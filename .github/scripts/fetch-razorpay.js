// Fetches Razorpay orders from the last 48 hours.
// This is the closest thing to "ground truth revenue" — GA4/Clarity show
// behavior, but Razorpay shows actual money. Writes to /tmp/razorpay-result.json.

const fs = require('fs');

async function main() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    writeResult({ ok: false, error: 'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set in GitHub Secrets' });
    return;
  }

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const twoDaysAgo = Math.floor((Date.now() - 2 * 24 * 60 * 60 * 1000) / 1000);

    const res = await fetch(
      `https://api.razorpay.com/v1/orders?from=${twoDaysAgo}&count=100`,
      {
        method: 'GET',
        headers: { 'Authorization': `Basic ${auth}` }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      writeResult({
        ok: false,
        error: `Razorpay API error ${res.status}: ${data.error?.description || JSON.stringify(data)}`,
        hint: res.status === 401 ? 'Check RAZORPAY_KEY_ID/SECRET are correct and the key is active (live or test mode matches your site)' : undefined
      });
      return;
    }

    const orders = (data.items || []).map(o => ({
      id: o.id,
      amount: o.amount / 100, // paise to rupees
      currency: o.currency,
      status: o.status,
      created_at: new Date(o.created_at * 1000).toISOString(),
      notes: o.notes || {}
    }));

    const paidOrders = orders.filter(o => o.status === 'paid');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);

    writeResult({
      ok: true,
      fetchedAt: new Date().toISOString(),
      periodDays: 2,
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
      totalRevenue,
      orders
    });
  } catch (e) {
    writeResult({ ok: false, error: 'Razorpay fetch exception: ' + e.message });
  }
}

function writeResult(obj) {
  fs.writeFileSync('/tmp/razorpay-result.json', JSON.stringify(obj, null, 2));
}

main();
