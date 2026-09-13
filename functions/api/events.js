import { json, bad, logEvent } from '../_lib.js';

// GET /api/events?item=ID&limit=200  |  GET /api/events (últimos 200 de todos)
export async function onRequestGet({ request, env }) {
  const u = new URL(request.url);
  const item = u.searchParams.get('item');
  const limit = Math.min(500, Number(u.searchParams.get('limit')) || 200);
  const q = item
    ? env.DB.prepare('SELECT id, item_id, type, meta, created_at FROM events WHERE item_id = ?1 ORDER BY created_at DESC LIMIT ?2').bind(item, limit)
    : env.DB.prepare('SELECT id, item_id, type, meta, created_at FROM events ORDER BY created_at DESC LIMIT ?1').bind(limit);
  const { results } = await q.all();
  return json(results.map(r => ({ ...r, meta: r.meta ? JSON.parse(r.meta) : null })));
}

// POST /api/events { itemId, type, meta? }
const TYPES = new Set(['criado','enviado_aprovacao','publicado','reprovado','mensagem','visita','oferta','vendido','retirado','acao','preco','editado','nota']);
export async function onRequestPost({ request, env }) {
  let b; try { b = await request.json(); } catch { return bad('invalid_json'); }
  if (typeof b.itemId !== 'string' || !TYPES.has(b.type)) return bad('invalid_event');
  await logEvent(env.DB, b.itemId, b.type, b.meta);
  return json({ ok: true });
}
