// Cloudflare Pages Function — POST /api/llm-fallback
// Layer 2 worker: shared OpenRouter free-model router.
// Used by other Layer-2 endpoints when their primary provider fails or
// hits quota. Owner-only direct calls are rate-limited and capped.
//
// Required env: OPENROUTER_API_KEY
//
// Hard daily cap: MAX_DAILY_CALLS to prevent burning the free tier on abuse.
// Counter is best-effort in-memory; resets per worker cold start.

import { json } from './_lib.js';

const MAX_DAILY_CALLS = 50;
let dailyCount = 0;
let dailyKey = '';

function bumpDaily() {
  const today = new Date().toISOString().slice(0, 10);
  if (dailyKey !== today) { dailyKey = today; dailyCount = 0; }
  dailyCount += 1;
  return dailyCount;
}

const PREFERRED_FREE_MODELS = [
  'meta-llama/llama-3.1-8b-instruct:free',
  'google/gemma-2-9b-it:free',
  'mistralai/mistral-7b-instruct:free'
];

export async function onRequestPost({ request, env }) {
  try {
    if (!env.OPENROUTER_API_KEY) {
      return json({ ok: false, error: 'OPENROUTER_API_KEY not set' }, 503);
    }
    if (bumpDaily() > MAX_DAILY_CALLS) {
      return json({ ok: false, error: 'Daily fallback cap reached' }, 429);
    }

    const { prompt, system, model } = await request.json();
    if (!prompt || prompt.length < 2) return json({ ok: false, error: 'Empty prompt' }, 400);
    if (prompt.length > 4000) return json({ ok: false, error: 'Prompt too long' }, 400);

    const modelsToTry = model ? [model] : PREFERRED_FREE_MODELS;

    let lastErr = null;
    for (const m of modelsToTry) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://freelance-os.pages.dev',
            'X-Title': 'Freelancer OS Layer-2 fallback'
          },
          body: JSON.stringify({
            model: m,
            messages: [
              ...(system ? [{ role: 'system', content: system }] : []),
              { role: 'user', content: prompt }
            ],
            max_tokens: 400,
            temperature: 0.4
          })
        });
        if (!res.ok) { lastErr = `${m}: ${res.status}`; continue; }
        const data = await res.json();
        const out = (data.choices?.[0]?.message?.content || '').trim();
        if (!out) { lastErr = `${m}: empty`; continue; }
        return json({ ok: true, model: m, output: out, remaining: Math.max(0, MAX_DAILY_CALLS - dailyCount) });
      } catch (e) {
        lastErr = `${m}: ${e.message}`;
      }
    }
    return json({ ok: false, error: `All fallback models failed. Last: ${lastErr}` }, 502);
  } catch (e) {
    return json({ ok: false, error: 'Server error: ' + e.message }, 500);
  }
}
