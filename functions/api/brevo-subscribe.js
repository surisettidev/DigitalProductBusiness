// Cloudflare Pages Function — POST /api/brevo-subscribe
// Body: { email, source }
// Secrets (BREVO_API_KEY, BREVO_LIST_ID) live in Cloudflare Pages env vars — never in the repo.
export async function onRequestPost({ request, env }) {
  try {
    const { email, source = 'website' } = await request.json();
    if (!email || !email.includes('@')) {
      return new Response('Invalid email', { status: 400 });
    }

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
        return new Response(JSON.stringify({ ok: true, existed: true }), { status: 200 });
      }
      return new Response('Brevo error: ' + txt, { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response('Server error: ' + e.message, { status: 500 });
  }
}
