// Cloudflare Pages Function — POST /api/groq-chat
// Layer 2 worker: real-time visitor chat using Groq's free Llama 3.3 70B.
// Logs the interaction to ledger.json so the Daily AI Agent can review.
//
// Required env: GROQ_API_KEY
// Optional:     OPENROUTER_API_KEY (used as fallback if Groq fails/quota)
//
// Hard rules (per /config/OPERATING-CONTRACT.md):
// - Read-only to the catalog; cannot change prices or products
// - Cannot send email
// - Cannot access PII beyond what visitor explicitly provides in the message
// - Cannot write outside /daily-operations/ledger.json
// - Rate-limited per IP

import { json, CATALOG } from './_lib.js';
import { appendToLedger } from './_ledger.js';

const SYSTEM_PROMPT = `You are the helpful FAQ assistant for Freelancer OS — a digital product business for Indian freelancers.

Products (always in INR, prices may change so prefer ranges):
- AI for Freelancers Guide (~₹699)
- Pricing Masterclass (~₹899)
- Indian Tax & Compliance Guide (~₹799–999)
- Client Generation & Lead System (~₹1,299)
- Solopreneur Business OS (~₹1,899)
- Complete Bundle (all 5, ~₹3,999)

Rules:
- Be concise (max 3 short paragraphs).
- If asked about refunds: "7-day money-back guarantee, no questions asked. Email surisetti.dev@gmail.com with payment reference."
- If asked about payment methods: "UPI, cards, netbanking, wallets via Razorpay."
- If asked about delivery: "Instant — download appears after payment + emailed within seconds."
- If asked about taxes/legal/CA advice in detail: "The Tax Guide is educational; please consult a qualified CA for personal tax decisions."
- If asked something you genuinely don't know: say so and recommend emailing surisetti.dev@gmail.com.
- Never invent product features that don't exist.
- Never promise specific revenue outcomes.
- Never claim to be a human.`;

const RATE_LIMIT_PER_MIN = 6; // per IP

// Very simple in-memory rate limiter (per worker instance; good enough for free tier)
const rateBucket = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const minute = Math.floor(now / 60000);
  const key = `${ip}:${minute}`;
  const count = (rateBucket.get(key) || 0) + 1;
  rateBucket.set(key, count);
  // garbage collect old keys (cheap)
  if (rateBucket.size > 500) {
    for (const k of rateBucket.keys()) {
      const m = parseInt(k.split(':')[1], 10);
      if (m < minute - 1) rateBucket.delete(k);
    }
  }
  return count > RATE_LIMIT_PER_MIN;
}

async function callGroq(env, userMessage) {
  if (!env.GROQ_API_KEY) throw new Error('GROQ_API_KEY not set');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 280,
      temperature: 0.5
    })
  });
  if (!res.ok) throw new Error(`Groq ${res.status}`);
  const data = await res.json();
  return (data.choices?.[0]?.message?.content || '').trim();
}

async function callOpenRouterFallback(env, userMessage) {
  if (!env.OPENROUTER_API_KEY) return null;
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://freelance-os.pages.dev',
      'X-Title': 'Freelancer OS'
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 280,
      temperature: 0.5
    })
  });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.choices?.[0]?.message?.content || '').trim() || null;
}

export async function onRequestPost({ request, env }) {
  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'anon';
    if (rateLimited(ip)) return json({ ok: false, error: 'Slow down a bit 🙂' }, 429);

    const { message, visitorId } = await request.json();
    if (!message || typeof message !== 'string' || message.length < 2) {
      return json({ ok: false, error: 'Message too short' }, 400);
    }
    if (message.length > 1000) {
      return json({ ok: false, error: 'Message too long (max 1000 chars)' }, 400);
    }

    let answer = '';
    let model = 'groq:llama-3.3-70b';
    try {
      answer = await callGroq(env, message);
    } catch (_) {
      answer = await callOpenRouterFallback(env, message);
      model = 'openrouter:llama-3.1-8b';
    }

    if (!answer) {
      answer = "I couldn't reach my model right now. Please email surisetti.dev@gmail.com and we'll respond within 24 hours.";
      model = 'fallback:none';
    }

    // Log to ledger (non-PII: question + answer + opaque visitor id)
    try {
      await appendToLedger(env, {
        lead: null,
        sale: null
      });
      // Append a chat event via a structured note on the lead-less path:
      const { appendToLedger: append2 } = await import('./_ledger.js');
      await append2(env, {
        lead: {
          email: '',
          source: `chat:${(visitorId || ip).slice(0, 12)}`,
          status: 'chat',
          notes: `Q: ${message.slice(0, 200)} | A: ${answer.slice(0, 200)} | model: ${model}`
        }
      });
    } catch (_) { /* non-fatal */ }

    return json({ ok: true, answer, model });
  } catch (e) {
    return json({ ok: false, error: 'Server error: ' + e.message }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}
