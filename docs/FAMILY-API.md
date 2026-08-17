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

Inbound deep-link stays `/stamp?hash=&ref=`. HQ `metrics.json` `raw.last10` + `raw.familyClients` are **read-only** aggregates.

## Architecture

| Piece | Role |
|-------|------|
| Cloudflare Pages | Static SPA satohash.io |
| VPS Docker | Express API + Redis |
| Public OTS calendars | Create aggregated timestamps |
| VPS pruned bitcoind (optional) | Verify independence |
| LND / LNbits | Settlement / tips — not OTS hashing |
| Family apps | Thin clients → API only |

**Orchestration:** Kimi on **VPS**. Code on **M3**. No Umbrel / no M4 coding.

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
Content-Type: application/json

{"hash":"<64 hex>","filename":"seal.json"}
```

## Public

Without family key → **402** if `REQUIRE_LIGHTNING` is not `false`.

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
