// Cloudflare Pages Function — GET /api/admin-data
// Returns the live sales + leads ledger for the operator dashboard.
// Protected: requires a valid admin token (same one issued by /api/admin-auth).
import { json } from './_lib.js';
import { verifyToken } from './admin-auth.js';
import { readLedger } from './_ledger.js';

export async function onRequestGet({ request, env }) {
  const token = request.headers.get('x-admin-token') || '';
  const ok = await verifyToken(env, token);
  if (!ok) return json({ ok: false, error: 'Unauthorized' }, 401);

  const ledger = await readLedger(env);
  return json({
    ok: true,
    sales: ledger.sales,
    leads: ledger.leads,
    warning: ledger.error || null
  });
}
