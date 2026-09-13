import { json, isAuthed } from '../_lib.js';

// Tudo em /api/* exige sessão, exceto login/logout e o status de configuração.
const OPEN = new Set(['/api/login', '/api/logout', '/api/status']);

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (OPEN.has(url.pathname)) return context.next();
  if (!context.env.DB || !context.env.SELLITOOL_PASSWORD) return json({ error: 'not_configured' }, 503);
  if (!(await isAuthed(context))) return json({ error: 'unauthorized' }, 401);
  return context.next();
}
