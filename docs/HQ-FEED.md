# Satohash → HQ feed directory

**Consumer:** https://hq.giveabit.io  
**Schema:** `gab.product-metrics.v1`  
**Canonical live:** https://api.satohash.io/metrics.json  
**SPA mirror (build-time):** https://satohash.io/metrics.json  

HQ should poll **API origin** every few minutes. SPA file is a CF Pages snapshot.

## What HQ gets from `/metrics.json`

| Block | Purpose |
|-------|---------|
| `health` | Status, deps (calendars, pending backlog, client attribution) |
| `kpis[]` | stamps_total/24h/7d, pending, confirmed, confirm_rate, family_free, api_clients, monthly_capacity, family_share_pct |
| `series[]` | stamps_daily, confirmed_daily, pending_depth (from DB), family_share |
| `funnels[]` | stamp_journey (hash → submit → calendar → bitcoin → pending) |
| `segments[]` | **by_client** (X-Satohash-Client), **by_status** |
| `offers[]` | API + SPA surfaces for Network / dependency map |
| `education[]` | Pitch/mold hints for operators |
| `links[]` | Deep links into product + API |
| `raw.directory` | Full public directory (hosts, endpoints, SPA routes, clients) |
| `raw.counts` | Raw counters for custom HQ cards |

## Extra endpoints for HQ intel

| URL | Use |
|-----|-----|
| `GET /api/public/status` | Heartbeat + deep_links + hosts |
| `GET /api/public/directory` | Same directory as `raw.directory` |
| `GET /api/public/stats` | Public stats (v5) |
| `GET /api/stamps/recent` | Live stamp feed |
| `GET /health` | Liveness / deep health |
| `GET /api/stamps/:id` | Single proof metadata |
| `GET /api/stamps/:hash/by-hash` | Proofs for a hash |

## Attribution contract (required for segments)

Family apps **must** send:

```http
X-Satohash-Client: sherpacarta
```

SPA deep-links use `?ref=sherpacarta` → SPA posts the same header.

Stored as `timestamps.client_id` for HQ `segments.by_client`.

## Deep-link contract (family → SPA)

```
https://satohash.io/stamp?hash=<64hex>&ref=<productId>[&label=][&campaign=]
```

Home `/?hash=` redirects to `/stamp`.

## Do not put in metrics

- API keys, LNbits secrets, nsec, PII, file contents, full user lists
- Invented uptime percentages or synthetic growth curves
- Demo series when real stamps exist (`raw.demo` must be `false`)

## Learn (2026-07-27)

See **`docs/LEARN-STAMP-FAMILY.md`**. SPA on CF Pages must call **API origin** for stamps; family clients send `X-Satohash-Client` / `ref` so `by_client` segments light up after THOR Docker rebuild.
