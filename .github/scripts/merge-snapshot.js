// Merges the 4 individual fetch results into one snapshot file.
// This is the ONLY file the daily agent needs to read to get all live data —
// it never sees the raw secrets, only this derived, already-fetched output.

const fs = require('fs');
const path = require('path');

function safeRead(filepath) {
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  } catch (e) {
    return { ok: false, error: 'Could not read or parse ' + filepath + ': ' + e.message };
  }
}

function main() {
  const ga4 = safeRead('/tmp/ga4-result.json');
  const clarity = safeRead('/tmp/clarity-result.json');
  const razorpay = safeRead('/tmp/razorpay-result.json');
  const brevo = safeRead('/tmp/brevo-result.json');

  const snapshot = {
    generatedAt: new Date().toISOString(),
    sourcesOk: {
      ga4: ga4.ok === true,
      clarity: clarity.ok === true,
      razorpay: razorpay.ok === true,
      brevo: brevo.ok === true
    },
    ga4,
    clarity,
    razorpay,
    brevo
  };

  const outDir = path.join(process.cwd(), 'daily-operations');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    path.join(outDir, 'live-data-snapshot.json'),
    JSON.stringify(snapshot, null, 2)
  );

  console.log('Snapshot written. Sources OK:', snapshot.sourcesOk);
}

main();
