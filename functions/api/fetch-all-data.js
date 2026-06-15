// Cloudflare Pages Function — GET /api/fetch-all-data
// Pulls live business data from GA4, Razorpay, Clarity, Brevo, and GitHub
// in parallel. Each source reports its own status (success / error /
// not_configured) so the Daily AI Agent can skip whatever isn't set up
// yet without failing the whole request.
//
// Protected: requires a valid admin token (same one issued by /api/admin-auth).
//
// Query params:
//   ?days=N   — lookback window for GA4/Razorpay (default 7)
import { json } from './_lib.js';
import { verifyToken } from './admin-auth.js';
import {
  fetchGA4Data, fetchRazorpayData, fetchClarityData, fetchBrevoData, fetchGitHubData
} from './_external-data.js';

export async function onRequestGet({ request, env }) {
  const token = request.headers.get('x-admin-token') || '';
  const ok = await verifyToken(env, token);
  if (!ok) return json({ ok: false, error: 'Unauthorized' }, 401);

  const url = new URL(request.url);
  const daysBack = Math.max(1, Math.min(30, parseInt(url.searchParams.get('days') || '7', 10) || 7));

  const [ga4, razorpay, clarity, brevo, github] = await Promise.all([
    fetchGA4Data(env, { daysBack }),
    fetchRazorpayData(env, { daysBack }),
    fetchClarityData(env),
    fetchBrevoData(env),
    fetchGitHubData(env)
  ]);

  const sources = { ga4, razorpay, clarity, brevo, github };
  const skipped = Object.entries(sources)
    .filter(([, v]) => v.status !== 'success')
    .map(([k, v]) => ({ source: k, status: v.status, reason: v.reason || v.error || null }));

  return json({
    ok: true,
    timestamp: new Date().toISOString(),
    daysBack,
    ...sources,
    skipped
  });
}
