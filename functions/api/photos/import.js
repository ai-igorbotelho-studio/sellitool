import { json, bad } from '../../_lib.js';

// POST /api/photos/import { url } → baixa a imagem no servidor (sem CORS/hotlink) e guarda no R2 → { url, key }
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' };

export async function onRequestPost({ request, env }) {
  if (!env.PHOTOS) return bad('photos_not_configured', 503);
  let body; try { body = await request.json(); } catch { return bad('invalid_json'); }
  let url; try { url = new URL(body.url); } catch { return bad('invalid_url'); }
  if (!/^https?:$/.test(url.protocol)) return bad('invalid_url');
  let res;
  try { res = await fetch(url.toString(), { headers: { 'user-agent': UA, 'accept': 'image/*,*/*;q=0.5', 'referer': url.origin + '/' }, redirect: 'follow' }); }
  catch { return bad('fetch_failed', 502); }
  if (!res.ok) return bad('image_status_' + res.status, 502);
  const type = (res.headers.get('content-type') || '').split(';')[0].trim();
  if (!EXT[type]) return bad('not_an_image', 415);
  const len = Number(res.headers.get('content-length') || 0);
  if (len > 12 * 1024 * 1024) return bad('too_large', 413);
  const key = `${Date.now()}-${crypto.randomUUID()}.${EXT[type]}`;
  await env.PHOTOS.put(key, res.body, { httpMetadata: { contentType: type, cacheControl: 'private, max-age=31536000, immutable' } });
  return json({ url: `/api/photos/${key}`, key });
}
