// ============================================================
// PUBLIC client-side config. NEVER put secrets here.
// Master copy of business settings lives in /config/settings.json
// To change prices/links: edit here AND /config/PRODUCT-SPECS.md
// ============================================================

window.APP_CONFIG = {
  siteName: "Freelancer OS",
  tagline: "Build a Smarter Freelancer Business Without Guesswork",
  contactEmail: "surisetti.dev@gmail.com",
  currency: "INR",
  currencySymbol: "₹",
  domain: "https://your-domain.pages.dev", // update after Cloudflare Pages deploy

  analytics: {
    ga4Id: "G-XXXXXXX",      // paste real GA4 ID
    clarityId: "xxxxxxxxxx"  // paste real Microsoft Clarity ID
  },

  // Payhip "Buy" links — paste your real ones after creating products in Payhip
  // (Payhip dashboard → Product → Share → copy the payhip.com/b/XXXXX link)
  products: {
    "ai-freelancer": {
      name: "AI for Freelancers Guide",
      price: 699,
      payhipUrl: "https://payhip.com/b/YOUR_PRODUCT_ID_1",
      page: "products/ai-freelancer.html",
      desc: "Stop wasting hours picking the wrong AI. Decision tree + 50 prompts + free-API setup guide."
    },
    "pricing-guide": {
      name: "Freelancer Pricing Masterclass",
      price: 899,
      payhipUrl: "https://payhip.com/b/YOUR_PRODUCT_ID_2",
      page: "products/pricing-guide.html",
      desc: "Move from hourly billing to value-based pricing. Calculator + proposal templates included."
    },
    "tax-guide": {
      name: "Indian Freelancer Tax & Compliance Guide",
      price: 799,
      payhipUrl: "https://payhip.com/b/YOUR_PRODUCT_ID_3",
      page: "products/tax-guide.html",
      desc: "GST, 44ADA, advance tax — explained simply for Indian freelancers. Invoice template included."
    },
    "client-gen": {
      name: "Client Generation & Lead System",
      price: 1299,
      payhipUrl: "https://payhip.com/b/YOUR_PRODUCT_ID_4",
      page: "products/client-gen.html",
      desc: "Cold outreach sequences + lead tracker + discovery call script. Predictable pipeline."
    },
    "business-os": {
      name: "Solopreneur Business OS",
      price: 1899,
      payhipUrl: "https://payhip.com/b/YOUR_PRODUCT_ID_5",
      page: "products/business-os.html",
      desc: "Notion dashboard + ops guide. Run your freelance business like a CEO, not a chaos manager."
    },
    "bundle": {
      name: "Complete Freelancer OS (All 5)",
      price: 3999,
      originalPrice: 5595,
      payhipUrl: "https://payhip.com/b/YOUR_BUNDLE_ID",
      desc: "Every product, one checkout. Save ₹1,596."
    }
  },

  leadMagnet: {
    title: "Free Freelancer Pricing Calculator",
    payhipUrl: "https://payhip.com/b/YOUR_FREE_PRODUCT_ID"
  }
};
