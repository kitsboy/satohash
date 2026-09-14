# Satohash 5.0.0-ELITE

[![Version](https://img.shields.io/badge/version-5.0.0--ELITE-indigo.svg)](https://github.com/kitsboy/satohash)
[![License](https://img.shields.io/badge/license-MIT-black.svg)](LICENSE)
[![Protocol](https://img.shields.io/badge/protocol-OpenTimestamps-orange.svg)](https://opentimestamps.org)
[![Parent Studio](https://img.shields.io/badge/studio-Give_A_Bit-orange.svg)](https://giveabit.io)

> **Prove a file existed. Never show the file. Bitcoin keeps the receipt forever.**

Hash a file on your device. Stamp the fingerprint. Download a portable `.ots` receipt. Bitcoin keeps it.

**Live loop:** [satohash.io/stamp](https://satohash.io/stamp) → [verify](https://satohash.io/verify) → share [`/p/<hash>`](https://satohash.io/p/). No account. Free stamps. The file never leaves the device.

Phone cameras cannot read `.ots` files. Proof cards encode **`https://satohash.io/p/{hash}`** as a QR (PDFs and email too) — scanning it opens the zero-JS receipt. **Pending** means calendars have the hash; **Confirmed** means a Bitcoin block has sealed it (~60 minutes). They are not the same.

**API:** [https://api.satohash.io](https://api.satohash.io) · **Watch:** [satohash.io/watch](https://satohash.io/watch) (~84s)

> **Agents:** start at **[AGENTS.md](AGENTS.md)** · status **[.ai_docs/current-status.md](.ai_docs/current-status.md)** · handoff **[docs/handoff-log.md](docs/handoff-log.md)**.

### What is live vs later

| Live today | Later (cathedral) |
|------------|-------------------|
| Stamp, download `.ots`, verify, share `/p/<hash>` | Private-key authorship (proves *who*, not only *when*) |
| Camera QR → `https://satohash.io/p/{hash}` · Pending ≠ Confirmed | Lightning paywall / BOLT-12 / L402 |
| File hashed on-device; only the SHA-256 leaves | Multi-party contracts |
| Production API at `api.satohash.io` + own `bitcoind` at tip | Snapper Chrome extension (store-shipped) |
| Family widget POST `/api/stamp` + CLI | Native store apps |
| Explainer at `/watch` | ZK redaction as a product |

Today Satohash proves **when** a file existed, not **who** made it. Confirmation waits for the next Bitcoin block (~60 minutes). Bitcoin-only — no other chain.

### Documentation & pitch

| Resource | Path |
|----------|------|
| **Explainer (~84s)** | [/watch](https://satohash.io/watch) · media `public/media/video/` |
| **Exec summary (UI)** | [/docs/executive-summary](https://satohash.io/docs/executive-summary) |
| **Live pitch deck** | [/pitch](https://satohash.io/pitch) |
| Executive summary (md) | [docs/marketing/EXECUTIVE-SUMMARY.md](docs/marketing/EXECUTIVE-SUMMARY.md) |
| Product pitch | [docs/marketing/PITCH.md](docs/marketing/PITCH.md) |
| Brand voice | [docs/marketing/BRAND-VOICE.md](docs/marketing/BRAND-VOICE.md) |
| Mission & scope | [docs/MISSION-SCOPE-v3.md](docs/MISSION-SCOPE-v3.md) |
| Architecture | [docs/architecture.md](docs/architecture.md) |
| Deploy | [docs/deploy.md](docs/deploy.md) |
| Quickstart | [docs/QUICKSTART.md](docs/QUICKSTART.md) |
| Family widget / API | [docs/FAMILY-API.md](docs/FAMILY-API.md) |

---

## How it works

1. Your browser (or the CLI) computes SHA-256 locally. The original bytes never upload.
2. Only the 64-character hash is sent to the API, which submits it to public OpenTimestamps calendars.
3. Calendars aggregate hashes and commit a Merkle root to Bitcoin.
4. After ~60 minutes a block seals the receipt. Download the `.ots`. Share `https://satohash.io/p/<hash>`.

Verify at [satohash.io/verify](https://satohash.io/verify) or with open OpenTimestamps tools. A hash of a short, guessable input can theoretically be reverse-matched — fine for real documents, not a privacy shield for trivial files.

---

## Use it

**Browser** — [https://satohash.io/stamp](https://satohash.io/stamp)

**CLI** — from this repo (`packages/satohash-cli`; not `bin/satohash.js`, which is stale):

```bash
node packages/satohash-cli/bin/satohash.js status
node packages/satohash-cli/bin/satohash.js stamp ./file.pdf
```

`SATOHASH_API_URL` defaults to `https://api.satohash.io`. Every request sends `X-Satohash-Client: cli`. See [packages/satohash-cli/README.md](packages/satohash-cli/README.md).

**Family widget** — Katoa, MotoPass, Sherpa, Give A Bit, TadBuy. Hashes on-device, then **POST**s `/api/stamp` (completes the stamp; `data-mode="spa"` still opens `/stamp?hash=…&ref=…`):

```html
<div data-satohash-stamp data-client="katoa" data-theme="jewel"></div>
<script src="https://satohash.io/widgets/stamp.js" async></script>
```

Source: [`public/widgets/stamp.js`](public/widgets/stamp.js). Contract: [docs/FAMILY-API.md](docs/FAMILY-API.md).

---

## Technical architecture

Local-first hashing. The server only ever sees hashes and metadata.

- **SPA:** React 18 + Vite 6 on Cloudflare Pages (`satohash.io` / `www` / `pages.dev`). Bundles at `/b/*`.
- **API:** Express 5 on THOR Docker at **`https://api.satohash.io`** (production). Local `npm run dev` is for development; the live SPA always calls the public API.
- **Proofs:** OpenTimestamps → Bitcoin. Own pruned `bitcoind` at tip.
- **Hashing:** Web Crypto in the browser; Node crypto in the CLI.
- **Identity (optional):** Nostr NIP-05 / NIP-07 — public keys only. `nsec` never in git.
- **Metrics:** `https://api.satohash.io/metrics.json` (SPA `/metrics.json` is a Cloudflare Function proxy).

Full map: [docs/architecture.md](docs/architecture.md). Deploy: [docs/deploy.md](docs/deploy.md).

---

## Project structure (key paths)

```
├── src/                  # SPA (stamp, verify, /p/<hash>, network, watch, …)
├── server/               # Express API (live at api.satohash.io)
├── packages/satohash-cli # CLI — default API https://api.satohash.io
├── public/widgets/       # Family stamp widget (stamp.js)
├── public/media/video/   # Explainer cuts
├── functions/            # Cloudflare Pages Functions (proof card, metrics proxy)
├── extension/satohash-snapper/  # Unpacked MV3 scaffold — not store-shipped
├── docs/                 # Humans: architecture.md, deploy.md, marketing/, diligence/
├── AGENTS.md             # Agent entry
└── tests/                # Vitest + Playwright
```

---

## Common commands

```bash
npm install                 # Install
npm run dev                 # Local Vite (:3000) + Express (:3001)
npm run build               # Production build to dist/
npm test                    # Vitest
npm run test:e2e            # Playwright
npm run lint && npm run format
```

Live site: **https://satohash.io** (Cloudflare Pages). Live API: **https://api.satohash.io**.

Full setup: [docs/QUICKSTART.md](docs/QUICKSTART.md)

---

## Legal & compliance

Satohash provides cryptographic evidence of a **date** — not legal advice, and not proof of authorship. Frameworks such as the US ESIGN Act and UETA, and the EU's eIDAS regulation, recognize timestamped electronic records as admissible evidence. Admissibility is not the same as a court accepting a specific legal conclusion. A Satohash proof is independently checkable evidence of *when*; a court still weighs it in context.

---

© 2026 Give A Bit. MIT License — see [LICENSE](LICENSE).

**Diligence / partner pack:** [docs/diligence/](docs/diligence/)  
Portfolio: [Family of 8](https://giveabit.io/family)
