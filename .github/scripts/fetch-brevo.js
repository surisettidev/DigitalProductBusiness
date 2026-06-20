// Fetches Brevo contact growth and transactional email stats.
// Writes to /tmp/brevo-result.json.

const fs = require('fs');

async function main() {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    writeResult({ ok: false, error: 'BREVO_API_KEY not set in GitHub Secrets' });
    return;
  }

  if (!apiKey.startsWith('xkeysib-')) {
    writeResult({
      ok: false,
      error: `BREVO_API_KEY doesn't look like a valid SMTP v3 key (should start with "xkeysib-"). Got a key starting with "${apiKey.slice(0, 8)}...". Generate the correct one in Brevo → SMTP & API → API Keys.`
    });
    return;
  }

  try {
    // Contact count
    const contactsRes = await fetch('https://api.brevo.com/v3/contacts?limit=1', {
      headers: { 'api-key': apiKey }
    });
    const contactsData = await contactsRes.json();

    if (!contactsRes.ok) {
      writeResult({
        ok: false,
        error: `Brevo contacts API error ${contactsRes.status}: ${contactsData.message || JSON.stringify(contactsData)}`
      });
      return;
    }

    // Transactional email stats (last 2 days)
    const today = new Date();
    const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
    const startDate = twoDaysAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    const statsRes = await fetch(
      `https://api.brevo.com/v3/smtp/statistics/aggregatedReport?startDate=${startDate}&endDate=${endDate}`,
      { headers: { 'api-key': apiKey } }
    );
    const statsData = await statsRes.json();

    writeResult({
      ok: true,
      fetchedAt: new Date().toISOString(),
      periodDays: 2,
      totalContacts: contactsData.count || 0,
      emailStats: statsRes.ok ? {
        sent: statsData.requests || 0,
        delivered: statsData.delivered || 0,
        opened: statsData.uniqueOpens || 0,
        clicked: statsData.uniqueClicks || 0,
        bounced: (statsData.hardBounces || 0) + (statsData.softBounces || 0)
      } : { error: 'Could not fetch email stats: ' + (statsData.message || statsRes.status) }
    });
  } catch (e) {
    writeResult({ ok: false, error: 'Brevo fetch exception: ' + e.message });
  }
}

function writeResult(obj) {
  fs.writeFileSync('/tmp/brevo-result.json', JSON.stringify(obj, null, 2));
}

main();
