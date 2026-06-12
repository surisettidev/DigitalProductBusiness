// Cloudflare Pages Function — POST /api/razorpay-webhook
// Phase 2: activate only after Razorpay KYC is done.
export async function onRequestPost({ request, env }) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';
    const expected = await hmacSha256(env.RAZORPAY_WEBHOOK_SECRET, body);
    if (signature !== expected) {
      return new Response('Invalid signature', { status: 401 });
    }
    const event = JSON.parse(body);
    if (event.event === 'payment.captured') {
      // wire same logSaleToGithub flow from payhip-webhook.js
    }
    return new Response('OK', { status: 200 });
  } catch (e) {
    return new Response('Error: ' + e.message, { status: 500 });
  }
}

async function hmacSha256(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}
