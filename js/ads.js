/**
 * Freelancer OS — Minimal Non-Intrusive Ad System
 * ================================================
 * Strategy:
 *  1. Native "Sponsored tool" strips — look like editorial recommendations.
 *     Clearly labelled "Sponsored" in small grey text.
 *  2. One sticky bottom banner (desktop only, ≥900px) — dismissible.
 *     Auto-hides after 8 s of inactivity or on scroll past 80% of page.
 *  3. Zero popups, zero interstitials, zero autoplay video, zero ad-blockers.
 *  4. Only shown AFTER 3 seconds of page load (non-blocking).
 *  5. Respects prefers-reduced-motion.
 *  6. Persists dismissal for 24 h via localStorage.
 *
 * HOW TO MONETISE:
 *  Option A — Google AdSense Auto-ads:
 *    Paste your AdSense publisher tag in index.html <head>.
 *    Set ADS_CONFIG.adsensePublisherId below. Auto-ads will inject
 *    themselves on the page; this script's native units supplement.
 *
 *  Option B — Direct / affiliate native units:
 *    Edit ADS_CONFIG.nativeAds array below with real affiliate links.
 *    These are contextual tool recommendations your audience already
 *    wants — much better CTR and no creepy tracking.
 *
 *  Option C — Carbon Ads / EthicalAds (developer-friendly, GDPR-clean):
 *    Set ADS_CONFIG.carbonAdsId with your placement ID.
 */

const ADS_CONFIG = {
  // --- Google AdSense ---
  // Paste publisher ID (ca-pub-XXXXXXXXXXXXXXXX) here to activate AdSense.
  // Leave empty to disable.
  adsensePublisherId: '',

  // --- Carbon Ads (https://www.carbonads.net) ---
  // Great for dev/tech audiences, very clean single ad unit.
  // Get a placement ID from carbonads.net and paste here.
  carbonAdsId: '',  // e.g. 'CWYD42JN'

  // --- Native / Affiliate Recommendations ---
  // These render as labelled "Sponsored tool" cards in the page flow.
  // Only shown on index.html between the pain-points and products sections.
  // REPLACE with real affiliate links once you have them.
  nativeAds: [
    {
      id: 'brevo',
      label: 'Sponsored',
      logo: 'https://www.brevo.com/favicon.ico',
      title: 'Brevo (formerly Sendinblue)',
      tagline: 'Free email marketing for up to 300 emails/day. Used by this site.',
      cta: 'Start free →',
      url: 'https://www.brevo.com/?utm_source=freelanceros',
      relevance: ['index'] // page slugs to show on
    },
    {
      id: 'notion',
      label: 'Sponsored',
      logo: 'https://www.notion.so/images/favicon.ico',
      title: 'Notion',
      tagline: 'Free for personal use. The backbone of the Solopreneur Business OS.',
      cta: 'Use for free →',
      url: 'https://notion.so',
      relevance: ['index', 'business-os']
    },
    {
      id: 'payhip',
      label: 'Sponsored',
      logo: 'https://payhip.com/favicon.ico',
      title: 'Payhip',
      tagline: '0% transaction fees on the free plan. Sell PDFs and templates instantly.',
      cta: 'Sell your own products →',
      url: 'https://payhip.com',
      relevance: ['index']
    }
  ],

  // --- Sticky footer banner (dismissible, desktop only) ---
  stickyBanner: {
    enabled: true,
    dismissDurationHours: 24,
    // Rotate through these; one shown at a time
    items: [
      {
        text: '🚀 <strong>Groq</strong> — Free, blazing-fast Llama API. Used in the AI for Freelancers Guide.',
        cta: 'Get free API key →',
        url: 'https://console.groq.com'
      },
      {
        text: '📊 <strong>Microsoft Clarity</strong> — Free heatmaps & session recordings for your site.',
        cta: 'Set up free →',
        url: 'https://clarity.microsoft.com'
      }
    ]
  }
};

/* ============================================================
   INITIALISE — runs after 3 s to never block critical content
   ============================================================ */
window.addEventListener('load', () => {
  setTimeout(initAds, 3000);
});

function initAds() {
  // Detect current page
  const slug = location.pathname.split('/').pop().replace('.html', '') || 'index';

  // 1. Carbon Ads
  if (ADS_CONFIG.carbonAdsId) {
    injectCarbonAd();
  }

  // 2. Native recommendation strip (index page only)
  const nativeSlot = document.getElementById('native-ads-slot');
  if (nativeSlot) {
    const ads = ADS_CONFIG.nativeAds.filter(a => a.relevance.includes(slug));
    if (ads.length) {
      renderNativeStrip(nativeSlot, ads);
    }
  }

  // 3. Sticky footer banner (desktop only)
  if (ADS_CONFIG.stickyBanner.enabled && window.innerWidth >= 900) {
    const key = 'fos_sticky_dismissed';
    const dismissed = localStorage.getItem(key);
    if (!dismissed || Date.now() > Number(dismissed)) {
      renderStickyBanner(key);
    }
  }

  // 4. AdSense auto-ads (just inject the script tag once)
  if (ADS_CONFIG.adsensePublisherId && !document.getElementById('adsense-script')) {
    const s = document.createElement('script');
    s.id = 'adsense-script';
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CONFIG.adsensePublisherId}`;
    document.head.appendChild(s);
  }
}

/* ============================================================
   NATIVE STRIP
   ============================================================ */
function renderNativeStrip(slot, ads) {
  const section = document.createElement('section');
  section.className = 'native-ads-section';
  section.setAttribute('aria-label', 'Sponsored tools');
  section.innerHTML = `
    <div class="container">
      <div class="native-ads-strip">
        ${ads.map(ad => `
          <a class="native-ad-card" href="${ad.url}" target="_blank" rel="noopener sponsored" data-ad-id="${ad.id}">
            <span class="native-ad-label">${ad.label}</span>
            <div class="native-ad-inner">
              <img src="${ad.logo}" alt="" class="native-ad-logo" width="20" height="20" loading="lazy" onerror="this.style.display='none'">
              <div>
                <strong class="native-ad-title">${ad.title}</strong>
                <span class="native-ad-tag">${ad.tagline}</span>
              </div>
              <span class="native-ad-cta">${ad.cta}</span>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
  `;

  // Inject between pain section and products section
  const productsSection = document.getElementById('products');
  if (productsSection) {
    productsSection.parentNode.insertBefore(section, productsSection);
  } else {
    slot.appendChild(section);
  }
}

/* ============================================================
   STICKY BOTTOM BANNER
   ============================================================ */
function renderStickyBanner(storageKey) {
  const items = ADS_CONFIG.stickyBanner.items;
  const item  = items[Math.floor(Math.random() * items.length)];

  const bar = document.createElement('div');
  bar.id = 'sticky-ad-bar';
  bar.innerHTML = `
    <div class="sticky-ad-inner">
      <span class="sticky-ad-label">Sponsored</span>
      <p class="sticky-ad-text">${item.text}</p>
      <a class="sticky-ad-cta" href="${item.url}" target="_blank" rel="noopener sponsored">${item.cta}</a>
      <button class="sticky-ad-close" aria-label="Dismiss">&times;</button>
    </div>
  `;
  document.body.appendChild(bar);

  // Dismiss button
  bar.querySelector('.sticky-ad-close').addEventListener('click', () => dismissSticky(bar, storageKey));

  // Auto-dismiss after 8 s of no scroll
  let autoTimer = setTimeout(() => dismissSticky(bar, storageKey), 8000);

  // Reset timer on scroll; hide when near page bottom
  window.addEventListener('scroll', () => {
    clearTimeout(autoTimer);
    autoTimer = setTimeout(() => dismissSticky(bar, storageKey), 8000);
    const scrollPct = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
    if (scrollPct > 0.85) dismissSticky(bar, storageKey);
  }, { passive: true });
}

function dismissSticky(bar, storageKey) {
  bar.style.transform = 'translateY(100%)';
  bar.style.opacity = '0';
  setTimeout(() => bar.remove(), 400);
  const hours = ADS_CONFIG.stickyBanner.dismissDurationHours;
  localStorage.setItem(storageKey, String(Date.now() + hours * 3600_000));
}

/* ============================================================
   CARBON ADS
   ============================================================ */
function injectCarbonAd() {
  const slot = document.getElementById('carbon-ad-slot');
  if (!slot) return;
  const s = document.createElement('script');
  s.async = true;
  s.type = 'text/javascript';
  s.src = `//cdn.carbonads.com/carbon.js?serve=${ADS_CONFIG.carbonAdsId}&placement=freelanceros`;
  s.id = '_carbonads_js';
  slot.appendChild(s);
}
