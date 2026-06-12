# Freelancer OS — Digital Products for Indian Freelancers

Live site: **https://freelance-os.pages.dev** · Repo: [surisettidev/DigitalProductBusiness](https://github.com/surisettidev/DigitalProductBusiness)

Practical digital products (pricing, client acquisition, AI workflows, tax compliance, business systems) for Indian freelancers. Static site on **Cloudflare Pages** with serverless **Pages Functions** for payments, delivery, and admin auth.

## What's working now

| Feature | Status | How |
|---|---|---|
| Razorpay checkout (UPI/cards/netbanking/wallets) | DONE | `js/checkout.js` → `/api/create-order` → Razorpay modal |
| Server-side payment verification | DONE | `/api/verify-payment` (HMAC signature check) |
| On-page delivery after payment | DONE | `success.html` shows download links instantly |
| Email delivery via Brevo | DONE | `verify-payment` + webhook both send the email |
| Razorpay webhook (backstop delivery + sale logging) | DONE | `/api/razorpay-webhook` (signature-verified) |
| Newsletter signup (Brevo) | DONE | `/api/brevo-subscribe` |
| Admin dashboard — server-side auth | DONE | `/api/admin-auth` checks `ADMIN_PASSWORD` env var, issues signed expiring token |
| GA4 + Microsoft Clarity | DONE | IDs in `js/config.js`; disclosed in privacy policy |
| Legal pages (DPDP Act, Razorpay, Clarity session-recording disclosure) | DONE | `legal/` |

## Architecture

```
Browser                       Cloudflare Pages Functions            External
-------                       --------------------------            --------
Buy click -----------------> POST /api/create-order --------------> Razorpay Orders API
  <-- orderId + keyId --------+   (server-side price catalog)
Razorpay Checkout modal --------------------------------------> Razorpay (payment)
  on success --------------> POST /api/verify-payment
                               +- verifies HMAC signature
                               +- returns download links ---------> shown on success.html
                               +- sends delivery email -----------> Brevo SMTP API
Razorpay servers ----------> POST /api/razorpay-webhook  (backstop)
                               +- verifies webhook signature
                               +- sends delivery email (if missed)
                               +- logs sale ----------------------> GitHub sales-tracker.md
admin.html login ----------> POST /api/admin-auth -- checks ADMIN_PASSWORD env
                               +- returns signed 12h token (verified by /api/admin-verify)
```

**Key principle:** prices live server-side in `functions/api/_lib.js` (`CATALOG`). The client can never set the amount. `js/config.js` prices are display-only — keep both in sync.

## Required Cloudflare env vars (Pages → Settings → Environment variables)

| Variable | Status | Purpose |
|---|---|---|
| `RAZORPAY_KEY_ID` | already set | Publishable key |
| `RAZORPAY_KEY_SECRET` | already set | Order creation + signature verification |
| `RAZORPAY_WEBHOOK_SECRET` | **SET THIS** | Must equal the secret you type in Razorpay → Webhooks |
| `BREVO_API_KEY` | already set | Delivery emails + newsletter |
| `BREVO_LIST_ID` | set if not 2 | Contact list id |
| `FROM_EMAIL` | recommended | Verified Brevo sender (defaults to surisetti.dev@gmail.com) |
| `ADMIN_PASSWORD` | **SET THIS** | Admin dashboard password (server-side only) |
| `ADMIN_TOKEN_SECRET` | **SET THIS** | Random string signing admin tokens |
| `DELIVERY_LINKS` | set when products exist | JSON: `{"ai-freelancer":"https://...", ...}` |
| `GITHUB_PAT` / `GITHUB_OWNER` / `GITHUB_REPO` | optional | Auto-log sales to `daily-operations/sales-tracker.md` |

## Launch checklist (manual steps remaining)

1. **Razorpay Dashboard → Settings → Webhooks → Add webhook**
   - URL: `https://freelance-os.pages.dev/api/razorpay-webhook`
   - Secret: generate a strong one → also add to Cloudflare as `RAZORPAY_WEBHOOK_SECRET`
   - Events: `payment.captured`
2. **Cloudflare** → add `ADMIN_PASSWORD`, `ADMIN_TOKEN_SECRET` (admin login refuses until set)
3. **Build the 5 products** (see `config/PRODUCT-SPECS.md`), host the files (Google Drive / R2 / Brevo), then set `DELIVERY_LINKS` JSON env var
4. **Test in Razorpay test mode**: buy `ai-freelancer` with test UPI → confirm on-page links + email + webhook log
5. **Go live**: swap `rzp_test_*` keys for live keys in Cloudflare env vars (no code change needed)

## Repo map

```
├── index.html / products/ / legal/   Static pages
├── success.html                      Post-payment on-page delivery
├── admin.html                        Operator dashboard (server-side auth)
├── js/                               config, main (UI), checkout (Razorpay), newsletter, analytics, ads
├── css/                              style.css (design tokens, dark hero, animations)
├── functions/api/                    Cloudflare Pages Functions
│   ├── _lib.js                       Shared: catalog, crypto, Brevo, GitHub logging
│   ├── create-order.js               POST /api/create-order
│   ├── verify-payment.js             POST /api/verify-payment
│   ├── razorpay-webhook.js           POST /api/razorpay-webhook
│   ├── admin-auth.js / admin-verify.js  Admin login
│   ├── brevo-subscribe.js            Newsletter
│   └── payhip-webhook.js             Legacy fallback (unused)
├── config/                           Business docs (brief, specs, voice, personas)
├── daily-operations/                 Sales ledger, logs, metrics
└── marketing/                        Email templates
```

## Products (prices in sync: `js/config.js` and `functions/api/_lib.js`)

| Slug | Product | Price |
|---|---|---|
| `ai-freelancer` | AI for Freelancers Guide | ₹699 |
| `pricing-guide` | Freelancer Pricing Masterclass | ₹899 |
| `tax-guide` | Indian Freelancer Tax & Compliance Guide | ₹799 |
| `client-gen` | Client Generation & Lead System | ₹1,299 |
| `business-os` | Solopreneur Business OS | ₹1,899 |
| `bundle` | Complete Freelancer OS (all 5) | ₹3,999 |

## Local preview

```bash
npx wrangler pages dev . --port 3000   # serves static files + functions/
```

## Deploy

Push to `main` → Cloudflare Pages auto-deploys (build output dir: repo root).

---
*Last updated: 12 June 2026 — Razorpay integration, dual delivery, server-side admin auth, DPDP-compliant legal pages, UI refresh.*
