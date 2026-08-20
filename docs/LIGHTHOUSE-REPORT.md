# LIGHTHOUSE-REPORT.md — Satohash transparency dashboard & site audit

> Ops doc. Honest findings from a curl-based performance/security audit (no Lighthouse binary),
> plus what was fixed in this change. Audit date: **2026-08-20** against the live site
> (satohash.io) and API (api.satohash.io). All numbers below were measured live via curl.

---

## 1. What changed in this push

| File | Change |
|---|---|
| `src/pages/StatusPublic.jsx` | Upgraded from static page to live transparency dashboard (see §2) |
| `src/components/shared/LiveNodeChip.jsx` | Correctness fix: `/api/public/readiness` is not on the live public surface, so it now falls back to `/health?deep=true` (public deep health) and reads `details.bitcoin` / `details.paywall` instead of `planes.*` |
| `docs/LIGHTHOUSE-REPORT.md` | This report (new) |
| `.env.example` | Documented `SENTRY_DSN` (server, `config.SENTRY_DSN`) and `VITE_SENTRY_DSN` (client SPA, consumed by `src/main.jsx`) — both already wired in code, were just undocumented |

---

## 2. StatusPublic.jsx — live transparency dashboard

The public `/status` page now renders five live sections plus a recent-stamps list, all
read-only, no auth, English only, matching the existing dark theme
(`--accent-gold`, `--border`, `--bg-primary`, `--text-secondary`), Tailwind, framer-motion,
lucide-react, and the existing `usePageMeta` + `Footer` page pattern.

### Endpoints consumed (shapes verified live via curl)

| Section | Endpoint | Verified shape |
|---|---|---|
| Service overview | `GET /api/public/status` | `{ ok, service, plane, role, family_free_tier, require_lightning, stamps_stored, timestamp, … }` |
| Bitcoin node | `GET /health?deep=true` → `details.bitcoin` | `{ configured, status, source, block_height, headers, ibd, progress_pct, peers, chain, pruned, mempool_count, ready_to_verify }` |
| OTS calendars | `GET /health?deep=true` → `details.ots.calendars` | `[ { url, status: "healthy"|… } ]` (alice, bob, finney) |
| Nostr relays | `GET /health?deep=true` → `details.nostr` | `{ status, ok_count, total, relays: [ { url, latency, status, error } ] }` |
| Lightning / LNURL | `GET /health?deep=true` → `details.lightning` | `{ status, lnbits: { configured, status, name, balance_msat, balance_sats, ready_for_paywall }, lnd }` |
| Network fees (companion) | `GET /api/public/network` | `{ source, block_height, fees: { fastestFee, … }, halving }` |
| 24h stats (companion) | `GET /api/public/stats` | `{ window, stamps_created, clients_active, avg_confirm_time_sec, calendar_health }` |
| Recent stamps | `GET /api/stamps/recent` | `{ stamps: [ { id, hash, status, created_at, client } ] }` (20 most recent) |

Fallbacks: recent stamps falls back to `metrics.json` → `raw.last10` if
`/api/stamps/recent` fails; every section shows a per-card "unavailable" state if its
endpoint fails or the shape is unexpected, and the page header shows a "last updated"
timestamp (from `/api/public/status.timestamp`, with a refresh button).

### Shape mismatches found (all handled in component)

1. `/api/public/readiness` (used by `LiveNodeChip`) **does not exist** on the live public
   API — the chip was silently rendering nothing. Fixed to fall back to `/health?deep=true`
   (`details.bitcoin.ready_to_verify`, `details.paywall.require_lightning`).
2. `details.lightning` nests under `lnbits.*` (name, ready_for_paywall) — component reads
   the nested shape, not a flat `lightning.name`.
3. `/api/stamps/recent` returns `{ stamps: [...] }`, not a bare array.
4. `metrics.json` `raw.last10` fallback was confirmed present but not needed in the live run.

---

## 3. HTTP status of key routes (live, 2026-08-20)

| Route | HTTP status |
|---|---|
| `/` | 200 |
| `/stamp` | 200 |
| `/verify` | 200 |
| `/status` | 200 |
| `/faq` | 200 |
| `/donate` | 200 |
| `/docs/learn-what-is-opentimestamps` | 200 |

All key public routes serve 200. No dead links found in the primary navigation.

---

## 4. Security headers on `/` (live)

| Header | Value found | Verdict |
|---|---|---|
| `content-security-policy` | `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://analytics.giveabit.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; media-src 'self' blob:; worker-src 'self' blob:; connect-src 'self' https://api.satohash.io wss://api.satohash.io https://mempool.space https://analytics.giveabit.io https://alice.btc.calendar.opentimestamps.org https://bob.btc.calendar.opentimestamps.org https://finney.calendar.eternitywall.com` | ✅ Present, well-scoped (no `'unsafe-eval'` on script-src; `frame-ancestors 'none'`; connect-src pinned to known origins). `'unsafe-inline'` on script-src is the only notable looseness (required by the PWA/inline bootstrapping) |
| `strict-transport-security` | `max-age=31536000; includeSubDomains; preload` | ✅ Present, 1 year + preload |
| `x-content-type-options` | `nosniff` | ✅ Present |
| `referrer-policy` | `strict-origin-when-cross-origin` | ✅ Present (privacy-safe default) |

**Security verdict: good.** The four core headers are all present with sensible values.
No action taken this push.

---

## 5. Caching pattern: `/b/*` long-cache vs `index.html` no-cache

| Resource | `cache-control` | Notes |
|---|---|---|
| `/` (index.html) | `public, max-age=0, must-revalidate` | ✅ Correct: HTML is revalidated every load, so new deploys (new hashed bundle) propagate immediately |
| `/b/index-*.js` (hashed bundle) | `public, max-age=14400, must-revalidate` | ✅ Content-hashed filename ⇒ immutable; 4h CDN cache is safe. Could go to `max-age=31536000, immutable` for a slightly better cache hit rate — **recommendation only**, not changed |
| `/logo.png` | served with etag / default | fine |

Pattern is **correct as-is**: hash-named bundle under `/b/` gets the long cache; the
un-hashed HTML entry never caches stale. No fix needed.

---

## 6. Page weight (live, gzip over the wire)

| Asset | Raw bytes | Gzip bytes | Notes |
|---|---|---|---|
| `/` index.html | 19,056 | ~4,464 | Includes inline bootstrapping + i18n hreflang links |
| `/b/index-CiKT2Kvw.js` (main bundle) | 675,938 | 132,876 | Single hashed bundle |
| **Total first load** | **694,994** | **~137,340 (≈134 KB)** | gzip ratio ≈ 5.1× |

**Weight verdict: acceptable for a feature-rich SPA** (~134 KB gzipped total; the OTS
library and crypto deps dominate). The bundle is already code-split where it matters.
Recommendations (not changed this push): consider splitting the OTS/bitcoin crypto chunks
via dynamic `import()` on the `/stamp` route only, and add `immutable` to the `/b/*`
cache header. Both are deploy-time nginx config, out of scope for a client-only change.

---

## 7. Verification performed

- `npx eslint src/pages/StatusPublic.jsx src/components/shared/LiveNodeChip.jsx` → **clean (exit 0)**.
- `node --check` — n/a for `.jsx` (Node 22 rejects the `.jsx` extension without a loader);
  eslint is the authoritative syntax gate for these files and passed.
- Every endpoint shape in §2 was curl-verified live **before** the component code was
  written; mismatches (readiness route missing, nested `lnbits`, `{stamps:[]}` wrapper)
  are documented in §2 and handled defensively in code.
- No `npm install` / `npm run build` run (hard rule); `dist/` untouched.

---

*This report is an ops artifact, not a sales sheet — numbers are from live curl runs and
will drift as the site evolves.*
