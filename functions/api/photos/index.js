import { json, bad } from '../../_lib.js';

// POST /api/photos (multipart: file) → { url, key }
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
export async function onRequestPost({ request, env }) {
  if (!env.PHOTOS) return bad('photos_not_configured', 503);
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return bad('missing_file');
  if (!EXT[file.type]) return bad('unsupported_type', 415);
  if (file.size > 8 * 1024 * 1024) return bad('too_large', 413);
  const key = `${Date.now()}-${crypto.randomUUID()}.${EXT[file.type]}`;
  await env.PHOTOS.put(key, file.stream(), { httpMetadata: { contentType: file.type, cacheControl: 'private, max-age=31536000, immutable' } });
  return json({ url: `/api/photos/${key}`, key });
}
