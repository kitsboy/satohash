# Paste this whole block to Kimi on THOR

```
ROLE: You are Kimi on THOR. Ops only. No inventing new architectures.
GOAL: Make Satohash fully operational and green on HQ (https://hq.giveabit.io).
CODE OWNER: Grok on M3 already pushed main to GitHub. You pull + Docker + smoke + HQ wiring.
NEVER commit secrets, .env, keys, macaroons.

## CONTEXT (trust these facts)
- Product: Satohash — Bitcoin OTS notary. SPA: https://satohash.io (CF Pages). API: https://api.satohash.io (THOR Docker + Caddy).
- Version target: 5.0.0-ELITE. Live /health still reports 4.1.0-ELITE until you rebuild the API container.
- Metrics source of truth: https://api.satohash.io/metrics.json (schema gab.product-metrics.v1, productId satohash).
- SPA /metrics.json is a static mirror only — may lag. HQ must poll the API origin.
- Umami: https://analytics.giveabit.io already proxies to THOR Umami. Collect POST works. Do NOT re-point sites to raw IP:3002.
- Suite Umami tags already live on major products (giveabit, katoa, tadbuy, motopass, HQ, sherpacarta, stranded, openstrata, satohash).
- Family free stamps: REQUIRE_LIGHTNING=false until Cam explicitly wants paywall.
- Full brief also in satohash repo: docs/KIMI-HANDOFF.md (top POWER BRIEF) and docs/KIMI-POWER-PROMPT-SATOHASH.md.

## EXECUTE IN ORDER

### 1) Pull + rebuild API
cd to satohash on THOR
git pull origin main
docker compose -f docker-compose.vps.yml up -d --build
# fix path if your compose file differs; use the existing production compose only

### 2) Smoke (must all pass)
curl -sS https://api.satohash.io/health
# expect status ok AND version 5.0.0-ELITE (not 4.1.0)

curl -sS https://api.satohash.io/api/public/version
curl -sS https://api.satohash.io/metrics.json | head -c 400
# expect schema gab.product-metrics.v1, productId satohash, health green/ok

# optional stamp smoke (open free tier)
curl -sS -X POST https://api.satohash.io/api/stamp \
  -H 'Content-Type: application/json' \
  -H 'X-Satohash-Client: kimi-ops-smoke' \
  -d "{\"hash\":\"$(openssl rand -hex 32)\",\"filename\":\"kimi-ops.txt\"}"

### 3) HQ dashboard (hq.giveabit.io) — CRITICAL
- Ensure satohash project feed URL is exactly:
  https://api.satohash.io/metrics.json
- Confirm CORS_ORIGIN on API includes https://hq.giveabit.io (and pages.dev if used)
- Trigger HQ status refresh / wait for status matrix job
- Open https://hq.giveabit.io and verify satohash metrics tile is green with live counts (not stuck demo-only if stamps exist)
- If HQ still broken: fix projects.json / feeds config in HQ repo on THOR, redeploy HQ glass if needed — do not invent a second metrics schema

### 4) Umami (verify only — do not rebuild if healthy)
curl -sI https://analytics.giveabit.io/script.js | head -5
# optional: confirm satohash website id 720524e7-b747-4f95-8ce6-1a20fd4a599f still exists in Umami admin (Tailscale/localhost:3002)

### 5) Optional ops (only if Cam already asked)
- docs/KIMI-REQUEST-BITCOIN-WALLETS.md → L1 + Lightning wallets for future paywall
- BITCOIN_RPC_URL if pruned node ready
- Do NOT set REQUIRE_LIGHTNING=true without Cam yes

### 6) Report back to Cam (short)
Status message only:
- API rebuild: yes/no + health version string
- Stamp smoke: pass/fail
- HQ satohash green: yes/no + any feed URL you set
- Umami: still good / needs fix
- Blockers only if any
- No full chat dump; append one clean section to satohash docs/KIMI-HANDOFF.md if you change ops state, then git pull is enough for Grok next session

## SUCCESS CRITERIA
[ ] api.satohash.io/health version 5.0.0-ELITE
[ ] api.satohash.io/metrics.json 200 gab.product-metrics.v1
[ ] hq.giveabit.io shows satohash healthy with that API feed
[ ] analytics.giveabit.io still 200
[ ] No secrets committed
```
