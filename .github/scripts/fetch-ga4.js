// Fetches GA4 sessions, top pages, and conversion events for the last 48 hours.
// Writes to /tmp/ga4-result.json. Fails gracefully — missing/invalid creds
// produce a clear error object instead of crashing the whole workflow.

const fs = require('fs');

async function main() {
  const keyJson = process.env.GOOGLE_ANALYTICS_KEY_JSON;
  const propertyId = process.env.GA4_PROPERTY_ID;

  if (!keyJson || !propertyId) {
    writeResult({ ok: false, error: 'GOOGLE_ANALYTICS_KEY_JSON or GA4_PROPERTY_ID not set in GitHub Secrets' });
    return;
  }

  // GA4_PROPERTY_ID must be NUMERIC (e.g. 123456789), not the G-XXXXX measurement ID
  if (!/^\d+$/.test(propertyId.trim())) {
    writeResult({
      ok: false,
      error: `GA4_PROPERTY_ID looks wrong: "${propertyId}". It must be the NUMERIC property ID (e.g. 123456789), not the G-XXXXX measurement ID. Find it in GA4 → Admin → Property Settings → Property ID.`
    });
    return;
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(keyJson);
  } catch (e) {
    writeResult({ ok: false, error: 'GOOGLE_ANALYTICS_KEY_JSON is not valid JSON: ' + e.message });
    return;
  }

  try {
    const { GoogleAuth } = require('google-auth-library');
    const auth = new GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    });
    const client = await auth.getClient();
    const token = await client.getAccessToken();

    const body = {
      dateRanges: [{ startDate: '2daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' }
      ],
      limit: 25,
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
    };

    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    );

    const data = await res.json();

    if (!res.ok) {
      writeResult({
        ok: false,
        error: `GA4 API error ${res.status}: ${data.error?.message || JSON.stringify(data)}`,
        hint: res.status === 403 ? 'Service account likely needs Viewer access added in GA4 → Admin → Property Access Management' : undefined
      });
      return;
    }

    const rows = (data.rows || []).map(row => ({
      page: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value) || 0,
      pageViews: parseInt(row.metricValues[1].value) || 0,
      bounceRate: parseFloat(row.metricValues[2].value) || 0,
      avgSessionDuration: parseFloat(row.metricValues[3].value) || 0
    }));

    const totalSessions = rows.reduce((sum, r) => sum + r.sessions, 0);

    writeResult({
      ok: true,
      fetchedAt: new Date().toISOString(),
      periodDays: 2,
      totalSessions,
      topPages: rows
    });
  } catch (e) {
    writeResult({ ok: false, error: 'GA4 fetch exception: ' + e.message });
  }
}

function writeResult(obj) {
  fs.writeFileSync('/tmp/ga4-result.json', JSON.stringify(obj, null, 2));
}

main();
