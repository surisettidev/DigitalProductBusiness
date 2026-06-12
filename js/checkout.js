// Click-to-Payhip handoff. Tracks the click in GA4 if available.
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.buy-btn[data-slug]');
  if (!btn) return;
  e.preventDefault();

  const slug = btn.getAttribute('data-slug');
  const product = window.APP_CONFIG && window.APP_CONFIG.products && window.APP_CONFIG.products[slug];
  if (!product || !product.payhipUrl || product.payhipUrl.includes('YOUR_')) {
    alert('Checkout link not configured yet. Please email ' + ((window.APP_CONFIG || {}).contactEmail || 'support') + '\n\n(Operator: paste your real Payhip buy link into js/config.js)');
    return;
  }

  // GA4 event
  if (window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: window.APP_CONFIG.currency,
      value: product.price,
      items: [{ item_id: slug, item_name: product.name, price: product.price, quantity: 1 }]
    });
  }

  // Open Payhip in same tab — better mobile UX
  window.location.href = product.payhipUrl;
});
