/* ================================================================
   Freelancer OS v3.1 — main-v3.js
   Renders product cards + bundle into the DOM.
   Cards have NO data-reveal (avoids opacity:0 race with GSAP).
   Grid wrapper has data-stagger — GSAP handles reveal via autoAlpha.
   ================================================================ */
(function () {
  'use strict';

  const cfg = window.APP_CONFIG || {};

  /* Bind site name */
  document.querySelectorAll('[data-bind="siteName"]').forEach(el => {
    if (cfg.siteName) el.textContent = cfg.siteName;
  });

  /* Year */
  document.querySelectorAll('#year, .js-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const FEATURES = {
    'ai-freelancer':  ['50+ curated AI prompts',          'Which-tool decision tree',       'Free API setup guide (₹0 cost)'],
    'pricing-guide':  ['Value-based pricing calculator',   'Proposal templates (5 niches)',   'Rate-raise email scripts'],
    'tax-guide':      ['GST registration walkthrough',     'Section 44ADA savings guide',     'GST-compliant invoice template'],
    'client-gen':     ['Cold outreach email sequences',    'Lead tracker spreadsheet',        'Discovery call script'],
    'business-os':    ['Complete Notion OS template',      'Weekly + monthly review playbook','Revenue dashboard included'],
  };

  const ORDER = ['ai-freelancer','pricing-guide','tax-guide','client-gen','business-os'];

  /* ── Product cards ──────────────────────────────────── */
  const grid = document.getElementById('products-grid');
  if (grid && cfg.products) {
    grid.innerHTML = ORDER.map(slug => {
      const p = cfg.products[slug];
      if (!p) return '';
      const featured = slug === 'ai-freelancer';
      const feats    = FEATURES[slug] || [];

      return `
<article class="product-card${featured ? ' featured' : ''}">
  ${featured ? '<div style="margin-bottom:10px"><span class="card-badge">⭐ Start here</span></div>' : ''}
  <div class="card-emoji">${p.emoji || '📦'}</div>
  <div class="card-title"><a href="${p.page || '#'}">${p.name}</a></div>
  <p class="card-desc">${p.desc || ''}</p>
  <div class="card-features">
    ${feats.map(f => `
    <div class="card-feat">
      <span class="feat-check">✓</span>
      <span>${f}</span>
    </div>`).join('')}
  </div>
  <div class="card-footer">
    <span class="card-price">${cfg.currencySymbol || '₹'}${p.price.toLocaleString('en-IN')}</span>
    <button class="buy-btn" data-slug="${slug}" aria-label="Buy ${p.name}">
      Buy now
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
      </svg>
    </button>
  </div>
  <a class="card-learn" href="${p.page || '#'}">See what's inside →</a>
</article>`;
    }).join('');
  }

  /* ── Bundle card ──────────────────────────────────────── */
  const bundleEl = document.getElementById('bundle-card');
  if (bundleEl && cfg.products && cfg.products.bundle) {
    const b   = cfg.products.bundle;
    const sym = cfg.currencySymbol || '₹';
    const savings = b.originalPrice ? b.originalPrice - b.price : 0;
    const pct     = b.originalPrice ? Math.round((savings / b.originalPrice) * 100) : 0;

    bundleEl.innerHTML = `
<div class="bundle-inner">
  <div class="bundle-left">
    <div class="bundle-flag">🔥 Best Value — Save ${pct}%</div>
    <div class="bundle-title">${b.emoji || '🎁'} Complete Freelancer OS</div>
    <p class="bundle-sub">All 5 products · Every system you need to run a thriving freelance business in India</p>
    <div class="bundle-chips">
      <span class="bundle-chip">🤖 AI Guide</span>
      <span class="bundle-chip">💰 Pricing</span>
      <span class="bundle-chip">🧾 Tax</span>
      <span class="bundle-chip">🎯 Clients</span>
      <span class="bundle-chip">🗂️ Business OS</span>
    </div>
  </div>
  <div class="bundle-pricing">
    ${b.originalPrice ? `<span class="bundle-orig">${sym}${b.originalPrice.toLocaleString('en-IN')}</span>` : ''}
    <span class="bundle-amount">${sym}${b.price.toLocaleString('en-IN')}</span>
    ${savings > 0 ? `<span class="bundle-save">You save ${sym}${savings.toLocaleString('en-IN')}</span>` : ''}
    <button class="bundle-buy" data-slug="bundle" aria-label="Buy Complete Freelancer OS bundle">
      Get the Full Bundle →
    </button>
  </div>
</div>`;
  }
})();
