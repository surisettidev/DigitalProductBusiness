// ============================================================
// Shared server-side helpers for Cloudflare Pages Functions.
// Files starting with "_" are NOT exposed as routes.
// ============================================================

// ---- Server-side product catalog (authoritative prices in paise) ----
export const CATALOG = {
  'automation-bundle': { name: 'Freelancer Automation Bundle',           amount: 99900  },
  'ai-freelancer':     { name: 'AI for Freelancers Guide',               amount: 69900  },
  'pricing-guide':     { name: 'Freelancer Pricing Masterclass',         amount: 89900  },
  'tax-guide':         { name: 'Indian Freelancer Tax & Compliance Guide',amount: 79900  },
  'client-gen':        { name: 'Client Generation & Lead System',        amount: 129900 },
  'business-os':       { name: 'Solopreneur Business OS',                amount: 189900 },
  'bundle':            { name: 'Complete Freelancer OS (All 5)',          amount: 399900 }
};

export const BUNDLE_SLUGS = ['automation-bundle', 'ai-freelancer', 'pricing-guide', 'tax-guide', 'client-gen', 'business-os'];

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders }
  });
}

// ---- Crypto helpers ----
export async function hmacSha256Hex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

// ---- Delivery links (fallback for on-page delivery) ----
// DELIVERY_LINKS env var: JSON map of slug → URL
// e.g. {"automation-bundle":"https://drive.google.com/..."}
export function getDeliveryItems(env, slug) {
  let links = {};
  try { links = JSON.parse(env.DELIVERY_LINKS || '{}'); } catch (_) {}
  const slugs = slug === 'bundle' ? BUNDLE_SLUGS : [slug];
  return slugs.map(s => ({
    slug: s,
    name: (CATALOG[s] || {}).name || s,
    url: links[s] || null
  }));
}

// ---- Primary delivery: Google AppScript webhook ----
// Calls your deployed AppScript Web App which generates Drive link + sends Gmail.
// Falls back to Brevo if AppScript not configured.
export async function sendDeliveryEmail(env, { email, name, slug, paymentId, orderId }) {
  // Try AppScript first (primary)
  if (env.DELIVERY_WEBHOOK_URL && env.DELIVERY_SECRET) {
    try {
      const res = await fetch(env.DELIVERY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: env.DELIVERY_SECRET,
          customerEmail: email,
          customerName: name || email.split('@')[0],
          productId: slug,
          paymentId,
          orderId: orderId || '',
          amount: (CATALOG[slug] || {}).amount ? (CATALOG[slug].amount / 100) : 0
        })
      });
      const result = await res.json().catch(() => ({}));
      if (result.success) return true;
      console.error('AppScript delivery failed:', result.error);
    } catch (e) {
      console.error('AppScript delivery error:', e.message);
    }
  }

  // Fallback: Brevo (if configured)
  if (env.BREVO_API_KEY && email) {
    return sendBrevoDeliveryEmail(env, { email, name, slug, paymentId });
  }

  return false;
}

// ---- Brevo transactional email (fallback) ----
async function sendBrevoDeliveryEmail(env, { email, name, slug, paymentId }) {
  const items = getDeliveryItems(env, slug);
  const productName = (CATALOG[slug] || {}).name || slug;

  const linksHtml = items.map(it => it.url
    ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
         <strong>${it.name}</strong><br>
         <a href="${it.url}" style="display:inline-block;margin-top:6px;background:#2563eb;color:#fff;padding:9px 18px;border-radius:8px;text-decoration:none;font-weight:600;">Download →</a>
       </td></tr>`
    : `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
         <strong>${it.name}</strong><br>
         <span style="color:#475569;">Your download link will be emailed within a few hours.</span>
       </td></tr>`
  ).join('');

  const html = `
  <div style="font-family:Inter,'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;">
    <div style="background:#0f172a;padding:22px 28px;border-radius:12px 12px 0 0;">
      <span style="color:#fff;font-weight:800;font-size:18px;">Freelancer OS</span>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px;padding:28px;">
      <h2 style="color:#0f172a;margin:0 0 8px;">Payment received — here's your product 🎉</h2>
      <p style="color:#475569;">Thanks for buying <strong>${productName}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;">${linksHtml}</table>
      <p style="color:#475569;margin-top:18px;font-size:14px;">
        Payment reference: <code>${paymentId || '-'}</code><br>
        7-day money-back guarantee — just reply to this email.
      </p>
      <p style="color:#94a3b8;font-size:12px;margin-top:22px;">
        Freelancer OS · Practical digital products for Indian freelancers<br>
        Support: ${env.SUPPORT_EMAIL || 'surisetti.dev@gmail.com'}
      </p>
    </div>
  </div>`;

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Freelancer OS', email: env.FROM_EMAIL || 'surisetti.dev@gmail.com' },
      to: [{ email, name: name || email.split('@')[0] }],
      subject: `Your ${productName} — download inside`,
      htmlContent: html
    })
  });
  return res.ok;
}

// ---- Add buyer to Brevo contact list ----
export async function addBrevoContact(env, { email, slug }) {
  if (!env.BREVO_API_KEY || !email) return false;
  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        listIds: [parseInt(env.BREVO_LIST_ID || '2', 10)],
        attributes: { SOURCE: 'purchase:' + slug, SIGNUP_DATE: new Date().toISOString() },
        updateEnabled: true
      })
    });
    return res.ok || res.status === 204;
  } catch (_) { return false; }
}

// ---- Log sale to GitHub sales-tracker.md ----
export async function logSaleToGithub(env, sale) {
  const token = env.GITHUB_PAT;
  const owner = env.GITHUB_OWNER || 'surisettidev';
  const repo  = env.GITHUB_REPO  || 'DigitalProductBusiness';
  if (!token) return false;
  try {
    const filePath = 'daily-operations/sales-tracker.md';
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const fileRes = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'fos-cf-worker' }
    });
    if (!fileRes.ok) return false;
    const file = await fileRes.json();
    const current = atob(file.content.replace(/\n/g, ''));
    const line = `| ${sale.date.slice(0, 10)} | ${sale.product} | 1 | ${sale.amount} | ${sale.amount} | razorpay |\n`;
    const updated = current + line;
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'fos-cf-worker', 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `Sale: ${sale.product} (razorpay)`, content: btoa(updated), sha: file.sha })
    });
    return putRes.ok;
  } catch (_) { return false; }
}

// ---- Log sale to ledger (powers admin.html) ----
export async function logSaleToLedger(env, { slug, productName, amountInr, email, paymentId, channel }) {
  try {
    const { appendToLedger } = await import('./_ledger.js');
    const sale = {
      product: slug || productName || 'unknown',
      gross: amountInr || 0,
      net: amountInr || 0,
      channel: channel || 'razorpay',
      email: email || '',
      units: 1,
      date: new Date().toISOString().slice(0, 10),
      paymentId: paymentId || ''
    };
    const lead = email ? { email, source: `purchase:${slug || 'unknown'}`, status: 'customer', notes: '' } : null;
    return await appendToLedger(env, { sale, lead });
  } catch (_) { return { ok: false }; }
}
