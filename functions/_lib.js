// Utilidades compartilhadas pelas Pages Functions (sem build, ES modules nativos).
const enc = new TextEncoder();
const COOKIE = 'st_session';
const DAYS = 30;

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });

export const bad = (msg, status = 400) => json({ error: msg }, status);

async function hmac(secret, msg) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export async function makeToken(secret) {
  const exp = Date.now() + DAYS * 864e5;
  return `${exp}.${await hmac(secret, 'ok:' + exp)}`;
}

export async function verifyToken(secret, token) {
  if (!secret || !token) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const expected = await hmac(secret, 'ok:' + exp);
  return timingSafeEqual(expected, sig);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export function readCookie(request, name = COOKIE) {
  const c = request.headers.get('cookie') || '';
  const m = c.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[1]) : null;
}

export const setCookie = token => `${COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`;
export const clearCookie = () => `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;

export async function isAuthed(context) {
  return verifyToken(context.env.SELLITOOL_PASSWORD, readCookie(context.request));
}

export async function logEvent(db, itemId, type, meta) {
  await db.prepare('INSERT INTO events (item_id, type, meta, created_at) VALUES (?1, ?2, ?3, ?4)')
    .bind(itemId, type, meta ? JSON.stringify(meta) : null, Date.now()).run();
}
