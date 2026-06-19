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

async function sendWaitlistConfirmation(env, email, productName) {
  if (!env.BREVO_API_KEY) {
    console.warn('[waitlist] BREVO_API_KEY not set, skipping email send');
    return;
  }
  const senderEmail = env.BREVO_SENDER_EMAIL || 'noreply@freelanceos.co.in';
  console.log('[waitlist] Sending confirmation to', email, 'from', senderEmail);
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: {
        name: 'Suresh @ Freelancer OS',
        email: senderEmail
      },
      to: [{ email }],
      subject: `You're on the waitlist — ${productName}`,
      htmlContent: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:40px;max-width:560px;">
        <tr><td>
          <p style="font-size:24px;font-weight:700;color:#111827;margin:0 0 8px;">You're in! 🎉</p>
          <p style="font-size:16px;color:#6b7280;margin:0 0 24px;">
            You're on the early-access waitlist for <strong style="color:#111827;">${productName}</strong>.
          </p>
          <p style="font-size:15px;color:#374151;margin:0 0 16px;">
            When it launches, you'll be the first to know — and you'll get an <strong>early-bird discount</strong> as a thank you for signing up early.
          </p>
          <p style="font-size:15px;color:#374151;margin:0 0 32px;">
            In the meantime, if you have questions or want to share what would make this product more useful for you, just reply to this email.
          </p>
          <p style="font-size:14px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:24px;margin:0;">
            — Suresh Surisetti<br>
            <a href="https://freelanceos.co.in" style="color:#6366f1;text-decoration:none;">freelanceos.co.in</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
      textContent: `You're on the waitlist for ${productName}!

When it launches, you'll be the first to know and get an early-bird discount.

Reply to this email if you have questions.

— Suresh @ Freelancer OS
https://freelanceos.co.in`
    })
  });
  return res;
}

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

    // Add to Brevo contact list (non-fatal)
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

      // Send confirmation email (non-fatal)
      try {
        const emailRes = await sendWaitlistConfirmation(env, email, productName);
        if (!emailRes.ok) {
          const errBody = await emailRes.text();
          console.error('[waitlist] Brevo email send failed:', emailRes.status, errBody);
        } else {
          console.log('[waitlist] Brevo email sent successfully');
        }
      } catch (err) {
        console.error('[waitlist] Email send exception:', err.message);
      }
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
