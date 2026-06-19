# GST-Compliant Invoice Template (Indian Freelancers)

Replace `{{...}}` placeholders. Delete this header before sending.

---

## TAX INVOICE

**{{YOUR_BUSINESS_NAME / YOUR_FULL_NAME}}**
{{YOUR_ADDRESS_LINE_1}}
{{YOUR_CITY}}, {{YOUR_STATE}} - {{YOUR_PIN}}
Email: {{YOUR_EMAIL}} · Phone: {{YOUR_PHONE}}
GSTIN: {{YOUR_GSTIN_OR_LEAVE_BLANK_IF_UNREGISTERED}}
PAN: {{YOUR_PAN}}

---

**Invoice No:** {{2026-27/INV/001}}
**Invoice Date:** {{DD-MM-YYYY}}
**Due Date:** {{DD-MM-YYYY}}
**Place of Supply:** {{CLIENT_STATE_NAME}} ({{STATE_CODE}})

---

### Bill To:
**{{CLIENT_COMPANY_NAME}}**
{{CLIENT_ADDRESS}}
{{CLIENT_CITY}}, {{CLIENT_STATE}} - {{CLIENT_PIN}}
GSTIN: {{CLIENT_GSTIN_IF_B2B}}
Email: {{CLIENT_EMAIL}}

---

### Services Rendered

| # | Description | SAC Code | Qty | Rate (₹) | Amount (₹) |
|---|---|---|---|---|---|
| 1 | {{SERVICE_DESCRIPTION_PLAIN_ENGLISH}} | {{9983 / 998314 / 998361}} | 1 | {{AMOUNT}} | {{AMOUNT}} |

**Taxable Value:** ₹{{TAXABLE_VALUE}}

---

### Tax Calculation

**If client is in SAME STATE as you:**
| Tax | Rate | Amount |
|---|---|---|
| CGST | 9% | ₹{{TAXABLE_VALUE * 0.09}} |
| SGST | 9% | ₹{{TAXABLE_VALUE * 0.09}} |

**If client is in DIFFERENT STATE:**
| Tax | Rate | Amount |
|---|---|---|
| IGST | 18% | ₹{{TAXABLE_VALUE * 0.18}} |

**If EXPORT of service (international client):**
> *Export of Services under LUT — IGST not charged.*
> *LUT Reference: {{YOUR_LUT_ARN}}*
> *Place of Supply: Outside India*

---

### Total

**Subtotal:** ₹{{TAXABLE_VALUE}}
**GST:** ₹{{GST_AMOUNT}}
**Grand Total:** ₹{{GRAND_TOTAL}}

**Amount in Words:** Rupees {{AMOUNT_IN_WORDS}} only.

---

### Payment Details

**Bank Name:** {{BANK_NAME}}
**Account Holder:** {{ACCOUNT_HOLDER_NAME}}
**Account Number:** {{ACCOUNT_NUMBER}}
**IFSC Code:** {{IFSC}}
**UPI ID:** {{UPI_ID}}
**Razorpay Payment Link:** {{OPTIONAL_PAYMENT_LINK}}

---

### Terms

1. Payment due within {{15 / 30}} days of invoice date.
2. Late payment attracts interest @ 2% per month from due date.
3. Disputes: jurisdiction of {{YOUR_CITY}} courts only.
4. Bank charges (if any) to be borne by the payer.

---

*This is a computer-generated invoice. Digital signature is valid under IT Act 2000.*

**Signature:** {{DIGITAL_SIGNATURE_OR_NAME}}
**Date:** {{INVOICE_DATE}}
