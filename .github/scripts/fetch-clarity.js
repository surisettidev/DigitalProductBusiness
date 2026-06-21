// Fetches Microsoft Clarity behavioral data (rage clicks, dead clicks, scroll depth).
// Clarity's Data Export API only retains 1-3 days of data, so this is always
// a short window. Writes to /tmp/clarity-result.json.

const fs = require('fs');

const CLARITY_PROJECT_ID = 'x5vbk9lkvs';

async function main() {
  const token = process.env.CLARITY_API_TOKEN;

  if (!token) {
    writeResult({ ok: false, error: 'CLARITY_API_TOKEN not set in GitHub Secrets' });
    return;
  }

  try {
    const res = await fetch(
      `https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=2`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      writeResult({
        ok: false,
        error: `Clarity API error ${res.status}: ${data.message || JSON.stringify(data)}`,
        hint: res.status === 401 ? 'Token may be invalid or expired — regenerate in Clarity → Settings → Data Export' : undefined
      });
      return;
    }

    // Clarity returns an array of metric objects; normalize into something
    // the daily agent can scan quickly for problem pages.
    const metrics = Array.isArray(data) ? data : [];
    const rageClicks = metrics.find(m => m.metricName === 'RageClickCount');
    const deadClicks = metrics.find(m => m.metricName === 'DeadClickCount');
    const scrollDepth = metrics.find(m => m.metricName === 'ScrollDepth');

    writeResult({
      ok: true,
      fetchedAt: new Date().toISOString(),
      periodDays: 2,
      rageClicks: rageClicks?.information || [],
      deadClicks: deadClicks?.information || [],
      scrollDepth: scrollDepth?.information || [],
      raw: metrics
    });
  } catch (e) {
    writeResult({ ok: false, error: 'Clarity fetch exception: ' + e.message });
  }
}

function writeResult(obj) {
  fs.writeFileSync('/tmp/clarity-result.json', JSON.stringify(obj, null, 2));
}

main();
