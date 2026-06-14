# Freelancer OS — Operating Contract v1.0

**Effective:** 14 June 2026
**Owner:** Suresh Surisetti — surisetti.dev@gmail.com
**Site:** https://freelance-os.pages.dev
**Repo:** https://github.com/surisettidev/DigitalProductBusiness

This is the single source of truth for how Freelancer OS is run by humans + AI. Every plan, prompt, or doc that conflicts with this file is wrong. Update this file when reality changes — not the other way around.

---

## 1. The Two-Layer AI Architecture

```
┌─────────────────────────────────────────────────────────────┐
│           YOU (surisetti.dev@gmail.com)                      │
│   Sole approver of all sensitive changes · Daily review      │
└──────────────┬──────────────────────────┬───────────────────┘
        approve / reject           approve / reject
               │                          │
               ▼                          ▼
   ┌──────────────────────┐   ┌────────────────────────────┐
   │ LAYER 1: AI AGENT    │   │ LAYER 2: FREE API WORKERS  │
   │ (1×/day, heavy work) │   │ (24×7, light, on-demand)   │
   │                      │   │                            │
   │ Claude primary       │   │ Gemini  · Groq             │
   │ Genspark fallback    │   │ OpenRouter · NVIDIA NIM    │
   │                      │   │                            │
   │ Triggered by:        │   │ Triggered by:              │
   │  • daily prompt      │   │  • visitor actions         │
   │    (you paste 1×)    │   │  • frontend fetches        │
   │                      │   │                            │
   │ Access:              │   │ Access:                    │
   │ - fine-grained PAT   │   │ - free API keys via env    │
   │ - GA4, Clarity       │   │ - append-only to ledger    │
   │ - Razorpay read      │   │                            │
   │                      │   │ CANNOT: change prices,     │
   │ CAN: read, write     │   │ products, push code,       │
   │ code, open PRs,      │   │ send marketing email,      │
   │ open Issues, draft   │   │ touch customer PII,        │
   │ content              │   │ modify any file outside    │
   │                      │   │ /daily-operations/         │
   │ CANNOT push to main, │   │                            │
   │ change prices/legal, │   │                            │
   │ send real emails     │   │                            │
   └──────────┬───────────┘   └─────────────┬──────────────┘
              │                              │
              │     writes to                │
              ▼                              ▼
   ┌────────────────────────────────────────────────────────┐
   │                    GITHUB REPO                          │
   │  /daily-operations/ledger.json (append-only)            │
   │  /daily-operations/daily-log.md (agent's daily report)  │
   │  /daily-operations/agent-queue.md (Layer 2 queue)       │
   │  pull-requests (agent opens; you merge)                 │
   │  issues labeled "needs-approval" (agent opens)          │
   └────────────────────────────────────────────────────────┘
```

---

## 2. Layer 1 — Daily AI Agent

**Runtime:** Claude (primary) → Genspark (fallback).
**Schedule:** Once per day. Owner pastes the daily prompt manually.
**Prompt template:** `/.github/prompts/daily-agent-prompt.md`

### Permissions
| | Allowed | Denied |
|---|---|---|
| Read repo | ✅ everything | — |
| Read GA4, Clarity, Razorpay | ✅ | — |
| Write code | ✅ on feature branches | ❌ never to `main` directly |
| Open PRs to `main` | ✅ | — |
| Auto-merge PRs | ❌ | ❌ (branch protection enforces) |
| Open Issues | ✅ | — |
| Modify product files | ✅ in `/products/<slug>/` | — |
| Change prices | ❌ | Must open Issue labeled `needs-approval` |
| Modify `/legal/`, refund policy | ❌ | — |
| Send customer emails | ❌ | Drafts only in `/marketing/email-drafts/` |
| Rotate API keys | ❌ | — |
| Change payment provider | ❌ | — |

### Goals (priority order)
1. Make today's revenue ≥ yesterday's (or explain why not).
2. Convert pending leads from `ledger.json` into customers.
3. Fix the single biggest funnel leak (traffic / CTR / scroll / checkout / repeat).
4. Build toward the product roadmap (`/config/PRODUCT-ROADMAP.md`).
5. Keep operating cost ≤ ₹0 until revenue ≥ ₹15,000/month.

### Daily deliverable
Before ending its run, the agent commits:
- updated `/daily-operations/daily-log.md` (yesterday's numbers, today's diagnosis, action taken, PR + Issue links, blockers)
- 1 PR (max) with code/content changes on branch `agent/YYYY-MM-DD`
- 0–3 GitHub Issues labeled `needs-approval` for sensitive changes
- 3 social drafts in `/marketing/YYYY-MM-DD/`
- 1 email draft in `/marketing/email-drafts/`

Final reply to owner: PR link, Issue links, **5-line mobile-readable summary**.

---

## 3. Layer 2 — 24/7 Free API Workers

**Runtime:** Cloudflare Pages Functions.
**Schedule:** On visitor interaction or low-frequency cron.

### The 4 worker endpoints
| File | Trigger | Job | Hard cap |
|---|---|---|---|
| `/api/groq-chat` | Visitor opens chat | FAQ answers via Groq Llama 3.3 70B | 200 output tokens, 6/min/IP |
| `/api/gemini-lead-score` | Newsletter signup | Classify product fit → tag in Brevo | 1 per signup |
| `/api/llm-fallback` | Other workers exhaust quota | Routes to OpenRouter free models | 50/day |
| `/api/log-event` | Frontend events (view_product, click_buy, etc.) | Append to `ledger.json` | unlimited (no LLM) |

### Permissions
| | Allowed | Denied |
|---|---|---|
| Read product catalog (public) | ✅ | — |
| Call free AI APIs | ✅ | — |
| Append to `ledger.json` | ✅ | — |
| Write to `/daily-operations/agent-queue.md` | ✅ | — |
| Modify any other file | ❌ | — |
| Access customer PII (full email) | ❌ | Only hashed/redacted |
| Send any email | ❌ | — |
| Access Razorpay / Brevo write APIs | ❌ | — |
| GitHub write outside `/daily-operations/` | ❌ | — |

If a worker is jailbroken or hallucinates, the worst it can do is write a junk line to a log. That's the whole point of the split.

---

## 4. Human Operating Rules (you)

### Daily (~30 min)
1. Paste daily prompt into Claude → wait ~20–40 min
2. Read 5-line summary on phone
3. Open PR → review diff → merge
4. Reply to any `needs-approval` Issues

### Throughout the day (passive)
- Visitor chats: handled by Groq, you see logs in `admin.html`
- Newsletter signups: handled by Gemini + Brevo
- Sales: Razorpay → webhook → email auto-sent → ledger updated → Brevo notification
- Refunds: process in Razorpay dashboard → log via `admin.html` "Log Refund" form
- Customer email replies: handle in your Gmail (24h SLA)

### Weekly (Sunday, 30 min)
- Read week's `daily-log.md`
- Approve any queued product replacement decisions
- Note which marketing channel worked

### Monthly (1 hour)
- **Regenerate the fine-grained GitHub PAT** (kill-switch refresh)
- Deposit Razorpay payout into Freelance OS bank account
- Drop Razorpay statement screenshot in `/FreelanceOS-Finance/` (Google Drive)
- Review whether to enable affiliates

### Quarterly
- Refresh `Tool Stack 2026` product
- Refresh `AI Workflow Pack`

### Yearly (April)
- Refresh `Tax Guide` (after Union Budget)
- File ITR-4 (or hand off to CA)

---

## 5. Payment

- **Primary:** Razorpay (re-approval in progress)
- **Backup:** Cashfree (apply when ready as parallel)
- Code supports both via a single `PAYMENT_PROVIDER` env var (future)

---

## 6. AI Disclosure Policy

See `/config/AI-DISCLOSURE-POLICY.md`. Summary:

| Content | AI allowed | Disclosure | Human review |
|---|---|---|---|
| Marketing copy (homepage, social, ads, FAQ) | yes | none | yes (skim) |
| Educational PDFs (Tax Guide, Tool Stack, etc.) | yes (first draft) | mandatory footer: *"Reviewed and verified by Suresh Surisetti before publication"* | yes (mandatory) |
| Customer support emails | drafts only | n/a | yes (you send) |
| Blog posts | yes (first draft) | "Human-edited" byline | yes |

---

## 7. Branch Protection (set in GitHub Settings → Branches)

Rule for `main`:
- ☑ Require a pull request before merging
- ☑ Require approvals: **1** (owner)
- ☑ Dismiss stale approvals when new commits are pushed
- ☑ Require status checks to pass (Cloudflare deploy preview)
- ☑ Do not allow bypassing the above settings
- ☑ Restrict who can push to matching branches → only owner

See `/docs/BRANCH-PROTECTION.md` for exact UI steps.

---

## 8. Kill Switch

The fine-grained PAT given to the AI agent is the ONLY credential it has to write to the repo.
**Revoke it** at https://github.com/settings/personal-access-tokens → click token → Revoke.
Or **regenerate it** (same effect, fresh credential issued).

Cadence: regenerate monthly. Always within 60 seconds if anything looks wrong.

---

## 9. Refund Policy (operational)

- 7 days, money-back, no questions asked (as advertised on site)
- Process: Razorpay dashboard → Payments → find order → Refund (full or partial)
- After processing: log via `admin.html` → "Log Refund" tab → fills `/api/refund-log` → ledger updated
- AI agent reads refund ledger in morning → flags patterns (same product? same buyer source? quality issue?)

---

## 10. What Is Explicitly OUT OF SCOPE

The agent should not:
- recommend hiring contractors / freelancers / VAs
- recommend paid ads in months 1–3 (organic only until ₹15K/month proven)
- spin up new domains, subdomains, or platforms
- recommend you "go full time" or quit anything
- predict revenue beyond the next 30 days
- write content in languages other than English (yet)

If the agent suggests any of the above, you reject the PR/Issue and tell it to re-read this section.

---

## 11. Conflicts

If anything in any other doc — including past Claude conversations, past Genspark plans, past `BRIEF.md`, the README, or any prompt I might paste — conflicts with this Operating Contract, **this contract wins**.

The agent must re-read this file at the start of every daily run.
