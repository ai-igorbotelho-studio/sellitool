import { json, bad, makeToken, setCookie } from '../_lib.js';
export async function onRequestPost({ request, env }) {
  if (!env.SELLITOOL_PASSWORD) return bad('not_configured', 503);
  let body; try { body = await request.json(); } catch { return bad('invalid_json'); }
  const ok = typeof body.password === 'string' && body.password.length > 0 && body.password === env.SELLITOOL_PASSWORD;
  if (!ok) { await new Promise(r => setTimeout(r, 600)); return bad('wrong_password', 401); }
  return json({ ok: true }, 200, { 'set-cookie': setCookie(await makeToken(env.SELLITOOL_PASSWORD)) });
}
