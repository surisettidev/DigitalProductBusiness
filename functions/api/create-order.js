// Cloudflare Pages Function — POST /api/create-order
// Creates a Razorpay Order server-side (amount comes from the server-side
// catalog, never the client) and returns { orderId, keyId, amount, name }.
//
// Required Cloudflare Pages env vars:
//   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
import { CATALOG, json } from './_lib.js';

export async function onRequestPost({ request, env }) {
  try {
    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
      return json({ error: 'Payments are not configured yet. Email support.' }, 503);
    }

    const { slug } = await request.json();
    const product = CATALOG[slug];
    if (!product) return json({ error: 'Unknown product' }, 400);

    const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: product.amount,          // paise — server-side price
        currency: 'INR',
        receipt: `fos_${slug}_${Date.now()}`,
        notes: { slug, product: product.name }
      })
    });

    if (!res.ok) {
      const errTxt = await res.text();
      console.log('Razorpay order error:', errTxt);
      return json({ error: 'Could not start checkout. Try again in a minute.' }, 502);
    }

    const order = await res.json();
    return json({
      orderId: order.id,
      keyId: env.RAZORPAY_KEY_ID,        // publishable key — safe to expose
      amount: product.amount,
      currency: 'INR',
      name: product.name,
      slug
    });
  } catch (e) {
    return json({ error: 'Server error: ' + e.message }, 500);
  }
}
