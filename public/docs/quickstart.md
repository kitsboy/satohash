# Satohash Quick Start

**Version:** 5.0.0-ELITE · **Updated:** 2026-08-16 · **Live:** https://satohash.io

Stamp a file, download a portable `.ots` proof, and verify it — no account, no wallet, no paywall.

Stamps are **free today**. Only a SHA-256 fingerprint leaves your device. Proofs anchor to **Bitcoin** via [OpenTimestamps](https://opentimestamps.org).

## 60-second stamp

1. Open [satohash.io/stamp](/stamp).
2. Drop a file, pick from camera/gallery, or paste a hash.
3. Your browser hashes the bytes locally (Web Crypto / worker).
4. Satohash submits the hash to public OTS calendars (alice, bob, finney).
5. You land on **/stamp/done** — download the `.ots`, share, or show a QR.

The original file never uploads. If you go Back from the done screen, you will not re-submit.

## Verify

1. Open [satohash.io/verify](/verify).
2. Drop the original file, the `.ots`, or paste the hash.
3. Pending means calendars have the hash but Bitcoin has not confirmed yet.
4. Confirmed means the Merkle path reaches a Bitcoin block.

Anyone can re-verify later with Satohash or with the open-source `ots` CLI — even if this site is gone.

```bash
pip install opentimestamps-client
ots verify mydoc.pdf.ots -f mydoc.pdf
```

## What you get

| Artifact | What it is |
|---|---|
| `.ots` file | Portable OpenTimestamps proof |
| Proof package ZIP | `.ots` + hash + share extras |
| Share / QR | Deep link back to verify |
| Status pill | Pending vs Bitcoin-confirmed |

## Standing product facts (August 2026)

- SPA: **https://satohash.io** (Cloudflare Pages)
- API: **https://api.satohash.io** — the SPA always calls this host
- Version: **5.0.0-ELITE**
- Paywall: **off** (`REQUIRE_LIGHTNING=false`)
- Bitcoin: own pruned **bitcoind** on THOR, at chain tip, `ready_to_verify`
- Languages: English, Español, Français, Deutsch, Português, Kiswahili, 中文
- Explainer: [/watch](/watch) (~80s educational cut; 10s teaser toggle)

When a Lightning fee exists later, you would pay **us** a small invoice. The chain of proof stays Bitcoin + OTS.

## Next

- [How OpenTimestamps works](/docs/ots_setup)
- [Architecture](/docs/architecture)
- [Mission](/docs/mission)
- [FAQ](/faq)
- Family / API clients: see `docs/FAMILY-API.md` on GitHub
