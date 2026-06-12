# Getting Started — For You (the human operator)

## Day 0 (today): Account creation (45–60 min)
Create accounts and save credentials in a password manager:

| # | Service | Why | Link |
|---|---|---|---|
| 1 | GitHub (private repo) | Source of truth | github.com |
| 2 | Cloudflare (Pages + DNS) | Hosting | cloudflare.com |
| 3 | Payhip | Checkout | payhip.com |
| 4 | Brevo | Email | brevo.com |
| 5 | Google AI Studio | Gemini API | aistudio.google.com |
| 6 | Groq Cloud | Groq API | console.groq.com |
| 7 | OpenRouter | Multi-model | openrouter.ai |
| 8 | NVIDIA Build | NIM API | build.nvidia.com |
| 9 | Google Analytics 4 | Analytics | analytics.google.com |
| 10 | Microsoft Clarity | Heatmaps | clarity.microsoft.com |

## Day 1: Push this repo
```bash
git clone https://github.com/surisettidev/DigitalProductBusiness
# copy all files from this starter pack
git add .
git commit -m "Initial commit: starter structure"
git push origin main
```

## Day 2: Connect Cloudflare Pages
1. Cloudflare dashboard → Pages → Connect to Git → pick the repo
2. Build settings:
   - Framework preset: None
   - Build command: (leave blank)
   - Build output directory: `/` (this repo serves the site from root)
3. Add environment variables (from `.env.example`)
4. Deploy. Get `*.pages.dev` URL.

## Day 3: Wire Payhip
1. Create your first product as a ₹0 test product
2. Get the "Buy" button link
3. Paste link into `js/config.js` under `products`
4. Push → site updates → test checkout

## Day 4: Wire Brevo newsletter
1. Brevo dashboard → SMTP & API → create API key → put in Cloudflare env as `BREVO_API_KEY`
2. Create list called "Leads" → note the list ID → set as `BREVO_LIST_ID`
3. Test the newsletter form on the live site

## Day 5+: Start building products
Follow `config/PRODUCT-SPECS.md` build order.

## ⚠️ Security reminders
- NEVER commit `.env` or any API key/PAT to the repo.
- The GitHub PAT goes ONLY in: GitHub repo → Settings → Secrets → Actions → `GITHUBPAT`, and in Cloudflare Pages env as `GITHUB_PAT`.
- If a PAT has ever been pasted in chat/email/anywhere public — revoke it and create a new fine-grained PAT scoped to this single repo.
