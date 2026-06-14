// Cloudflare Pages Function — POST /api/gemini-lead-score
// Layer 2 worker: classifies a newsletter signup by best-fit product
// using Gemini Flash (free tier). Result is logged to ledger.json so the
// Daily AI Agent can route nurture sequences appropriately.
//
// Required env: GEMINI_API_KEY
// Optional:     BREVO_API_KEY, BREVO_LIST_ID (already used elsewhere)
//
// Hard rules:
// - Cannot send marketing email itself (only tags the contact)
// - Cannot write outside the ledger
// - Cannot access existing contact PII beyond the submitted email

import { json } from './_lib.js';
import { appendToLedger } from './_ledger.js';

const SYSTEM_PROMPT = `You are a lead-scoring classifier for Freelancer OS.
A visitor just submitted their email. Given the signup source and any
interest hint they provided, recommend ONE best-fit product slug from:
  tool-stack, tax-guide-2026, ai-workflow-pack, client-negotiation,
  portfolio-os, bundle.

Respond with strict JSON, no commentary, schema:
{ "product": "<slug>", "confidence": "low|medium|high", "reason": "<1 sentence>" }`;

async function callGemini(env, userPayload) {
  if (!env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: userPayload }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    })
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  try { return JSON.parse(text); } catch (_) { return null; }
}

function tagBrevoContact(env, email, slug) {
  if (!env.BREVO_API_KEY) return Promise.resolve(false);
  return fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
    method: 'PUT',
    headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attributes: { FIT_PRODUCT: slug, SCORED_AT: new Date().toISOString() }
    })
  }).then(r => r.ok).catch(() => false);
}

export async function onRequestPost({ request, env }) {
  try {
    const { email, source = 'website', interest = '' } = await request.json();
    if (!email || !email.includes('@')) {
      return json({ ok: false, error: 'Invalid email' }, 400);
    }

    const userPayload = `Signup email: ${email}
Source: ${source}
Interest hint: ${interest || '(none)'}
Pick the best product.`;

    let recommendation = null;
    try {
      recommendation = await callGemini(env, userPayload);
    } catch (e) {
      recommendation = { product: 'tool-stack', confidence: 'low', reason: 'gemini unavailable; defaulted to entry product' };
    }

    if (!recommendation || !recommendation.product) {
      recommendation = { product: 'tool-stack', confidence: 'low', reason: 'no model output; defaulted to entry product' };
    }

    // Tag in Brevo (best-effort, non-fatal)
    try { await tagBrevoContact(env, email, recommendation.product); } catch (_) { /* ignore */ }

    // Log to ledger
    try {
      await appendToLedger(env, {
        lead: {
          email,
          source: `score:${source}`,
          status: 'scored',
          notes: `Fit: ${recommendation.product} (${recommendation.confidence}). ${recommendation.reason || ''}`
        }
      });
    } catch (_) { /* non-fatal */ }

    return json({ ok: true, recommendation });
  } catch (e) {
    return json({ ok: false, error: 'Server error: ' + e.message }, 500);
  }
}
