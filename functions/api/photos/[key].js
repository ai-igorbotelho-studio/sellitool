// GET /api/photos/:key → serve do R2 (privado: passa pelo middleware de sessão)
export async function onRequestGet({ env, params }) {
  if (!env.PHOTOS) return new Response('not configured', { status: 503 });
  const obj = await env.PHOTOS.get(params.key);
  if (!obj) return new Response('not found', { status: 404 });
  const h = new Headers();
  obj.writeHttpMetadata(h);
  h.set('etag', obj.httpEtag);
  h.set('cache-control', 'private, max-age=31536000, immutable');
  return new Response(obj.body, { headers: h });
}
export async function onRequestDelete({ env, params }) {
  if (env.PHOTOS) await env.PHOTOS.delete(params.key);
  return new Response(null, { status: 204 });
}
