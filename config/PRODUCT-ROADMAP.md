# Product Roadmap — Freelancer OS

**Effective:** 14 June 2026
**Target:** ≥ ₹15,000/month by end of Week 4

This roadmap replaces the original 5-product lineup. The original products were too generic (commoditized by ChatGPT). This lineup targets **India-specific problems** that AI hallucinates worst on, where templates take real research, and where there's repeat-buyer potential.

---

## Build order (cheapest to validate first)

| # | Slug | Product | ₹ | Build window | Status |
|---|---|---|---|---|---|
| 1 | `tool-stack` | **Indian Freelancer Tool Stack 2026** | 499 | Days 1–4 | 🟢 Build now |
| 2 | `tax-guide-2026` | **Indian Tax Guide 2026–27** (rebuild, deeper) | 999 | Days 5–10 | ⚪ Queued |
| 3 | `ai-workflow-pack` | **AI Workflow Pack for Service Delivery** | 799 | Days 11–15 | ⚪ Queued |
| 4 | `client-negotiation` | **Indian Client Negotiation Vault** | 1,299 | Days 16–22 | ⚪ Queued |
| 5 | `portfolio-os` | **Portfolio + Proposal OS** | 1,499 | Days 23–30 | ⚪ Queued |
| 🎁 | `bundle` | **Complete Freelancer OS Bundle** (all 5) | 3,999 | Day 30 | ⚪ Queued |

**Total bundle value:** ₹5,095 → sold at ₹3,999 (22% off).

---

## ₹15K/month math at full lineup

| Product | Units | Revenue |
|---|---|---|
| Tool Stack | 15 | ₹7,485 |
| Tax Guide | 10 | ₹9,990 |
| AI Workflow Pack | 5 | ₹3,995 |
| Negotiation Vault | 2 | ₹2,598 |
| Bundle | 1 | ₹3,999 |
| **Total** | | **₹28,067** |

Hitting ₹15K/month is the **week-4 minimum**, not the ceiling.

---

## Product 1: Indian Freelancer Tool Stack 2026 (₹499)

**Why first:** cheapest, fastest to build, validates whether anyone pays.

**What's inside:**
- Curated list of every tool an Indian freelancer needs in 2026, organized by job-to-be-done
- Categories: invoicing, payment receiving (domestic + international), GST filing, project mgmt, contract templates with Indian Stamp Act clauses, communication, time tracking, AI tools
- Each entry: free tier limits, paid tier price, India-specific notes (does it accept INR? does it work with Razorpay/Cashfree? does it generate GST-compliant invoices?)
- Quarterly refresh promise (Jan / Apr / Jul / Oct)

**Format:** PDF (40–60 pages) + Notion database template (importable) + comparison spreadsheet

**Refresh:** every quarter. Each refresh = email to all past buyers with free updated copy.

---

## Product 2: Indian Tax Guide 2026–27 (₹999)

**Why second:** India-specific = no ChatGPT competition. March–July is peak buying season.

**What's inside:**
- GST registration walkthrough for freelancers (when needed, when not)
- 44ADA presumptive taxation explained with worked examples (₹2L, ₹10L, ₹50L revenue scenarios)
- TDS on freelance payments — what to do when client deducts, how to claim refund
- Foreign payments — Wise vs Payoneer vs direct bank — tax implications of each
- GST-compliant invoice templates (Word, Google Docs, PDF)
- Advance tax payment schedule + calculator (Google Sheet)
- A "CA cheat sheet" — what to bring to a CA meeting so you don't waste ₹15K in mistakes

**Format:** PDF guide + invoice template pack + Google Sheets calculator

**Refresh:** every April (after Union Budget). Past buyers get free updated copy.

---

## Product 3: AI Workflow Pack for Service Delivery (₹799)

**Why third:** drives traffic from r/IndianSolopreneurs, Twitter AI crowd, AI newsletter audiences.

**What's inside (not "which AI to use" theory — actual ready-to-paste workflows):**
- Client onboarding automation (Make.com or n8n template)
- Proposal-from-brief generator (Claude/ChatGPT prompts + Google Doc template)
- Weekly status report generator (Slack → email digest workflow)
- Invoice-from-Slack workflow (when you mark a project done in Slack, invoice gets drafted)
- Lead-to-CRM auto-sync (Tally Forms → Notion CRM)
- Content repurposer (1 blog post → 5 tweets + 1 LinkedIn + 1 reel script)

Each workflow: exact prompts + JSON template + 5-min setup video link

**Format:** PDF + Make.com/n8n template files + video tutorials

**Refresh:** every 4 months (AI tools move fastest).

---

## Product 4: Indian Client Negotiation Vault (₹1,299)

**Why fourth:** higher ticket — needs trust from products 1–3 first.

**What's inside (India-specific scripts; American templates don't work here):**
- 50+ ready-to-send email templates organized by situation:
  - Chasing payment 30, 60, 90 days late
  - Handling "we have no budget" objection
  - Negotiating retainers in INR vs USD
  - Asking for testimonial / referral
  - Saying no to scope creep without losing the client
  - Raising rates on existing clients
  - Firing a toxic client politely
  - WhatsApp vs email — when to switch
- Cultural notes (when "yes" means "maybe" in Indian B2B)
- LinkedIn DM scripts that actually work in India
- 10 real case studies (with names redacted)

**Format:** PDF + Notion template with all scripts categorized

**Refresh:** yearly.

---

## Product 5: Portfolio + Proposal OS (₹1,499)

**Why fifth:** most work to build, premium ticket, anchor for the bundle.

**What's inside:**
- Done-for-you portfolio website template (HTML/Tailwind — deploy to Cloudflare Pages free)
- 10 proven proposal templates at tiers ₹50K / ₹2L / ₹5L / ₹10L+ projects
- Pricing one-pager template (the "rate card you send first")
- Case study template (your past work → client-ready format)
- Brand kit starter (colors, fonts, logo placeholder system)
- Onboarding deck template
- SOW (Statement of Work) template with Indian Stamp Act clauses

**Format:** Notion workspace + Figma proposal templates + Tailwind portfolio repo

**Refresh:** twice a year.

---

## Distribution / launch sequencing

For each product, the Daily Agent runs this launch cycle (5–7 days):

1. **Day 0** — product file goes live, page updated, `DELIVERY_LINKS` env var updated
2. **Day 1** — soft launch: 1 LinkedIn post + 1 X thread + 1 Reddit comment on r/IndianFreelancers/r/IndianSolopreneurs
3. **Day 2** — email to existing newsletter list
4. **Day 3** — long-form blog post indexable by SEO (1,500+ words) + AI-search-optimized FAQ section
5. **Day 4–7** — daily X/LinkedIn posts repurposed from product content
6. **Day 7** — agent reports: views, signups, sales, refund rate. Decide: scale, iterate, or kill.

---

## When to retire / replace a product

The Daily Agent flags a product for retirement if:
- 0 sales in 14 consecutive days *and* >100 product page views (= positioning / price problem)
- Refund rate >15% in any 30-day window (= quality problem)
- Three consecutive support emails about the same factual error

Replacement requires an Issue labeled `needs-approval` with: data, hypothesis, proposed replacement.
