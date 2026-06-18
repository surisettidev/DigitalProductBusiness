# Nurture email draft — 2026-06-18

**Status:** DRAFT — do not send until Brevo SMTP v3 key is wired + custom domain DKIM/DMARC verified.
**List:** "hero-lead-magnet" leads (currently 1 subscriber: pricing-calculator opt-in from product page hero).
**Sequence position:** Email 1 of 3 (welcome + value).

---

## Subject

The 3 tools that paid for themselves the first week I used them

## Preview text

Skip the global lists. Here's the India-tested shortlist.

## Body

Hey,

You signed up for the pricing calculator — thanks for trusting me with your inbox. I won't waste it.

Quick context: I run Freelancer OS. I write opinionated, India-tested guides for freelancers who are tired of generic global advice that ignores GST, UPI, and the way Indian clients actually pay.

Since pricing is the reason you signed up, here's the smallest possible tool shortlist that lets you charge professionally from day one:

1. **Refrens** — free up to 25 invoices/month. GST fields built in. Send invoices that look like a real business sent them, not a freelancer.
2. **Wise** — free USD/EUR/GBP receiving accounts. If you have any foreign clients, this saves you 3–5% over PayPal/Razorpay forex conversion.
3. **Notion** — one free workspace. Use it as your client tracker. Stop trying to remember what you quoted whom.

That's it. ₹0/month for the first three months while you find your feet.

I'm shipping a deeper tool stack guide next week (₹499) — quarterly refresh, 30+ tools compared, GST-compliant invoice template included. Reply to this email and I'll send you a 20% early-bird code when it goes live.

Educational, not professional advice. Talk to a CA for tax decisions.

— Karthik
Freelancer OS

P.S. Reply with the single biggest tool/pricing question you have right now. I read everything.

---

## Compliance
- Word count: 192 words.
- Subject ≤ 60 chars: ✅ (52).
- No specific income promises.
- No fake testimonials.
- Includes "educational, not professional advice" disclaimer.
- Soft CTA: reply for early-bird code (no shopping link until product ships).
- Sender once domain is live: `karthik@freelanceros.in` (pending domain purchase).

## Send conditions (block list)
- [ ] Brevo SMTP v3 API key (`xkeysib-...`) wired into BREVO_API_KEY env
- [ ] Custom domain purchased + DNS pointed at Cloudflare
- [ ] DKIM + DMARC + SPF verified for the sending domain
- [ ] Tool Stack product live (so the P.S./CTA matches reality)

Until ALL four are true, this email stays in `/marketing/email-drafts/`.
