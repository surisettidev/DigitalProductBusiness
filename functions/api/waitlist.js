// Cloudflare Pages Function — POST /api/waitlist
// Body: { email, slug }
// Stores waitlist signups in the ledger under a dedicated "waitlist" array.
// Used when a product is "coming soon" — PDF not yet built.
// No payment, no Razorpay. Just email + slug to validate demand.
import { json } from './_lib.js';
import { appendToLedger } from './_ledger.js';

// Map slug → human product name (same as CATALOG in _lib.js)
const PRODUCT_NAMES = {
  'ai-freelancer'  : 'AI for Freelancers Guide',
  'pricing-guide'  : 'Freelancer Pricing Masterclass',
  'tax-guide'      : 'Indian Tax Guide 2026-27',
  'client-gen'     : 'Client Negotiation Vault',
  'business-os'    : 'Portfolio + Proposal OS',
  'tool-stack'     : 'Indian Freelancer Tool Stack 2026',
  'bundle'         : 'Bundle',
};

export async function onRequestPost({ request, env }) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    let body;
    try { body = await request.json(); } catch (_) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), { status: 400, headers: corsHeaders });
    }

    const { email = '', slug = '' } = body;

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ ok: false, error: 'Valid email required' }), { status: 400, headers: corsHeaders });
    }
    if (!slug || !PRODUCT_NAMES[slug]) {
      return new Response(JSON.stringify({ ok: false, error: 'Valid product slug required' }), { status: 400, headers: corsHeaders });
    }

    const productName = PRODUCT_NAMES[slug];

    // Log as a lead in the ledger (source = "waitlist:<slug>")
    await appendToLedger(env, {
      lead: {
        email,
        source: `waitlist:${slug}`,
        status: 'waitlist',
        notes: `Waitlisted for "${productName}"`
      }
    });

    // Optionally add to Brevo contact list (non-fatal if Brevo not configured)
    if (env.BREVO_API_KEY) {
      try {
        await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            listIds: [parseInt(env.BREVO_LIST_ID || '2', 10)],
            attributes: {
              SOURCE: `waitlist:${slug}`,
              PRODUCT: productName,
              SIGNUP_DATE: new Date().toISOString()
            },
            updateEnabled: true
          })
        });
      } catch (_) { /* non-fatal */ }
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
