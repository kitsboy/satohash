# Satohash — Ref / AGENTS

## Status
**Repo:** kitsboy/satohash (public GitHub) · **Live:** satohash.io + www.satohash.io  
**API:** api.satohash.io (on THOR, Docker) — v5.0.0-ELITE  
**Stack:** Node.js API, Bitcoin OpenTimestamps, AI notary (local embed+fraud), Lightning-ready

## Agents

| Agent | Role | Machine |
|-------|------|---------|
| Grok | Code, UI, API features, CF Pages | M3 / M4 |
| Kimi (Hermes) | Docker ops, Bitcoin node, LNbits, HQ wiring, backups | THOR VPS |

## Planes

| Plane | Where | Status |
|-------|-------|--------|
| SPA | CF Pages → satohash.io / www / pages.dev | 🟢 Live |
| API | THOR Docker → api.satohash.io | 🟢 v5.0.0-ELITE |
| AI | Embed, fraud, search, compliance, templates | 🟢 All live |
| Bitcoin node | Bitcoin Core v28.1 pruned (THOR) | 🟡 IBD in progress (~48%) |
| LNbits paywall | Wired, flip-ready (still free, REQUIRE_LIGHTNING=false) | 🟢 Ready (off) |
| Nostr | Multi-relay publish on stamp | 🟢 Good enough |
| Metrics SoT | `api.satohash.io/metrics.json` only | 🟢 Live |
| Explainer video | `/watch` page + music + VO | 🟢 Live |

## API endpoints (key ones)

| Endpoint | Purpose |
|----------|---------|
| `/health` `?deep=true` | Service + bitcoin + Nostr health |
| `/metrics.json` | HQ metrics envelope (gab.product-metrics.v1) |
| `/api/public/readiness` | All plane statuses |
| `/api/public/bitcoin` | Bitcoin node status |
| `/api/ai/embed` | Local embedding (model: satohash-local-bow-v1) |
| `/api/ai/fraud` | ML fraud detection (model: satohash-fraud-ml-v1) |
| `/api/ai/search` | Semantic search over stamps |
| `/api/compliance-check` | GDPR/compliance analysis |
| `/api/nostr/health` | Nostr relay health |

## Hard rules
- No secrets in git
- API = api.satohash.io only; SPA = CF Pages
- HQ feeds from API metrics.json only
- M3/M4 = code push; THOR = ops
