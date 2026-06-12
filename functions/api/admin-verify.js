// Cloudflare Pages Function — POST /api/admin-verify
// Validates an admin token issued by /api/admin-auth.
// Body: { token } → { ok: true|false }
import { json } from './_lib.js';
import { verifyToken } from './admin-auth.js';

export async function onRequestPost({ request, env }) {
  try {
    const { token } = await request.json();
    const ok = await verifyToken(env, token);
    return json({ ok }, ok ? 200 : 401);
  } catch (e) {
    return json({ ok: false }, 400);
  }
}
