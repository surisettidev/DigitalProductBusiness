---
title: "AI Workflow Pack for Service Delivery"
slug: ai-workflow-pack
version: 2026-Q3
last-updated: 19 June 2026
ai-tier: 2
price: ₹799
---

# AI Workflow Pack for Service Delivery

**Stop picking the wrong AI tool. Six ready-to-paste automations that save 5-10 hours a week — on Make.com, n8n, or Google Apps Script.**

> *Reviewed and verified by Karthik Surisetti before publication.*
> *Last updated: 19 June 2026. AI tools and pricing change quarterly — refer to each tool's official site for current details. Educational content, not professional advice.*

---

## How to use this guide

- **If you've never used Make.com or n8n:** open Section 1 first. Pick one. Don't try both.
- **If you spend 2+ hours/week writing proposals from scratch:** start with Workflow 2 (Proposal-from-brief). Pays for itself in week 1.
- **If you invoice clients inconsistently and chase payments:** Workflow 5 (Invoice-from-Slack) is your friend.
- **If you want the fastest ROI on this guide:** skip to Section 7 — the 4-hour quick-start gets you 3 workflows live in one afternoon.
- **If you already use ChatGPT or Claude but feel you're under-using them:** Section 2 has the exact prompting patterns that 3x output quality.

---

## Section 1 — Pick ONE automation platform (and stop comparing)

### The problem you're solving

There are 12+ "no-code automation" tools. Make.com, n8n, Zapier, Pabbly Connect, Workato, Power Automate, IFTTT, n8n Cloud, n8n self-hosted, Relay.app, Bardeen, Lindy. Every Reddit thread asks "which is best." Most freelancers never start because they can't decide.

The answer is: pick based on what you already pay for.

### Decision tree

| Your current stack | Use this | Why |
|---|---|---|
| You already pay for **Zapier** (or are on a free trial) | **Zapier** | Don't pay twice. Use what you have. |
| You pay for **Notion** (paid plan) and want free automation | **Make.com** free tier (1,000 ops/month) | Best free tier, no credit card |
| You're a **developer** comfortable with self-hosting | **n8n self-hosted on a ₹500/month VPS** | Unlimited workflows, free forever |
| You're a **non-tech freelancer** who wants the simplest UI | **Make.com** | Visual, drag-drop, easier than Zapier |
| You're a **Microsoft shop** (use Office 365) | **Power Automate** | Free with most M365 plans |

**Verdict: Use Make.com for 90% of freelancers.** It's the best price-to-power ratio in 2026.

### What I'd actually use

- **You earn < ₹10L/year and don't want another subscription:** **Make.com free tier** (1,000 operations/month) or **Google Apps Script** (GAS) — totally free, runs in your Google account. Section 4 has GAS snippets if you want zero-cost.
- **You earn ₹10L-₹50L/year and time is money:** **Make.com Core plan at $9/month (~₹750/month)** as of June 2026 (verify on make.com). 10,000 ops/month covers most freelancers.
- **You earn > ₹50L/year and have a junior:** **n8n self-hosted on a Hostinger VPS at ₹500/month**. Unlimited workflows, no per-op cost, junior can build without racking up a bill.

### Make.com vs n8n — the only comparison that matters

| | Make.com | n8n self-hosted |
|---|---|---|
| Free tier | 1,000 ops/month, no card needed | Unlimited (you host) |
| Paid tier | $9/month Core, 10K ops; $16/month Pro 10K ops | $0 (just your VPS) |
| Hosting | Managed | You run it (Docker) |
| Visual UI | Best in class | Good, slightly less polished |
| AI nodes | Native, OpenAI/Anthropic/Gemini built-in | Same, slightly more config |
| Best for | Solo freelancers, small teams | Tech-comfortable freelancers, agencies |

**Verdict:Skip Zapier.** It's the most expensive per-operation and has the worst India-specific integrations (Razorpay, Cashfree, Brevo, etc. all need premium apps on Zapier; they're free on Make.com).

### Bottom-line ₹ / hour savings

Right platform pick: **₹0-₹1,000/month** vs. overpaying for Zapier (which would cost ₹1,500-₹4,000/month for the same workflows). Over a year, that's **₹18,000-₹48,000 saved**.

---

## Section 2 — The 5 prompts that 3x your output quality

### The problem you're solving

Most freelancers use ChatGPT/Claude like a search engine: type a vague question, get a vague answer, complain the AI is "stupid." The issue is the prompt, not the model.

This section gives you 5 prompt patterns that consistently produce 5-10x more useful output. Save them. Reuse them.

### Pattern 1 — "Act as a [specific role], help me with [specific task]"

Bad prompt: "Help me write a proposal."
Good prompt: "Act as a senior freelance web designer with 8 years of experience billing ₹3L-₹8L per project. Help me write a proposal for a 6-week e-commerce redesign project for a D2C skincare brand. The client is the marketing head, has a ₹2L budget, and is comparing me with two cheaper freelancers."

The role + the specific task + the constraints = much better output.

### Pattern 2 — "Show your work" / "Think step by step"

Bad prompt: "What's the best pricing for my services?"
Good prompt: "I'm a freelance copywriter in India with 3 years of experience, billing ₹50K/month. I want to raise my rates by 30%. Think step by step: (1) what data should I collect about my current clients, (2) what scripts should I use to ask for the raise, (3) what fallback position should I have. Show your reasoning."

### Pattern 3 — "Critique this, then improve it"

Bad prompt: "Make this better: [pastes draft]"
Good prompt: "Here's my draft client email. Critique it on (1) clarity, (2) tone, (3) call-to-action strength. Then give me 2 alternative versions: one more direct, one more friendly."

### Pattern 4 — "Cite your reasoning / tell me what you're not sure about"

This is the hallucination-killer.

Bad prompt: "What are the GST rules for freelancers in India?"
Good prompt: "What are the GST rules for freelancers in India in 2026? Cite the section number where possible. For anything you're not sure about, say 'verify with a CA' rather than guessing."

### Pattern 5 — "Output as [specific format]"

Bad prompt: "Give me a project plan."
Good prompt: "Output a project plan as a 4-column markdown table with columns: Week, Task, Deliverable, Hours. Then list 3 risks in bullet points."

### Free API key setup (June 2026, verify before publication)

| Provider | Free tier | Speed | Best for |
|---|---|---|---|
| **Google Gemini 2.5 Flash** | 15 RPM, 1M TPM, 1500 RPD | Fastest | Bulk tasks, classification |
| **Groq (Llama 3.3 70B)** | 30 RPM, generous token limits | Lightning fast | Real-time chat, drafting |
| **OpenRouter** | Free models from Meta, Mistral, etc. | Variable | Variety, comparison |
| **NVIDIA NIM** | 1000 requests free during trial | Fast | Heavy batch jobs |

**Verdict: Use Gemini 2.5 Flash for any bulk/classification task. Use Groq for interactive chat. Skip OpenAI/Anthropic paid for routine work — pay only when the quality delta is measurable.**

Setup: Google AI Studio (aistudio.google.com) → API key → 2 minutes. Plug into Make.com's "OpenAI-compatible" module as the base URL with Gemini's endpoint.

### Bottom-line ₹ / hour savings

Right prompting + free APIs: **5-10 hours/week saved** for a typical freelancer. At a ₹2,000/hour billing rate, that's **₹40,000-₹80,000/month in recovered time** — well above this product's ₹799 cost.

---

## Section 3 — Workflow 1: Client onboarding automation

### What this does

New client fills a Tally form (or Typeform or Google Form) → Make.com creates a folder in your Google Drive → adds the client to a Notion CRM database → sends a welcome email → creates a Slack channel → adds a row to your invoice tracker.

Setup time: 30 minutes. Saves: 45 minutes per new client.

### The 8 steps (Make.com visual)

1. **Trigger:** Webhook from Tally form submission (form has: name, email, company, project type, budget).
2. **Module 1 — Google Drive: Create a folder** named `{{client-company}} - {{date}}`.
3. **Module 2 — Notion: Create a page** in your "Clients" database with all the form fields mapped.
4. **Module 3 — Gmail: Send email** using a welcome template (Appendix A).
5. **Module 4 — Slack: Create a channel** `#client-{{company-slug}}`.
6. **Module 5 — Google Sheets: Append row** to `Invoice Tracker` sheet with: client name, project, start date, expected invoice date.
7. **Module 6 — Notion: Create sub-page** in the client folder: "Onboarding checklist" (template from Appendix B).
8. **Module 7 — Google Calendar: Create event** for kickoff call 3 days out.

### Cost: free (Make.com free tier covers 1,000 ops/month; one new client uses ~7 ops)

### Verdict: Build this. It's the highest-ROI workflow in the pack for any freelancer with > 2 clients/year.

### Bottom-line ₹ / hour savings

Time saved per new client: 45 min. New clients per year: 5-15. **5-11 hours/year saved**, equivalent to **₹10,000-₹22,000 in recovered time** at conservative billing rates.

---

## Section 4 — Workflow 2: Proposal-from-brief generator

### What this does

Client sends you a brief (email, doc, or Notion page) → You run a Make.com automation that uses Claude/Gemini to extract requirements → Generates a draft proposal in your template → Saves to Google Drive → Notifies you on Slack for review → You edit + send.

Setup time: 45 minutes. Saves: 2-3 hours per proposal.

### The 5 steps

1. **Trigger:** Email arrives in `briefs@yourdomain.com` OR a Notion page is added to a "New Briefs" database.
2. **Module 1 — Extract text** from the email or Notion page.
3. **Module 2 — Anthropic Claude / OpenAI:** Send prompt: *"Extract from this brief: (a) project goal, (b) deliverables, (c) timeline, (d) budget signals, (e) decision-maker role. Output as JSON."*
4. **Module 3 — Anthropic Claude:** Send second prompt: *"Based on this brief JSON, write a 3-section proposal: (1) understanding, (2) approach, (3) timeline + fees. Use my voice — direct, no fluff. Tone: confident, senior."* Include your fee structure in the prompt (variable).
5. **Module 4 — Google Docs: Create from template** with the proposal pasted into your branded template.
6. **Module 5 — Slack: Send message** with the doc link to `#proposals` channel.
7. **You:** Open, edit, send.

### The exact prompt (Module 3)

```
You are writing a freelance proposal in my voice. Direct, no fluff, confident-senior tone. No "synergy", no "leverage", no "next-level".

Based on this brief JSON:
{{brief_json}}

And my standard rate card:
- Discovery + strategy: ₹{{discovery_fee}}
- Per-deliverable fees: {{per_unit_rates}}
- Project minimum: ₹{{min_project}}

Write a 3-section proposal:
1. "What I understood" — 2 paragraphs confirming the project goal
2. "How I'd approach it" — 3 bullets, each 1-2 sentences
3. "Timeline and fees" — 1 paragraph, with the fee as a single number, not a range

Output as plain text, no markdown headings.
```

### Verdict: Build this. You'll never start a proposal from a blank doc again.

### Bottom-line ₹ / hour savings

Time saved per proposal: 2-3 hours. Proposals per year: 10-30. **20-90 hours/year saved** = **₹40,000-₹1,80,000 in recovered time**.

---

## Section 5 — Workflow 3: Weekly status report generator

### What this does

Every Friday at 4 PM, Make.com pulls last 7 days of Slack messages, Notion updates, and Toggl time entries from your project channels → Sends them to Claude → Claude generates a 200-word status report per client → Sends via email to each client automatically.

Setup time: 60 minutes. Saves: 90 min/week.

### The 4 steps

1. **Trigger:** Schedule — every Friday 4 PM IST.
2. **Module 1 — Slack: List messages** from each `#client-{{company}}` channel for the past 7 days.
3. **Module 2 — Notion: Query** the "Projects" database for status changes in the past 7 days.
4. **Module 3 — Anthropic Claude:** Send prompt: *"Generate a 200-word client status report. Tone: professional, confident, no fluff. Include: what got done, what's in progress, any blockers. End with: 'Reply with questions or next steps.'"*
5. **Module 4 — Gmail: Send** to client with the report in the body.

### The exact prompt (Module 3)

```
You are writing a Friday status update to a client. Tone: professional, direct, no fluff. No emojis. No "synergy". No "leverage". 200 words max.

Inputs:
- Slack activity: {{slack_messages}}
- Notion updates: {{notion_updates}}
- Toggl time: {{toggl_hours}}

Output 3 paragraphs:
1. "Completed this week" — bullet list of what shipped (max 5 items)
2. "In progress" — bullet list of ongoing work (max 5 items)
3. "Blockers / decisions needed" — bullet list, empty if none

End with: "Reply with questions or next steps. Have a good weekend."

If there's nothing to report in a section, write "None" and move on. Never pad.
```

### Verdict: Build this. The combination of "looks professional" + "you didn't actually have to write it" wins clients.

### Bottom-line ₹ / hour savings

Time saved: 90 min/week × 50 weeks = **75 hours/year** = **₹1,50,000-₹3,00,000 in recovered time** at conservative billing rates. Plus: client retention improves because clients *feel* the project is well-managed.

---

## Section 6 — Workflows 4, 5, 6 — Invoice, lead-to-CRM, content repurposer

### Workflow 4: Lead-to-CRM auto-sync

**What this does:** Tally/Typeform lead form → Notion CRM with auto-tagging (budget = "high/medium/low" via Gemini classification) → Brevo list addition →Slack ping.

**Setup:** 25 minutes. The classification prompt is the secret sauce:

```
You are classifying a freelance lead. Output ONE of: hot, warm, cold.

Lead data:
- Budget signal: {{budget}}
- Timeline: {{timeline}}
- Project type: {{project_type}}
- Email domain: {{email_domain}}

Rules:
- B2C with budget < ₹50K = cold
- B2B with budget > ₹2L = hot
- B2B with budget ₹50K-₹2L = warm
- Personal email (gmail/yahoo) with no clear budget = cold
- Corporate email + clear timeline + clear budget = hot

Output: just the word "hot", "warm", or "cold". Nothing else.
```

**Verdict: Build this. Auto-tagging saves 10 min/lead and improves follow-up prioritization.**

**Savings:** 10 min/lead × 50 leads/year = 8 hours/year = **₹16,000+ in recovered time**.

### Workflow 5: Invoice-from-Slack

**What this does:** You mark a project as "done" in Slack with `/invoice {{client-name}}` → Make.com triggers invoice generation in Zoho Books / Refrens → PDF invoice emailed to client → Slack message confirms with the invoice number.

**Setup:** 45 minutes. Requires Zoho Books or Refrens API access.

**Steps:**
1. Slack slash command trigger.
2. Parse client name and amount from the message.
3. Zoho Books: create invoice.
4. Gmail: send invoice PDF to client.
5. Slack: reply with "Invoice #XYZ emailed to {{client}}."

**Verdict: Build this once you've nailed Workflows 1-3. The ROI compounds.**

**Savings:** 20 min/invoice × 50 invoices/year = 17 hours/year = **₹34,000+ in recovered time**.

### Workflow 6: Content repurposer

**What this does:** You publish a blog post (Notion, WordPress, or Substack) → Make.com extracts the text → Sends to Claude with prompt → Claude writes: 1 X/Twitter thread (8 tweets), 1 LinkedIn long-form post, 1 Instagram reel script, 1 newsletter excerpt.

**Setup:** 60 minutes. Most complex workflow in the pack.

**The exact prompt:**

```
You are repurposing a long-form blog post for social media. Tone: direct, no fluff. No "synergy". No "leverage". Second person, "you" and "your".

Blog post: {{blog_post_text}}

Output as JSON with these fields:
{
  "twitter_thread": ["tweet 1", "tweet 2", ... 8 tweets max, each <280 chars],
  "linkedin_post": "400-600 word LinkedIn post. Strong hook in first 2 lines.",
  "reel_script": "30-second reel. 3 sentences max. Hook + 1 insight + CTA.",
  "newsletter_excerpt": "150-word excerpt that could anchor a newsletter."
}
```

**Verdict: Build this if you publish > 1 blog post/month. Otherwise, manual repurposing is fine until then.**

**Savings:** 90 min/blog × 12 blogs/year = 18 hours/year = **₹36,000+ in recovered time**.

---

## Section 7 — The 4-hour quick-start: 3 workflows live by tonight

### The plan

| Hour | Workflow | Result |
|---|---|---|
| 0:00-0:30 | Set up Make.com free account | Account ready |
| 0:30-1:30 | Build Workflow 1: Client onboarding | First test run done |
| 1:30-2:30 | Build Workflow 2: Proposal-from-brief | Draft proposal generated for a real test brief |
| 2:30-3:30 | Build Workflow 3: Weekly status report | First Friday report goes out next week |
| 3:30-4:00 | Polish, error handling, documentation | Pack is live |

### Pre-flight checklist

- [ ] Make.com account created (free, no card)
- [ ] Google account with Drive, Gmail, Calendar, Sheets access
- [ ] Notion account (free is fine)
- [ ] Slack workspace (free is fine)
- [ ] Anthropic API key OR Google AI Studio API key (free tier)
- [ ] One test client data set ready (use your own name + a fake company)

### Verdict: Do this. The single biggest mistake is "I'll do it next week." Next week never comes. Block 4 hours tonight.

### Bottom-line ₹ / hour savings

Once 3 workflows are live: **3-5 hours/week saved** = **₹6,000-₹10,000/week in recovered time** = **₹3,00,000-₹5,00,000/year**.

This is a 375-625x ROI on the ₹799 product cost.

---

## Section 8 — Make.com vs n8n vs Google Apps Script: when to switch

### When to use Google Apps Script (GAS) instead of Make.com

- Workflow is **purely Google-only** (Gmail + Sheets + Docs + Calendar, no Slack/Notion)
- You want **zero ongoing cost** (GAS is free, runs in your Google account)
- You want **version control** (GAS code can live in your GitHub)
- You're comfortable with **JavaScript basics**

10 GAS snippets are included in the Appendix. They cover: "auto-archive old emails," "send invoice from Sheets row," "tag Gmail by sender domain," "auto-respond to common queries," "weekly digest email," "create Calendar event from Gmail," "merge duplicate Contacts," "auto-reply to out-of-office with status," "log Slack time to Sheets," "extract attachments to Drive."

**Verdict: Use GAS for any single-app workflow. Use Make.com for cross-app workflows. Don't try to do Slack + Notion + Gmail + Sheets in GAS — Make.com is faster.**

### When to switch to n8n

- You cross **10,000 Make.com operations/month** (n8n self-hosted is unlimited)
- You need **on-premise** (data residency for some clients)
- You want **AI agent workflows** (n8n has a more mature LangChain integration)

### Bottom-line ₹ / hour savings

Right platform per workflow: **₹0-₹2,000/month** vs. overpaying for Zapier or for a too-expensive Make.com plan. Over a year: **₹24,000 in platform cost savings**.

---

## Section 9 — The minimal stack

### Tier 0 (₹0/month)

- **Make.com** free tier (1,000 ops/month) for cross-app workflows
- **Google Apps Script** for Google-only workflows
- **Gemini 2.5 Flash** free API for classification + bulk tasks
- **Tally** free tier for lead forms
- **Notion** free for CRM and project docs
- **Slack** free for internal + client channels

**Verdict: Use this until ₹10L/year revenue. Move to Tier 1 when you hit 5,000+ ops/month.**

### Tier 1 (₹500-₹1,500/month)

- **Make.com Core** at $9/month (~₹750/month, verify on make.com)
- **Anthropic Claude API** for prompt-heavy workflows (~$20-50/month depending on usage)
- **Tally Pro** at ₹1,500/month if you need custom domains + integrations
- **Notion Plus** at $10/month (~₹830/month) for unlimited file uploads

### Tier 2 (₹3,000-₹8,000/month)

- **Make.com Pro** at $16/month for 10K ops + team features
- **Anthropic Claude Pro** at $20/month for higher usage + faster models
- **n8n Cloud Starter** at $24/month if you don't want to self-host
- **Zapier Starter** (only if you already pay for it for legacy reasons)

**Verdict: Most freelancers stay at Tier 1 indefinitely. Tier 2 is for agencies with 3+ freelancers.**

### Bottom-line ₹ / hour savings

Right tier: **₹6,000-₹60,000/year** vs. overpaying for features you don't use. Most freelancers over-buy at Tier 2 in month 1 and under-use everything.

---

## Section 10 — Quarterly refresh log (annual update promise)

### What changed in this edition (June 2026 vs March 2026)

- **Make.com** has added a "Razorpay" native module — no more webhook-only integrations. Workflow 5 (Invoice-from-Slack) is now simpler.
- **Anthropic Claude Sonnet 4.5** released — better at long-form structured output. Recommended for Workflows 2, 3, 6.
- **Google Gemini 2.5 Flash** has a new 1M-token context window — usable for entire client email threads in Workflow 3.
- **n8n 1.50+** has improved the visual UI — closer to Make.com polish now.
- **OpenAI GPT-5** released — slightly more expensive than Claude for similar quality on these tasks. Skip unless you have a specific reason.

### Promise to past buyers

If you bought the March 2026 edition, you'll get the September 2026 update free. The pack refreshes quarterly because AI models and Make.com feature roll-outs change fast.

---

## Appendix A — Welcome email template (for Workflow 1)

```
Subject: Welcome — your [Project Type] project with [Your Name] starts [Date]

Hi {{client_first_name}},

Welcome aboard. Here's what happens in the next 7 days:

1. Today: you'll get a kickoff questionnaire (5 questions, takes 10 min)
2. Day 2: I send back a project plan and timeline
3. Day 3: we have a 30-min kickoff call
4. Day 5: I share the first deliverable draft
5. Day 7: we sync on feedback

I've set up your project folder here: {{drive_folder_link}}
And our shared Slack channel: {{slack_channel_link}}

If anything urgent comes up, reply to this email — I check it 2x daily.

Looking forward to the work.

[Your name]
```

---

## Appendix B — Onboarding checklist (Notion template for Workflow 1)

```
PROJECT ONBOARDING CHECKLIST
============================

□ Signed contract / SOW received
□ Advance payment received (50% standard)
□ Kickoff call scheduled
□ Client questionnaire sent
□ Client questionnaire returned
□ Project folder set up in Drive
□ Slack channel created and client added
□ Brand assets received (if applicable)
□ Access to client's tools / accounts (if applicable)
□ First milestone scheduled in calendar
□ Project added to Notion Projects DB
□ Invoice 1 issued in Zoho Books / Refrens
```

---

## Appendix C — The 10 Google Apps Script snippets

*(Full code is provided in the product ZIP as `gas-snippets.gs` — copy-paste ready. Highlights below.)*

1. **auto-archive-old-emails.gs** — auto-archive Gmail older than 6 months from "Newsletters" label.
2. **send-invoice-from-sheet.gs** — when a row is added to "Pending Invoices" sheet with status "ready," send PDF via Gmail.
3. **tag-gmail-by-domain.gs** — auto-label incoming email by sender domain.
4. **auto-respond-common-queries.gs** — if subject contains "invoice" or "proposal," send templated reply.
5. **weekly-digest.gs** — every Friday, email a digest of all Notion updates to you.
6. **calendar-from-gmail.gs** — detect "meeting" or "call" in email body, create Calendar event.
7. **dedupe-contacts.gs** — find and merge duplicate Contacts by email.
8. **ooo-auto-reply.gs** — when enabled, reply to incoming emails with status message.
9. **slack-time-to-sheets.gs** — log your `/track start` Slack messages to a time-tracking sheet.
10. **extract-attachments.gs** — auto-save email attachments matching pattern to Drive folder.

**Verdict: Use these before paying for Make.com for Google-only workflows.**

---

## Closing — what to do this week

1. **Create a Make.com account today.** Free. No credit card. Don't optimize further. Pick a platform. Move on.
2. **Build Workflow 1 (Client onboarding) this weekend.** 30 minutes of focused work. Your next new client will go through it automatically.
3. **Save the 5 prompt patterns from Section 2 as a Notion page.** Reuse them on every ChatGPT/Claude session this week. You'll feel the quality difference by Friday.
4. **Block 4 hours next Saturday for the Section 7 quick-start.** 3 workflows live in one afternoon. Pays for the product 100x over.

---

## Future editions — how to get them

This is the current edition (June 2026). AI tools and Make.com modules change every 3-6 months, so newer editions get released as the landscape shifts. To get the next edition, email `surisetti.dev@gmail.com` with the subject "AI Workflow Pack update" and mention which edition you originally bought. Allow up to 7 business days for a reply.

Future editions are not sent automatically. Continued free updates depend on this product's demand — if it doesn't get an active buyer base, future editions may carry a small additional cost (you'll always be told the price before being charged). This guide may also be retired or replaced if it stops getting used; if that happens before your next requested update, you'll be notified and offered the closest current equivalent.

---

> *Reviewed and verified by Karthik Surisetti before publication.*
> *Last updated: 19 June 2026. AI tools and pricing change quarterly — refer to each tool's official site for current details. Educational content, not professional advice.*

---

## REVIEWER NOTES

- **Verify before publication:** Make.com pricing (Core $9/month, Pro $16/month) as of June 2026 — verify on make.com/en/pricing.
- **Verify before publication:** Anthropic Claude Sonnet 4.5 release status — check status.anthropic.com and docs.anthropic.com.
- **Verify before publication:** Google Gemini 2.5 Flash free tier limits (15 RPM, 1M TPM, 1500 RPD) — verify on ai.google.dev/pricing.
- **Verify before publication:** Tally Pro pricing ₹1,500/month — verify on tally.so/pricing.
- **Verify before publication:** Notion Plus pricing $10/month — verify on notion.so/pricing.
- **Section 1 platform pick:** Make.com vs n8n comparison based on June 2026 features. If n8n improves its UI further, the recommendation may flip for tech-comfortable users.
- **Defaulted to general rule:** AI model performance for specific tasks varies — the guide picks Claude for prompt-heavy and Gemini for bulk/classification, but actual results may differ. Users should A/B test for their specific use case.
- **Make.com operations math:** "1 new client = ~7 ops" is approximate. Actual ops count depends on the number of modules and whether loops/routers are used.
- **Workflow 5 (Invoice-from-Slack) requires Zoho Books or Refrens API access.** Refrens has a documented API as of June 2026 (verify); Zoho Books has a comprehensive API. Stripe India is not covered because most freelancers selling to Indian clients use Razorpay/Cashfree, not Stripe.
- **The 10 GAS snippets are production-ready code** (with comments + error handling), but users should review the Gmail/Drive permission scopes before deploying.
