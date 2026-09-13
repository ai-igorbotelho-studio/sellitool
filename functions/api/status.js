import { json, isAuthed } from '../_lib.js';
export async function onRequestGet(context) {
  const { env } = context;
  const configured = Boolean(env.DB && env.SELLITOOL_PASSWORD);
  return json({ configured, photos: Boolean(env.PHOTOS), authed: configured && await isAuthed(context) });
}
