# Satohash production closeout — 2026-07-28

## Operational (green)

| Plane | Status |
|-------|--------|
| API `api.satohash.io` | v5.0.0-ELITE live |
| Free stamps | `REQUIRE_LIGHTNING=false` |
| Paywall flip-ready | LNbits invoice key on THOR env; 21 sats |
| AI | embed / fraud / search / compliance / templates live |
| Nostr | multi-relay; soft-fail damus |
| HQ metrics | `https://api.satohash.io/metrics.json` only |
| SQLite backup | THOR daily 06:00 UTC, 7-day, local path |
| Security handoffs | status words only (no key material) |

## In progress

| Item | Owner | Note |
|------|--------|------|
| Bitcoind IBD | Kimi | pruned; report when `source: bitcoind` |
| www.satohash.io | Grok CF | Added to Pages project 2026-07-28; wait SSL/active |

## Cam defaults (unless overridden)

- Launch **free**
- Claude **optional later**
- FAMILY keys **no rotate** until public hype
- HQ Vault invoice paste **optional** (Money tab)
- Bitcoin: pruned + **mempool fallback forever** after IBD

## Flip paid (when Cam says)

1. Confirm LNbits healthy on readiness  
2. `REQUIRE_LIGHTNING=true` on THOR .env  
3. Restart API  
4. Suite apps use `X-Satohash-Key` for free family tier  

## Smoke (API)

```bash
curl -sS https://api.satohash.io/health
curl -sS https://api.satohash.io/api/public/readiness | jq .
curl -sS https://api.satohash.io/api/public/bitcoin | jq .
curl -sS https://api.satohash.io/metrics.json | jq .health
```

*Safe Harbour · Give A Bit*
