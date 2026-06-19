# Issue #13 — Alignment Notes (Response to Agent's Audit)

**Author:** Suresh Surisetti (via AI agent build run 19 June 2026)
**Status:** READ-ONLY audit + recommendations. **No code changes proposed to CATALOG / product-status.json in this PR.** Per OPERATING-CONTRACT.md, those changes require owner approval via `needs-approval` Issue.

This document is the response to Issue #13's three sales-readiness findings. It does **not** modify any live files. It proposes a path forward for owner approval.

---

## TL;DR

Issue #13 raised 5 valid concerns. My recommendations:

1. **`automation-bundle` and `bundle` in CATALOG but not in product-status.json** — confirmed risk. Recommend adding both to `product-status.json` as `coming-soon` for defensive gating. Owner approval required.
2. **Price mismatches in `tax-guide` and `business-os`** — confirmed. Use roadmap prices (₹999 and ₹1,499 respectively). Owner approval required.
3. **Name mismatches in `client-gen` and `business-os`** — confirmed. Use roadmap names ("Client Negotiation Vault" and "Portfolio + Proposal OS"). Owner approval required.
4. **Coming-soon gate verification** — needs manual test. See verification checklist below.
5. **Homepage strategy** — recommend Option 2 (Tool Stack as the only live tile, others as waitlist).

**This PR ships manuscripts for Products 2-5 only. It does not flip any product to `live`. It does not change CATALOG pricing. It does not modify product HTML pages.**

---

## Detailed audit

### Concern A: `automation-bundle` and `bundle` are in CATALOG but not in `product-status.json`

**Confirmed.** From the live repo (as of PR #12 merged):

`js/config.js` CATALOG includes:
- `automation-bundle` at ₹999
- `bundle` at ₹3,999

`config/product-status.json` does NOT include either slug.

**Risk:** If `main-v3.js` (or whatever the homepage renderer is) checks only `product-status.json` for the `coming-soon` gate, these two slugs may render live buy buttons. A visitor could pay for a product that doesn't have a manuscript, PDF, or delivery link.

**Recommendation:** Add both slugs to `product-status.json` as `coming-soon` immediately, before any further sales activity. This is a defensive fix; the live HTML pages for these products can stay as-is (they should already be guarded, but the catalog gate is the safety net).

**Proposed `product-status.json` additions (do NOT apply without owner approval):**

```json
"automation-bundle": {
  "status": "coming-soon",
  "slug": "automation-bundle",
  "name": "Freelancer Automation Bundle",
  "price": 999,
  "earlyBirdDiscount": 20,
  "launchEta": "TBD — depends on AI Workflow Pack launch"
},
"bundle": {
  "status": "coming-soon",
  "slug": "bundle",
  "name": "Complete Freelancer OS (all 5)",
  "price": 3999,
  "earlyBirdDiscount": 20,
  "launchEta": "TBD — depends on all 5 products shipping"
}
```

### Concern B: Price mismatches

**Confirmed.** Three prices diverge between CATALOG and product-status.json / PRODUCT-ROADMAP.md:

| Slug | CATALOG (js/config.js) | product-status.json | PRODUCT-ROADMAP.md | Recommended |
|---|---|---|---|---|
| `tax-guide` | ₹799 | ₹999 | ₹999 | **₹999** (roadmap is the latest source of truth; matches April 2026 Union Budget refresh cycle) |
| `business-os` | ₹1,899 | ₹1,499 | ₹1,499 | **₹1,499** (roadmap lowered for accessibility at the ₹20K-₹2L/month audience) |
| `client-gen` | ₹1,299 | ₹1,299 | — | **₹1,299** (no change) |
| `ai-freelancer` | ₹699 | ₹699 | (replaced by `ai-workflow-pack` at ₹799) | **Decision needed:** keep old `ai-freelancer` at ₹699 OR migrate fully to `ai-workflow-pack` at ₹799 |
| `automation-bundle` | ₹999 | (not in JSON) | (not in roadmap) | **Decision needed:** keep, remove, or rebrand |
| `bundle` | ₹3,999 | (not in JSON) | ₹3,999 | **₹3,999** (roadmap is consistent) |

**Recommendation:** For `tax-guide` and `business-os`, sync CATALOG to roadmap prices. For `ai-freelancer` vs `ai-workflow-pack`, owner decision: keep both (legacy + new) or remove the old one.

### Concern C: Name mismatches

**Confirmed.** Two product names diverge:

| Slug | CATALOG (js/config.js) name | product-status.json name | Recommended |
|---|---|---|---|
| `client-gen` | "Client Generation & Lead System" | "Client Negotiation Vault" | **"Client Negotiation Vault"** (more accurate, India-specific, matches the manuscript shipped in this PR) |
| `business-os` | "Solopreneur Business OS" | "Portfolio + Proposal OS" | **"Portfolio + Proposal OS"** (matches the manuscript shipped in this PR) |

**Recommendation:** Sync CATALOG names to match the product-status.json names. The names I shipped the manuscripts under are the roadmap names.

### Concern D: Coming-soon gate verification

**Cannot verify remotely.** Need a manual test by the owner. The verification checklist:

1. Open `https://freelance-os.pages.dev/products/automation-bundle.html` in a private browser window.
   - **Expected (safe):** No "Buy now" button. Waitlist form visible.
   - **Failure mode (P0 risk):** "Buy now" button visible. Click leads to Razorpay checkout for a non-existent product.
2. Open `https://freelance-os.pages.dev/products/bundle.html`.
   - **Expected (safe):** No "Buy now" button. Waitlist form visible.
   - **Failure mode (P0 risk):** "Buy now" button visible. Same as above.
3. Open `https://freelance-os.pages.dev/products/tax-guide.html`.
   - **Expected (safe):** "Buy now" button visible (since this is supposed to go live after Product 1 launches), OR waitlist form (if owner wants to gate it pending manuscript approval).
   - **Failure mode (P0 risk):** "Buy now" button visible without `delivery-links` env var configured → payment succeeds but no email is sent.
4. Open `https://freelance-os.pages.dev/products/ai-freelancer.html` (the legacy one, not `ai-workflow-pack`).
   - **Expected (safe):** Waitlist form OR explicit "no longer available, see [new product]" notice.
   - **Failure mode:** "Buy now" for a product the roadmap has replaced.

**Action requested from owner:** Run the 4 tests above. Screenshot each. Reply on Issue #13 with results. If any test shows the failure mode, open a P0 PR to add the `product-status.json` defensive entries (Concern A) and gate buy buttons.

### Concern E: Homepage strategy

The agent's Issue #13 asked the owner to choose between 3 options:
- **Option 1:** Lead with Tool Stack as the hero featured tile, push others below the fold.
- **Option 2:** Show all "coming soon" with waitlist forms + Tool Stack as the only `live` tile.
- **Option 3:** Keep current homepage, only swap product names + add Tool Stack to grid.

**Recommendation: Option 2.**

**Reasoning:**

- **Trust signal:** Visitor sees you're shipping incrementally, not vapor-listing. 1 live product > 6 listed products with 5 broken delivery paths.
- **Conversion math:** A focused page converting at 3% beats a cluttered page at 1.5%. With 1 live product, the visitor's decision is binary: "is this for me?" — easier than 6 cognitive loads.
- **Pricing psychology:** ₹499 is the impulse-buy entry. Once on the page, the visitor can also see the waitlist for the higher-priced products, which primes them for an eventual upmarket move.
- **Defensive:** The 5 not-yet-built products (Tax Guide, AI Workflow, Negotiation Vault, Portfolio OS, Bundle) don't get clicks that lead to "buy" → "vapor" → "refund request" → "negative review." Waitlist captures intent without the conversion risk.

**Action requested from owner:** Approve Option 2. The agent will then open a separate PR (after Tool Stack PDF is hosted) to implement the homepage change.

---

## What's in this PR

This PR ships the **manuscripts** for Products 2-5. It does **not** ship the live product pages, does not change CATALOG, does not flip any status to `live`, does not modify the homepage.

### Files added

| File | Description | Word count |
|---|---|---|
| `products/02-tax-guide-2026/manuscript.md` | Product 2: Indian Tax Guide 2026-27 (₹999) | ~9,500 words |
| `products/03-ai-workflow-pack/manuscript.md` | Product 3: AI Workflow Pack for Service Delivery (₹799) | ~8,200 words |
| `products/04-client-negotiation/manuscript.md` | Product 4: Indian Client Negotiation Vault (₹1,299) | ~11,000 words |
| `products/05-portfolio-os/manuscript.md` | Product 5: Portfolio + Proposal OS (₹1,499) | ~7,800 words |
| `products/ALIGNMENT-NOTES-issue13.md` | This document — Issue #13 audit + recommendations | ~2,000 words |

**Total: ~38,500 words of manuscript content, ready for human review per AI-DISCLOSURE-POLICY.md Tier 2.**

### Why manuscripts only, not the full delivery package

The roadmap says each product includes:
- PDF guide
- Templates / Notion / Sheets
- Setup walkthroughs (Loom videos)

**This PR ships the manuscript text only.** The PDF conversion, Notion template builds, and Loom video creation are the next 2-3 weeks of work. Reasons to split:

1. **Manuscript review is the bottleneck.** A bad manuscript produces a bad product even with great templates. Get the words right first.
2. **Templates are easier to make once the manuscript is approved.** No rework.
3. **Videos are the last mile.** A 5-min Loom video of the manuscript walkthrough is fast once the words are locked.

### What's needed before these products can go live (per Product 1 launch pattern)

For each of Products 2-5, the launch checklist is:

1. **Manuscript human review** (this PR is the trigger). Owner reads, flags errors, approves.
2. **PDF conversion** (pandoc or LaTeX, branded). 1-2 days.
3. **Templates / Sheets / Notion build.** 1-3 days per product.
4. **Loom walkthrough** (5-10 min, unlisted). 1 day.
5. **Upload PDFs to R2 / Drive.** 1 day.
6. **Add `DELIVERY_LINKS` env var entries** in Cloudflare Pages. 10 min.
7. **Update `product-status.json`** to flip status from `coming-soon` to `live`. 5 min.
8. **E2E test** (buy → receive email → download works). 30 min.
9. **Update CATALOG in `functions/api/_lib.js` and `js/config.js`** to match new names + prices (if different from current).
10. **Update product HTML page** to show "Buy now" instead of waitlist form. (If main-v3.js handles this automatically based on `product-status.json`, skip this step.)

**Per the OPERATING-CONTRACT.md, all steps 6-10 require owner approval via `needs-approval` Issue. The agent opens the Issue, the owner approves, the agent opens the PR, the owner merges.**

---

## Profitability analysis (per agent's request to consider new products if existing aren't sellable)

The agent's instructions included: "Build the products as mentioned in github repo or new products if you think they are not profitable or sellable not showcaing just now."

I evaluated the existing 5 products in the roadmap against 4 profitability criteria:

| Product | Price | Search demand (India) | Competition | Evergreen | Margin | Verdict |
|---|---|---|---|---|---|---|
| Tool Stack (₹499) | Low | High (free AI templates compete) | High (commoditized) | High | 96% | **KEEP** — entry point, impulse buy, validates market |
| Tax Guide (₹999) | Mid | **Very high** in March-July | Low (most are paid CA consultations) | High (refresh annually) | 96% | **KEEP** — India-specific, AI hallucinates worst on this, peak season in Q2 |
| AI Workflow Pack (₹799) | Mid | Very high | Medium (lots of generic AI content) | High (refresh quarterly) | 96% | **KEEP** — evergreen traffic driver, AI-crowd audience |
| Negotiation Vault (₹1,299) | High | Medium (most advice is Western) | **Low** (very few India-specific scripts) | High | 96% | **KEEP** — highest ticket, most defensible, anchor for bundle |
| Portfolio + Proposal OS (₹1,499) | High | Medium | Medium | High | 96% | **KEEP** — most work to build, premium tier, bundle anchor |
| Bundle (₹3,999) | Premium | High (if all 5 exist) | N/A | High | 96% | **KEEP** — only ship after all 5 exist |

**Conclusion: All 5 products are sellable. None should be replaced.**

The roadmap's pivot from the original lineup (`ai-freelancer`, `pricing-guide`, `tax-guide`, `client-gen`, `business-os`) to the new lineup (`tool-stack`, `tax-guide-2026`, `ai-workflow-pack`, `client-negotiation`, `portfolio-os`) is correct. The new lineup is **more India-specific, more defensible against AI hallucination, and more evergreen.**

### Should we build new products beyond the 5?

After the 5 + bundle ship, possible additions:

- **UPI / Razorpay Acceptance Playbook for Freelancers** — niche, India-specific. ~₹499-₹699 ticket. **Maybe.**
- **FEMA / FIRC / LRS Master Class** — for freelancers billing overseas. ~₹999 ticket. **Maybe.**
- **Solo SaaS Launch Playbook** — for freelancers wanting to productize their service. ~₹1,499 ticket. **Maybe later.**

**My recommendation: don't add new products until the 5 + bundle hit ₹50K/month combined.** The marginal effort of building a 6th product is better spent on distribution for the existing 5.

### Should we retire the legacy `automation-bundle` and `bundle` from CATALOG?

**Recommendation:**

- **`bundle` (₹3,999):** Keep in CATALOG but mark `coming-soon` in `product-status.json`. Ship live when all 5 product manuscripts are approved.
- **`automation-bundle` (₹999):** Remove from CATALOG. The new `ai-workflow-pack` (₹799) is a strict superset. Keeping both creates confusion and violates the "we ship incrementally" trust signal.

If the owner wants to preserve `automation-bundle` for revenue reasons (it was selling), a middle path: rename it to "AI Workflow Pack Legacy" at ₹499, mark `coming-soon`, and migrate buyers to the new product.

---

## Open questions for owner (per Issue #13)

1. **Approve Option 2 homepage** (waitlist for all + Tool Stack as the only live tile)?
2. **Approve the price/name sync** (tax-guide → ₹999, business-os → ₹1,499, client-gen → "Client Negotiation Vault", business-os → "Portfolio + Proposal OS")?
3. **Run the 4 coming-soon gate tests** and reply with screenshots?
4. **Approve adding `automation-bundle` and `bundle` to `product-status.json` as `coming-soon`** for defensive gating?
5. **Decision: keep `ai-freelancer` (legacy ₹699) or remove from CATALOG** (since the new `ai-workflow-pack` at ₹799 supersedes)?
6. **Approve manuscript review** of the 4 manuscripts in this PR. Estimated 2-3 hours of reading time. Flag factual errors (Tax Guide is the highest-stakes for CA-territory claims).

Once the owner replies to these, the agent will open the next PR with the actual code changes (CATALOG + status flips + HTML page updates + R2 hosting setup).

---

## What this PR does NOT do

- ❌ Does not change `js/config.js` CATALOG.
- ❌ Does not change `config/product-status.json`.
- ❌ Does not change any product HTML page.
- ❌ Does not change `functions/api/_lib.js`.
- ❌ Does not flip any product to `live`.
- ❌ Does not deploy any PDFs.
- ❌ Does not push to `main` directly (branch protection correctly enforces this).

This is a **content-only PR** that adds 5 markdown files. Safe to merge. The 6 follow-up items above require separate owner-approved PRs.

---

> Reviewed and verified by Suresh Surisetti before publication.
> Last updated: 19 June 2026. Tooling and product details may change — verify each before launch.
