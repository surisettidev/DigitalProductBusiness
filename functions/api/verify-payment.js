// Cloudflare Pages Function — POST /api/verify-payment
// Called by browser right after Razorpay Checkout succeeds.
// 1. Verifies Razorpay HMAC-SHA256 signature
// 2. Sends delivery email via AppScript (primary) or Brevo (fallback)
// 3. Returns download items for on-page delivery
// 4. Adds buyer to Brevo contact list (non-blocking)
import { CATALOG, json, hmacSha256Hex, timingSafeEqual, getDeliveryItems, sendDeliveryEmail, addBrevoContact } from './_lib.js';

export async function onRequestPost({ request, env }) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, slug, email, name } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return json({ ok: false, error: 'Missing payment fields' }, 400);
    }
    if (!CATALOG[slug]) return json({ ok: false, error: 'Unknown product' }, 400);
    if (!env.RAZORPAY_KEY_SECRET) return json({ ok: false, error: 'Not configured' }, 503);

    // Verify Razorpay signature
    const expected = await hmacSha256Hex(env.RAZORPAY_KEY_SECRET, `${razorpay_order_id}|${razorpay_payment_id}`);
    if (!timingSafeEqual(expected, razorpay_signature)) {
      return json({ ok: false, error: 'Payment verification failed' }, 401);
    }

    // Prepare on-page delivery items
    const items = getDeliveryItems(env, slug);

    // Send delivery email (AppScript → Gmail, fallback to Brevo)
    let emailSent = false;
    if (email && email.includes('@')) {
      try {
        emailSent = await sendDeliveryEmail(env, {
          email,
          name: name || email.split('@')[0],
          slug,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id
        });
        // Add to mailing list (non-blocking)
        addBrevoContact(env, { email, slug }).catch(() => {});
      } catch (e) {
        console.error('Delivery error:', e.message);
        // Payment succeeded — webhook will retry delivery
      }
    }

    return json({
      ok: true,
      product: CATALOG[slug].name,
      paymentId: razorpay_payment_id,
      items,
      emailSent
    });

  } catch (e) {
    return json({ ok: false, error: 'Server error: ' + e.message }, 500);
  }
}
