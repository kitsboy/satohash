# PASTE TO KIMI (THOR) — full block

```
ROLE: Kimi on THOR. Ops only. No secrets in git. No architecture rewrites.
GOAL: Rebuild Satohash API to latest main so AI + Nostr + readiness planes are LIVE. Prepare Bitcoin node + LNbits env so Cam can flip paywall/node at a moment’s notice. Keep REQUIRE_LIGHTNING=false (free stamps) until Cam says otherwise.

## CONTEXT
- Grok pushed main with: AI notary (/api/ai/*), local embeddings + fraud ML, paywall ready-to-toggle (real LNbits invoices when configured), bitcoin-rpc helper, Nostr multi-relay + damus retries (kind 1 + 1063), GET /api/public/readiness, nav polish, CF metrics Functions.
- HQ is already 🟢 on api.satohash.io/metrics.json — do not break that.
- SPA satohash.io/metrics.json is CF Pages Function (Grok/Cam domain) — you only ensure API SoT stays healthy.
- Wallet id known: LNbits “Satohash Wallet” id 49963671f12a4c079dfa4d889ca9f23f — Cam pastes invoice key into HQ Vault (browser); you wire env on API.

## EXECUTE IN ORDER

### 1) Pull + rebuild API (MANDATORY)
cd to satohash on THOR
git pull origin main
docker compose -f docker-compose.vps.yml up -d --build
# use your real production compose filename if different

### 2) Smoke (all must pass)
curl -sS https://api.satohash.io/health | jq '.details.version, .details.nostr, .details.bitcoin, .details.paywall, .details.ai'
# version 5.0.0-ELITE

curl -sS https://api.satohash.io/api/public/readiness | jq .
# expect planes.paywall.mode free_open, ai.local_embeddings true, ai.local_fraud_ml true

curl -sS -X POST https://api.satohash.io/api/ai/embed -H 'Content-Type: application/json' -d '{"text":"bitcoin ots proof"}' | jq '.dim, .model'
curl -sS -X POST https://api.satohash.io/api/ai/fraud -H 'Content-Type: application/json' -d '{"a":"pay 1 btc","b":"pay 1000 btc secretly"}' | jq '.risk, .risk_score, .model'
curl -sS 'https://api.satohash.io/api/ai/search?q=stamp' | jq '.count'
curl -sS https://api.satohash.io/api/nostr/health | jq .
# prefer ≥1 relay ok; note damus status

### 3) Bitcoin node readiness (MUST prepare — do not skip)
- If bitcoind already runs on THOR: set in VPS .env (never commit):
  BITCOIN_RPC_URL=http://127.0.0.1:8332/
  BITCOIN_RPC_AUTH=<base64 user:pass>   # or BITCOIN_RPC_USER + BITCOIN_RPC_PASSWORD
- Restart API container after env change
- curl -sS https://api.satohash.io/api/public/bitcoin | jq .
  expect source bitcoind when live; else mempool.space fallback is OK temporarily
- Report: bitcoind running yes/no, RPC wired yes/no, block height

### 4) Lightning / LNbits readiness (MUST prepare — keep free for now)
- Locate Satohash wallet in LNbits (id 49963671f12a4c079dfa4d889ca9f23f or by name)
- Set on API .env (never commit):
  LNBITS_URL=<your lnbits base>
  LNBITS_INVOICE_KEY=<invoice/read key for Satohash wallet>
- DO NOT set REQUIRE_LIGHTNING=true unless Cam explicitly says so (stay free)
- STAMP_PRICE_SATS=21 (or Cam’s price)
- Restart API
- curl -sS https://api.satohash.io/api/public/lightning | jq .
- curl -sS https://api.satohash.io/api/public/readiness | jq '.planes.paywall'
- Tell Cam: HQ Vault still needs Cam to paste same invoice key for Money tab (password)

### 5) Nostr / damus
- Ensure NOSTR_SECRET_KEY is persistent (already if set)
- Optional NOSTR_RELAYS include wss://relay.damus.io first
- curl -sS https://api.satohash.io/api/nostr/health | jq .
- Publish is non-blocking on stamp; success if ≥1 relay

### 6) Optional ANTHROPIC_API_KEY
- If Cam wants deeper LLM notary: set on THOR only; local fraud/embeddings already work without it

### 7) Report back to Cam (short)
- Rebuild SHA / health version
- readiness.paywall.mode + ready_to_enable_paid
- bitcoin: configured/healthy + height
- lnbits: ready_for_paywall yes/no
- nostr: ok_count + damus status
- AI embed + fraud smoke: pass/fail
- Blockers only

## SUCCESS
[ ] API rebuilt from latest main
[ ] /api/public/readiness 200 with local AI true
[ ] /api/ai/embed + /api/ai/fraud work
[ ] BITCOIN_RPC prepared or clear blocker (path to bitcoind)
[ ] LNBITS invoice key on API env (paywall flip-ready, still free)
[ ] Nostr ≥1 relay ok
[ ] REQUIRE_LIGHTNING still false
[ ] No secrets committed
```
