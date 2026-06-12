// ============================================================
// PUBLIC client-side config. NEVER put secrets here.
// Prices shown here are DISPLAY ONLY — the server-side catalog in
// functions/api/_lib.js is the authoritative price list used to
// create Razorpay orders. Keep both in sync when changing prices.
// ============================================================

window.APP_CONFIG = {
  siteName: "Freelancer OS",
  tagline: "Build a Smarter Freelancer Business Without Guesswork",
  contactEmail: "surisetti.dev@gmail.com",
  currency: "INR",
  currencySymbol: "₹",
  domain: "https://freelance-os.pages.dev",

  // Payments: Razorpay (UPI, cards, netbanking, wallets).
  // Orders are created server-side via /api/create-order — no keys here.
  paymentGateway: "razorpay",

  analytics: {
    ga4Id: "G-DH0HSN4Z0H",
    clarityId: "x5vbk9lkvs"
  },

  products: {
    "ai-freelancer": {
      name: "AI for Freelancers Guide",
      price: 699,
      page: "products/ai-freelancer.html",
      emoji: "🤖",
      desc: "Stop wasting hours picking the wrong AI. Decision tree + 50 prompts + free-API setup guide."
    },
    "pricing-guide": {
      name: "Freelancer Pricing Masterclass",
      price: 899,
      page: "products/pricing-guide.html",
      emoji: "💰",
      desc: "Move from hourly billing to value-based pricing. Calculator + proposal templates included."
    },
    "tax-guide": {
      name: "Indian Freelancer Tax & Compliance Guide",
      price: 799,
      page: "products/tax-guide.html",
      emoji: "🧾",
      desc: "GST, 44ADA, advance tax — explained simply for Indian freelancers. Invoice template included."
    },
    "client-gen": {
      name: "Client Generation & Lead System",
      price: 1299,
      page: "products/client-gen.html",
      emoji: "🎯",
      desc: "Cold outreach sequences + lead tracker + discovery call script. Predictable pipeline."
    },
    "business-os": {
      name: "Solopreneur Business OS",
      price: 1899,
      page: "products/business-os.html",
      emoji: "🗂️",
      desc: "Notion dashboard + ops guide. Run your freelance business like a CEO, not a chaos manager."
    },
    "bundle": {
      name: "Complete Freelancer OS (All 5)",
      price: 3999,
      originalPrice: 5595,
      emoji: "🎁",
      desc: "Every product, one checkout. Save ₹1,596."
    }
  },

  leadMagnet: {
    title: "Free Freelancer Pricing Calculator"
  }
};
