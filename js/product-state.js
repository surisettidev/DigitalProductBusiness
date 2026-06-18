// js/product-state.js
// Shared script included by all product pages.
// Reads config/product-status.json and:
//   - If status == "live": shows buy button (existing checkout.js handles it)
//   - If status == "coming-soon": hides buy button, injects waitlist form
//
// Usage in product HTML:
//   <script src="../js/product-state.js" data-slug="ai-freelancer" defer></script>
//   <script src="../js/checkout.js" defer></script>

(async function () {
  const script   = document.currentScript || document.querySelector('[data-slug]');
  const slug     = script?.dataset?.slug || '';
  if (!slug) return;

  // Load product status config
  let config;
  try {
    const res = await fetch('/config/product-status.json');
    config = await res.json();
  } catch (_) {
    // Config not loadable — fail open (show buy button as default)
    return;
  }

  const product = config?.products?.[slug];
  if (!product) return; // Unknown slug — fail open

  if (product.status === 'live') {
    // Buy button is already shown by default in HTML
    // Just ensure waitlist containers (if any) are hidden
    document.querySelectorAll('.waitlist-wrap').forEach(el => el.remove());
    return;
  }

  if (product.status === 'coming-soon') {
    // 1. Hide all buy buttons and price displays
    document.querySelectorAll('.buy-btn').forEach(btn => {
      btn.closest('.prod-cta-row')?.classList.add('hidden-cta-row');
      btn.remove();
    });
    document.querySelectorAll('.prod-price, .cta-box-price').forEach(el => {
      el.textContent = product.price
        ? `₹${product.price.toLocaleString('en-IN')} — launching soon`
        : 'Launching soon';
    });
    document.querySelectorAll('.prod-guarantee').forEach(el => {
      el.textContent = `🔔 Free early-bird: join the waitlist for ${product.earlyBirdDiscount || 20}% off on launch day`;
    });

    // 2. Replace the CTA boxes with waitlist forms
    document.querySelectorAll('.cta-box').forEach(box => {
      box.innerHTML = buildWaitlistHTML(product);
    });

    // 3. Inject a waitlist form below the hero price block (if cta-row was removed)
    document.querySelectorAll('.prod-cta-row.hidden-cta-row, .prod-cta-row').forEach(row => {
      const wrap = document.createElement('div');
      wrap.className = 'waitlist-wrap';
      wrap.innerHTML = buildWaitlistHTML(product);
      row.replaceWith(wrap);
    });

    // 4. Wire up all waitlist forms
    wireWaitlistForms(slug, product);
  }
})();

function buildWaitlistHTML(product) {
  const discount = product.earlyBirdDiscount || 20;
  const eta      = product.launchEta ? ` · Launches ${product.launchEta}` : '';
  return `
    <div class="waitlist-inner">
      <p class="waitlist-badge">🚀 Coming Soon${eta}</p>
      <p class="waitlist-headline">
        Get <strong>${discount}% early-bird discount</strong> — join the waitlist
      </p>
      <p class="waitlist-sub">
        This guide is being reviewed and finalised. Waitlist members get a
        personal launch-day email + ${discount}% off at checkout.
      </p>
      <form class="waitlist-form" novalidate>
        <div class="waitlist-row">
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            required
            class="waitlist-input"
            aria-label="Email address for waitlist"
          >
          <button type="submit" class="waitlist-btn">
            Notify me →
          </button>
        </div>
        <p class="waitlist-note">🔒 No spam · Unsubscribe anytime</p>
        <p class="waitlist-success" aria-live="polite" hidden>
          ✅ You're on the list! We'll email you the moment it launches.
        </p>
        <p class="waitlist-error" aria-live="polite" hidden>
          Something went wrong. Try again or email <a href="mailto:support@freelancer-os.in">support</a>.
        </p>
      </form>
    </div>
  `;
}

function wireWaitlistForms(slug, product) {
  document.querySelectorAll('.waitlist-form').forEach(form => {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn      = form.querySelector('.waitlist-btn');
      const input    = form.querySelector('input[name="email"]');
      const success  = form.querySelector('.waitlist-success');
      const errEl    = form.querySelector('.waitlist-error');
      const email    = (input?.value || '').trim();

      if (!email || !email.includes('@')) {
        input?.focus();
        return;
      }

      btn.textContent = 'Saving…';
      btn.disabled    = true;
      errEl.hidden    = true;

      try {
        const res = await fetch('/api/waitlist', {
          method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify({ email, slug })
        });
        const data = await res.json();

        if (data.ok) {
          form.querySelector('.waitlist-row').hidden = true;
          form.querySelector('.waitlist-note').hidden = true;
          success.hidden = false;

          // GA4 event
          if (window.gtag) {
            window.gtag('event', 'waitlist_signup', {
              product_slug: slug,
              product_name: product.name || slug
            });
          }
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (_) {
        errEl.hidden    = false;
        btn.textContent = 'Notify me →';
        btn.disabled    = false;
      }
    });
  });
}
