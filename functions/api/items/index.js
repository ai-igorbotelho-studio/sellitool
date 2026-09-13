import { json, bad } from '../../_lib.js';

// GET /api/items → lista completa
export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT data FROM items ORDER BY created_at DESC').all();
  return json(results.map(r => JSON.parse(r.data)));
}

// POST /api/items → importação em lote (migração do localStorage). Não sobrescreve quem já existe.
export async function onRequestPost({ request, env }) {
  let list; try { list = await request.json(); } catch { return bad('invalid_json'); }
  if (!Array.isArray(list)) return bad('expected_array');
  const now = Date.now();
  const { results } = await env.DB.prepare('SELECT id FROM items').all();
  const existing = new Set(results.map(r => r.id));
  const stmts = [];
  for (const it of list.slice(0, 500)) {
    if (!it || typeof it.id !== 'string' || existing.has(it.id)) continue;
    stmts.push(env.DB.prepare('INSERT OR IGNORE INTO items (id, status, data, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5)')
      .bind(it.id, it.status || 'rascunho', JSON.stringify(it), it.criadoEm || now, now));
    stmts.push(env.DB.prepare('INSERT INTO events (item_id, type, meta, created_at) VALUES (?1, ?2, ?3, ?4)')
      .bind(it.id, 'importado', JSON.stringify({ status: it.status }), now));
  }
  if (stmts.length) await env.DB.batch(stmts);
  return json({ ok: true, imported: stmts.length / 2 });
}
