// Renders product cards from config and handles small UI bindings.
(function () {
  const cfg = window.APP_CONFIG || {};

  // Bind siteName, year, etc.
  document.querySelectorAll('[data-bind]').forEach(el => {
    const key = el.getAttribute('data-bind');
    if (cfg[key]) el.textContent = cfg[key];
  });
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Render product grid
  const grid = document.getElementById('products-grid');
  if (grid && cfg.products) {
    const order = ['ai-freelancer', 'pricing-guide', 'tax-guide', 'client-gen', 'business-os'];
    grid.innerHTML = order.map(slug => {
      const p = cfg.products[slug];
      if (!p) return '';
      const featured = slug === 'ai-freelancer' ? 'featured' : '';
      const badge = slug === 'ai-freelancer' ? '<span class="badge">Start here</span>' : '';
      return `
        <article class="product-card ${featured}">
          ${badge}
          <div class="card-emoji" aria-hidden="true">${p.emoji || '📦'}</div>
          <h3><a href="${p.page}">${p.name}</a></h3>
          <div class="price">${cfg.currencySymbol}${p.price}</div>
          <p class="desc">${p.desc || ''}</p>
          <button class="buy-btn" data-slug="${slug}">Buy now →</button>
          <a class="learn-link" href="${p.page}">What's inside →</a>
        </article>
      `;
    }).join('');
  }

  // Render bundle card
  const bundle = document.getElementById('bundle-card');
  if (bundle && cfg.products && cfg.products.bundle) {
    const b = cfg.products.bundle;
    bundle.innerHTML = `
      <h3>${(b.emoji || '🎁')} Complete Freelancer OS — all 5 products</h3>
      <div class="price">${cfg.currencySymbol}${b.price}
        <small>${cfg.currencySymbol}${b.originalPrice}</small>
      </div>
      <p style="color:#cbd5e1;margin-bottom:14px;">Save ${cfg.currencySymbol}${b.originalPrice - b.price} when you grab everything together.</p>
      <button class="buy-btn" data-slug="bundle">Get the bundle →</button>
    `;
  }

  // Scroll-reveal: fade sections/cards in as they enter the viewport.
  if ('IntersectionObserver' in window) {
    const targets = document.querySelectorAll(
      '.pain-card, .product-card, .faq-item, .bundle-card, .how-steps li, .hero-stats > div'
    );
    targets.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = ((i % 3) * 80) + 'ms';
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach(el => io.observe(el));
  }
})();
