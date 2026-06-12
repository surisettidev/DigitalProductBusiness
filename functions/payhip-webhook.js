// Cloudflare Pages Function — POST /api/payhip-webhook
// Configure this URL in Payhip dashboard → Settings → Webhooks
export async function onRequestPost({ request, env }) {
  try {
    const text = await request.text();
    const signature = request.headers.get('x-payhip-signature') || '';

    const expected = await hmacSha256(env.PAYHIP_WEBHOOK_SECRET, text);
    if (signature && signature !== expected) {
      return new Response('Invalid signature', { status: 401 });
    }

    const params = new URLSearchParams(text);
    const eventType = params.get('type');
    const email = params.get('email');
    const productName = params.get('items[0][product_name]') || params.get('product_name');
    const amount = params.get('amount') || '0';

    if (eventType === 'paid') {
      const sale = { date: new Date().toISOString(), product: productName, amount, email };

      // 1. Write to GitHub markdown (sales-tracker.md — human-readable log)
      await logSaleToGithub({
        owner: env.GITHUB_OWNER,
        repo: env.GITHUB_REPO,
        token: env.GITHUB_PAT,
        sale
      });

      // 2. Write to Genspark Table API (powers admin dashboard charts + KPIs)
      if (env.SITE_URL) {
        try {
          await fetch(`${env.SITE_URL}/tables/sales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              product: slugFromName(productName),
              gross: Number(amount) || 0,
              net: Number(amount) || 0,
              channel: 'payhip',
              email: email || '',
              units: 1,
              date: sale.date.slice(0, 10)
            })
          });
        } catch (_) { /* non-fatal — GitHub log already succeeded */ }
      }
    }

    return new Response('OK', { status: 200 });
  } catch (e) {
    return new Response('Error: ' + e.message, { status: 500 });
  }
}

// Map Payhip product names to config slugs for clean admin display
function slugFromName(name = '') {
  const n = name.toLowerCase();
  if (n.includes('ai for') || n.includes('ai freelancer')) return 'ai-freelancer';
  if (n.includes('pricing') || n.includes('masterclass')) return 'pricing-guide';
  if (n.includes('tax') || n.includes('compliance')) return 'tax-guide';
  if (n.includes('client') || n.includes('lead system')) return 'client-gen';
  if (n.includes('business os') || n.includes('solopreneur')) return 'business-os';
  if (n.includes('bundle') || n.includes('complete')) return 'bundle';
  return name; // fallback to raw name
}

async function hmacSha256(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function logSaleToGithub({ owner, repo, token, sale }) {
  if (!token) return;
  const filePath = 'daily-operations/sales-tracker.md';
  const fileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
    headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'cf-worker' }
  });
  const file = await fileRes.json();
  const current = atob(file.content.replace(/\n/g, ''));
  const line = `| ${sale.date.slice(0,10)} | ${sale.product} | 1 | ${sale.amount} | ${sale.amount} | payhip |\n`;
  const updated = current.includes('| | | | | | |')
    ? current.replace('| | | | | | |\n', line + '| | | | | | |\n')
    : current + line;

  await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'cf-worker', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Sale logged: ${sale.product}`,
      content: btoa(updated),
      sha: file.sha
    })
  });
}
