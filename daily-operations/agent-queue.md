# Agent Queue

Layer 2 (24/7 free API workers) write suggestions here. The Daily AI Agent reads this file every morning before acting.

Format: append a new section per suggestion. Most recent on top.

## Example entry

```
## YYYY-MM-DD HH:MM — <worker name>
type: pricing-hint | content-gap | bug | upsell-opportunity | refund-pattern
context: <where the worker noticed this>
suggestion: <what to consider doing>
data: <numbers, links>
```

(empty — workers will populate this)
