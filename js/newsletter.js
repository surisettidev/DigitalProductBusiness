// Captures lead email.
// 1) Tries the Cloudflare Pages Function /api/brevo-subscribe (production, Brevo).
// 2) Falls back to the built-in RESTful Table API (tables/leads) so the form
//    works immediately on this hosting too — leads appear in admin.html.
document.addEventListener('submit', async function (e) {
  const form = e.target.closest('#lead-form');
  if (!form) return;
  e.preventDefault();

  const email = form.querySelector('input[name="email"]').value.trim();
  if (!email || !email.includes('@')) return;

  const btn = form.querySelector('button');
  const original = btn.textContent;
  btn.textContent = 'Sending...'; btn.disabled = true;

  const source = form.getAttribute('data-source') || 'hero-lead-magnet';

  // Attempt 1: Brevo via Cloudflare Pages Function
  let ok = false;
  try {
    const res = await fetch('/api/brevo-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source })
    });
    ok = res.ok;
  } catch (_) { /* function not deployed here — fall through */ }

  // Attempt 2: built-in table storage fallback
  if (!ok) {
    try {
      const res = await fetch('tables/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, status: 'new', notes: '' })
      });
      ok = res.ok;
    } catch (_) { /* network failure */ }
  }

  if (ok) {
    if (window.gtag) window.gtag('event', 'subscribe_newsletter', { method: 'lead_magnet' });
    window.location.href = 'thank-you.html';
  } else {
    alert("Hmm, that didn't work. Email " + ((window.APP_CONFIG || {}).contactEmail || 'support') + " — we'll send it manually.");
    btn.textContent = original; btn.disabled = false;
  }
});
