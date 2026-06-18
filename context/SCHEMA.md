# JSONL Schemas for `/context/`

Every line in every file MUST validate against one of the schemas below. If your line doesn't validate, don't commit it.

---

## 1. `claude-sessions.jsonl`

**Owner:** Claude (long chats — Claude.ai web, Claude Desktop, Claude Code, etc.)
**Append cadence:** every ~20 turns, or at end of session, or when user says "checkpoint".

### Schema

```json
{
  "type": "claude_turn",
  "session_id": "9103fe11-2a09-40b9-8f59-fac57f95659c",
  "session_title": "Exposed GitHub PAT security warning",
  "turn_index": 12,
  "role": "user" | "assistant",
  "ts": "2026-06-18T07:30:00Z",
  "model": "claude-sonnet-4.5" | "claude-opus-4" | "claude-haiku-4" | "unknown",
  "text": "...verbatim message content...",
  "tool_calls": [
    { "tool": "github_api", "summary": "read .github/prompts/daily-agent-prompt.md" }
  ],
  "files_touched": ["functions/api/waitlist.js"],
  "tokens_estimate": 1240
}
```

### Rules
- `text` is the **verbatim** message, NOT a summary. If too long, split across multiple turns with the same `turn_index` and add `"chunk": 1`, `"chunk": 2`, etc.
- `tool_calls` and `files_touched` are optional but recommended — they let the resume agent skip diffing.
- Redact any secret values inside `text` before committing. Use `[REDACTED:pat]`, `[REDACTED:key]`.

### Special "session boundary" line (write once per session at the very end)

```json
{
  "type": "session_end",
  "session_id": "9103fe11-2a09-40b9-8f59-fac57f95659c",
  "session_title": "Exposed GitHub PAT security warning",
  "ended_at": "2026-06-18T07:28:17Z",
  "turn_count": 47,
  "outcome_summary": "Built waitlist UI on 5 product pages, added live GA4/Razorpay to admin, identified domain + email as the last 2 blockers.",
  "next_step": "Finish enhanced-style.css + enhanced-animations.js, then fix env vars in Cloudflare.",
  "open_questions": ["Buy freelanceros.in this week?", "Switch Brevo to SMTP v3 key?"]
}
```

This is the **ONLY** place summarization is allowed, and it's tiny (≤500 chars). The resume prompt reads these `session_end` lines first to get the "story so far" cheaply.

---

## 2. `daily-agent-log.jsonl`

**Owner:** Daily AI Agent (v3.0 prompt at `.github/prompts/daily-agent-prompt.md`).
**Append cadence:** exactly once per day at end of morning run.

### Schema

```json
{
  "type": "daily_agent_run",
  "date": "2026-06-18",
  "ts": "2026-06-18T00:30:00Z",
  "model_used": "claude-sonnet-4.5" | "genspark" | "gemini-2.5-pro" | "groq-llama-3.3",
  "metrics": {
    "revenue_inr": 0,
    "revenue_delta_pct": null,
    "sessions": 12,
    "leads": 3,
    "sales": 0,
    "refunds": 0,
    "conversion_pct": 0.0
  },
  "data_sources_used": ["ga4", "clarity", "razorpay", "brevo", "ledger.json"],
  "data_sources_missing": [],
  "biggest_leak": "Product page CTR is 18% but checkout-start is 0% — pricing visible only after click.",
  "action_taken": {
    "type": "social_post" | "product_edit" | "email_draft" | "ad_brief" | "issue",
    "pr_url": "https://github.com/surisettidev/DigitalProductBusiness/pull/12",
    "summary": "Drafted 3 X posts + 1 LI post on freelancer tax filing season"
  },
  "approval_requests": [
    {
      "category": "pricing",
      "target": "AI for Freelancers Guide",
      "current": "₹699",
      "proposed": "₹499",
      "reasoning": "0 sales in 7 days, 5 chat objections to price",
      "issue_url": "https://github.com/surisettidev/DigitalProductBusiness/issues/22"
    }
  ],
  "blockers": [],
  "tomorrow_focus": ["Tax guide outline", "Razorpay live mode test", "Reply to LI comments"]
}
```

---

## 3. `worker-events.jsonl`

**Owner:** Cloudflare Pages Functions (`groq-chat.js`, `gemini-lead-score.js`, `llm-fallback.js`, `log-event.js`).
**Append cadence:** one line per worker event, batched if needed.

### Schema

```json
{
  "type": "worker_event",
  "ts": "2026-06-18T11:42:09Z",
  "worker": "groq-chat" | "gemini-lead-score" | "openrouter-fallback" | "nim-inference",
  "event": "visitor_question" | "lead_scored" | "fallback_triggered" | "rate_limit_hit",
  "session_hash": "a3f7c2",
  "payload": {
    "question": "Is the Tax Guide updated for FY 2025-26?",
    "page": "/products/indian-tax-guide",
    "device": "mobile"
  },
  "result": {
    "answer_summary": "Yes — confirmed it covers 44ADA + ₹75k deduction.",
    "tokens_in": 220,
    "tokens_out": 95,
    "latency_ms": 480
  },
  "cost_inr": 0
}
```

### Rules
- `session_hash` is a short hash of the visitor's session cookie — never the raw value.
- `question` and `answer_summary` may be truncated to 300 chars; full text stays in `ledger.json` if needed.
- Never log payment data, email addresses, or anything PII here.

---

## Validating before commit

Any agent writing here MUST run this check before the commit (pseudocode):

```js
for (const line of newLines) {
  const obj = JSON.parse(line);              // must parse
  assert(obj.type && obj.ts);                // must have type + ts
  assert(/^\d{4}-\d{2}-\d{2}T/.test(obj.ts)); // ISO timestamp
  assert(!/github_pat_|ghp_|xkeysib-|sk-/.test(line)); // no secret prefixes
}
```

If any line fails, do not commit — open a `needs-approval` issue instead.
