# What's live

**Version:** 5.0.0-ELITE · **Updated:** 2026-08-20 · **Live:** https://satohash.io

Public status snapshot for Satohash. Agent session logs stay in the repo (`docs/handoff-log.md`); this page is for humans.

## Product

| Surface | Notes |
|---|---|
| `/` | Landing + marketing nav. CTA to the explainer. |
| `/stamp` · `/stamp/done` | Free stamp loop. Sticky CTA, camera/gallery, share + QR, proof ZIP. |
| `/verify` | File, hash, or `.ots`. Pending vs Bitcoin-confirmed. |
| `/templates` | Category chips, search, demo editor. |
| `/watch` | ~84s Kimi/Pippa cut (VO + dance bed); 10s teaser toggle. |
| `/government` | Solutions + Motopass concept. |
| `/network` | Live calendars / bitcoin / stamps dashboard. |
| `/docs` | This documentation set. |
| Languages | en · es · fr · de · pt · sw · zh |

## Infrastructure

- API **green** at `https://api.satohash.io` (5.0.0-ELITE)
- SPA always calls that API — never same-origin on Cloudflare Pages hosts
- Own pruned bitcoind at tip · `ready_to_verify: true`
- OTS calendars: alice / bob / finney (2 of 3 is healthy)
- Lightning configured but **paywall off**
- Metrics: `https://api.satohash.io/metrics.json`

## Standing orders

- Free stamps until Cam flips `REQUIRE_LIGHTNING`
- Do not change live `/api/*` paths without an explicit request
- Do not break `public/_redirects` SPA fallback or `GET /metrics.json`
- Version source of truth: `package.json` → `5.0.0-ELITE`

## Suggested next (not started)

- Full e2e stamp → live API → verify
- CI Lighthouse mobile gate
- Real-device Safari QA
- Longer educational explainer (~30s+) when Cam is ready
