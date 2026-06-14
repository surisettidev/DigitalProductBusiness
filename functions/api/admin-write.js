// Cloudflare Pages Function — POST /api/admin-write
// Handles manual edits from the operator dashboard:
//   { action: 'add-sale',  sale: {...} }
//   { action: 'add-lead',  lead: {...} }
//   { action: 'update-lead-status', id, status }
//   { action: 'delete-sale', id }
//   { action: 'delete-lead', id }
// Protected: requires a valid admin token (same one issued by /api/admin-auth).
import { json } from './_lib.js';
import { verifyToken } from './admin-auth.js';
import { readLedger, writeLedger } from './_ledger.js';

export async function onRequestPost({ request, env }) {
  const token = request.headers.get('x-admin-token') || '';
  const ok = await verifyToken(env, token);
  if (!ok) return json({ ok: false, error: 'Unauthorized' }, 401);

  let body;
  try { body = await request.json(); } catch (_) { return json({ ok: false, error: 'Invalid JSON' }, 400); }

  const { action } = body;
  const current = await readLedger(env);
  let sales = [...current.sales];
  let leads = [...current.leads];
  let resultRecord = null;

  switch (action) {
    case 'add-sale': {
      const s = body.sale || {};
      resultRecord = {
        id: crypto.randomUUID(),
        created_at: Date.now(),
        product: s.product || '',
        gross: Number(s.gross) || 0,
        net: Number(s.net) || Number(s.gross) || 0,
        channel: s.channel || 'manual',
        email: s.email || '',
        units: Number(s.units) || 1,
        date: s.date || new Date().toISOString().slice(0, 10)
      };
      sales = [resultRecord, ...sales];
      break;
    }
    case 'add-lead': {
      const l = body.lead || {};
      if (!l.email) return json({ ok: false, error: 'Email required' }, 400);
      resultRecord = {
        id: crypto.randomUUID(),
        created_at: Date.now(),
        email: l.email,
        source: l.source || 'manual',
        status: l.status || 'new',
        notes: l.notes || ''
      };
      leads = [resultRecord, ...leads];
      break;
    }
    case 'update-lead-status': {
      const idx = leads.findIndex(l => l.id === body.id);
      if (idx === -1) return json({ ok: false, error: 'Lead not found' }, 404);
      leads[idx] = { ...leads[idx], status: body.status };
      resultRecord = leads[idx];
      break;
    }
    case 'delete-sale': {
      const before = sales.length;
      sales = sales.filter(s => s.id !== body.id);
      if (sales.length === before) return json({ ok: false, error: 'Sale not found' }, 404);
      break;
    }
    case 'delete-lead': {
      const before = leads.length;
      leads = leads.filter(l => l.id !== body.id);
      if (leads.length === before) return json({ ok: false, error: 'Lead not found' }, 404);
      break;
    }
    default:
      return json({ ok: false, error: 'Unknown action' }, 400);
  }

  const write = await writeLedger(env, {
    sales, leads, sha: current.sha,
    message: `Admin: ${action}`
  });

  if (!write.ok) {
    // Likely a sha conflict from a concurrent edit — re-read for a fresh sha
    // and retry with the same computed sales/leads (best effort).
    const retryCurrent = await readLedger(env);
    const retry = await writeLedger(env, {
      sales, leads, sha: retryCurrent.sha, message: `Admin: ${action} (retry)`
    });
    if (!retry.ok) return json({ ok: false, error: retry.error || write.error }, 500);
  }

  return json({ ok: true, record: resultRecord });
}
