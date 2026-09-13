import { json, bad, logEvent } from '../../_lib.js';

// PUT /api/items/:id → upsert do item inteiro. Body: { item, event?: {type, meta} }
export async function onRequestPut({ request, env, params }) {
  let body; try { body = await request.json(); } catch { return bad('invalid_json'); }
  const item = body.item;
  if (!item || item.id !== params.id) return bad('id_mismatch');
  const data = JSON.stringify(item);
  if (data.length > 900_000) return bad('item_too_large', 413);
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO items (id, status, data, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5)
     ON CONFLICT(id) DO UPDATE SET status = excluded.status, data = excluded.data, updated_at = excluded.updated_at`
  ).bind(item.id, item.status || 'rascunho', data, item.criadoEm || now, now).run();
  if (body.event && typeof body.event.type === 'string') await logEvent(env.DB, item.id, body.event.type, body.event.meta);
  return json({ ok: true, updatedAt: now });
}

// DELETE /api/items/:id
export async function onRequestDelete({ env, params }) {
  await env.DB.batch([
    env.DB.prepare('DELETE FROM items WHERE id = ?1').bind(params.id),
    env.DB.prepare('INSERT INTO events (item_id, type, meta, created_at) VALUES (?1, ?2, NULL, ?3)').bind(params.id, 'excluido', Date.now())
  ]);
  return json({ ok: true });
}
