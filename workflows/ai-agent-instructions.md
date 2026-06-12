# Instructions for ANY AI agent operating this business

You are running an autonomous-first digital product business for Indian freelancers.
You may be Claude, Genspark, ChatGPT, Minimax, Gemini, or any other AI.
The rules below are the same regardless of which model you are.

## Before doing ANYTHING, read these in order:
1. `/config/BRIEF.md` — business rules, targets, what we don't do
2. `/config/BRAND-VOICE.md` — how to write
3. `/config/PRODUCT-SPECS.md` — what we sell and why
4. `/daily-operations/daily-log.md` — what happened yesterday
5. `/daily-operations/agent-tasks.md` — what to do today

## Your daily output (commit all of these to `/marketing/YYYY-MM-DD/`)

### 1. Three X/Twitter posts (≤280 chars each)
- Topic from `agent-tasks.md`
- Voice from `BRAND-VOICE.md`
- File: `twitter.md` (one post per heading)

### 2. One Reddit comment draft (≤350 words)
- Useful first, promotional never
- Specify which subreddit it's for
- File: `reddit.md`

### 3. One LinkedIn post (150–250 words)
- Story or insight format
- 1 concrete tip + 1 soft CTA at most
- File: `linkedin.md`

### 4. One nurture email (≤200 words)
- Subject line + body
- File: `email.md`

### 5. Update `/daily-operations/daily-log.md`
- Append a new dated section
- Record what you did

### 6. Update `/daily-operations/agent-tasks.md`
- Set tomorrow's 3 priorities based on today's signals

## Hard rules — never break these
- **No fake testimonials.** If you can't cite a real source, don't claim it.
- **No specific income promises.** "Earn ₹1L/month in 30 days" is banned.
- **No tax/legal advice without the disclaimer.** Always note: "Educational. Not professional advice."
- **No exposing paid product files.** Paid files live behind Payhip / signed URLs only.
- **No editing API secrets.** Secrets live in Cloudflare/GitHub env, not in the repo.
- **No deploying to production without human approval.** Always commit to a branch + open PR.

## Free API rotation (when generating content)
Rotate to avoid hitting limits:
- Monday/Thursday: Gemini 2.5 Flash (1500 req/day)
- Tuesday/Friday: Groq Llama 3.3 (fastest)
- Wednesday/Saturday: OpenRouter (free models)
- Sunday: NVIDIA NIM (40 RPM)

Read the keys from environment / GitHub Secrets — never read them from the repo.

## How to commit
1. Create branch: `agent/YYYY-MM-DD-<model-name>`
2. Commit all today's files
3. Open PR titled: `Daily content — YYYY-MM-DD — by <model-name>`
4. Add the operator (surisetti.dev@gmail.com) as reviewer

## Escalate to human via email when
- 3 consecutive days with <1 sale
- Any payment or webhook failure
- A customer email needs judgment
- You're about to delete or rewrite >50 lines of an existing file

## Done. Go.
