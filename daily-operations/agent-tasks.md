# Agent Tasks — What today's AI should do

> Updated every evening by the previous day's AI agent OR by the human operator.

## Today's priority (2026-06-19)

1. **Start authoring the Tool Stack PDF** — open `products/01-tool-stack/tool-stack-2026-Q3.md`, draft Sections 1 (Invoicing & GST: Refrens, Zoho Invoice, Vyapar, Sleek Bill) and 2 (Domestic payments: UPI, Razorpay, Cashfree, Instamojo). Target: ~12 pages of substantive comparison content with India-specific notes (GSTIN handling, TDS implications, settlement times). Cite official tool docs; mark anything uncertain with `[NEEDS-VERIFY]` so the human reviewer (per AI-DISCLOSURE-POLICY Tier 2) can fix-or-fact-check.
2. **Draft Email 2** of the welcome nurture sequence into `/marketing/email-drafts/2026-06-19-welcome-email-2.md`. Theme: "where most freelancers lose money on tools." Body ≤ 200 words, soft CTA to the Tool Stack waitlist.
3. **Open a formal `needs-approval` Issue** bundling the three unblock-the-funnel asks: (a) buy `freelanceros.in` from BigRock (~₹300/yr), (b) swap `BREVO_API_KEY` to SMTP v3 (`xkeysib-` prefix), (c) replace `GA4_PROPERTY_ID` with numeric Property ID. One Issue, three checkboxes — keeps approval lightweight.

## Reference docs (read these first)
- `/config/BRIEF.md`
- `/config/BRAND-VOICE.md`
- `/config/PRODUCT-ROADMAP.md` (NOT the old PRODUCT-SPECS — the roadmap is the current source of truth)
- `/config/AI-DISCLOSURE-POLICY.md` (mandatory for Tool Stack content — it's a Tier 2 product)
- `/daily-operations/daily-log.md` (yesterday's entry)
- `/context/daily-agent-log.jsonl` (tail -7)

## API rotation for content generation
2026-06-19 is **Friday** → **Groq Llama 3.3** (fastest).

## Constraints
- No fake testimonials, no fake numbers.
- Tier 2 product content REQUIRES the disclosure footer:
  > *Reviewed and verified by Surisetti Dev before publication. Last updated: [DATE]. Tax/legal/financial information is educational and not professional advice. Consult a qualified CA for personal tax decisions.*
- Tool Stack pricing/features must be verified against the tool's official site at time of writing — mark anything you can't verify with `[NEEDS-VERIFY]`.
- One PR per scope. Don't bundle product content + infra changes in one PR.

## Escalate to human (open `needs-approval` Issue) if:
- You'd need to change a price in `js/config.js` or any product README
- You'd need to send a real email (drafts only)
- You'd need to rewrite >50 lines of an existing file
- You hit 3 consecutive days with 0 leads + 0 sales (escalation email to surisetti.dev@gmail.com)
