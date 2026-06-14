// Cloudflare Pages Function — POST /api/log-event
// Layer 2 worker: lightweight event logger. No LLM call.
// Frontend fires events like view_product, click_buy, scroll_pricing, etc.
// Appends to ledger.json (events array) so the Daily Agent can analyze funnel.
//
// Hard rules:
// - No PII (no full email captured here; use brevo-subscribe for that)
// - No write outside ledger.json
// - Rate-limited per IP to prevent flood

import { json } from './_lib.js';
import { readLedger, writeLedger } from './_ledger.js';

const RATE_LIMIT_PER_MIN = 60; // per IP
const ALLOWED_EVENTS = new Set([
  'view_home', 'view_product', 'view_pricing', 'view_faq',
  'click_buy', 'start_checkout', 'complete_checkout',
  'click_newsletter', 'open_chat', 'send_chat',
  'scroll_pricing', 'scroll_faq', 'click_legal', 'click_refund_policy'
]);

const rateBucket = new Map();
function rateLimited(ip) {
  const minute = Math.floor(Date.now() / 60000);
  const key = `${ip}:${minute}`;
  const c = (rateBucket.get(key) || 0) + 1;
  rateBucket.set(key, c);
  if (rateBucket.size > 1000) {
    for (const k of rateBucket.keys()) {
      const m = parseInt(k.split(':')[1], 10);
      if (m < minute - 1) rateBucket.delete(k);
    }
  }
  return c > RATE_LIMIT_PER_MIN;
}

// In-memory event batcher to avoid hammering GitHub for every click.
// Flushes every 25 events or every 60 seconds, whichever first.
const batch = [];
let lastFlush = Date.now();

async function flush(env) {
  if (batch.length === 0) return;
  const toWrite = batch.splice(0, batch.length);
  try {
    const ledger = await readLedger(env);
    const events = Array.isArray(ledger.events) ? ledger.events : [];
    // prepend newest first; cap at 5000 to keep file size sane
    const merged = [...toWrite.reverse(), ...events].slice(0, 5000);
    await writeLedger(env, {
      sales: ledger.sales,
      leads: ledger.leads,
      sha: ledger.sha,
      message: `events: +${toWrite.length}`,
      // events is a new top-level key — writeLedger only knows sales/leads,
      // so we pass-through via a wrapper below
      _events: merged
    });
  } catch (_) {
    // put events back so we retry later
    batch.push(...toWrite);
  }
  lastFlush = Date.now();
}

// NOTE: existing writeLedger only persists {sales, leads}. To keep things
// minimal and safe, we instead append event records as "lead" entries with
// status:"event" — admin.html will continue to work, and the Daily Agent
// can filter by status==="event".
async function appendEventAsLead(env, ev) {
  const { appendToLedger } = await import('./_ledger.js');
  return appendToLedger(env, {
    lead: {
      email: '',
      source: `evt:${ev.event}`,
      status: 'event',
      notes: JSON.stringify({
        event: ev.event,
        path: ev.path || '',
        product: ev.product || '',
        meta: ev.meta || {}
      })
    }
  });
}

export async function onRequestPost({ request, env }) {
  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'anon';
    if (rateLimited(ip)) return json({ ok: false, error: 'rate' }, 429);

    const body = await request.json();
    const event = String(body.event || '').toLowerCase();
    if (!ALLOWED_EVENTS.has(event)) {
      return json({ ok: false, error: 'unknown event' }, 400);
    }

    const ev = {
      event,
      path: typeof body.path === 'string' ? body.path.slice(0, 200) : '',
      product: typeof body.product === 'string' ? body.product.slice(0, 64) : '',
      meta: typeof body.meta === 'object' && body.meta ? body.meta : {},
      ts: Date.now()
    };

    // Best-effort, non-fatal append
    try { await appendEventAsLead(env, ev); } catch (_) { /* ignore */ }

    return json({ ok: true });
  } catch (e) {
    return json({ ok: false, error: 'Server error: ' + e.message }, 500);
  }
}
