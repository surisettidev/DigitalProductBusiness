// ============================================================
// Shared GitHub-backed JSON ledger for sales + leads.
// Stored at daily-operations/ledger.json in the repo.
// Used by: razorpay-webhook, brevo-subscribe, admin-data, admin-write
// ============================================================

const LEDGER_PATH = 'daily-operations/ledger.json';

function ghHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'User-Agent': 'fos-cf-worker',
    Accept: 'application/vnd.github+json'
  };
}

// Reads the ledger file. Returns { sales: [], leads: [], sha: '<git sha>' }.
// If the file doesn't exist yet, returns an empty ledger with sha: null.
export async function readLedger(env) {
  const token = env.GITHUB_PAT;
  const owner = env.GITHUB_OWNER || 'surisettidev';
  const repo  = env.GITHUB_REPO  || 'DigitalProductBusiness';
  if (!token) return { sales: [], leads: [], sha: null, error: 'GITHUB_PAT not configured' };

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${LEDGER_PATH}`;
  const res = await fetch(apiUrl, { headers: ghHeaders(token) });

  if (res.status === 404) {
    return { sales: [], leads: [], sha: null };
  }
  if (!res.ok) {
    return { sales: [], leads: [], sha: null, error: `GitHub read failed: ${res.status}` };
  }

  const file = await res.json();
  try {
    const content = JSON.parse(atob(file.content.replace(/\n/g, '')));
    return {
      sales: Array.isArray(content.sales) ? content.sales : [],
      leads: Array.isArray(content.leads) ? content.leads : [],
      sha: file.sha
    };
  } catch (_) {
    return { sales: [], leads: [], sha: file.sha, error: 'Ledger JSON parse failed' };
  }
}

// Writes the ledger back to GitHub. `sha` must be the sha returned by readLedger
// (or null if the file doesn't exist yet) to avoid clobbering concurrent edits.
export async function writeLedger(env, { sales, leads, sha, message }) {
  const token = env.GITHUB_PAT;
  const owner = env.GITHUB_OWNER || 'surisettidev';
  const repo  = env.GITHUB_REPO  || 'DigitalProductBusiness';
  if (!token) return { ok: false, error: 'GITHUB_PAT not configured' };

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${LEDGER_PATH}`;
  const body = {
    message: message || 'Update ledger',
    content: btoa(unescape(encodeURIComponent(JSON.stringify({ sales, leads }, null, 2))))
  };
  if (sha) body.sha = sha;

  const res = await fetch(apiUrl, {
    method: 'PUT',
    headers: { ...ghHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    return { ok: false, error: `GitHub write failed: ${res.status} ${txt}` };
  }
  const json = await res.json();
  return { ok: true, sha: json.content?.sha };
}

// Appends one or more sale/lead records with simple retry-on-conflict
// (re-reads + re-applies if the sha changed between read and write).
export async function appendToLedger(env, { sale, lead }, attempt = 0) {
  const current = await readLedger(env);

  const sales = [...current.sales];
  const leads = [...current.leads];
  if (sale) sales.unshift({ id: sale.id || crypto.randomUUID(), created_at: Date.now(), ...sale });
  if (lead) leads.unshift({ id: lead.id || crypto.randomUUID(), created_at: Date.now(), ...lead });

  const result = await writeLedger(env, {
    sales, leads, sha: current.sha,
    message: sale ? `Sale: ${sale.product}` : `Lead: ${lead.email}`
  });

  // sha conflict (409) — retry once with a fresh read
  if (!result.ok && attempt < 2) {
    await new Promise(r => setTimeout(r, 300 * (attempt + 1)));
    return appendToLedger(env, { sale, lead }, attempt + 1);
  }
  return result;
}
