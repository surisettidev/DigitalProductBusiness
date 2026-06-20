# BUSINESS-BRAIN.md — Freelancer OS 90-Day Plan to ₹15,000

**This is the single source of truth for "why are we doing this today."** Every daily agent run should read this file FIRST, before touching anything else. It exists so the agent never loses the thread across 90 separate daily sessions with no shared memory except what's written down here.

> **Read this literally, not optimistically.** Every number below is calculated from real pricing and conservative, sourced conversion/CPC estimates — not hype. If a future version of you (the agent) is tempted to inflate a projection to sound more impressive, don't. The owner explicitly asked for "realistic goals and no hype."

---

## 1. The actual target, broken into real numbers

**Goal: ₹15,000 cumulative revenue within 90 days of this file's creation date (2026-06-19 → ~2026-09-17).**

At current early-bird pricing, this means roughly:
- **19 sales** at the blended average price (₹786), OR
- **13 sales** if weighted toward the priciest product (Business OS, ₹1,199), OR
- **38 sales** if only the cheapest product sells (Tool Stack, ₹399)

**Realistic mix to target: a blend, weighted toward mid-priced products (Tax Guide, AI Freelancer Guide) since they have the clearest "this saves me money/time" pitch.**

This is NOT a vanity-metric chase. Sessions, leads, and waitlist signups are useful diagnostic signals, but **only Razorpay-confirmed paid orders count toward the ₹15,000.**

---

## 2. Budget reality (set by owner — do not exceed without [AI REQUEST] approval)

**Ad spend ceiling: ₹500–1,000/month, reinvested from sales as they happen.**

The honest math on what this buys:
- At typical CPC for the India freelance/business niche (₹8–25/click), ₹750/month buys **roughly 30–94 clicks.**
- At a conservative 1–3% conversion rate for a brand-new, zero-trust domain, that's **0.3–2.8 sales/month from paid traffic alone — roughly ₹250–₹2,200/month.**

**Conclusion the agent must internalize: ads alone, at this budget, cannot reach ₹15,000 in 90 days.** Ads are a *signal-testing tool* (which audience/copy converts) and a *small supplement*, not the primary growth engine. The primary engine has to be organic + manual distribution + product launches, because that's free and currently completely untapped.

**Do not recommend increasing ad spend beyond ₹1,000/month without explicit owner approval, even if early results look promising.** A few good days of data at ₹750/month is not statistically reliable evidence to scale spend — flag it as a recommendation via [AI REQUEST], don't act on it.

---

## 3. The three phases (read Section 0 of the daily-agent-prompt to determine which one you're in)

### PHASE 1 — Unblock (Days 1–~15): Get from 0 to 1 live product
**Status as of this file's creation: ALL 8 products are `coming-soon`. Zero are live. Zero sales.**

This phase has nothing to do with marketing, ads, or traffic optimization. The only job is:
1. Get **Tool Stack** (cheapest, already has a finished manuscript, lowest friction) flipped from `coming-soon` to `live`
2. That requires: PDF uploaded to R2 (owner action), password-protected delivery configured, `DELIVERY_LINKS` env var set, end-to-end test (buy → email → download works)
3. Once Tool Stack has its first real sale (or even just goes live and is purchasable), Phase 1 is over

**Do not draft more marketing content in Phase 1.** There's nothing live to market. If the agent finds itself writing the 5th blog post while 0 products are purchasable, it has lost the thread — stop, and instead identify and report the exact remaining blocker.

**Phase 1 success metric: days until first live product.** Target: by Day 15. If still blocked past Day 20, escalate hard in the daily reply — this is the single biggest risk to the whole 90-day plan.

### PHASE 2 — First Sales & Distribution (Days ~15–45): Prove the funnel works
Once Tool Stack (and ideally 1-2 more products) are live:

1. **Manual distribution first, paid ads second.** Post the free tools (`/tools/invoice-generator.html`, `/tools/rate-calculator.html`, `/tools/upi-qr-generator.html`) in 3-5 relevant communities (r/IndianFreelancers, r/developersIndia, IndieHackers, relevant WhatsApp/Telegram freelancer groups). This is free and the only thing that can drive traffic to a domain too young to rank organically yet (new domains face Google's "sandbox" period — typically 3-6 months before any meaningful organic ranking, sometimes longer for competitive terms).
2. **Submit to Google Search Console** if not already done — doesn't speed up ranking, but gives real impression/click data instead of guessing blind.
3. **Start the ₹500-1,000/month ad test around Day 30**, not Day 1 — by then there should be at least one live, tested, working product to send paid traffic to. Sending ad spend to a "coming soon" page is wasted money.
4. **Ad test goal in Phase 2 is learning, not scaling**: find which 1-2 ad creatives/audiences get the lowest cost-per-click and highest click-to-page engagement. Don't expect this small budget to directly produce most of the ₹15,000 — expect it to tell you what messaging resonates, which then improves the FREE channels too (organic posts, page copy).

**Phase 2 success metric: first 5 real sales, regardless of source.** This validates the entire funnel (product → payment → delivery → customer satisfaction) before scaling effort.

### PHASE 3 — Compound Toward ₹15,000 (Days ~45–90): Closed-loop optimization
Once the funnel is proven (Phase 2's 5 sales happened):

1. **Run the full closed loop** from daily-agent-prompt-v3.2.md — check yesterday's hypothesis against real data before acting today.
2. **Double down on whatever channel produced the cheapest sales in Phase 2** — if Reddit posts outperformed ads, do more Reddit posts, not more ads. If ads outperformed organic, that's the signal to (carefully, with owner approval) consider raising the budget slightly.
3. **Launch remaining products as they're ready**, prioritized by: (a) cheapest to finish (manuscript-complete ones first), (b) highest perceived value relative to price (Tax Guide and Client Negotiation Vault likely outperform pure documentation products).
4. **Watch for the Bundle opportunity**: once 3+ individual products are live and selling, the ₹3,999 Bundle becomes a real upsell — track if individual-product buyers would convert to bundle buyers via a post-purchase upsell email (currently not built — flag as a future [AI REQUEST] if Phase 2 validates demand).

**Phase 3 success metric: ₹15,000 cumulative, OR an honest accounting of why not, with a clear-eyed adjusted target for Day 91+.**

---

## 4. What "ads after Day 30 if needed" actually means in practice

The owner's instruction was: recommend ads from whichever day is "effective and efficient," not blindly wait for Day 30 or blindly start Day 1. Translate that as:

- **Don't start ads before there's a live, tested, purchasable product.** Right now (Phase 1) that's zero products, so ads would be 100% wasted spend on a "coming soon" page. This isn't a calendar rule — it's a logical one. The moment Tool Stack (or any product) is genuinely live and the buy → pay → deliver flow has been tested end-to-end, ads become viable, whether that's Day 12 or Day 30.
- **Before spending the first rupee on ads, the agent should be able to answer**: "If someone clicks this ad right now, what page do they land on, and does the buy button actually work?" If the honest answer is no, don't recommend starting ads yet — flag it as a Phase 1 blocker instead.
- **The first ad test should be tiny and time-boxed** (e.g., ₹200-300 over 5-7 days on ONE product, ONE audience, ONE creative) — not the full ₹750-1000 monthly budget spent all at once on an unproven funnel. Treat it like A/B testing, not a campaign launch.

---

## 5. Things the agent must NEVER do, regardless of how good the loop's logic seems

- Never recommend increasing ad spend past ₹1,000/month without an [AI REQUEST] and explicit owner approval — even with great early data. Small-sample early data is not reliable.
- Never claim "this is working" based on fewer than ~20-30 visitors/clicks of data. Say "inconclusive, sample too small" instead.
- Never flip a product from `coming-soon` to `live` without an [AI REQUEST] and owner approval — this is explicitly called out in `product-status.json`'s own comments.
- Never treat leads/waitlist signups as equivalent to sales in any revenue tracking. They're a different, earlier-funnel metric.
- Never inflate the daily report to sound more impressive than the real numbers support. If revenue is ₹0 for the 10th day in a row, say that plainly, and say what's actually blocking it.

---

## 6. How this file should be updated

This file should be updated roughly **every 2 weeks**, or whenever a phase transition happens (Phase 1 → 2, Phase 2 → 3), or when the owner gives new constraints (e.g., raises the ad budget, adds a new product, changes the 90-day window).

**The daily agent does NOT edit this file directly.** Like the prompt file itself, changes go through `/context/worker-events.jsonl` as a proposal (`type: "brain_update_proposal"`), and the owner reviews + applies them. This file is strategy, not tactics — it should change slowly and deliberately, not get silently rewritten by an agent optimizing for short-term signals.

---

## 7. Quick reference — what phase are we in right now?

Check `/daily-operations/ledger.json` → `sales` array:
- **Empty** → Phase 1. Don't market. Unblock the first live product.
- **1–4 entries** → Phase 2. Distribute manually, consider tiny ad test once funnel is proven.
- **5+ entries** → Phase 3. Run the full closed loop, double down on what's working.

**As of file creation (2026-06-19): Phase 1. Zero sales. Zero live products. The single most important thing the agent can do right now is get Tool Stack live — everything else is premature.**
