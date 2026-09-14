# Satohash Quick Start

**Prove a file existed. Never show the file. Bitcoin keeps the receipt forever.**

**Version:** 5.0.0-ELITE · **Updated:** 2026-09-14 · **Live:** https://satohash.io

Stamp a file, download a portable `.ots` proof, and verify it — no account, no wallet, no paywall.

Stamps are **free today**. Only a SHA-256 fingerprint leaves your device. Proofs anchor to **Bitcoin** via [OpenTimestamps](https://opentimestamps.org). Confirmation waits for the next Bitcoin block (~60 minutes).

## 60-second stamp

1. Open [satohash.io/stamp](/stamp).
2. Drop a file, pick from camera/gallery, or paste a hash.
3. Your browser hashes the bytes locally (Web Crypto / worker). The original file never uploads.
4. Satohash submits the hash to public OTS calendars (alice, bob, finney).
5. You land on **/stamp/done** — download the `.ots`, share `https://satohash.io/p/<hash>`.

Phone cameras cannot read `.ots` files. They open the QR, which is that `/p/<hash>` URL (also on PDFs and email).

If you go Back from the done screen, you will not re-submit.

## Verify

1. Open [satohash.io/verify](/verify).
2. Drop the original file, the `.ots`, or paste the hash.
3. **Pending ≠ Confirmed.** Pending means calendars have the hash. Confirmed means a Bitcoin block has sealed it (~60 minutes).

Anyone can re-verify later with Satohash or with the open-source `ots` CLI — even if this site is gone.

```bash
pip install opentimestamps-client
ots verify mydoc.pdf.ots -f mydoc.pdf
```

## CLI

From the repo (`packages/satohash-cli` — not the stale `bin/satohash.js`):

```bash
node packages/satohash-cli/bin/satohash.js stamp ./file.pdf
```

Defaults to `https://api.satohash.io`. Prints `https://satohash.io/p/<hash>` on success.

## Family widget (completes stamps)

Hash on-device. Default **completes** the stamp: `POST /api/stamp` and returns the proof card. Opt-in `data-mode="spa"` opens `/stamp?hash=&ref=` instead.

```html
<div data-satohash-stamp data-client="katoa" data-theme="jewel"></div>
<script src="https://satohash.io/widgets/stamp.js" async></script>
```

## What you get

| Artifact | What it is |
|---|---|
| `.ots` file | Portable OpenTimestamps proof |
| Proof package ZIP | `.ots` + hash + share extras |
| Share / QR | `https://satohash.io/p/<hash>` — cameras open this |
| Status pill | **Pending** vs Bitcoin-**Confirmed** — not the same |

## Standing product facts (2026-09-14)

- SPA: **https://satohash.io** (Cloudflare Pages)
- API: **https://api.satohash.io** — the SPA always calls this host
- Version: **5.0.0-ELITE**
- Paywall: **off** (`REQUIRE_LIGHTNING=false`)
- Bitcoin: own pruned **bitcoind** on THOR, at chain tip, `ready_to_verify`
- Languages: English, Español, Français, Deutsch, Português, Kiswahili, 中文
- Explainer: [/watch](/watch) (~84s Kimi/Pippa cut; 10s teaser toggle)
- Snapper, ZK redaction, BOLT-12, 3D Merkle: **not** current features

When a Lightning fee exists later, you would pay **us** a small invoice. The chain of proof stays Bitcoin + OTS.

## Next

- [How OpenTimestamps works](/docs/ots_setup)
- [Architecture](/docs/architecture)
- [Mission](/docs/mission)
- [FAQ](/faq)
- Family / API clients: see `docs/FAMILY-API.md` on GitHub
