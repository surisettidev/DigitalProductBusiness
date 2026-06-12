// Cloudflare Pages Function — POST /api/admin-auth
// Server-side admin login. The password lives ONLY in the Cloudflare env var
// ADMIN_PASSWORD (never in the repo / browser). On success it returns a
// signed, expiring token; /api/admin-verify checks it on dashboard load.
//
// Required env vars: ADMIN_PASSWORD
// Optional: ADMIN_TOKEN_SECRET (falls back to RAZORPAY_KEY_SECRET)
import { json, hmacSha256Hex, timingSafeEqual } from './_lib.js';

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function tokenSecret(env) {
  return env.ADMIN_TOKEN_SECRET || env.RAZORPAY_KEY_SECRET || '';
}

export async function makeToken(env) {
  const exp = Date.now() + TOKEN_TTL_MS;
  const sig = await hmacSha256Hex(tokenSecret(env), `admin|${exp}`);
  return `${exp}.${sig}`;
}

export async function verifyToken(env, token) {
  if (!token || !tokenSecret(env)) return false;
  const [expStr, sig] = String(token).split('.');
  const exp = parseInt(expStr, 10);
  if (!exp || !sig || Date.now() > exp) return false;
  const expected = await hmacSha256Hex(tokenSecret(env), `admin|${exp}`);
  return timingSafeEqual(expected, sig);
}

export async function onRequestPost({ request, env }) {
  try {
    if (!env.ADMIN_PASSWORD) {
      return json({ ok: false, error: 'Admin auth not configured. Set ADMIN_PASSWORD in Cloudflare Pages → Settings → Environment variables.' }, 503);
    }
    if (!tokenSecret(env)) {
      return json({ ok: false, error: 'Set ADMIN_TOKEN_SECRET env var.' }, 503);
    }

    const { password } = await request.json();

    // Constant-time-ish compare via HMAC of both values
    const a = await hmacSha256Hex('fos-pw-cmp', String(password || ''));
    const b = await hmacSha256Hex('fos-pw-cmp', env.ADMIN_PASSWORD);
    if (!timingSafeEqual(a, b)) {
      // Small delay to slow brute-force attempts
      await new Promise(r => setTimeout(r, 600));
      return json({ ok: false, error: 'Incorrect password' }, 401);
    }

    const token = await makeToken(env);
    return json({ ok: true, token, expiresInMs: TOKEN_TTL_MS });
  } catch (e) {
    return json({ ok: false, error: 'Server error: ' + e.message }, 500);
  }
}
