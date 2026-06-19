// Captures lead email via the Cloudflare Pages Function /api/brevo-subscribe,
// which adds the contact to Brevo (if configured) AND logs the lead to the
// structured ledger that powers admin.html — even if Brevo isn't set up yet.
//
// If form has data-slug attribute, uses /api/waitlist instead (for coming-soon products).
document.addEventListener('submit', async function (e) {
  const form = e.target.closest('#lead-form');
  if (!form) return;
  e.preventDefault();

  const email = form.querySelector('input[name="email"]').value.trim();
  if (!email || !email.includes('@')) return;

  const btn = form.querySelector('button');
  const original = btn.textContent;
  btn.textContent = 'Sending...'; btn.disabled = true;

  const slug = form.getAttribute('data-slug');
  const source = form.getAttribute('data-source') || 'hero-lead-magnet';

  let ok = false;
  let endpoint = '/api/brevo-subscribe';
  let payload = { email, source };

  // If form has data-slug, use /api/waitlist instead
  if (slug) {
    endpoint = '/api/waitlist';
    payload = { email, slug };
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    ok = res.ok;
  } catch (_) { /* network failure */ }

  if (ok) {
    if (window.gtag) window.gtag('event', 'subscribe_newsletter', { method: slug ? 'waitlist' : 'lead_magnet' });
    window.location.href = 'thank-you.html';
  } else {
    alert("Hmm, that didn't work. Email " + ((window.APP_CONFIG || {}).contactEmail || 'support') + " — we'll send it manually.");
    btn.textContent = original; btn.disabled = false;
  }
});
