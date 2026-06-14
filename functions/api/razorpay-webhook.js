// Cloudflare Pages Function — POST /api/razorpay-webhook
// Configure in Razorpay Dashboard → Settings → Webhooks:
//   URL:    https://freelance-os.pages.dev/api/razorpay-webhook
//   Secret: same value as Cloudflare env var RAZORPAY_WEBHOOK_SECRET
//   Events: payment.captured (required). payment.authorized, payment.failed,
//           and order.paid are accepted too — they're recorded for visibility
//           but only payment.captured triggers delivery + ledger logging,
//           since that's the event that means money actually landed.
//
// This is the reliable backstop for delivery + bookkeeping:
//   1. Verifies the webhook signature (HMAC-SHA256 of raw body)
//   2. On payment.captured → emails the product via Brevo,
//      adds buyer to contact list, logs the sale to GitHub +
//      the structured ledger that powers admin.html.
import {
  json, hmacSha256Hex, timingSafeEqual,
  sendDeliveryEmail, addBrevoContact, logSaleToGithub, logSaleToLedger, CATALOG
} from './_lib.js';

export async function onRequestPost({ request, env }) {
  try {
    if (!env.RAZORPAY_WEBHOOK_SECRET) {
      // Misconfiguration — return 500 so Razorpay retries after the secret is set
      return new Response('Webhook secret not configured', { status: 500 });
    }

    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';
    const expected = await hmacSha256Hex(env.RAZORPAY_WEBHOOK_SECRET, body);
    if (!timingSafeEqual(expected, signature)) {
      return new Response('Invalid signature', { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity || {};
      const email = payment.email || '';
      const paymentId = payment.id || '';
      const amountInr = Math.round((payment.amount || 0) / 100);
      // slug travels in order notes (set by /api/create-order)
      const slug = payment.notes?.slug || '';
      const productName = (CATALOG[slug] || {}).name || payment.notes?.product || payment.description || 'Unknown product';

      // 1. Email delivery (backstop — buyer may already have it from verify-payment)
      if (email) {
        try { await sendDeliveryEmail(env, { email, slug: slug || 'bundle', paymentId }); } catch (_) {}
        try { await addBrevoContact(env, { email, slug: slug || 'unknown' }); } catch (_) {}
      }

      // 2. Log sale to GitHub markdown ledger (human-readable)
      try {
        await logSaleToGithub(env, {
          date: new Date().toISOString(),
          product: productName,
          amount: amountInr,
          email
        });
      } catch (_) { /* non-fatal */ }

      // 3. Log sale + customer to the structured ledger (powers admin.html)
      try {
        await logSaleToLedger(env, { slug, productName, amountInr, email, paymentId, channel: 'razorpay' });
      } catch (_) { /* non-fatal */ }
    }

    // payment.authorized / payment.failed / order.paid: acknowledged but not
    // logged to the ledger — payment.captured is the source of truth for
    // money received. Returning 200 here just stops Razorpay from retrying.

    // Always 200 for verified events so Razorpay does not retry endlessly
    return json({ ok: true });
  } catch (e) {
    return new Response('Error: ' + e.message, { status: 500 });
  }
}

// Razorpay sends a GET when you click "Test webhook" sometimes; reply politely.
export async function onRequestGet() {
  return json({ ok: true, message: 'Razorpay webhook endpoint is live. POST only.' });
}
