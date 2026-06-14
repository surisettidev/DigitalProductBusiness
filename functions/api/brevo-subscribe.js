// Cloudflare Pages Function — POST /api/brevo-subscribe
// Body: { email, source }
// Secrets (BREVO_API_KEY, BREVO_LIST_ID) live in Cloudflare Pages env vars — never in the repo.
import { appendToLedger } from './_ledger.js';

export async function onRequestPost({ request, env }) {
  try {
    const { email, source = 'website' } = await request.json();
    if (!email || !email.includes('@')) {
      return new Response('Invalid email', { status: 400 });
    }

    let brevoOk = true;
    let existed = false;

    if (env.BREVO_API_KEY) {
      const res = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'api-key': env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          listIds: [parseInt(env.BREVO_LIST_ID || '2', 10)],
          attributes: { SOURCE: source, SIGNUP_DATE: new Date().toISOString() },
          updateEnabled: true
        })
      });

      if (!res.ok && res.status !== 204) {
        const txt = await res.text();
        if (txt.includes('Contact already exist')) {
          existed = true;
        } else {
          brevoOk = false;
        }
      }
    } else {
      brevoOk = false;
    }

    // Log to the structured ledger regardless of Brevo result, so the lead
    // shows up in admin.html even if Brevo isn't configured.
    try {
      await appendToLedger(env, { lead: { email, source, status: 'new', notes: '' } });
    } catch (_) { /* non-fatal */ }

    if (!brevoOk && !existed) {
      return new Response(JSON.stringify({ ok: true, brevo: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ ok: true, existed }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response('Server error: ' + e.message, { status: 500 });
  }
}
