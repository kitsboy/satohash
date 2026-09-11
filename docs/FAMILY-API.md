# Satohash Family API — shared proof plane

**Status:** SPA deep-link + live API plane.  
**Kimi operator bible:** [`KIMI-VPS-RUNBOOK.md`](./KIMI-VPS-RUNBOOK.md) · **Vault paste:** [`MASTER-BRAIN-INGEST.md`](./MASTER-BRAIN-INGEST.md)

## Deep-link contract (family → SPA)

Canonical stamp entry for Sherpa, MotoPass, Katoa, etc.:

```
https://satohash.io/stamp?hash=<64hex>&ref=<productId>[&label=][&campaign=][&filename=]
```

| Param | Required | Notes |
|-------|----------|--------|
| `hash` | yes | 64 hex SHA-256 |
| `ref` or `source` | recommended | e.g. `sherpacarta`, `motopass`, `katoa` → SPA sends `X-Satohash-Client` |
| `label` / `filename` / `campaign` | optional | Display + attribution |

Also accepted (client redirect to `/stamp`):

```
https://satohash.io/?hash=<64hex>&ref=<productId>
https://satohash.giveabit.io/stamp?hash=…&ref=…
```

**After stamp — share these (do not invent new API paths):**

```
https://satohash.io/p/<64hex>          # zero-JS proof card (family iMessage / email)
https://satohash.io/verify/<64hex>     # interactive verify
https://satohash.io/verify/<stamp-id>  # UUID from POST /api/stamp
```

Inbound deep-link stays `/stamp?hash=&ref=`. HQ `metrics.json` `raw.last10` + `raw.familyClients` are **read-only** aggregates (**live on API 2026-08-17**).

## Drop-in widget

Family sites can paste this instead of wiring the deep-link by hand. The script SHA-256s the file **on-device** (the file is never uploaded), then opens `/stamp?hash=<64hex>&ref=<productId>`. The SPA sends `X-Satohash-Client` from `data-client`. HQ `metrics.json` `raw.familyClients` counts only stamps that complete with that id — paste is not live attribution.

Swap `data-client` for the exact product id: `katoa` · `motopass` · `sherpacarta` · `giveabit`. Theme: `jewel`.

```html
<div data-satohash-stamp data-client="katoa" data-theme="jewel"></div>
<script src="https://satohash.io/widgets/stamp.js" async></script>
```

Do **not** invent new API paths. Stamp remains `POST /api/stamp`.

## Architecture

| Piece | Role |
|-------|------|
| Cloudflare Pages | Static SPA satohash.io |
| VPS Docker | Express API + Redis |
| Public OTS calendars | Create aggregated timestamps |
| VPS pruned bitcoind (optional) | Verify independence |
| LND / LNbits | Settlement / tips — not OTS hashing |
| Family apps | Thin clients → API only |

**Orchestration:** Kimi on **THOR VPS** (Obsidian / MASTER-BRAIN on THOR, not M4). Code on **M3**. No Umbrel / no M4 coding.

## Free for us

Server:

```bash
FAMILY_API_KEYS=<openssl rand -hex 24>
REQUIRE_LIGHTNING=false   # or true once public paywall is ready
```

Client:

```http
POST /api/stamp
X-Satohash-Key: <family key>
X-Satohash-Client: motopass
# Required for HQ segments (timestamps.client_id). Examples:
#   sherpacarta | sherpacarta-canada | motopass | katoa | spa | cli
# Public MotoPass widget / SPA: X-Satohash-Client: motopass
# HQ country-intel cron (scripts/stamp-changed.mjs): motopass-intel — do not use on the public site
Content-Type: application/json

{"hash":"<64 hex>","filename":"seal.json"}
```

## Public

Without family key → **402** if `REQUIRE_LIGHTNING` is not `false`.

**Stamp rate limit (2026-08-17):** public `POST /api/stamp` is **5 / minute / IP**. Family key (`X-Satohash-Key`) is **30 / minute**. Re-submitting an existing hash returns the stored proof (`reused: true`) and does **not** hit calendars again.

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| GET | `/health` | public |
| GET | `/health?deep=true` | public (best-effort deps) |
| GET | `/metrics.json` | public (HQ product metrics v1) |
| GET | `/api/public/status` | public (HQ heartbeat) |
| GET | `/api/public/directory` | public (hosts, endpoints, clients) |
| GET | `/api/stamps/recent` | public |
| POST | `/api/stamp` | family key / L402 / open |
| GET | `/api/stamps/:id` | public |

## VPS one-shot

```bash
# on VPS
git pull
cp .env.vps.example .env   # edit secrets
bash scripts/vps-deploy-api.sh
# DNS: api.satohash.io A/AAAA → VPS
```

## Client package

See `packages/satohash-client/` — copy into motopass, katoa, giveabit, etc.

## Donations / tips (not stamp paywall)

Product support addresses are **not** the same as family free-tier stamp keys.  
Kimi provisions LNbits wallet **`satohash`** + public on-chain + LUD-16; secrets stay in HQ Vault.  
See **[KIMI-REQUEST-BITCOIN-WALLETS.md](./KIMI-REQUEST-BITCOIN-WALLETS.md)**. Grok wires SPA only after public handback.

## HQ

See **[HQ-FEED.md](./HQ-FEED.md)** for the full inventory.

| Poll | URL |
|------|-----|
| Metrics envelope | `https://api.satohash.io/metrics.json` |
| Heartbeat | `https://api.satohash.io/api/public/status` |
| Directory | `https://api.satohash.io/api/public/directory` |
| Health | `https://api.satohash.io/health` |
| Recent stamps | `https://api.satohash.io/api/stamps/recent` |

Glass: https://hq.giveabit.io

## Stable connection

Additive client resilience only — **do not invent or rename `/api/*` paths.** Prefer `packages/satohash-client` (or match this policy). Widget default remains the SPA deep-link; `data-mode="api"` is opt-in and still hashes on-device (file is never uploaded).

### Timeouts

| Call | Timeout |
|------|---------|
| `GET /health` (`getApiHealth` / `ping`) | 8s |
| `GET /api/public/status` | 8s |
| `POST /api/stamp` | 45s |
| `GET /api/stamps/:id` | 10s |

Server socket: keep-alive 65s (headers 66s), request timeout 120s. OTS stamp budget stays 30s server-side.

### Retries

- Network failure and HTTP **502 / 503 / 504**: up to **2** retries (fresh timeout each attempt).
- HTTP **429**: honor `Retry-After` (cap **10s**), then **one** retry.
- Widget `data-mode="api"`: **one** retry on 429 / 5xx, then fall back to `/stamp?hash=&ref=`.

### Headers

```http
X-Satohash-Client: motopass
X-Satohash-Key: <family key>   # optional free-tier; never commit
```

`X-Satohash-Client` is required for HQ `raw.familyClients` attribution. CORS already allows both headers.

### Family client ids

Use the exact product id (lowercase):

`katoa` · `motopass` · `sherpacarta` · `giveabit` · `tadbuy` · `spa` · `cli`

### Proof card (do not invent paths)

```
POST /api/stamp
GET  /api/stamps/:id
GET  /health
GET  /metrics.json
GET  /api/public/status

https://satohash.io/stamp?hash=<64hex>&ref=<productId>
https://satohash.io/p/<64hex>          # zero-JS proof card
https://satohash.io/verify/<64hex>
```

Smoke: `node scripts/family-api-smoke.mjs` (live `api.satohash.io`; asserts `raw.requireLightning === false` and `gitSha` present).

## CLI (`packages/satohash-cli`)

From the repo (no npm publish required):

```bash
node packages/satohash-cli/bin/satohash.js stamp ./file.pdf
```

Commands: `status`, `stamp`, `verify`, `watch`. Always sends `X-Satohash-Client: cli` (HQ `raw.familyClients`). Env: `SATOHASH_API_URL` (default `https://api.satohash.io`), `SATOHASH_KEY`. Stamp success prints `https://satohash.io/p/<hash>`. Honors `Retry-After` on 429 (wait + one retry). See [`packages/satohash-cli/README.md`](../packages/satohash-cli/README.md).
