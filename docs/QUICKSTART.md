# Satohash Quickstart

**Prove a file existed. Never show the file. Bitcoin keeps the receipt forever.**

Stamps are **free** today. No account. The file never leaves the device. Confirmation waits for the next Bitcoin block (~60 minutes). Bitcoin-only.

The public in-app guide is [`public/docs/quickstart.md`](../public/docs/quickstart.md) (also `/docs/quickstart` on the site).

---

## 1. Browser (happy path)

1. Open [https://satohash.io/stamp](https://satohash.io/stamp) — no account.
2. Drop a PDF, image, or any file. The browser computes SHA-256 locally (Web Crypto). The original bytes never upload.
3. Only the hash is sent to [https://api.satohash.io](https://api.satohash.io).
4. Download the `.ots` receipt. Share `https://satohash.io/p/<hash>` — that is the proof card. Phone cameras cannot read `.ots`; they open this URL (QR on PDFs and email).
5. Verify at [https://satohash.io/verify](https://satohash.io/verify), or with open tools:

```bash
pip install opentimestamps-client
ots verify mydoc.pdf.ots -f mydoc.pdf
```

**Pending ≠ Confirmed.** Pending = calendars have the hash. Confirmed = a Bitcoin block has sealed it (~60 minutes). Explainer: [https://satohash.io/watch](https://satohash.io/watch).

---

## 2. CLI (against the live API)

From this repo. Use **`packages/satohash-cli`** — not `bin/satohash.js` (that file is stale and still defaults to `localhost:3001`).

```bash
node packages/satohash-cli/bin/satohash.js status
node packages/satohash-cli/bin/satohash.js stamp ./file.pdf
```

| Env | Default | Notes |
|-----|---------|--------|
| `SATOHASH_API_URL` | `https://api.satohash.io` | No trailing slash required |
| `SATOHASH_KEY` | (empty) | Optional family key. Never commit. |

Every request sends `X-Satohash-Client: cli`. Public stamp rate limit is 5 / minute / IP. On 429 the CLI honors `Retry-After` and retries once.

```bash
export SATOHASH_API_URL=https://api.satohash.io   # default; set only to override
node packages/satohash-cli/bin/satohash.js stamp ./contract.pdf --watch
node packages/satohash-cli/bin/satohash.js verify <64hex>
```

On stamp success the CLI prints `https://satohash.io/p/<hash>`. Full command list: [packages/satohash-cli/README.md](../packages/satohash-cli/README.md).

Family sites can embed the same loop without a CLI. The file is hashed on-device (never uploaded). Default **completes** the stamp: `POST https://api.satohash.io/api/stamp` (`X-Satohash-Client`) and returns the proof card. Opt-in `data-mode="spa"` opens `/stamp?hash=&ref=` instead.

```html
<div data-satohash-stamp data-client="katoa" data-theme="jewel"></div>
<script src="https://satohash.io/widgets/stamp.js" async></script>
```

Contract: [docs/FAMILY-API.md](./FAMILY-API.md). Do not invent `/api/*` paths.

---

## 3. Local development (optional)

For contributing to the SPA or API. The live site does **not** use localhost.

**Prerequisites:** Node.js >= 20, npm, a modern browser.

```bash
git clone https://github.com/kitsboy/satohash.git
cd satohash
npm install
cp .env.example .env
```

To talk to the **live** API while running the SPA locally (usual):

```bash
export VITE_API_URL=https://api.satohash.io
npm run dev          # Vite :3000; optional local Express on :3001
```

To run a **local** API as well, set `VITE_API_URL=http://localhost:3001` and `PORT=3001`. Vite proxies API calls in that mode. Do not treat this as the product path — production is `api.satohash.io`.

| Process | Default |
|---------|---------|
| Frontend (Vite) | http://localhost:3000 |
| Local API (if started) | http://localhost:3001 |
| Live API | https://api.satohash.io |

Production build (SPA):

```bash
export VITE_API_URL=https://api.satohash.io
npm run build          # outputs to dist/
```

Deploy: [docs/deploy.md](./deploy.md). Architecture: [docs/architecture.md](./architecture.md).

---

## Key live pages

| Path | What |
|------|------|
| `/stamp` | Hash on-device, stamp, download `.ots` |
| `/stamp/done` | Receipt + share `/p/<hash>` |
| `/verify` | Public verify |
| `/p/<hash>` | Zero-JS proof card — camera QR target |
| `/watch` | Explainer |
| `/network` | Live calendars, bitcoind tip, recent stamps |

Contracts, Snapper-as-store-extension, ZK redaction, BOLT-12, native store apps, and private-key authorship are **later** — not the happy path.

---

## Troubleshooting

- **CLI talking to localhost:** you ran `bin/satohash.js`. Use `packages/satohash-cli/bin/satohash.js`.
- **Pending for ~60 min:** expected. Bitcoin block time is the confirmation. Pending is not Confirmed.
- **429 on stamp:** public rate limit 5/min. Wait for `Retry-After`.
- **Local port conflict:** change `PORT` / Vite port. Live SPA always calls `https://api.satohash.io`.
- **Agents:** [AGENTS.md](../AGENTS.md).

**Questions?** hello@giveabit.io · [satohash.io](https://satohash.io)

Built by Give A Bit — Bitcoin sovereignty tooling.
