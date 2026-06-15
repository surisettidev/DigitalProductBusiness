// ============================================================
// External data fetchers — GA4, Razorpay, Clarity, Brevo, GitHub
// Each function returns { status: 'success'|'error'|'not_configured', ... }
// Never throws — callers can run all in parallel and skip failures.
// ============================================================

// ---------------------------------------------------------
// Google Analytics 4 (via Service Account + GA4 Data API)
// ---------------------------------------------------------
// Requires env.GOOGLE_ANALYTICS_KEY_JSON (full service account JSON)
// and env.GOOGLE_ANALYTICS_PROPERTY_ID (numeric GA4 property ID, e.g. "123456789"
// — NOT the "G-XXXX" measurement ID. Find it in GA4 Admin > Property Settings).
export async function fetchGA4Data(env, { daysBack = 7 } = {}) {
  if (!env.GOOGLE_ANALYTICS_KEY_JSON || !env.GOOGLE_ANALYTICS_PROPERTY_ID) {
    return { status: 'not_configured', reason: 'GOOGLE_ANALYTICS_KEY_JSON or GOOGLE_ANALYTICS_PROPERTY_ID missing' };
  }

  // Strip "properties/" prefix if present
  let propertyId = String(env.GOOGLE_ANALYTICS_PROPERTY_ID).replace(/^properties\//, '').trim();

  // Common mistake: pasting the Measurement ID (G-XXXXXXXXXX) instead of the
  // numeric Property ID (e.g. 123456789). The Data API requires the numeric one.
  if (propertyId.startsWith('G-')) {
    return {
      status: 'error',
      error: `GOOGLE_ANALYTICS_PROPERTY_ID is set to a Measurement ID (${propertyId}), but the GA4 Data API needs the numeric Property ID. ` +
             'Find it in GA4 → Admin → Property Settings → Property ID (looks like 123456789, no "G-" prefix).'
    };
  }
  if (!/^\d+$/.test(propertyId)) {
    return { status: 'error', error: `GOOGLE_ANALYTICS_PROPERTY_ID ("${propertyId}") doesn't look like a numeric GA4 Property ID.` };
  }

  try {
    const keyData = JSON.parse(env.GOOGLE_ANALYTICS_KEY_JSON);
    const accessToken = await getGoogleAccessToken(keyData, 'https://www.googleapis.com/auth/analytics.readonly');

    const endDate = new Date(Date.now() - 86400000).toISOString().slice(0, 10); // yesterday
    const startDate = new Date(Date.now() - daysBack * 86400000).toISOString().slice(0, 10);

    const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
          { name: 'sessions' }
        ],
        dimensions: [{ name: 'deviceCategory' }]
      })
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      return { status: 'error', error: `GA4 API ${res.status}: ${txt.slice(0, 300)}` };
    }

    const data = await res.json();
    const headers = (data.metricHeaders || []).map(h => h.name);
    const rows = data.rows || [];

    // Sum across device rows for totals; build device breakdown
    const totals = { activeUsers: 0, screenPageViews: 0, sessions: 0 };
    let bounceRateSum = 0, sessionDurationSum = 0, rowCount = 0;
    const deviceBreakdown = [];

    for (const row of rows) {
      const device = row.dimensionValues?.[0]?.value || 'unknown';
      const vals = {};
      headers.forEach((name, i) => { vals[name] = Number(row.metricValues?.[i]?.value || 0); });

      totals.activeUsers += vals.activeUsers || 0;
      totals.screenPageViews += vals.screenPageViews || 0;
      totals.sessions += vals.sessions || 0;
      bounceRateSum += vals.bounceRate || 0;
      sessionDurationSum += vals.averageSessionDuration || 0;
      rowCount++;

      deviceBreakdown.push({ device, users: vals.activeUsers || 0, sessions: vals.sessions || 0 });
    }

    return {
      status: 'success',
      dateRange: { startDate, endDate },
      activeUsers: totals.activeUsers,
      pageViews: totals.screenPageViews,
      sessions: totals.sessions,
      avgBounceRate: rowCount ? +(bounceRateSum / rowCount).toFixed(2) : 0,
      avgSessionDurationSeconds: rowCount ? Math.round(sessionDurationSum / rowCount) : 0,
      deviceBreakdown
    };
  } catch (e) {
    return { status: 'error', error: e.message };
  }
}

// Exchange a Google service-account JSON key for an OAuth2 access token
// using a self-signed RS256 JWT (Web Crypto, no external libraries).
async function getGoogleAccessToken(keyData, scope) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;

  const header = { alg: 'RS256', typ: 'JWT' };
  const claims = {
    iss: keyData.client_email,
    scope,
    aud: 'https://oauth2.googleapis.com/token',
    exp,
    iat
  };

  const encode = (obj) => base64url(new TextEncoder().encode(JSON.stringify(obj)));
  const unsigned = `${encode(header)}.${encode(claims)}`;

  const pemBody = keyData.private_key
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  const keyBytes = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyBytes,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(unsigned)
  );

  const jwt = `${unsigned}.${base64url(new Uint8Array(signature))}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });

  if (!tokenRes.ok) {
    const txt = await tokenRes.text().catch(() => '');
    throw new Error(`Google OAuth token exchange failed: ${tokenRes.status} ${txt.slice(0, 300)}`);
  }

  const tokenJson = await tokenRes.json();
  if (!tokenJson.access_token) throw new Error('Google OAuth: no access_token returned');
  return tokenJson.access_token;
}

function base64url(bytes) {
  let str = btoa(String.fromCharCode(...bytes));
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ---------------------------------------------------------
// Razorpay — recent orders/payments
// ---------------------------------------------------------
export async function fetchRazorpayData(env, { daysBack = 7 } = {}) {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    return { status: 'not_configured', reason: 'RAZORPAY_KEY_ID/SECRET missing' };
  }

  try {
    const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
    const since = Math.floor((Date.now() - daysBack * 86400000) / 1000);

    const res = await fetch(`https://api.razorpay.com/v1/payments?from=${since}&count=100`, {
      headers: { Authorization: `Basic ${auth}` }
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      return { status: 'error', error: `Razorpay API ${res.status}: ${txt.slice(0, 300)}` };
    }

    const data = await res.json();
    const payments = data.items || [];
    const captured = payments.filter(p => p.status === 'captured');
    const failed = payments.filter(p => p.status === 'failed');

    const totalRevenueInr = captured.reduce((sum, p) => sum + (p.amount || 0), 0) / 100;

    return {
      status: 'success',
      dateRangeDays: daysBack,
      totalPayments: payments.length,
      capturedCount: captured.length,
      failedCount: failed.length,
      totalRevenueInr,
      avgOrderValueInr: captured.length ? +(totalRevenueInr / captured.length).toFixed(0) : 0,
      recentPayments: captured.slice(0, 20).map(p => ({
        id: p.id,
        amountInr: p.amount / 100,
        email: p.email || '',
        createdAt: new Date(p.created_at * 1000).toISOString(),
        notes: p.notes || {}
      }))
    };
  } catch (e) {
    return { status: 'error', error: e.message };
  }
}

// ---------------------------------------------------------
// Microsoft Clarity — project insights via Data Export API
// ---------------------------------------------------------
// Clarity's public Data Export API (as of 2025/2026) returns aggregated
// metrics for the last 1-3 days only, keyed by numDays (1, 2, or 3).
export async function fetchClarityData(env) {
  if (!env.CLARITY_API_KEY) {
    return { status: 'not_configured', reason: 'CLARITY_API_KEY missing' };
  }

  try {
    const res = await fetch('https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=3', {
      headers: { Authorization: `Bearer ${env.CLARITY_API_KEY}` }
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      return { status: 'error', error: `Clarity API ${res.status}: ${txt.slice(0, 300)}` };
    }

    const data = await res.json();

    // Response is an array of metric groups, each with an "information" array
    const metrics = {};
    for (const group of (Array.isArray(data) ? data : [])) {
      const name = group.metricName || 'unknown';
      metrics[name] = group.information || group;
    }

    return {
      status: 'success',
      raw: metrics,
      note: 'Clarity export covers the last 1-3 days only; cross-check with GA4 for longer trends.'
    };
  } catch (e) {
    return { status: 'error', error: e.message };
  }
}

// ---------------------------------------------------------
// Brevo — account + list overview
// ---------------------------------------------------------
export async function fetchBrevoData(env) {
  if (!env.BREVO_API_KEY) {
    return { status: 'not_configured', reason: 'BREVO_API_KEY missing' };
  }

  try {
    const headers = { 'api-key': env.BREVO_API_KEY };

    const [accountRes, listRes] = await Promise.all([
      fetch('https://api.brevo.com/v3/account', { headers }),
      env.BREVO_LIST_ID
        ? fetch(`https://api.brevo.com/v3/contacts/lists/${env.BREVO_LIST_ID}`, { headers })
        : Promise.resolve(null)
    ]);

    if (!accountRes.ok) {
      const txt = await accountRes.text().catch(() => '');
      return { status: 'error', error: `Brevo account API ${accountRes.status}: ${txt.slice(0, 300)}` };
    }

    const account = await accountRes.json();
    let list = null;
    if (listRes && listRes.ok) {
      list = await listRes.json();
    }

    return {
      status: 'success',
      planType: account.plan?.[0]?.type || 'unknown',
      planCredits: account.plan?.[0]?.credits ?? null,
      companyName: account.companyName || '',
      list: list ? { id: list.id, name: list.name, totalSubscribers: list.totalSubscribers } : null
    };
  } catch (e) {
    return { status: 'error', error: e.message };
  }
}

// ---------------------------------------------------------
// GitHub — recent commits + open AI-request issues
// ---------------------------------------------------------
export async function fetchGitHubData(env) {
  const token = env.GITHUB_PAT;
  const owner = env.GITHUB_OWNER || 'surisettidev';
  const repo = env.GITHUB_REPO || 'DigitalProductBusiness';
  if (!token) {
    return { status: 'not_configured', reason: 'GITHUB_PAT missing' };
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'fos-fetch-all-data',
      Accept: 'application/vnd.github+json'
    };

    const [commitsRes, issuesRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=50`, { headers })
    ]);

    if (!commitsRes.ok) {
      const txt = await commitsRes.text().catch(() => '');
      return { status: 'error', error: `GitHub commits API ${commitsRes.status}: ${txt.slice(0, 300)}` };
    }

    const commits = await commitsRes.json();
    const issues = issuesRes.ok ? await issuesRes.json() : [];

    const aiRequests = issues.filter(i => (i.labels || []).some(l => (l.name || '').includes('ai-request') || (l.name || '').includes('needs-approval')));

    return {
      status: 'success',
      lastCommit: commits[0] ? { message: commits[0].commit?.message, date: commits[0].commit?.author?.date, sha: commits[0].sha?.slice(0, 7) } : null,
      recentCommits: commits.slice(0, 10).map(c => ({ message: c.commit?.message, date: c.commit?.author?.date, sha: c.sha?.slice(0, 7) })),
      openIssues: issues.length,
      pendingApprovals: aiRequests.length,
      pendingApprovalTitles: aiRequests.map(i => i.title)
    };
  } catch (e) {
    return { status: 'error', error: e.message };
  }
}
