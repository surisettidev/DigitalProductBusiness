#!/usr/bin/env bash
# Freelancer OS — API key verification
# Usage: edit the variables below or pass them as env vars, then run:
#   bash scripts/test-keys.sh
# Each test prints "OK <name>" or "FAIL <name>: <reason>".
# No key is printed.

set -u

PASS=0
FAIL=0

note() { echo "→ $1"; }
ok()   { echo "OK   $1"; PASS=$((PASS+1)); }
bad()  { echo "FAIL $1: $2"; FAIL=$((FAIL+1)); }

# ----- Razorpay -----
note "Razorpay (key id + secret)"
if [[ -z "${RAZORPAY_KEY_ID:-}" || -z "${RAZORPAY_KEY_SECRET:-}" ]]; then
  bad "Razorpay" "set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET env vars first"
else
  HTTP=$(curl -s -o /tmp/rzp.json -w "%{http_code}" \
    -u "${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}" \
    "https://api.razorpay.com/v1/payments?count=1")
  if [[ "$HTTP" == "200" ]]; then ok "Razorpay"; else bad "Razorpay" "HTTP $HTTP"; fi
fi

# ----- Brevo -----
note "Brevo"
if [[ -z "${BREVO_API_KEY:-}" ]]; then
  bad "Brevo" "set BREVO_API_KEY"
else
  HTTP=$(curl -s -o /tmp/brevo.json -w "%{http_code}" \
    -H "api-key: ${BREVO_API_KEY}" \
    "https://api.brevo.com/v3/account")
  if [[ "$HTTP" == "200" ]]; then ok "Brevo"; else bad "Brevo" "HTTP $HTTP"; fi
fi

# ----- Gemini -----
note "Gemini (Google AI Studio)"
if [[ -z "${GEMINI_API_KEY:-}" ]]; then
  bad "Gemini" "set GEMINI_API_KEY"
else
  HTTP=$(curl -s -o /tmp/gemini.json -w "%{http_code}" \
    -H "Content-Type: application/json" \
    -d '{"contents":[{"parts":[{"text":"ping"}]}]}' \
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}")
  if [[ "$HTTP" == "200" ]]; then ok "Gemini"; else bad "Gemini" "HTTP $HTTP"; fi
fi

# ----- Groq -----
note "Groq"
if [[ -z "${GROQ_API_KEY:-}" ]]; then
  bad "Groq" "set GROQ_API_KEY"
else
  HTTP=$(curl -s -o /tmp/groq.json -w "%{http_code}" \
    -H "Authorization: Bearer ${GROQ_API_KEY}" \
    -H "Content-Type: application/json" \
    -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"ping"}],"max_tokens":5}' \
    "https://api.groq.com/openai/v1/chat/completions")
  if [[ "$HTTP" == "200" ]]; then ok "Groq"; else bad "Groq" "HTTP $HTTP"; fi
fi

# ----- OpenRouter -----
note "OpenRouter (free model)"
if [[ -z "${OPENROUTER_API_KEY:-}" ]]; then
  bad "OpenRouter" "set OPENROUTER_API_KEY"
else
  HTTP=$(curl -s -o /tmp/or.json -w "%{http_code}" \
    -H "Authorization: Bearer ${OPENROUTER_API_KEY}" \
    -H "Content-Type: application/json" \
    -H "HTTP-Referer: https://freelance-os.pages.dev" \
    -d '{"model":"meta-llama/llama-3.1-8b-instruct:free","messages":[{"role":"user","content":"ping"}],"max_tokens":5}' \
    "https://openrouter.ai/api/v1/chat/completions")
  if [[ "$HTTP" == "200" ]]; then ok "OpenRouter"; else bad "OpenRouter" "HTTP $HTTP"; fi
fi

# ----- NVIDIA NIM -----
note "NVIDIA NIM"
if [[ -z "${NVIDIA_NIM_API_KEY:-}" ]]; then
  bad "NVIDIA" "set NVIDIA_NIM_API_KEY"
else
  HTTP=$(curl -s -o /tmp/nv.json -w "%{http_code}" \
    -H "Authorization: Bearer ${NVIDIA_NIM_API_KEY}" \
    -H "Content-Type: application/json" \
    -d '{"model":"meta/llama-3.1-8b-instruct","messages":[{"role":"user","content":"ping"}],"max_tokens":5}' \
    "https://integrate.api.nvidia.com/v1/chat/completions")
  if [[ "$HTTP" == "200" ]]; then ok "NVIDIA"; else bad "NVIDIA" "HTTP $HTTP"; fi
fi

# ----- GitHub PAT (fine-grained) -----
note "GitHub fine-grained PAT"
if [[ -z "${GITHUB_PAT:-}" ]]; then
  bad "GitHub PAT" "set GITHUB_PAT"
else
  HTTP=$(curl -s -o /tmp/gh.json -w "%{http_code}" \
    -H "Authorization: Bearer ${GITHUB_PAT}" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/surisettidev/DigitalProductBusiness")
  if [[ "$HTTP" == "200" ]]; then ok "GitHub PAT"; else bad "GitHub PAT" "HTTP $HTTP"; fi
fi

echo
echo "Summary: $PASS passed, $FAIL failed."
exit $FAIL
