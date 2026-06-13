/* ── main-v3.js — product card renderer (v3 design) ─────────────
   Runs after DOMContentLoaded (defer). Cards rendered WITHOUT
   data-reveal so they are never opacity:0 before JS fires.
   app-v3.js handles scroll-reveal on the grid wrapper instead.
   ──────────────────────────────────────────────────────────────*/
(function () {
  'use strict';

  const cfg = window.APP_CONFIG || {};

  document.querySelectorAll('[data-bind="siteName"]').forEach(el => {
    if (cfg.siteName) el.textContent = cfg.siteName;
  });

  document.querySelectorAll('.js-year, #year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const FEATURES = {
    'ai-freelancer':  ['50+ curated AI prompts',   'Which-tool decision tree',  'Free API setup guide'],
    'pricing-guide':  ['Value-based pricing calc',  'Proposal templates',        'Rate-raise email scripts'],
    'tax-guide':      ['GST registration explained','44ADA tax savings guide',   'Invoice + expense sheet'],
    'client-gen':     ['Cold outreach sequences',   'Lead tracker spreadsheet',  'Discovery call script'],
    'business-os':    ['Notion CEO dashboard',      'Weekly ops playbook',       'Review templates'],
  };

  const ORDER = ['ai-freelancer','pricing-guide','tax-guide','client-gen','business-os'];

  const grid = document.getElementById('products-grid');
  if (grid && cfg.products) {
    grid.innerHTML = ORDER.map((slug, idx) => {
      const p = cfg.products[slug];
      if (!p) return '';
      const featured = slug === 'ai-freelancer';
      const feats = FEATURES[slug] || [];
      const badgeHtml = featured
        ? '<div style="margin-bottom:10px"><span class="card-badge">⭐ Start Here</span></div>'
        : '';
      return `
<article class="product-card${featured ? ' featured' : ''}" data-slug="${slug}">
  ${badgeHtml}
  <div class="card-emoji">${p.emoji || '📦'}</div>
  <div class="card-title"><a href="${p.page || '#'}">${p.name}</a></div>
  <p class="card-desc">${p.desc || ''}</p>
  <div class="card-features">
    ${feats.map(f => `<div class="card-feat"><span class="feat-check">✓</span><span>${f}</span></div>`).join('')}
  </div>
  <div class="card-footer">
    <span class="card-price">${cfg.currencySymbol||'₹'}${p.price.toLocaleString('en-IN')}</span>
    <button class="buy-btn" data-slug="${slug}">
      Buy now
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>
    </button>
  </div>
  <a class="card-learn" href="${p.page || '#'}">See what's inside →</a>
</article>`;
    }).join('');
  }

  const bundleEl = document.getElementById('bundle-card');
  if (bundleEl && cfg.products && cfg.products.bundle) {
    const b   = cfg.products.bundle;
    const sym = cfg.currencySymbol || '₹';
    const savings = b.originalPrice ? b.originalPrice - b.price : 0;
    const pct     = b.originalPrice ? Math.round((savings / b.originalPrice) * 100) : 0;
    bundleEl.innerHTML = `
<div class="bundle-inner">
  <div class="bundle-left">
    <div class="bundle-flag">🔥 Best Value</div>
    <div class="bundle-title">${b.emoji||'🎁'} Complete Freelancer OS</div>
    <p class="bundle-sub">All 5 products · Every system you need to run a thriving freelance business</p>
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
    ${savings > 0 ? `<span class="bundle-save">Save ${sym}${savings.toLocaleString('en-IN')} (${pct}% off)</span>` : ''}
    <button class="bundle-buy buy-btn" data-slug="bundle">Get the Full Bundle →</button>
  </div>
</div>`;
  }
})();
