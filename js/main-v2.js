// ============================================================
// Freelancer OS — main-v2.js
// Product card rendering with new award-winning design
// Keeps Razorpay checkout integration intact via data attributes
// ============================================================
(function () {
  'use strict';

  const cfg = window.APP_CONFIG || {};

  // Bind site name
  document.querySelectorAll('[data-bind="siteName"]').forEach(el => {
    if (cfg.siteName) el.querySelector('span:last-child').textContent = cfg.siteName;
  });

  // Update year in footer
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Render product grid with new card design
  const grid = document.getElementById('products-grid');
  if (grid && cfg.products) {
    const order = ['ai-freelancer', 'pricing-guide', 'tax-guide', 'client-gen', 'business-os'];

    const features = {
      'ai-freelancer': ['50+ AI prompts', 'Decision tree', 'Free API guide'],
      'pricing-guide': ['Pricing calculator', 'Proposal templates', 'Value-based system'],
      'tax-guide': ['GST explained', '44ADA guide', 'Invoice template'],
      'client-gen': ['Outreach sequences', 'Lead tracker', 'Call scripts'],
      'business-os': ['Notion dashboard', 'Ops guide', 'CEO systems'],
    };

    grid.innerHTML = order.map((slug, idx) => {
      const p = cfg.products[slug];
      if (!p) return '';
      const isFeatured = slug === 'ai-freelancer';
      const featuredClass = isFeatured ? 'featured' : '';
      const badge = isFeatured
        ? '<span class="card-badge">⭐ Start Here</span>'
        : '';
      const featureList = (features[slug] || []).map(f => `<span>✓ ${f}</span>`).join('');

      return `
        <article class="product-card ${featuredClass}" data-slug="${slug}">
          <div class="card-glow" aria-hidden="true"></div>
          <div class="card-header">
            ${badge}
            <div class="card-emoji" aria-hidden="true">${p.emoji || '📦'}</div>
          </div>
          <h3><a href="${p.page || '#'}">${p.name}</a></h3>
          <p>${p.desc || ''}</p>
          <div class="card-features">
            ${featureList}
          </div>
          <div class="card-footer">
            <div class="price-block">
              <span class="price">${cfg.currencySymbol || '₹'}${p.price.toLocaleString('en-IN')}</span>
            </div>
            <button class="buy-btn" data-slug="${slug}">
              <span>Buy Now</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>
            </button>
          </div>
          <a class="learn-link" href="${p.page || '#'}">What's inside →</a>
        </article>
      `;
    }).join('');
  }

  // Render bundle card with new design
  const bundleEl = document.getElementById('bundle-card');
  if (bundleEl && cfg.products && cfg.products.bundle) {
    const b = cfg.products.bundle;
    const savings = b.originalPrice ? b.originalPrice - b.price : 0;
    const pct = b.originalPrice ? Math.round((savings / b.originalPrice) * 100) : 0;

    bundleEl.innerHTML = `
      <div class="bundle-bg" aria-hidden="true"></div>
      <div class="bundle-content">
        <div class="bundle-left">
          <span class="bundle-tag">🔥 Best Value</span>
          <h3 class="bundle-title">${b.emoji || '🎁'} Complete Freelancer OS</h3>
          <p class="bundle-sub">All 5 products · Everything you need to build a thriving freelance business</p>
          <div class="bundle-includes">
            <span>🤖 AI Guide</span>
            <span>💰 Pricing</span>
            <span>🧾 Tax</span>
            <span>🎯 Clients</span>
            <span>🗂️ Business OS</span>
          </div>
        </div>
        <div class="bundle-right">
          <div class="bundle-price">
            <span class="bundle-current">${cfg.currencySymbol || '₹'}${b.price.toLocaleString('en-IN')}</span>
            ${b.originalPrice ? `<span class="bundle-original">${cfg.currencySymbol || '₹'}${b.originalPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>
          ${savings > 0 ? `<div class="bundle-savings">Save ${cfg.currencySymbol || '₹'}${savings.toLocaleString('en-IN')} (${pct}% off)</div>` : ''}
          <button class="bundle-btn buy-btn" data-slug="bundle">Get the Bundle →</button>
        </div>
      </div>
    `;
  }

})();
