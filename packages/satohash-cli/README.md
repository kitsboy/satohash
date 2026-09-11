# @satohash/cli

Stamp, verify, and watch Bitcoin-anchored proofs against the Satohash API. The file never leaves the machine — only a SHA-256 hex is POSTed.

## Install (from this repo)

No publish step. From the satohash repo root:

```bash
node packages/satohash-cli/bin/satohash.js help
node packages/satohash-cli/bin/satohash.js status
node packages/satohash-cli/bin/satohash.js stamp ./file.pdf
node packages/satohash-cli/bin/satohash.js verify <64hex>
node packages/satohash-cli/bin/satohash.js watch <64hex>
```

Optional PATH shim:

```bash
npx --prefix packages/satohash-cli satohash status
```

## Commands

| Command | What it does |
|---------|----------------|
| `status [--json]` | `GET /health` |
| `stamp <file> [--json] [--watch]` | Hash the file, `POST /api/stamp`, print the proof card URL |
| `verify <hash> [--json]` | `POST /api/verify` |
| `watch <hash> [--json] [--interval N]` | Poll `GET /api/stamps/:hash/by-hash` until Bitcoin-confirmed |

On stamp success the CLI prints `https://satohash.io/p/<hash>` (the zero-JS proof card). `--watch` on stamp keeps polling until confirmed.

## Env

| Variable | Default | Notes |
|----------|---------|--------|
| `SATOHASH_API_URL` | `https://api.satohash.io` | API base, no trailing slash required |
| `SATOHASH_KEY` | (empty) | Optional family key (`X-Satohash-Key`) |

Every request that talks to the stamp/verify plane sends **`X-Satohash-Client: cli`** so HQ `metrics.json` `raw.familyClients` attributes the stamp. Do not override that header.

Public stamp rate limit is 5 / minute / IP. On **429** the CLI honors `Retry-After` (seconds or HTTP-date), waits, and retries once.

## Examples

```bash
export SATOHASH_API_URL=https://api.satohash.io
# export SATOHASH_KEY=   # optional family key; never commit

node packages/satohash-cli/bin/satohash.js stamp ./contract.pdf
node packages/satohash-cli/bin/satohash.js stamp ./contract.pdf --watch --interval 20
node packages/satohash-cli/bin/satohash.js verify 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08 --json
```
