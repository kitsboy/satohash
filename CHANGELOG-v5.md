# Satohash 5.0.0-ELITE — Sovereignty Ascension

## Highlights
- Live API plane extended with public stats, network, calendars, version, DID, stamp list/recent/batch, proof packages, multihash upload, webcapture, cosign, SSE feeds, OpenAPI stub, admin key mint, webhook register, ethereum bridge stub, prune job.
- Frontend cathedral surfaces: network dashboard, proof-of-existence, batch verify, live feed, compare, playground, bitcoin explainer, community wall, AI hub, widget embed, wizard, particle landing hero.
- Client package v2 helpers + CLI package `@satohash/cli`.
- Version pin `5.0.0-ELITE`.

## Skipped / already existed
- POST `/api/verify` (enhanced with `/api/verify/json`)
- GET `/api/stamps/:id?download=true` (alias `/ots`)
- Correlation ID / pino-http
- Capture URL (webcapture parallel)
- Collaboration cosign path (new `/stamp/cosign` JSON)
- Theme provider (persisted elsewhere)
- Many vault/templates features pre-v5

## Ops
- No Caddy/VPS config in this release
- Deploy API on THOR via existing docker image after pull
