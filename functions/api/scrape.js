import { json, bad } from '../_lib.js';

// POST /api/scrape { url } → { nome, preco, condicao, marca, bullets[], descricao, imagens[], fonte }
// 1. busca a página no servidor (sem CORS), 2. extrai sinais com HTMLRewriter, 3. se houver ANTHROPIC_API_KEY, Claude organiza em bullets.

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const clean = s => (s || '').replace(/\s+/g, ' ').trim();

export async function onRequestPost({ request, env }) {
  let body; try { body = await request.json(); } catch { return bad('invalid_json'); }
  let url; try { url = new URL(body.url); } catch { return bad('invalid_url'); }
  if (!/^https?:$/.test(url.protocol)) return bad('invalid_url');

  let res;
  try {
    res = await fetch(url.toString(), { headers: { 'user-agent': UA, 'accept': 'text/html,*/*;q=0.8', 'accept-language': 'en-NZ,en;q=0.9' }, redirect: 'follow', cf: { cacheTtl: 0 } });
  } catch (e) { return bad('fetch_failed', 502); }
  if (!res.ok) return bad('site_status_' + res.status, 502);
  if (!/text\/html/i.test(res.headers.get('content-type') || '')) return bad('not_html', 415);

  const sig = await extract(res, url);
  const heuristic = organize(sig);
  let out = heuristic;
  if (env.ANTHROPIC_API_KEY) {
    try { out = { ...heuristic, ...(await refine(env.ANTHROPIC_API_KEY, sig, heuristic)), ia: true }; }
    catch (e) { out = { ...heuristic, ia: false, iaErro: String(e.message || e).slice(0, 200) }; }
  }
  return json({ ...out, fonte: url.hostname });
}

async function extract(res, base) {
  const s = { title: '', metaTitle: '', metaDesc: '', h1: '', jsonld: [], li: [], dtdd: [], rows: [], paras: [], imgs: new Set(), price: '' };
  let cur = null; const push = (k) => ({ text(t) { cur = k; s[k].push(''); }, }); // placeholder, replaced below
  const collectors = {};
  const textInto = (arr, max = 400) => {
    let buf = '';
    return { text(t) { buf += t.text; if (t.lastInTextNode) { const v = clean(buf); if (v && v.length <= max) arr.push(v); buf = ''; } } };
  };
  let dt = '', ddBuf = '';
  const abs = u => { try { return new URL(u, base).toString(); } catch { return null; } };
  const rewriter = new HTMLRewriter()
    .on('title', { text(t) { s.title += t.text; } })
    .on('meta', { element(e) {
      const p = (e.getAttribute('property') || e.getAttribute('name') || '').toLowerCase(); const c = e.getAttribute('content') || '';
      if (p === 'og:title' || p === 'twitter:title') s.metaTitle ||= c;
      if (p === 'og:description' || p === 'description' || p === 'twitter:description') s.metaDesc ||= c;
      if (p === 'og:image' || p === 'twitter:image' || p === 'og:image:secure_url') { const u = abs(c); if (u) s.imgs.add(u); }
      if (p === 'product:price:amount' || p === 'og:price:amount') s.price ||= c;
    } })
    .on('script[type="application/ld+json"]', { text: (() => { let buf = ''; return t => { buf += t.text; if (t.lastInTextNode) { try { s.jsonld.push(JSON.parse(buf)); } catch {} buf = ''; } }; })() })
    .on('h1', { text: (() => { let buf = ''; return t => { buf += t.text; if (t.lastInTextNode) { s.h1 ||= clean(buf); buf = ''; } }; })() })
    .on('li', textInto(s.li, 200))
    .on('p', textInto(s.paras, 1200))
    .on('dt', { text: (() => { let buf = ''; return t => { buf += t.text; if (t.lastInTextNode) { dt = clean(buf); buf = ''; } }; })() })
    .on('dd', { text: (() => { let buf = ''; return t => { buf += t.text; if (t.lastInTextNode) { const v = clean(buf); if (dt && v) s.dtdd.push(dt + ': ' + v); dt = ''; buf = ''; } }; })() })
    .on('tr', { element() { s.rows.push([]); } })
    .on('th, td', { text: (() => { let buf = ''; return t => { buf += t.text; if (t.lastInTextNode) { const v = clean(buf); const r = s.rows[s.rows.length - 1]; if (r && v) r.push(v); buf = ''; } }; })() })
    .on('img', { element(e) {
      const src = e.getAttribute('src') || e.getAttribute('data-src') || (e.getAttribute('srcset') || '').split(',')[0].trim().split(' ')[0];
      if (!src || /^data:/.test(src)) return;
      const w = Number(e.getAttribute('width')) || 0;
      if (w && w < 200) return;
      if (/logo|icon|sprite|avatar|badge|pixel|tracking|\.svg/i.test(src)) return;
      const u = abs(src); if (u) s.imgs.add(u);
    } })
    .on('script, style, noscript, nav, footer, header', { element(e) { if (e.tagName !== 'script') e.remove(); } });
  await rewriter.transform(res).text();
  s.title = clean(s.title);
  s.rows = s.rows.filter(r => r.length === 2).map(r => r[0] + ': ' + r[1]);
  s.imgs = Array.from(s.imgs).slice(0, 12);
  return s;
}

function organize(s) {
  let nome = clean(s.metaTitle || s.h1 || s.title).replace(/\s*[|\-–]\s*(Trade Me|Facebook|Marketplace|eBay|Amazon.*|Mighty Ape|Noel Leeming|The Warehouse|Torpedo7)\s*$/i, '');
  let preco = s.price; let condicao = ''; let marca = ''; let descricao = clean(s.metaDesc);
  const bullets = [];
  for (const raw of s.jsonld) {
    const list = Array.isArray(raw) ? raw : (raw['@graph'] || [raw]);
    for (const o of list) {
      const t = String(o['@type'] || '').toLowerCase();
      if (!/product|vehicle|car|offer/.test(t)) continue;
      nome = o.name ? clean(o.name) : nome;
      if (o.brand) marca = clean(typeof o.brand === 'string' ? o.brand : o.brand.name);
      if (o.description) descricao ||= clean(o.description);
      const off = Array.isArray(o.offers) ? o.offers[0] : o.offers;
      if (off && off.price) preco ||= String(off.price);
      if (off && off.itemCondition) condicao = /new/i.test(off.itemCondition) ? 'Novo' : /refurb|used|good/i.test(off.itemCondition) ? 'Bom usado' : 'Usado';
      for (const k of ['model', 'color', 'sku', 'mileageFromOdometer', 'vehicleTransmission', 'fuelType', 'vehicleModelDate', 'bodyType']) {
        if (o[k]) bullets.push(`${k}: ${clean(typeof o[k] === 'object' ? (o[k].value ? o[k].value + ' ' + (o[k].unitCode || '') : o[k].name) : o[k])}`);
      }
    }
  }
  const specs = [...s.dtdd, ...s.rows].filter(x => x.length < 120);
  const feats = s.li.filter(x => x.length > 12 && x.length < 160 && !/cookie|privacy|sign in|log in|menu|©|terms/i.test(x));
  if (!preco) { const m = (s.paras.join(' ') + ' ' + feats.join(' ')).match(/\$\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/); if (m) preco = m[1].replace(/,/g, ''); }
  if (!condicao) { const t = (descricao + ' ' + feats.join(' ')).toLowerCase(); condicao = /brand new|\bnew\b|unopened/.test(t) ? 'Novo' : /excellent|great condition|good condition|barely used/.test(t) ? 'Bom usado' : /faulty|damaged|parts only|not working/.test(t) ? 'Com defeito' : 'Usado'; }
  const seen = new Set(); const uniq = x => { const k = x.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; };
  const all = [...bullets, ...specs, ...feats].filter(uniq).slice(0, 25);
  if (!descricao) descricao = s.paras.filter(p => p.length > 60).slice(0, 3).join(' ').slice(0, 900);
  return { nome, preco: preco ? Number(String(preco).replace(/[^\d.]/g, '')) || 0 : 0, condicao, marca, bullets: all, descricao, imagens: s.imgs };
}

const SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['nome', 'preco', 'condicao', 'marca', 'bullets', 'descricao'],
  properties: {
    nome: { type: 'string' }, preco: { type: 'number' }, marca: { type: 'string' },
    condicao: { type: 'string', enum: ['Novo', 'Bom usado', 'Usado', 'Com defeito'] },
    bullets: { type: 'array', items: { type: 'string' }, maxItems: 14 },
    descricao: { type: 'string' }
  }
};

async function refine(apiKey, s, h) {
  const material = [
    'TITLE: ' + s.title, 'META TITLE: ' + s.metaTitle, 'H1: ' + s.h1, 'META DESC: ' + s.metaDesc,
    'JSON-LD: ' + JSON.stringify(s.jsonld).slice(0, 4000),
    'SPECS: ' + [...s.dtdd, ...s.rows].slice(0, 60).join(' | '),
    'LIST ITEMS: ' + s.li.slice(0, 80).join(' | '),
    'PARAGRAPHS: ' + s.paras.slice(0, 30).join(' ¶ ').slice(0, 6000)
  ].join('\n');
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'anthropic-beta': 'server-side-fallback-2026-07-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-opus-5',
      max_tokens: 2000,
      fallbacks: 'default',
      output_config: { effort: 'medium', format: { type: 'json_schema', schema: SCHEMA } },
      system: 'You extract product facts from scraped listing/store pages for a person reselling the item second-hand on Trade Me and Facebook Marketplace in New Zealand. Return only facts present in the material; never invent specs. Bullets: short, concrete product characteristics (brand, model, year, size, capacity, material, colour, included accessories, key specs), each under 90 characters, in Portuguese (Brazil), no marketing fluff, no store policies, no shipping/returns text. "preco" is the price in NZD as a number (0 if absent). "descricao" is a 2-4 sentence neutral summary in Portuguese. "condicao" must be one of the allowed values; use "Usado" when unclear.',
      messages: [{ role: 'user', content: 'Heuristic draft (may be noisy):\n' + JSON.stringify({ nome: h.nome, preco: h.preco, marca: h.marca, bullets: h.bullets }) + '\n\nPage material:\n' + material }]
    })
  });
  if (!r.ok) throw new Error('anthropic_' + r.status + ': ' + (await r.text()).slice(0, 200));
  const msg = await r.json();
  if (msg.stop_reason === 'refusal') throw new Error('refusal');
  const text = (msg.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
  return JSON.parse(text);
}
