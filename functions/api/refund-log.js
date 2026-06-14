// Cloudflare Pages Function — POST /api/refund-log
// Admin-only endpoint. Operator processes refund in Razorpay dashboard,
// then logs the refund here so:
//  - it appears in admin.html refund history
//  - the Daily AI Agent can spot patterns (same product, same source, etc.)
//
// Body (JSON):
//   { paymentId: string, amount: number, product?: string, email?: string, reason?: string }
// Auth: requires header `x-admin-token` (issued by /api/admin-auth)
//
// Hard rules:
// - Cannot trigger an actual refund (operator does that in Razorpay dashboard)
// - Cannot modify sales records — only appends a refund record

import { json } from './_lib.js';
import { verifyToken } from './admin-auth.js';
import { readLedger, writeLedger } from './_ledger.js';

export async function onRequestPost({ request, env }) {
  try {
    const token = request.headers.get('x-admin-token') || '';
    const ok = await verifyToken(env, token);
    if (!ok) return json({ ok: false, error: 'Unauthorized' }, 401);

    const { paymentId, amount, product, email, reason } = await request.json();
    if (!paymentId || typeof paymentId !== 'string') {
      return json({ ok: false, error: 'paymentId required' }, 400);
    }
    if (!amount || isNaN(Number(amount))) {
      return json({ ok: false, error: 'amount (₹) required' }, 400);
    }

    const refund = {
      id: crypto.randomUUID(),
      created_at: Date.now(),
      paymentId,
      amount: Number(amount),
      product: product || '',
      email: email || '',
      reason: reason || '',
      processed_by: 'operator'
    };

    // Persist into ledger under refunds array; fall back to leads-style append
    // if writeLedger's schema doesn't yet know about refunds.
    const ledger = await readLedger(env);
    const refunds = Array.isArray(ledger.refunds) ? ledger.refunds : [];
    refunds.unshift(refund);

    // writeLedger currently persists {sales, leads}; we need refunds too,
    // so do a manual passthrough via the same GitHub PUT pattern:
    const owner = env.GITHUB_OWNER || 'surisettidev';
    const repo  = env.GITHUB_REPO  || 'DigitalProductBusiness';
    const tokenG = env.GITHUB_PAT;
    if (!tokenG) return json({ ok: false, error: 'GITHUB_PAT not set' }, 503);

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/daily-operations/ledger.json`;
    const fileRes = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${tokenG}`, 'User-Agent': 'fos-cf-worker', Accept: 'application/vnd.github+json' }
    });

    let sha = null;
    let current = { sales: [], leads: [], refunds: [], events: [] };
    if (fileRes.ok) {
      const file = await fileRes.json();
      try {
        current = JSON.parse(atob(file.content.replace(/\n/g, '')));
      } catch (_) { /* keep defaults */ }
      sha = file.sha;
    } else if (fileRes.status !== 404) {
      return json({ ok: false, error: `Ledger read failed: ${fileRes.status}` }, 502);
    }

    current.refunds = [refund, ...(current.refunds || [])];

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${tokenG}`,
        'User-Agent': 'fos-cf-worker',
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Refund logged: ${paymentId}`,
        content: btoa(unescape(encodeURIComponent(JSON.stringify(current, null, 2)))),
        ...(sha ? { sha } : {})
      })
    });

    if (!putRes.ok) {
      const txt = await putRes.text().catch(() => '');
      return json({ ok: false, error: `Ledger write failed: ${putRes.status} ${txt}` }, 502);
    }

    return json({ ok: true, refund });
  } catch (e) {
    return json({ ok: false, error: 'Server error: ' + e.message }, 500);
  }
}
