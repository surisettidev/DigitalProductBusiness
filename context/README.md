# `/context/` — Shared Memory for Every AI Session

This folder is the **single source of truth** for AI context across:
- 🧠 **Claude chat sessions** (long-form thinking, design, debugging)
- 🤖 **Daily AI Agent** (morning autonomous check-in)
- ⚙️ **Layer-2 mini workers** (Groq chat, Gemini lead-scoring, OpenRouter fallback)

**Why this exists:** chat history dies when a session ends. Tokens get expensive when you re-paste history. This folder fixes both — every agent reads + writes here, so the next agent picks up exactly where the last one stopped, with zero token spend on summarization.

---

## The Three Files (and the Rule)

| File | Owner | Purpose | Append-only? |
|------|-------|---------|--------------|
| `claude-sessions.jsonl` | Claude long chats | Raw turn-by-turn dumps from each Claude session (no summarization) | ✅ Yes |
| `daily-agent-log.jsonl` | Daily AI Agent (Claude/Genspark at 6 AM IST) | One JSON line per daily run — metrics seen, decisions taken, PRs opened | ✅ Yes |
| `worker-events.jsonl` | Layer-2 workers (Groq / Gemini / OpenRouter / NIM) | One JSON line per worker event — chat reply, lead score, fallback trigger | ✅ Yes |

> **THE RULE:** Every file is `jsonl` (one JSON object per line). **Never edit past lines. Only append.** This makes the files git-mergeable across concurrent agents, and lets any future agent `tail -n 200` to get recent context without reading the whole history.

---

## How each agent uses it

### 1. Claude long-chat sessions (this is the one you, the human owner, use daily)

**At start of every new chat**, paste the universal resume prompt from `/.github/prompts/claude-resume-prompt.md`. That prompt tells Claude to:
1. Fetch the latest ~30 lines of `claude-sessions.jsonl` via the GitHub API
2. Fetch the latest ~10 lines of `daily-agent-log.jsonl` and `worker-events.jsonl`
3. Treat them as the full memory of "what happened before this chat"
4. Continue work without re-summarizing

**At end of every chat (or every ~20 turns)**, Claude appends its own session as new JSONL lines using the format in `SCHEMA.md`. It does this by committing directly to `main` (this is non-sensitive content per the Operating Contract).

### 2. Daily AI Agent

Defined in `/.github/prompts/daily-agent-prompt.md` (v3.0). After completing its morning routine, it appends **one line** to `daily-agent-log.jsonl` with:
- yesterday's revenue/sessions/sales/leads
- the single leak identified
- the action taken (PR link)
- approval requests raised

### 3. Layer-2 workers (the always-on mini models)

Cloudflare Pages Functions like `functions/api/groq-chat.js`, `functions/api/gemini-lead-score.js`, `functions/api/llm-fallback.js` already log events to `daily-operations/ledger.json`. They additionally POST a one-line summary to `/api/log-event` which appends to `worker-events.jsonl`. This means when Claude resumes tomorrow, it can see what real visitors asked, what scores were assigned, and which fallbacks fired — without you having to summarize anything.

---

## File size management

JSONL files grow forever, but that's fine — we only ever **tail** them, never read the whole thing.

- When any file exceeds **5 MB**, the Daily Agent automatically rotates it: rename to `claude-sessions.2026-Q2.jsonl` and start a fresh empty file. The old archives stay in git history but aren't fetched by resume prompts.

---

## Hard rules for any AI writing to this folder

1. **Append-only.** Never edit or delete past lines. Conflicts auto-resolve because diffs are pure additions.
2. **One JSON object per line.** No multiline JSON. No comments. Validate before commit.
3. **Never put secrets in here.** No PATs, no API keys, no customer emails in plaintext. Hash or redact.
4. **Use ISO 8601 UTC timestamps.** Format: `2026-06-18T07:30:00Z`.
5. **Commit message format:** `context: append {file} (session={session_id_short})`.
6. **Commit directly to `main`** — this folder is exempt from the PR-required rule because it's pure log data. Branch protection should whitelist it.

Schema details + examples → `SCHEMA.md` in this same folder.
