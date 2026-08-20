# Satohash SEO Strategy & Uniformity Protocol (2026-08-21)

## The uniform SEO standard (every site, current + future)

Every site in the Give A Bit family gets the SAME treatment, enforced by the
nightly self-healing audit (`/root/hq/scripts/seo-audit.py` → HQ SEO Plane):

| Signal | What it is | How to fix |
|--------|-----------|-----------|
| Site up | Reachable | — |
| Security headers | CSP + HSTS | `_headers` file |
| robots.txt | Crawl map | static file |
| sitemap.xml | Page list | static file |
| **llms.txt** | **AI crawler map** | static file |
| Structured data | JSON-LD | index.html / app.html |
| hreflang | Language routing | static alternates in head |
| Prerender | Crawlers see real HTML | CF middleware (functions/_middleware.js) or SSR |
| AI crawler access | GPTBot/Claude/Perplexity not 403 | **CF dashboard AI Crawl Control** (per domain) |

## Self-healing loop (LIVE)

1. **Nightly 01:10** cron runs `seo-audit.py` (10 sites, auto-discovers new ones from projects.json)
2. Writes `metrics/seo-audit.json` → HQ **SEO Plane** tab shows scores + plain-English tooltips
3. **Regression detection**: score drop ≥15 or a green→red signal → logged to `docs/FIXES-LOG.md` + alert
4. New sites **join automatically** (auto-discovered from projects.json) — zero manual setup

## Current state (2026-08-21): 92/100 A — 6 sites at 100

Satohash, Give A Bit, MotoPass, Tadbuy, OpenStrata, HQ = 100.
SherpaCarta/Katoa (89): **needs Cam** — CF AI Crawl Control unblock for GPTBot/ClaudeBot/PerplexityBot (same as satohash).
Stranded (89): hreflang pushed, deploy pending verify.
Buzz (56): planned project, not launched.

## To make everything 100 (Cam, 2 min per site in CF)

For **sherpacarta.org** and **katoa.org**: dash.cloudflare.com → domain → Security → AI Crawl Control → unblock GPTBot, ClaudeBot, PerplexityBot, ChatGPT-User (exactly what we did for satohash.io).

## Handoff to Grok (family-site code — M3 lane)

- X-Satohash-Client attribution (katoa, motopass, sherpacarta, tadbuy): add header on satohash API calls
- On-chain donate address for katoa, motopass, tadbuy, stranded, openstrata


Prepared by Kimi (THOR). Tier 1 + Tier 2 shipped in parallel-agent batch; this doc is the
next-wave blueprint. All items are fully autonomous (Kimi + spawned agents, end-to-end).

## Tier 3 — Product depth (next batch, highest value first)

| # | Item | Files/area | Notes |
|---|------|-----------|-------|
| 1 | Embeddable "Stamp on Satohash" widget | `src/components/widgets/*`, new route `/widget`, `public/widget-embed.js` | Copy-paste snippet; iframe + API; family sites can drop it in (katoa, tadbuy, sherpacarta…) |
| 2 | CLI polish | `packages/satohash-cli` | Add `--watch` (stamp → auto-upgrade → verify → show block), `--json` output, install docs page |
| 3 | API docs polish | `server/swagger.js`, `/api-docs` | Complete OpenAPI for public endpoints + live "try it"; examples for stamp/batch/webhooks |
| 4 | Webhook recipe templates | `docs/WEBHOOKS.md` | Ready-made Zapier/Make recipes + payload examples |
| 5 | PWA polish | `vite-plugin-pwa`, `sw.js` | Offline page, install prompt, better stamp-flow caching |
| 6 | Light/dark theme toggle | theme context + `index.html` class | Tailwind makes it quick; respect `prefers-color-scheme` default |
| 7 | Batch stamping UI upgrade | `src/pages/BatchTimestamp.jsx` | 10 files, progress, one certificate pack (zip) |

## Tier 4 — Reliability & hygiene

| # | Item | Files/area | Notes |
|---|------|-----------|-------|
| 1 | Sentry DSN wiring | `.env` + Vault | Code already inits both server (`config.SENTRY_DSN`) and client (`VITE_SENTRY_DSN`). **Cam-gated:** needs a free DSN from sentry.io (2-min setup) → Vault, never git. Self-hosting Sentry on THOR is NOT recommended (needs kafka+clickhouse, ~8GB RAM). |
| 2 | CI smoke tests | `.github/workflows/*` | ✅ **DONE** — `ci.yml` runs eslint + i18n + vitest + playwright (chromium+webkit) on push/PR. `deploy.yml` + `lighthouse-weekly.yml` also live. |
| 3 | Cache-header audit | `public/_headers` | ✅ **DONE** — `/` + `/index.html` + `/sw.js` no-cache; `/b/*` 1h immutable-safe; `/media/video/*` 5min; `/metrics.json` 60s CORS. Verified current. |
| 4 | On-site metrics strip | `src/pages/Landing.jsx` | ✅ **DONE** — landing shows live `proofCount` from API ("N Bitcoin-anchored proofs issued through this plane"). |
| 5 | Security headers sweep | helmet + `_headers` | ✅ **DONE 2026-08-20** — live sweep of /, /stamp, /verify, /status, /api/public/status, /docs/learn-*: full CSP, HSTS preload, X-Frame-Options DENY, nosniff, strict-origin-when-cross-origin, permissions-policy all present. No changes needed. |

## Gate (needs Cam — NOT autonomous)

- LN channels open (needs capital + Cam go)
- Paywall flip (business decision)
- Umbrel node integration (hardware)
- iPhone Safari physical test of `/p/<hash>`

## Handoff to Grok (family-site code — M3 lane)

These are code changes in family repos (M3/Grok territory — Kimi does not push code there):

- **X-Satohash-Client attribution** (katoa, motopass, sherpacarta, tadbuy): when each site
  calls satohash `/api/stamp` or `/stamp?hash=&ref=`, add header
  `X-Satohash-Client: <site-id>` (server stores it → HQ tiles go live). One-line JS change per repo.
- **On-chain donate address** for katoa, motopass, tadbuy, stranded, openstrata: add the LND
  address `bc1qkrlg6ssme0ztgynr2us846mtlde0r33ly7kdmc` (or per-site fresh addresses) to each
  site's wallets.json + a donate section. SherpaCarta already has one.

## Process

- Each tier = one parallel-agent batch (max 4 agents, strict file ownership, no shared-file edits)
- Orchestrator (Kimi): pre-wire routes → spawn → review → lint+build+test → commit+push → verify live
- Handoff updated after each batch; LATEST-UPDATE.md kept current
