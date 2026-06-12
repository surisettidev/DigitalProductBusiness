// Cloudflare Pages Function — POST /api/verify-payment
// Called by the browser right after Razorpay Checkout succeeds.
// Verifies the payment signature (HMAC-SHA256 of "order_id|payment_id"
// with RAZORPAY_KEY_SECRET) and, if valid:
//   1. returns the product download links for ON-PAGE delivery
//   2. sends the delivery EMAIL via Brevo (so the customer gets BOTH)
//   3. adds the buyer to the Brevo customer list
//
// The webhook (/api/razorpay-webhook) ALSO sends the email + logs the sale,
// acting as the reliable backstop if the buyer closes the tab early.
// Both paths are idempotent enough for this use case (Brevo dedupes contacts;
// a rare duplicate delivery email is harmless).
import { CATALOG, json, hmacSha256Hex, timingSafeEqual, getDeliveryItems, sendDeliveryEmail, addBrevoContact } from './_lib.js';

export async function onRequestPost({ request, env }) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, slug, email } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return json({ ok: false, error: 'Missing payment fields' }, 400);
    }
    if (!CATALOG[slug]) return json({ ok: false, error: 'Unknown product' }, 400);
    if (!env.RAZORPAY_KEY_SECRET) return json({ ok: false, error: 'Not configured' }, 503);

    // Signature check per Razorpay docs: HMAC_SHA256(order_id + "|" + payment_id, key_secret)
    const expected = await hmacSha256Hex(env.RAZORPAY_KEY_SECRET, `${razorpay_order_id}|${razorpay_payment_id}`);
    if (!timingSafeEqual(expected, razorpay_signature)) {
      return json({ ok: false, error: 'Payment verification failed' }, 401);
    }

    // Verified — prepare on-page delivery
    const items = getDeliveryItems(env, slug);

    // Fire email delivery + contact list add (non-blocking failures)
    let emailSent = false;
    if (email && email.includes('@')) {
      try {
        emailSent = await sendDeliveryEmail(env, { email, slug, paymentId: razorpay_payment_id });
        await addBrevoContact(env, { email, slug });
      } catch (_) { /* webhook will retry delivery */ }
    }

    return json({
      ok: true,
      product: CATALOG[slug].name,
      paymentId: razorpay_payment_id,
      items,                  // [{slug,name,url|null}] → rendered on success page
      emailSent
    });
  } catch (e) {
    return json({ ok: false, error: 'Server error: ' + e.message }, 500);
  }
}
