# AI Disclosure Policy — Freelancer OS

**Effective:** 14 June 2026
**Owner:** Suresh Surisetti

Customers paying ₹500–₹4,000 for educational content want to know a human checked the work. Pure-AI content gets refund-shamed publicly. This policy draws the line.

## The Three Tiers

### Tier 1 — Marketing copy
**Examples:** homepage hero, product page descriptions, FAQ answers, social posts, ad copy, landing page variants.

| | |
|---|---|
| AI allowed for first draft? | **Yes** |
| Disclosure required? | **No** |
| Human review before publish? | **Yes — owner skims** |

**Rationale:** Marketing copy is judged by whether it converts, not by who wrote it. No reader expects to know the byline of an FAQ.

---

### Tier 2 — Educational / paid product content
**Examples:** Tax Guide PDF, Tool Stack guide, Client Negotiation Vault, AI Workflow Pack, Portfolio + Proposal OS, any blog post making factual or how-to claims.

| | |
|---|---|
| AI allowed for first draft? | **Yes** |
| Disclosure required? | **Yes — mandatory** |
| Human review before publish? | **Yes — mandatory, page-by-page** |

**Required disclosure** (footer of every PDF and last block of every blog post):

> *Reviewed and verified by Suresh Surisetti before publication.*
> *Last updated: [DATE]. Tax/legal/financial information is educational and not professional advice. Consult a qualified CA for personal tax decisions.*

**Why this matters most for the Tax Guide:** if a customer follows wrong info and is fined, "I trusted an AI guide" is a liability vector. The disclosure + human review chain protects you legally.

---

### Tier 3 — Customer-facing email / support
**Examples:** reply to refund request, reply to "where is my download," reply to pre-sales question.

| | |
|---|---|
| AI allowed to write final draft? | **No** |
| AI allowed to suggest a draft? | **Yes, in `/marketing/email-drafts/` only** |
| Human sends? | **Yes — always owner** |

**Rationale:** customer support is the single highest-leverage trust signal at this scale. A bot reply destroys trust faster than a 24h delay.

---

## Enforcement

- The Daily AI Agent must never bypass these tiers. If unsure, **default to the stricter tier**.
- Disclosure text is fixed; do not paraphrase.
- "Reviewed by Suresh Surisetti" requires the owner to actually read the document before merging the PR. Skipping review = removing the line.
- If a Tier 2 product is rebuilt/refreshed, the disclosure date updates too.

## Tier overrides

The owner can mark a specific file as Tier 1 even if it looks Tier 2 (e.g. a satirical post). That decision is logged in the file's front-matter:

```yaml
---
ai-tier: 1
override-reason: "satirical content, not factual claims"
override-date: 2026-06-14
---
```

Without an explicit override, default classification applies.
