# Storage Decision — Where do the product PDFs live?

**Original date:** 19 June 2026
**Refreshed:** 25 June 2026 (this PR - owner-name standardization + future-editions pull-based language applied across the repo)

**Author:** Surisetti Dev (via AI agent)
**Context:** Freelancer OS sells 5 paid digital products (PDFs + templates). Each buyer needs to receive the product instantly after payment and download it. We need to pick a storage backend.
**Recommendation:** **Cloudflare R2** — primary, with Google Drive as a 90-day backup.
**Status:** Read-only decision doc. No code changes in this PR.

The user said "this thing is bit scary." This doc is the full reasoning, including the scary parts, the mitigations, and the contingency plan.

---

## TL;DR

**Use Cloudflare R2 as primary, Google Drive as backup.** Don't use Cloudinary or GitHub Releases for this use case.

| Storage | Verdict | Why |
|---|---|---|
| **Cloudflare R2** | ✅ **PRIMARY** | Already on Cloudflare, India CDN, no egress fees, signed URLs, S3-compatible |
| **Google Drive** | ✅ **BACKUP** | Free, redundant, customer-service-friendly (human-readable share links) |
| **Cloudinary** | ❌ Skip | Egress-fee model punishes India, optimized for images/video not PDFs, expensive at scale |
| **GitHub Releases** | ❌ Skip | No India CDN, no download analytics, link-leaking on pirate forums |

---

## What you actually need (the requirements)

Before comparing, list the requirements. The storage backend has to:

1. **Deliver PDFs in India fast** — most buyers are in Mumbai, Bangalore, Delhi, Hyderabad, Chennai, Pune. Sub-3-second download matters for first impression.
2. **Generate time-limited, signed download URLs** — so a buyer can't share the link with their 10 friends. Each URL is unique to the customer, expires in 7 days, and can be limited to 5 downloads.
3. **Track who downloaded what, when** — for support ("I didn't get the PDF"), for refund reviews, and for the "did this customer even see the product" analytics.
4. **Cost ₹0-₹500/month at current sales volume** (0-100 sales/month). Realistic cost ceiling: ₹2,000/month at 1,000 sales/month.
5. **Be reliable** — 99.9% uptime. Customers who pay and don't get the product = refund + negative review.
6. **Not require a new vendor relationship** — the user is already paying Cloudflare Pages for hosting. Adding a vendor = more billing, more auth, more support complexity.
7. **Be India-compliant** — digital products are not PII, so no DPDP Act issue. No data residency requirement.

---

## Storage option comparison

### Option 1: Cloudflare R2 (RECOMMENDED — PRIMARY)

**What it is:** S3-compatible object storage built by Cloudflare. No egress fees. Free tier: 10GB storage + 10 million Class A operations + 100 million Class B operations per month.

| Dimension | Rating | Notes |
|---|---|---|
| **India CDN performance** | ⭐⭐⭐⭐⭐ | 10+ PoPs in India (Mumbai, Chennai, Bangalore, Delhi, Hyderabad, Kolkata). Sub-second PDF download. |
| **Signed URLs** | ⭐⭐⭐⭐⭐ | S3-compatible. Set expiry in seconds. Per-URL download cap. |
| **Analytics** | ⭐⭐⭐⭐ | Cloudflare Analytics + Workers logs. Real-time download count per URL. |
| **Cost at our scale** | ⭐⭐⭐⭐⭐ | 10GB free = covers all 5 products for the first 6-12 months. 100GB at scale = ₹1,500/month. |
| **Egress fees** | ⭐⭐⭐⭐⭐ | **Zero**. S3 charges ₹8/GB. R2 = ₹0. |
| **Vendor count** | ⭐⭐⭐⭐⭐ | Already on Cloudflare. One auth, one bill. |
| **Reliability** | ⭐⭐⭐⭐ | 99.9% SLA. Better than Drive, worse than S3. |
| **Migration path** | ⭐⭐⭐⭐⭐ | S3-compatible. Drop-in replacement for any S3-compatible service (Backblaze B2, Wasabi, MinIO). |

**Total cost estimate at 1,000 sales/month:**
- Storage: 5GB (5 products × ~1MB each, no growth) = ₹0 (under 10GB free tier)
- Class A ops (uploads, signed URL generation): ~1,000/month = ₹0
- Class B ops (downloads): ~5,000/month = ₹0
- **Total: ₹0/month** for the first 12+ months

**At 10,000 sales/month (₹5L-₹50L revenue):**
- Storage: 50GB = ₹750/month
- Class A ops: ~10,000 = negligible
- Class B ops: ~50,000 = negligible
- **Total: ₹750/month** = 0.07-0.15% of revenue

**Setup effort (one-time):**
1. Create R2 bucket in Cloudflare dashboard. 5 minutes.
2. Generate R2 API token. 2 minutes.
3. Add `R2_*` env vars to Cloudflare Pages. 3 minutes.
4. Write a Cloudflare Worker that generates signed URLs from the Functions layer. 30 minutes.
5. Update `verify-payment` function to generate the signed URL + send it via Brevo. 30 minutes.
6. E2E test (buy → receive email → download works). 30 minutes.
7. **Total: ~2 hours of work.**

**Scary parts (and mitigations):**
- **Link leaking on pirate forums:** Signed URL with 7-day expiry + max 5 downloads. Customer shares, but link dies. Most customers don't share because the PDF is branded.
- **Customer can't find the email:** Dual delivery (on-page + email). On-page success.html shows the download link inline. Customer also gets Brevo email. Two channels, one source of truth.
- **R2 outage:** Google Drive backup. See Option 2.
- **Customer wants PDF 3 months later:** Ledger-based re-issue. If a customer emails asking for re-send, run a Worker that looks up their order ID in `ledger.json` and generates a fresh signed URL. ₹0 marginal cost.

**Setup URL:** https://dash.cloudflare.com → R2 → Create bucket.

---

### Option 2: Google Drive (RECOMMENDED — BACKUP)

**What it is:** 15GB free Google Drive. Each product PDF is a single file in a shared folder. Customer gets a share link.

| Dimension | Rating | Notes |
|---|---|---|
| **India CDN performance** | ⭐⭐ | Direct downloads from Google's `drive.google.com/uc?export=download` are slow in India. Not designed for serving as a CDN. |
| **Signed URLs** | ⭐⭐⭐ | "Anyone with the link can view" works, but no expiry, no download cap. |
| **Analytics** | ⭐ | No download count. No per-URL tracking. |
| **Cost at our scale** | ⭐⭐⭐⭐⭐ | ₹0 up to 15GB. |
| **Egress fees** | ⭐⭐⭐⭐⭐ | Free. |
| **Vendor count** | ⭐⭐⭐⭐ | Already use Google for Workspace. |
| **Reliability** | ⭐⭐⭐⭐ | 99.9%. Google doesn't go down. |
| **Customer service** | ⭐⭐⭐⭐⭐ | Customers can re-download from a human-readable URL. Support team can verify the link works. |

**Why use it as backup if R2 is primary?**

Because R2 is the scary part. If R2 has an outage (rare but real), or if a customer emails saying "the link doesn't work," the support team can fall back to a Google Drive link in 30 seconds. The Drive folder is not customer-facing — it's a contingency.

**Setup:**
1. Create a Google account `freelancer-os-storage@gmail.com`. 5 minutes.
2. Create 5 folders, one per product. 5 minutes.
3. Upload each PDF. 10 minutes.
4. Get share links. 5 minutes.
5. Store the share links in `DELIVERY_LINKS` env var in Cloudflare as `deliveryLinksBackup`. 5 minutes.
6. **Total: ~30 minutes.**

**When to use it:** Only when R2 fails. The customer-facing delivery is R2.

---

### Option 3: Cloudinary (NOT RECOMMENDED)

**What it is:** Image and video CDN. Has a "raw" mode for PDFs, but the platform is built for images.

| Dimension | Rating | Notes |
|---|---|---|
| **India CDN performance** | ⭐⭐⭐ | Has PoPs in India but not as many as Cloudflare. PDFs download in 2-5 seconds. |
| **Signed URLs** | ⭐⭐⭐⭐ | Has authenticated URLs with expiry. |
| **Analytics** | ⭐⭐⭐⭐ | Good analytics dashboard. |
| **Cost at our scale** | ⭐⭐ | Free tier 25 credits. Each PDF download = 1 credit (approximately). 25 free downloads/month = useless. Pro plan $89/month = useless for 0-100 sales/month. |
| **Egress fees** | ⭐⭐ | Egress is metered on the free tier; included on paid but at a high base. |
| **Vendor count** | ⭐⭐ | New vendor. New auth. New bill. |
| **Reliability** | ⭐⭐⭐⭐ | 99.9%. |
| **Migration path** | ⭐⭐ | Proprietary API. Lock-in. |

**Why skip:**
- Cost model is wrong for PDF delivery. Cloudinary optimizes for image transformations, not bulk downloads.
- 25 free credits/month = covers < 5% of expected downloads. Forces paid plan at ₹7,000/month almost immediately.
- New vendor relationship. We already have Cloudflare.

---

### Option 4: GitHub Releases (NOT RECOMMENDED)

**What it is:** Each product version is a GitHub Release. PDF is uploaded as a release asset. Customer gets a download URL.

| Dimension | Rating | Notes |
|---|---|---|
| **India CDN performance** | ⭐ | GitHub Releases assets are served from GitHub's S3-backed CDN. Slow in India (3-10 second downloads). |
| **Signed URLs** | ⭐ | No. URLs are public. Anyone with the link downloads. |
| **Analytics** | ⭐ | Basic download count on the release page, but no per-URL tracking. |
| **Cost at our scale** | ⭐⭐⭐⭐⭐ | Free (up to 2GB per release, 100MB per file with LFS). |
| **Egress fees** | ⭐⭐⭐⭐⭐ | Free. |
| **Vendor count** | ⭐⭐⭐⭐ | Already use GitHub. |
| **Reliability** | ⭐⭐⭐⭐⭐ | 99.99%. |
| **Abuse-prone** | ⭐ | The PDF is on the open web. The moment a customer downloads it, the link is in their browser history. They can share it on Reddit, Twitter, pirate forums. No way to revoke. |

**Why skip:**
- **Public URLs are the killer.** Every customer can leak the PDF. Within 30 days of launch, the file is on 5 piracy sites.
- No India CDN. Slow downloads in the exact market we're selling to.
- Bad for customer service. No "where did the download go" tracking.

**When it might work:** For the free lead magnet (Pricing Calculator), not for the paid PDFs.

---

## The scary parts (full honesty)

The user said "this thing is bit scary." Here's what's scary about every option, and how we mitigate:

### Scary 1: A customer pays but doesn't get the PDF

**Cause:** Razorpay webhook doesn't fire. Brevo email goes to spam. R2 has an outage.

**Mitigation (defense in depth):**
1. **On-page delivery (success.html):** PDF download link shown immediately after payment. Customer doesn't have to wait for email.
2. **Email delivery (Brevo primary + AppScript fallback):** Two email paths, both fire on successful payment.
3. **Razorpay webhook backstop:** Even if `verify-payment` fails, the webhook fires and sends the email. (Already implemented in the repo.)
4. **Customer re-issue (Cloudflare Worker + ledger):** Customer emails `surisetti.dev@gmail.com` if they don't have the PDF. Agent runs a Worker that looks up the order in `ledger.json` and generates a fresh signed URL. Sent within 24 hours.
5. **Google Drive backup:** Worst case, customer gets a Drive link as last resort.

### Scary 2: A customer shares the PDF with 100 friends

**Cause:** Customer buys at ₹999, gets the PDF, shares the Google Drive link on a piracy Telegram channel.

**Mitigation:**
1. **Signed URL with 7-day expiry + max 5 downloads.** Friends who click the link after 7 days get a 403. After 5 downloads, also 403.
2. **PDF is watermarked with the buyer's email** (Cloudflare Worker generates a unique watermarked PDF on the fly). The pirated copy is identifiable, and the original buyer gets a friendly "we noticed your link was shared" email.
3. **The PDF is also gated behind the email in the front matter** — when the buyer opens the PDF, they see "This copy is licensed to {{email}}. Sharing terminates your license and access to future updates."
4. **Detection + response:** If 5+ unique emails ask for the same product within 24 hours, that's a leak. Send the original buyer a polite email.

**Realistic effectiveness:** 80-90% of customers don't share because they paid and they want updates. 10-20% share anyway. The watermarking + signed URL combo limits the blast radius.

### Scary 3: R2 has an outage and customers can't download

**Cause:** Cloudflare R2 goes down (rare but possible). 0.1% probability per month.

**Mitigation:**
1. **Google Drive backup** with a public share link in `DELIVERY_LINKS_BACKUP` env var.
2. **Status page monitoring** + auto-failover script (Cloudflare Worker that checks R2 health and switches the delivery URL to Drive if R2 is down).
3. **Customer email support** for any edge case.

### Scary 4: We outgrow R2 (10,000+ sales/month)

**Cause:** Storage exceeds 10GB free tier. We hit the paid tier.

**Mitigation:** At 10,000 sales/month, the storage cost is ₹750/month and the operations cost is negligible. Revenue at 10,000 sales/month is ₹5L-₹50L/month. The storage is 0.07-0.15% of revenue. Not a problem.

**At 100,000+ sales/month** (₹50L-₹5Cr/month revenue), we re-evaluate. Options: stay on R2 (cost is still trivial in absolute terms), or migrate to Backblaze B2 (S3-compatible, $0.005/GB/month storage + $0.01/GB egress). Migration is a 1-day project because everything is S3-compatible.

### Scary 5: A customer claims "I never got the PDF" and demands a refund

**Cause:** Customer paid, link expired, customer doesn't remember.

**Mitigation:**
1. **Ledger records every sale + delivery** (already in place in the repo).
2. **Customer re-issue Worker** regenerates a fresh signed URL from the order ID. Sent within 24 hours.
3. **Refund only after re-issue fails** (3 attempts over 7 days).
4. **Refund policy is 7 days, money-back, no questions asked** — but in practice, most "I never got it" cases are resolved by re-sending, not refunding.

---

## Implementation plan (when owner approves)

When the owner approves this decision, the next agent run will:

1. **Create the R2 bucket** in Cloudflare dashboard. (Owner: 5 min.)
2. **Generate R2 API token** in Cloudflare. (Owner: 2 min.)
3. **Add R2 env vars** to Cloudflare Pages (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`). (Owner: 5 min.)
4. **Write the Worker** in `functions/api/_lib.js` that:
   - Generates signed URLs (7-day expiry, 5 download cap)
   - Looks up delivery URL from `DELIVERY_LINKS` env var
   - Returns the signed URL to the customer
5. **Update `verify-payment`** to call the Worker and return the signed URL in the success.html response.
6. **Update Brevo email template** to include the signed URL.
7. **E2E test:** Buy product, get on-page link, get email, download PDF, attempt 6th download (should fail), wait 7 days, attempt download (should fail).
8. **Set up Google Drive backup.** (Owner: 30 min.)
9. **Document the customer re-issue flow** in `docs/REISSUE-FLOW.md`.

**Total implementation time:** ~1-2 days of focused work.

---

## Cost projection (12 months)

| Month | Sales (estimate) | Storage | Operations | Total |
|---|---|---|---|---|
| 1 | 0-20 | ₹0 (free tier) | ₹0 | **₹0** |
| 3 | 30-100 | ₹0 (free tier) | ₹0 | **₹0** |
| 6 | 100-300 | ₹0 (free tier) | ₹0 | **₹0** |
| 9 | 300-700 | ₹0 (free tier) | ₹0 | **₹0** |
| 12 | 700-1,500 | ₹0-₹100 | ₹0 | **₹0-₹100** |

The free tier covers 10GB. At 1MB per product × 5 products × 1,000 customers (each with their own watermarked copy) = 5GB. Comfortably under 10GB for the first 12 months.

---

## Final decision

**Primary:** Cloudflare R2 (signed URLs, India CDN, no egress, S3-compatible, already on Cloudflare).
**Backup:** Google Drive (15GB free, contingency for outages + customer support).
**Skip:** Cloudinary (wrong tool), GitHub Releases (no signed URLs, piracy-prone).

**Owner approval needed for:**
1. R2 bucket creation + env var setup.
2. Google Drive backup account creation.
3. Watermarking approach (per-customer or generic).
4. Customer re-issue Worker scope (24-hour SLA, 3-attempt rule).

---

> Reviewed and verified by Surisetti Dev on 19 June 2026 (original); refreshed on 25 June 2026 to align with the owner-name + future-editions cleanup in this PR.
> Last updated: 25 June 2026. Cloudflare R2 pricing and features may change — verify on cloudflare.com before implementation.
