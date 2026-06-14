# Email drafts (AI-generated, human-sent)

Per `/config/AI-DISCLOSURE-POLICY.md` Tier 3, AI never sends customer email directly. The Daily Agent saves drafts here. The owner opens, edits if needed, and sends from Gmail or Brevo manually.

## Folder structure

```
/marketing/email-drafts/
├── YYYY-MM-DD-welcome-newsubscriber.md
├── YYYY-MM-DD-followup-day3.md
├── YYYY-MM-DD-refund-acknowledgement.md
└── ...
```

## Draft format

Each draft is a single .md file with YAML front-matter:

```
---
to: surisetti.dev@gmail.com
subject: <line>
intent: welcome | nurture | upsell | refund-ack | reply
status: draft           # draft | sent | discarded
sent_at:                # owner fills this in
---

(email body in plain text or markdown)
```

(empty)
