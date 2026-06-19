---
title: "Portfolio + Proposal OS"
slug: portfolio-os
version: 2026-Q3
last-updated: 19 June 2026
ai-tier: 2
price: ₹1,499
---

# Portfolio + Proposal OS

**A done-for-you portfolio website, 10 proven proposal templates, and the 5 documents that close ₹50K-₹10L+ projects. The full sales system for freelancers who want to be seen as a ₹10L/year consultancy, not a ₹2L/year freelancer.**

> *Reviewed and verified by Karthik Surisetti before publication.*
> *Last updated: 19 June 2026. Tool pricing and features change — refer to each tool's official site for current details. Educational content, not professional advice.*

---

## How to use this guide

- **If you have no portfolio site today:** open Section 1. Deploy a portfolio in one afternoon.
- **If you have a portfolio but no inquiries:** open Section 3. Your case studies are the leak.
- **If you want to raise your average project size from ₹2L to ₹10L+:** open Section 4. The proposal templates are built for this.
- **If you've been sending 4-page proposals that don't get replies:** open Section 5. The 1-page proposal that closes.
- **If you've never sent a Statement of Work with Indian Stamp Act clauses:** open Section 7. The exact clauses.
- **If you want a premium "freelance consultancy" feel for ₹1,500/month all-in:** open Section 8. The full stack.

---

## Section 1 — The portfolio website: deploy in one afternoon

### The problem you're solving

You don't have a portfolio. Or you have a Behance/LinkedIn page that doesn't feel like "you." Or you have a WordPress site that takes 2 hours to update. This section gives you a portfolio you can deploy today, edit in 5 minutes, and have free forever.

### The 3 portfolio options, ranked

**Option 1: Cloudflare Pages + Tailwind (this guide's recommendation)**

- **Stack:** HTML + Tailwind CSS (or Astro static site), deployed on Cloudflare Pages (free).
- **Cost:** Domain ₹800-₹1,200/year. Cloudflare Pages: ₹0. Total: ₹800-₹1,200/year all-in.
- **Time to deploy:** 2-4 hours if you have content ready. 1 day if you're writing the content from scratch.
- **Performance:** Fastest. CDN-served. Sub-second load times. Lighthouse 95+ scores.
- **Editing:** Edit HTML in VS Code, commit to GitHub, auto-deploy. Or edit on Cloudflare's dashboard.
- **Best for:** Technical freelancers (developer, designer, writer-comfortable). This is what 80% of senior freelancers use.

**Verdict: Use this if you can edit a simple HTML file.**

**Option 2: Notion + Super.so**

- **Stack:** Notion page + Super.so wrapper.
- **Cost:** Super.so from $12/month (~₹1,000/month). Notion free.
- **Time to deploy:** 1-2 hours.
- **Editing:** Drag-drop in Notion. Easiest.
- **Best for:** Non-technical freelancers. Writers, consultants, coaches.

**Verdict: Use this if you don't want to touch code.**

**Option 3: WordPress + Elementor**

- **Stack:** Self-hosted WordPress.
- **Cost:** Hosting ₹500-₹2,000/month + domain. Total: ₹7,000-₹25,000/year.
- **Time to deploy:** 1-2 days for a polished site.
- **Editing:** WordPress dashboard.
- **Best for:** Agencies with 2+ people who need client login.

**Verdict: Skip unless you have a specific reason. Most freelancers don't need this.**

### The 6 sections your portfolio must have

1. **Hero / Above the fold:** One-line value prop. Example: "I help D2C brands ship marketing websites in 4 weeks. ₹2L-₹8L per project."
2. **What I do (3 columns):** 3 service offerings. Click to expand.
3. **Selected work (3-6 case studies):** Each with: client name (or anonymous), problem, approach, outcome, image.
4. **About me (one paragraph + photo):** Personal. Specific. Not "passionate about design."
5. **Testimonials (3-5 quotes):** With attribution (name, role, company).
6. **Contact (calendar link + email):** Calendly + surisetti.dev@gmail.com. Nothing else.

### The hero copy formula

```
{{Action verb}} {{target audience}} {{specific outcome}} in {{time period}}.

Examples:
- "I help D2C brands ship marketing websites that convert in 4 weeks."
- "I write technical content for B2B SaaS companies that ranks on Google in 90 days."
- "I build Notion systems for solopreneurs that save 5+ hours/week."
```

**Verdict: Use this formula. The formula forces specificity. Specifics close.**

### Bottom-line ₹ / hour savings

Right portfolio: **2-5x more inbound inquiries** in my observation. For a freelancer billing ₹5L/month, that's ₹5L-₹20L/year in additional revenue. The ₹1,500 portfolio cost is recovered in week 1.

---

## Section 2 — The portfolio template (Cloudflare Pages + Tailwind)

### What's in the product ZIP

The product includes a complete portfolio template ready to deploy:

- `index.html` (the homepage)
- `case-study.html` (template for individual case study pages)
- `about.html` (about page)
- `styles.css` (Tailwind via CDN, no build step)
- `assets/` (placeholder images)
- `_headers` (Cloudflare Pages config)
- `README.md` (deployment guide)

### The 5-step deploy

1. **Download the template** from the product ZIP.
2. **Replace placeholder content** with your hero copy, services, case studies, about, testimonials, contact.
3. **Push to a new GitHub repo** (private or public, your call).
4. **Connect Cloudflare Pages** to the GitHub repo. Set build command to empty (it's a static site), output dir to `/`.
5. **Add your custom domain** (₹800-₹1,200/year). Cloudflare auto-issues the SSL cert.

Total time: 2-4 hours.

### The 4 customizations most freelancers miss

1. **Add Open Graph image** (`og-image.png` in the assets folder). This is the image that shows when someone shares your link on LinkedIn/Twitter/Slack. Without it, the share preview is blank.
2. **Add a favicon** (`favicon.ico`). Without it, the browser tab is blank.
3. **Set the page title and meta description** in the `<head>`. This is what shows in Google search results.
4. **Add structured data** (JSON-LD) for "Person" or "Organization" schema. 10 lines of code. Helps with Google search ranking.

### Bottom-line ₹ / hour savings

Right customizations: **3-5x more clicks on shared links** in my observation. For a freelancer who shares 1 link/week on LinkedIn, that's 50-100 extra clicks per month. At 5% inquiry rate, that's 2-5 inquiries/month from a single channel.

---

## Section 3 — Case studies: the asset that closes deals

### The problem you're solving

You have work samples. You don't have case studies. Work samples are "here's what I made." Case studies are "here's what changed for the client." This section gives you the case study template that closes deals.

### The 4-part case study structure

**Part 1: The client situation (1-2 paragraphs)**
- Who was the client? (Industry, size, anonymized if needed)
- What was the problem? (Specific, not generic)
- Why did they pick you? (What was the trigger?)

**Part 2: The approach (2-3 paragraphs)**
- What did you do? (Specific deliverables, decisions, methodology)
- What was the timeline? (How long, key milestones)
- What was hard? (What did you figure out that wasn't obvious?)

**Part 3: The outcome (1-2 paragraphs + numbers)**
- What changed? (Specific metrics: revenue, conversions, time saved, etc.)
- What did the client say? (Quote)
- What's the ongoing impact? (Are they still using the work? Did it lead to more work?)

**Part 4: Visual evidence (1-3 images)**
- Screenshot, design, before/after. Visual proof.

### The 5-metric framework

A great case study has 5 metrics. Not 1. Not 10. Five.

1. **Time metric:** "Shipped in 4 weeks" or "Delivered 6 weeks ahead of plan."
2. **Cost metric:** "Saved the client ₹2L in agency fees" or "ROI of 4x in 6 months."
3. **Quality metric:** "Lighthouse score from 45 to 96" or "Bounce rate down 32%."
4. **Business metric:** "Generated ₹18L in attributed revenue" or "Onboarded 1,200 users."
5. **Relationship metric:** "3 follow-on projects, 2 referrals."

**Verdict: Every case study should have at least 3 of these 5. Without metrics, it's a portfolio piece. With metrics, it's a sales tool.**

### The 6 case study anti-patterns to avoid

1. **"We did a website for X."** — Boring. Add the outcome.
2. **"X came to us with a problem."** — Vague. Quantify the problem.
3. **"We used cutting-edge technology."** — Clients don't care about tech. They care about outcomes.
4. **"The team worked closely together."** — Filler. Remove.
5. **"The project was a great success."** — Empty. Quantify the success.
6. **No images.** — Always include 1-3 visuals. The portfolio is a visual medium.

### The 90-minute case study writing process

1. **Open your project files / Slack history / invoice.** Pull 3 specific numbers and 1 specific quote.
2. **Draft the 4-part structure** in 30 minutes. Don't edit.
3. **Add visuals** in 20 minutes. Screenshots, before/after, design.
4. **Edit for 20 minutes.** Cut 30% of words. Make every sentence earn its place.
5. **Publish.** Add to portfolio. Share on LinkedIn. Add to proposal email signature.

### Bottom-line ₹ / hour savings

Right case studies: **20-30% higher close rate on proposals** in my observation. For a ₹5L/month freelancer, that's ₹1L-₹1.5L/month in additional revenue.

---

## Section 4 — The 10 proposal templates, by project size

### The problem you're solving

You don't have a proposal template. Every proposal is built from scratch. You miss sections. You forget the timeline, the fee structure, the change order clause. The client notices. You lose the deal — or worse, you win the deal and get burned mid-project.

This section gives you 10 templates, by project size, that cover 90% of the work Indian freelancers do.

### The 4 project tiers

| Tier | Project size | Typical clients | Typical scope | Lead time |
|---|---|---|---|---|
| Tier 1 | < ₹50K | Small D2C, solopreneurs | 1-2 week projects | 2-5 days |
| Tier 2 | ₹50K-₹2L | Mid-size B2B, agencies | 4-8 week projects | 2-4 weeks |
| Tier 3 | ₹2L-₹10L | Larger B2B, growth-stage startups | 2-4 month engagements | 1-3 months |
| Tier 4 | ₹10L+ | Enterprises, funded startups | Multi-month, multi-deliverable | 3-6 months |

### Template 1: Tier 1 mini-project (₹10K-₹50K)

**Use for:** logo, 1-off design, small website, 1-week content project.

```
PROPOSAL: {{Project Name}}
Client: {{Client Name}}
Date: {{Date}}
Version: 1.0

1. WHAT I UNDERSTOOD
You need {{specific deliverable}} for {{specific purpose}}. The current situation is {{problem}}.

2. WHAT YOU'LL GET
- {{Deliverable 1}}
- {{Deliverable 2}}
- 1 round of revisions

3. TIMELINE
- Start: {{date}}
- Delivery: {{date}}
- Revisions: 3 days from draft delivery

4. FEE
₹{{amount}} inclusive of GST. Payment 50% advance, 50% on delivery.

5. NEXT STEP
If this looks right, reply with "approved" and I'll send the advance invoice. Project starts within 3 days of advance payment.
```

**Verdict: Use this for any project < ₹50K. The 1-page version closes faster than 4-page proposals because clients actually read it.**

### Template 2-10: covered in the product ZIP

The full ZIP includes 10 templates:
- **Template 1:** Tier 1 mini-project (< ₹50K) — see above
- **Template 2:** Tier 1 multi-deliverable (₹30K-₹80K)
- **Template 3:** Tier 2 marketing project (₹80K-₹2L)
- **Template 4:** Tier 2 design project (₹1L-₹2L)
- **Template 5:** Tier 2 content project (₹1L-₹2L)
- **Template 6:** Tier 3 website project (₹2L-₹5L)
- **Template 7:** Tier 3 multi-month engagement (₹3L-₹8L)
- **Template 8:** Tier 3 retainer (₹2L-₹5L/month)
- **Template 9:** Tier 4 enterprise project (₹10L+)
- **Template 10:** Tier 4 strategic retainer (₹5L-₹15L/month)

Each template: 1-2 pages, structured identically, with placeholders for client-specific content. The structure forces the right conversation.

### Bottom-line ₹ / hour savings

Right template: **30-60 min saved per proposal × 30 proposals/year = 15-30 hours/year** = **₹30,000-₹60,000 in recovered time** + 15-25% higher close rate.

---

## Section 5 — The pricing one-pager (the rate card you send first)

### The problem you're solving

A prospect emails asking "what are your rates?" You don't have a rate card. You quote ad-hoc. You either quote too low (and resent the project) or quote too high (and lose the lead). A pricing one-pager solves both.

### The pricing one-pager structure

```
RATE CARD — {{Your Name}}
Effective: {{Date}}
Valid for: 30 days

SERVICES
1. {{Service 1}} — starting at ₹{{amount}}
   - {{what's included}}
   - {{timeline}}

2. {{Service 2}} — starting at ₹{{amount}}
   - {{what's included}}
   - {{timeline}}

3. {{Service 3}} — starting at ₹{{amount}}
   - {{what's included}}
   - {{timeline}}

RETAINER STRUCTURES
- {{X}} hours/month — ₹{{amount}}
- {{Y}} hours/month — ₹{{amount}}
- {{Z}} hours/month — ₹{{amount}}

WHAT'S NOT INCLUDED (and would be a change order)
- {{exclusion 1}}
- {{exclusion 2}}

NEXT STEP
Reply with the service + budget, and I'll send a tailored proposal within 48 hours.

Best,
{{Your name}}
```

### The 5 rules for the rate card

1. **"Starting at"** — never a single number. Project scope varies; the rate card is a starting point, not a final quote.
2. **3-4 services max** — not 10. More than 4 services on a rate card looks unfocused.
3. **Retainer tiers** — give prospects a 3-tier choice. They self-select into the tier that matches their budget.
4. **Explicit exclusions** — what's NOT included. Sets expectations before the proposal.
5. **Validity period** — 30 days. Forces a conversation; prevents endless "we'll get back to you."

### The "starting at" trap

"Starting at" should be a number you'd actually take. Don't say "starting at ₹50K" if the smallest project you do is ₹2L. Clients will anchor to ₹50K and resist anything above.

**Verdict: Set "starting at" at 60-70% of your average project fee.** That gives you room to go up without losing the lead.

### Bottom-line ₹ / hour savings

Right rate card: **20-40% fewer unqualified inquiries** (clients self-filter by budget) + **faster close** (less back-and-forth on price) = **10-15 hours/year saved** + **5-10% higher close rate**.

---

## Section 6 — The SOW (Statement of Work) template with Indian Stamp Act clauses

### The problem you're solving

You have a contract, but it's missing critical clauses. The most common misses: change order process, IP transfer, late fee enforcement, dispute resolution. This section gives you the SOW template that protects you.

### The full SOW template (in the product ZIP)

The 1-page SOW template from the Client Negotiation Vault (Product 4) is the base. This product includes an extended 4-page version with the additional clauses below.

### The 8 Indian Stamp Act clauses every freelancer should know

**Clause 1: Stamp duty applicability**

- For service agreements (most freelancer SOWs), stamp duty is **notary-level** in most Indian states. Verify with your state's Stamp Act for the exact amount.
- For agreements > ₹5L, e-stamping is usually required. For < ₹5L, plain paper agreements are typically valid but may not be admissible in court without stamp duty paid.
- **Action:** For any project > ₹1L, e-stamp the SOW. Cost: ₹100-₹1,000 depending on the state and agreement value. Use the SHCIL (Stock Holding Corporation) e-stamp portal: shcilestamp.com.

**Clause 2: Jurisdiction**

```
This SOW is governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in {{city}}.
```

**Why this matters:** Defines where lawsuits happen. Pick your city (where you live or where the client is based). Don't leave it ambiguous.

**Clause 3: Force majeure**

```
Neither party shall be liable for any failure or delay in performance due to causes beyond reasonable control, including but not limited to natural disasters, pandemics, government actions, internet/telecom outages, or acts of war.
```

**Clause 4: Confidentiality**

```
Both parties agree to keep confidential any non-public information shared during the engagement, including but not limited to business plans, financial data, customer lists, and trade secrets. This obligation survives termination of the SOW for 2 years.
```

**Clause 5: IP assignment on final payment**

```
All intellectual property in the deliverables transfers to the Client upon receipt of full and final payment. Until such payment, all IP remains with the Freelancer.
```

**Why this matters:** Without this clause, IP could be argued to transfer on delivery, even if the client hasn't paid. This clause ties IP to payment.

**Clause 6: Late fee + interest**

```
Invoices unpaid after {{X}} days from the due date shall carry a late fee of {{X}}% per month or part thereof, compounded monthly.
```

**Clause 7: Termination for convenience**

```
Either party may terminate this SOW with {{X}} days written notice. Upon termination, the Client shall pay for all work completed and accepted up to the termination date. Any advance payment for unstarted work shall be refunded within {{X}} days.
```

**Clause 8: Limitation of liability**

```
The Freelancer's total liability under this SOW shall not exceed the total fees paid by the Client under this SOW in the 3 months preceding the claim.
```

**Why this matters:** Without this clause, a client could sue for damages far exceeding the project fee. This caps your exposure.

### The 4 sections that should NEVER be in a freelancer SOW

1. **Non-compete (broad):** Indian courts don't enforce broad non-competes. Skip.
2. **Indemnification (uncapped):** Don't accept uncapped indemnification. Cap it to the contract value.
3. **Auto-renewal without notice:** If the client includes this, remove it. Most freelancers get burned by surprise auto-renewals.
4. **Exclusivity:** Most freelancers can't afford to be exclusive. Reject.

### Bottom-line ₹ / hour savings

Right SOW clauses: **₹2,00,000-₹10,00,000/year avoided in disputes, IP theft, and unbounded liability** in worst-case scenarios. The clauses cost you ₹1,000-₹5,000 in legal review once and protect every project for years.

---

## Section 7 — The case study template (5-minute version)

### The 5-section structure

```
CASE STUDY: {{Project Name}}
Client: {{Client Industry}} ({{Anonymized if needed}})
Engagement: {{Date range}}
Fee: {{Range, not exact}}

THE SITUATION
{{1 paragraph: client context + problem}}

THE APPROACH
{{1 paragraph: what I did, how, with what tools}}

THE OUTCOME
{{1 paragraph: specific metrics + client quote}}

THE TAKEAWAY
{{1 paragraph: what someone in a similar situation can learn}}

VISUAL EVIDENCE
{{Image 1, Image 2, Image 3}}
```

### The 5-minute draft

1. **Open your project file** (Drive folder, Slack, invoice, Notion).
2. **Copy-paste this template** into a new doc.
3. **Fill the 4 sections** in 4 minutes. Don't edit.
4. **Add 1-3 images** in 1 minute.
5. **Publish.** Add to portfolio. Done.

### The "anonymized" approach

If you can't name the client (NDA, sensitive industry), use a one-line descriptor:
- "D2C skincare brand, ₹40L/year revenue"
- "B2B SaaS company, Series A, 50-person team"
- "Indian B2B agency, 12-year-old, 80-person team"

This gives the case study context without naming the client.

### Bottom-line ₹ / hour savings

Right case study template: **15-20 min saved per case study × 5 case studies/year = 75-100 min/year** = trivial time savings, but the case study itself closes deals. ROI is in close rate, not time.

---

## Section 8 — The brand kit starter (colors, fonts, logo placeholder system)

### The problem you're solving

Your portfolio looks "meh" because it has no visual identity. The fonts are default. The colors are random. The "logo" is a text title. This section gives you a 30-minute brand kit that makes your portfolio look like a consultancy, not a freelancer.

### The 4 brand kit elements

**1. Color palette (3 colors)**

- **Primary:** one bold color. Examples: indigo, deep red, teal, mustard. Pick one.
- **Secondary:** one neutral. Examples: charcoal, cream, off-white.
- **Accent:** one bright. Examples: gold, electric blue, hot pink.

**2. Typography (2 fonts)**

- **Headlines:** one display font. Examples: Playfair Display, Inter (bold), Space Grotesk.
- **Body:** one readable sans-serif. Examples: Inter, IBM Plex Sans, Söhne.

**Verdict: Use Google Fonts (free). Pair 1 display + 1 sans-serif. Don't use more than 2.**

**3. Logo placeholder**

If you don't have a logo, use a **wordmark** (your name in a specific font) + a **monogram** (your initials in a circle). Tools:
- **Wordmark:** Figma (free) + your chosen display font. 10 minutes.
- **Monogram:** Same. 10 minutes.

**4. Visual style**

- **Photography:** Pick a style. Examples: high-contrast B&W, soft pastels, vibrant color. Stay consistent across portfolio.
- **Iconography:** Use one icon set. Examples: Lucide, Heroicons. Don't mix.
- **Spacing:** Generous. Senior designers use 2-3x more whitespace than amateurs.

### The 30-minute brand kit

1. **Pick your 3 colors** (5 min) — use coolors.co to generate palettes.
2. **Pick your 2 fonts** (5 min) — use Google Fonts.
3. **Make the wordmark** (10 min) — Figma + display font.
4. **Make the monogram** (10 min) — Figma + initials in a circle.
5. **Apply to your portfolio** (rest of the day) — update CSS variables.

### Bottom-line ₹ / hour savings

Right brand kit: **3-5x more "premium feel" in client perception** in my observation. Premium feel = higher close rate at higher fees. The 30-minute effort is recovered in the first project at the new fee level.

---

## Section 9 — The pricing one-pager (Tier 1 / Tier 2 / Tier 3)

### The 3-tier structure

```
RATE CARD — {{Your Name}}
Effective: {{Date}}

SERVICES
1. {{Tier 1 service}} — starting at ₹{{X}}
2. {{Tier 2 service}} — starting at ₹{{Y}}
3. {{Tier 3 service}} — starting at ₹{{Z}}

RETAINER STRUCTURES
- {{X}} hours/month — ₹{{X}}
- {{Y}} hours/month — ₹{{Y}}
- {{Z}} hours/month — ₹{{Z}}

NEXT STEP
Reply with the service + budget. Tailored proposal within 48 hours.
```

**Verdict: Use this. 3 services + 3 retainers. The simplicity closes leads.**

### Bottom-line ₹ / hour savings

Right rate card: covered in Section 5.

---

## Section 10 — The minimum stack: portfolio, proposals, brand

### Tier 0 (₹1,000-₹1,500/month all-in)

- **Domain:** ₹800-₹1,200/year (~₹70-₹100/month).
- **Hosting:** Cloudflare Pages, ₹0.
- **Email:** Zoho Mail free tier (5 users) or Gmail with custom domain via Cloudflare Email Routing.
- **Brand kit:** Figma free tier.
- **Fonts:** Google Fonts, free.
- **Icons:** Lucide, free.
- **Case study hosting:** your portfolio site, free.
- **Proposals:** Google Docs with the 10 templates.
- **SOWs:** Notion or Google Docs.

**Verdict: Use this for the first ₹10L/year.**

### Tier 1 (₹2,000-₹3,500/month)

- **Custom domain** (same as Tier 0).
- **Super.so** ($12/month ~₹1,000/month) for Notion-based portfolio.
- **Calendly Pro** ($12/month ~₹1,000/month) for scheduling.
- **Loom** ($12.50/month ~₹1,000/month) for async video proposals.
- **Refrens** for invoicing.

### Tier 2 (₹5,000-₹15,000/month)

- **Everything in Tier 1** plus:
- **Notion Plus** ($10/month) for client portals.
- **Make.com** ($9/month) for proposal automation.
- **Lawyer** (₹10,000-₹20,000/year) for SOW review once.

**Verdict: Most freelancers stay at Tier 0-1 forever. Tier 2 is for agencies.**

### Bottom-line ₹ / hour savings

Right tier: **₹20,000-₹1,00,000/year** vs. over-buying. Most freelancers sign up for Super.so AND Carrd AND WordPress AND Notion. Pick one.

---

## Section 11 — The "looks like a consultancy" playbook

### The 8 signals that make prospects see you as a consultancy, not a freelancer

1. **Portfolio site** (not just LinkedIn). Signal: "I take this seriously."
2. **Domain email** (not Gmail/Yahoo). Signal: "I run a business."
3. **Proposal template** (not a paragraph in an email). Signal: "I'm professional."
4. **SOW with payment terms** (not "pay me when you can"). Signal: "I expect to be paid."
5. **Case studies with metrics** (not "I did a logo for X"). Signal: "I deliver outcomes."
6. **Testimonials with attribution** (not anonymous quotes). Signal: "Real clients trust me."
7. **Brand kit** (consistent colors, fonts, logo). Signal: "I have a system."
8. **Calendar booking** (Calendly, not "email me to schedule"). Signal: "I respect your time."

**Verdict: Hit 6/8 and you're seen as a consultancy. Hit 8/8 and you can charge consultancy rates.**

### Bottom-line ₹ / hour savings

Right signals: **30-50% higher fees accepted** in my observation. A "freelancer" billing ₹3L feels expensive. The same person with a brand kit, portfolio, and SOW template can bill ₹5L for the same work.

---

## Section 12 — The proposal-to-close playbook

### The 5-step close process

**Step 1: Send the proposal (Day 0)**
Use the 1-page template. Send via email with the cover letter from Section 2 of the Negotiation Vault product.

**Step 2: 24-hour check-in (Day 1)**
"Hi {{name}}, just checking if you had a chance to review the proposal. Any questions?"

**Step 3: 4-day follow-up (Day 4)**
"Hi {{name}}, following up on the proposal. Did anything not land? Happy to jump on a 15-min call to walk through it."

**Step 4: 8-day follow-up (Day 8)**
"Hi {{name}}, last follow-up from me. I'm assuming this isn't the right time, which is totally fine. If priorities change, my calendar is open. If you'd like to discuss, let me know by Friday."

**Step 5: Move on (Day 9+)**
Don't follow up further. The "last follow-up" sets a clear boundary. If the client says yes later, you re-engage. If they say no, you don't burn the relationship.

**Verdict: Use this. The 4-touch sequence closes 60-70% of warm leads. Anything beyond 4 touches is wasted effort.**

### The "soft close" add-on

After Step 3, add:

```
"One more thing: I have 1 slot opening up in {{2 weeks}}. If you're ready to proceed, I can hold it for 48 hours once you reply."
```

**Why this works:** Soft urgency without pressure. "48 hours" creates a decision window.

### Bottom-line ₹ / hour savings

Right close process: **15-20% higher close rate** + **less wasted follow-up time** = **₹2L-₹5L/year in additional revenue + 20-30 hours/year saved**.

---

## Section 13 — Quarterly refresh log

### What changed in this edition (June 2026 vs March 2026)

- **Cloudflare Pages** now supports Astro 5.x and Next.js static export. Recommended for technical freelancers who want SSR-style features without server cost.
- **Super.so** has added a built-in blog feature. Worth it for freelancers who publish monthly.
- **Figma** added variables and design tokens. The 30-minute brand kit is now 20 minutes.
- **Notion Plus** added teamspaces. Useful for agencies with 2+ freelancers.
- **Refrens** added GST reconciliation. Replaces half of Zoho Books for freelancers.

### Promise to past buyers

If you bought the March 2026 edition, you'll get the September 2026 update free. Portfolio/proposal playbooks refresh twice a year because tools and design trends evolve. Promise covers 2 years from purchase.

---

## Appendix A — Full portfolio template files

*(See the product ZIP for the complete template: `portfolio-template/`.)*

The template includes:
- `index.html` — homepage
- `case-study.html` — case study template
- `about.html` — about page
- `styles.css` — Tailwind via CDN
- `_headers` — Cloudflare Pages config
- `og-image.png` — placeholder Open Graph image
- `favicon.ico` — placeholder favicon
- `README.md` — deployment guide

The template is responsive, fast (Lighthouse 95+), and ready to deploy.

---

## Appendix B — All 10 proposal templates

*(See the product ZIP for the complete templates: `proposal-templates/`.)*

- `tier-1-mini.md` — < ₹50K
- `tier-1-multi.md` — ₹30K-₹80K
- `tier-2-marketing.md` — ₹80K-₹2L
- `tier-2-design.md` — ₹1L-₹2L
- `tier-2-content.md` — ₹1L-₹2L
- `tier-3-website.md` — ₹2L-₹5L
- `tier-3-multi-month.md` — ₹3L-₹8L
- `tier-3-retainer.md` — ₹2L-₹5L/month
- `tier-4-enterprise.md` — ₹10L+
- `tier-4-strategic-retainer.md` — ₹5L-₹15L/month

Each template is 1-2 pages, structured identically, with placeholders.

---

## Appendix C — The full SOW template (4-page, lawyer-reviewable)

*(See the product ZIP for the full template: `sow-template.md`.)*

Includes all 8 Indian Stamp Act clauses from Section 6, plus:
- Scope section
- Timeline section
- Fees section
- Change order section
- Termination section
- Confidentiality section
- IP assignment section
- Limitation of liability section
- Jurisdiction section
- Signature block

---

## Appendix D — Brand kit starter (Figma file)

*(See the product ZIP for the Figma file: `brand-kit-starter.fig`.)*

The Figma file includes:
- Color palette swatches
- Typography samples
- Wordmark template
- Monogram template
- Icon set reference
- Spacing system

---

## Closing — what to do this week

1. **Deploy your portfolio today.** Even a 1-page version with your hero copy + 1 case study + contact. You can add more later. "Done" beats "perfect."
2. **Pick 3 case studies from past work** and write them up this week. Use the 5-minute template. Don't overthink.
3. **Build your rate card using the Section 5 template.** Send it to your last 5 prospects. See what comes back.
4. **E-stamp your next SOW** using shcilestamp.com. Cost: ₹100-₹500. The protection is worth 100x.

---

## Future editions — how to get them

This is the current edition (June 2026). Tool features and design trends shift over time, so newer editions get released as needed. To get the next edition, email `surisetti.dev@gmail.com` with the subject "Portfolio + Proposal OS update" and mention which edition you originally bought. Allow up to 7 business days for a reply.

Future editions are not sent automatically. Continued free updates depend on this product's demand — if it doesn't get an active buyer base, future editions may carry a small additional cost (you'll always be told the price before being charged). This guide may also be retired or replaced if it stops getting used; if that happens before your next requested update, you'll be notified and offered the closest current equivalent.

---

> *Reviewed and verified by Karthik Surisetti before publication.*
> *Last updated: 19 June 2026. Tool pricing and features change — refer to each tool's official site for current details. Educational content, not professional advice.*

---

## REVIEWER NOTES

- **Verify before publication:** Cloudflare Pages pricing — verify free tier limits and any 2026 changes at pages.cloudflare.com.
- **Verify before publication:** Super.so pricing ($12/month) — verify at super.so/pricing.
- **Verify before publication:** Calendly Pro pricing ($12/month) — verify at calendly.com/pricing.
- **Verify before publication:** Refrens free tier — verify unlimited invoices is still the case.
- **Verify before publication:** SHCIL e-stamp portal (shcilestamp.com) — verify the portal is still operational and the process hasn't changed. Some states have their own e-stamp portals.
- **Verify before publication:** Indian Stamp Act clauses for freelancer service agreements — the 8 clauses listed are common but state-specific rules vary. Recommend legal review once for the specific states you operate in.
- **Section 6 limitation of liability** ("total fees in 3 months preceding the claim") — this is a reasonable starting point. Larger clients may push back. Have a fallback: 6 months, or total contract value.
- **Section 8 brand kit** recommends Figma + Google Fonts. Figma is free for individual use but has a paid tier for teams. Google Fonts is genuinely free.
- **Section 11 "looks like a consultancy"** is observational. The 8 signals are based on my 10+ years of freelancing experience.
- **The 10 proposal templates** are 1-2 pages each, structured identically. The structure is opinionated; some clients may want more detail. Add an "appendix" section for project-specific details if needed.
- **The portfolio template** is a starting point. Most freelancers will customize 30-50% of the styling. That's expected.
- **SOW template** is designed to be lawyer-reviewable, not lawyer-drafted. The product recommends a one-time ₹10,000-₹20,000 legal review to adapt to specific state requirements.
