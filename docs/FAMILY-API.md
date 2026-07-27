# Satohash Family API — shared proof plane

**Status:** Client packages + family free-tier middleware shipped; **public `api.satohash.io` goes live when VPS runs `docker-compose.vps.yml`.**  
**Kimi operator bible:** [`KIMI-VPS-RUNBOOK.md`](./KIMI-VPS-RUNBOOK.md) · **Vault paste:** [`MASTER-BRAIN-INGEST.md`](./MASTER-BRAIN-INGEST.md)

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
