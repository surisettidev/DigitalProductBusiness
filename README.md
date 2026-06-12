# 🚀 Freelancer OS — Digital Product Business

> Autonomous-first digital product business for Indian freelancers.  
> **Goal:** ₹15,000/month run-rate within 90 days · ≤2 hrs/day human effort · ₹0 fixed infrastructure cost.

---

## ✅ Completed Features

### Website & Store
- **Landing page** (`index.html`) — hero, pain points, product grid, FAQ, lead magnet form
- **5 product sales pages** — each with full description, What's Inside, CTA, 7-day guarantee
- **Thank-you page** (`thank-you.html`) — post-signup confirmation
- **Bundle section** — dynamically rendered from `js/config.js`
- **Fully responsive** — mobile, tablet, desktop

### Payments & Checkout
- **Payhip-first checkout** — zero upfront fees, instant delivery
- **Cloudflare Pages Function** — `/api/payhip-webhook` verifies signatures, logs sales to GitHub
- **Razorpay webhook** — stubbed at `/api/razorpay-webhook` for Phase 2

### Email & Lead Capture
- **Hero lead magnet form** — posts to `/api/brevo-subscribe` (Cloudflare Function → Brevo API)
- **Built-in table fallback** — leads also stored in `tables/leads` via RESTful Table API
- **Email templates** — welcome email, purchase confirmation (in `marketing/email-templates/`)
- **Brevo list integration** — subscribers auto-tagged with source + signup date

### Operator Dashboard (`admin.html`)
- **KPI cards** — total revenue, total sales, total leads, % of month target
- **Month progress bar** — live ₹0 → ₹15,000 tracker
- **Revenue by Product** — doughnut chart
- **Sales by Channel** — bar chart
- **Sales table** — paginated, filterable by product, deletable rows
- **Leads table** — paginated, filterable by status, inline status update (new → welcomed → customer)
- **Log Sale** form — manual entry with auto-price fill
- **Add Lead** form — for offline/DM leads
- Auto-refreshes every 60 seconds

### AI Operations & Automation
- **`workflows/ai-agent-instructions.md`** — the master prompt for ANY AI agent (Claude/Genspark/ChatGPT/Gemini/Groq)
- **`workflows/content-generator.js`** — Node.js fallback using Groq API
- **GitHub Actions** — daily content generation at 9 AM IST, commits to `marketing/YYYY-MM-DD/`
- **`daily-operations/`** — daily log, sales tracker, agent tasks, performance metrics JSON

### Ads (Non-Intrusive)
- **Native contextual strips** — labelled "Sponsored", shown between pain-points & products sections
- **Dismissible sticky footer bar** — desktop only, auto-hides after 8 s or 85% scroll, respects 24 h dismissal
- **Carbon Ads / AdSense slots** — wired up, just paste IDs into `js/ads.js`
- **Zero popups, zero interstitials, zero autoplay** — never blocks user flow

### Legal
- Privacy Policy, Terms of Service, Refund Policy — all India-law compliant (DPDP Act 2023, Telangana/AP jurisdiction)

---

## 🌐 Functional Entry URIs

| URL | Description |
|-----|-------------|
| `/` or `/index.html` | Main landing + store |
| `/products/ai-freelancer.html` | AI for Freelancers Guide — ₹699 |
| `/products/pricing-guide.html` | Freelancer Pricing Masterclass — ₹899 |
| `/products/tax-guide.html` | Indian Freelancer Tax Guide — ₹799 |
| `/products/client-gen.html` | Client Generation & Lead System — ₹1,299 |
| `/products/business-os.html` | Solopreneur Business OS — ₹1,899 |
| `/thank-you.html` | Post-signup/purchase confirmation |
| `/admin.html` | Operator dashboard (noindex) |
| `/legal/privacy-policy.html` | Privacy Policy |
| `/legal/terms-of-service.html` | Terms of Service |
| `/legal/refund-policy.html` | Refund Policy |
| `/api/brevo-subscribe` | POST — Cloudflare Function: subscribe email to Brevo |
| `/api/payhip-webhook` | POST — Cloudflare Function: log Payhip sales to GitHub |
| `/api/razorpay-webhook` | POST — Cloudflare Function: Phase 2 Razorpay (stubbed) |
| `tables/leads` | RESTful Table API — lead capture fallback + admin reads |
| `tables/sales` | RESTful Table API — manual sales log + admin reads |

---

## 🔧 Tech Stack

| Layer | Tool | Cost |
|---|---|---|
| Hosting | Cloudflare Pages | Free |
| Source of truth | GitHub (`surisettidev/DigitalProductBusiness`) | Free |
| Checkout | Payhip | 0% + 2.9%+$0.30 per sale |
| Email / Subscribers | Brevo | Free ≤300 emails/day |
| Serverless functions | Cloudflare Pages Functions | Free |
| Analytics | Google Analytics 4 + Microsoft Clarity | Free |
| AI content gen | Groq (Llama 3.3), Gemini 2.5 Flash | Free tier |
| CI/CD | GitHub Actions | Free |
| Ads (optional) | Carbon Ads / Google AdSense | Rev share |

---

## 🛠️ 10-Step Launch Checklist

```
[ ] 1. Push repo to github.com/surisettidev/DigitalProductBusiness
[ ] 2. Cloudflare Pages → Connect Git → output dir = / (root) → deploy
[ ] 3. Payhip → create free lead-magnet product → paste URL in js/config.js
[ ] 4. Payhip → create 5 paid products → paste URLs in js/config.js
[ ] 5. Brevo → create API key → create list "Leads" → add BREVO_API_KEY + BREVO_LIST_ID to Cloudflare env
[ ] 6. Payhip → Settings → Webhooks → add /api/payhip-webhook URL → add PAYHIP_WEBHOOK_SECRET to Cloudflare env
[ ] 7. GA4 + Microsoft Clarity → paste IDs into js/config.js analytics block
[ ] 8. Groq + Gemini → get free API keys → add to GitHub repo secrets (for daily AI workflow)
[ ] 9. Add GITHUBPAT (fine-grained, this repo only) to GitHub repo secrets + Cloudflare env
[ ] 10. Visit live site, submit lead form, confirm email arrives in Brevo
```

---

## 📁 Repository Structure

```
DigitalProductBusiness/
│
├── index.html                  ← Main store / landing page
├── thank-you.html              ← Post-signup confirmation
├── admin.html                  ← Operator dashboard (noindex)
│
├── products/                   ← Product sales pages
│   ├── ai-freelancer.html
│   ├── pricing-guide.html
│   ├── tax-guide.html
│   ├── client-gen.html
│   └── business-os.html
│
├── legal/
│   ├── privacy-policy.html
│   ├── terms-of-service.html
│   └── refund-policy.html
│
├── css/
│   ├── style.css               ← All styles (design tokens, components, ads)
│   └── responsive.css          ← Mobile breakpoints
│
├── js/
│   ├── config.js               ← PUBLIC config (prices, Payhip links, analytics IDs)
│   ├── main.js                 ← Renders product cards from config
│   ├── checkout.js             ← Payhip redirect + GA4 event
│   ├── newsletter.js           ← Lead form → Brevo function / table fallback
│   ├── analytics.js            ← Lazy-loads GA4 + Clarity
│   └── ads.js                  ← Non-intrusive ad system (native, sticky, AdSense)
│
├── config/                     ← Business settings — edit these, not the HTML
│   ├── settings.json           ← Single source of truth for site config
│   ├── BRIEF.md                ← Business rules, targets, constraints
│   ├── BRAND-VOICE.md          ← Tone guide for AI agents and copy
│   ├── PRODUCT-SPECS.md        ← Product contents + build order
│   ├── CUSTOMER-PROFILE.md     ← Persona, pains, buying triggers
│   └── GETTING-STARTED.md      ← Day-by-day setup guide
│
├── daily-operations/
│   ├── daily-log.md            ← Running business log (read by AI agents first)
│   ├── sales-tracker.md        ← Markdown sales table (updated by webhook)
│   ├── agent-tasks.md          ← Daily AI task list
│   └── performance-metrics.json← Structured metrics snapshot
│
├── workflows/
│   ├── ai-agent-instructions.md← Master prompt for any AI agent
│   └── content-generator.js    ← Node.js fallback content gen (Groq API)
│
├── functions/                  ← Cloudflare Pages Functions (serverless edge)
│   ├── brevo-subscribe.js      ← POST /api/brevo-subscribe
│   ├── payhip-webhook.js       ← POST /api/payhip-webhook
│   └── razorpay-webhook.js     ← POST /api/razorpay-webhook (Phase 2)
│
├── marketing/
│   ├── README.md
│   └── email-templates/        ← Transactional email HTML
│       ├── welcome.html
│       └── purchase-confirmation.html
│
├── .github/
│   └── workflows/
│       ├── deploy.yml          ← Notifies on push to main
│       └── daily-ai-routine.yml← 9 AM IST daily content generation
│
├── .env.example                ← Env var template (never commit .env)
├── .gitignore
└── package.json
```

---

## 💡 Ad Revenue Strategy

Three non-intrusive layers, all user-friendly:

| Layer | What | Where | Revenue model |
|---|---|---|---|
| Native strips | Contextual tool recs (Brevo, Notion, Payhip) | Between pain + products | Affiliate CPC/rev-share |
| Carbon Ads | One clean developer-targeted ad unit | Below FAQ section | CPM (~$1–3 for dev audience) |
| Sticky footer | Rotating tool tip, dismissible, desktop-only | Bottom of page | Affiliate / direct deal |
| AdSense | Auto-ads (optional) | Auto-placed | CPC/CPM |

> **Rule:** Ads never block navigation, never autoplay, never pop up. Labelled "Sponsored" clearly. Dismissed in 8 s or one click.

---

## 🎯 ₹15K/Month Roadmap

| Days | Milestone |
|---|---|
| 1–5 | Site live, free lead magnet capturing emails |
| 6–10 | AI for Freelancers Guide live at ₹699 |
| 11–20 | Organic distribution on Reddit + X + LinkedIn (1 hr/day) |
| 21–30 | 3–5 paid products live, first 5–10 sales |
| 31–60 | Bundle live, conversion optimisation, ~₹8–12K/month |
| 61–90 | SEO long-form starts paying off → **₹15K/month** |

---

## 🔒 Security Notes

- **Never commit `.env`** — use GitHub Secrets + Cloudflare env vars
- **GITHUBPAT** — fine-grained PAT scoped to `DigitalProductBusiness` repo only. Already configured as repo secret.
- **Paid product files** — delivered only via Payhip signed URLs; never in `/assets/`
- **Browser JS (`js/config.js`)** — zero secrets, only public config
- All secrets: Cloudflare env only

---

## 📞 Contact

- **Operator email:** surisetti.dev@gmail.com
- **GitHub repo:** https://github.com/surisettidev/DigitalProductBusiness
- **Support:** surisetti.dev@gmail.com (24 hr response on weekdays)

---

*Built with the Genspark Autonomous Digital Product Business plan. Last updated: 2026-06-12.*
