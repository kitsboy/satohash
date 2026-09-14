<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.io · **Version:** 5.0.0-ELITE (Build 386) · **Updated:** 2026-09-14
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Satohash MVP Readiness

> **Status:** Core MVP **live**. Frontend on Cloudflare Pages. API at https://api.satohash.io (THOR Docker). Own `bitcoind` at tip. Free stamps. Paywall off.
> **Updated:** 2026-09-14 · Version `5.0.0-ELITE`

## MVP definition

A stranger can open satohash.io, stamp a file, download a `.ots` proof, and verify it — **no account, no login wall.**

That loop is live:

1. [satohash.io/stamp](https://satohash.io/stamp) — hash on-device, stamp the fingerprint.
2. Download the `.ots`.
3. [satohash.io/verify](https://satohash.io/verify) — check the receipt.
4. Share `https://satohash.io/p/<hash>` — zero-JS proof card.

The remaining work below is for a *marketable* MVP (copy, pin, unfurl) — **not** “wait for the VPS.” The API is already live.

## Live planes

| Plane | Status |
|-------|--------|
| **SPA** | **LIVE** — Cloudflare Pages → satohash.io / www / pages.dev |
| **API** | **LIVE** — https://api.satohash.io (THOR Docker + Caddy) |
| **Bitcoin** | **LIVE** — own `bitcoind` at tip, `source: bitcoind`, IBD done, pruned 10 GB |
| **Stamps** | **Free** — `REQUIRE_LIGHTNING=false`. Paywall off. |
| **Metrics** | **LIVE** — `https://api.satohash.io/metrics.json` |
| **Explainer** | **LIVE** — `/watch` (~84s Kimi/Pippa + 10s teaser) |

```
[LIVE]  satohash.io          Cloudflare Pages — static SPA
[LIVE]  api.satohash.io      Express on THOR Docker
[LIVE]  bitcoind             At tip · IBD done · public source bitcoind
[LIVE]  Free stamps          REQUIRE_LIGHTNING=false
[LATER] Lightning paywall    Only when Cam flips (LND not configured)
[LATER] Authorship / contracts / store Snapper / store apps
```

## Remaining for a *marketable* MVP

The stranger-stamps loop does not wait on these. They are polish and distribution:

| Item | Status |
|------|--------|
| i18n of **About → Pitch → Network** (then Explorer, Atlas) | **In progress** — 7 locales (en es fr de pt sw zh). Product loop (Slice A) is done. Do not add Arabic. See `docs/I18N.md`. |
| Cam pin `/watch` on **@give_bit** | Open — paste-ready in `docs/marketing/GIVE-BIT-X-PACK.md` |
| Physical iPhone `/p/<hash>` unfurl | Open — HTML already uses JPEG `01-stamp-hero.jpg`; needs a device check |

Not a gate: VPS deploy, IBD, first public `/health`. Those shipped.

## NIP-05 / Kimi identity — do we need NSEC?

| Item | Need for MVP? | Notes |
|------|---------------|-------|
| **Public key (hex / npub)** | ✅ Already have | `076fbd67…f8d4` in `src/config/mvp.js` and `public/.well-known/nostr.json` |
| **NIP-05 `kimi@giveabit.io`** | ✅ Public lookup | Resolved from **giveabit.io** `/.well-known/nostr.json` — not satohash.io |
| **NSEC (private key)** | ❌ **Never** | Never commit, never paste to Grok, never put in frontend. Kimi signs on VPS/agent host only. |

Frontend only **verifies** NIP-05 (fetch public JSON, compare pubkey). Signing is optional via browser extension (NIP-07). `nsec` never in git.

## Honest limits (live product)

- Proves **when**, not **who**. Anyone can stamp any file.
- ~60-minute Bitcoin confirmation. Not instant.
- Bitcoin-only. No multi-chain anchoring.
- Hash of a short, guessable input can theoretically be reverse-matched.
- Portable `.ots` receipts. SPA verify talks to the live API; independent `ots` CLI still works on the file you downloaded.

## Core checklist (done)

- [x] Stranger can stamp, download `.ots`, verify — no account
- [x] File hashed on-device; only SHA-256 submitted
- [x] `VITE_API_URL` → `https://api.satohash.io`
- [x] Public `GET https://api.satohash.io/health` = 200
- [x] Public `GET https://api.satohash.io/metrics.json`
- [x] CORS allows suite origins
- [x] Family stamp from Katoa / MotoPass / Sherpa / Give A Bit (`public/widgets/stamp.js`)
- [x] CLI: `packages/satohash-cli` (default API `https://api.satohash.io`)
- [x] Own `bitcoind` at tip, IBD done
- [x] Free stamps, `REQUIRE_LIGHTNING=false`
- [x] `/watch` explainer shipped
- [x] `KIMI_NOSTR` pubkey documented (no secrets)
- [x] Landing proof count is live-sourced — never a fabricated number

## Evolution log

| Date | Build | Change |
|------|-------|--------|
| 2026-09-14 | 366 | Docs match live product: API live, bitcoind at tip, free stamps. VPS is no longer the gate. |
| 2026-08-31 | — | Stamp/Verify hang fixed (eager chunks). Pages deploy live. |
| 2026-08-17 | — | Metrics SoT on API; family clients attributed. |
| 2026-07-18 | 103+ | i18n 28 keys; government templates; api:smoke |
| 2026-07-15 | 100 | Templates crash fix — guard `specialSections.features` |
| 2026-07-15 | 98–99 | Desktop nav v2 — centered grid, compact primary tabs |
| 2026-07-15 | 94–95 | Static-edge wave 2 — lazy i18n, Stamp/Vault polish, 73 tests |
| 2026-07-07 | 85+ | MVP frontend prep — public routes, API wiring, NIP-05 clarity |

---
© 2026 Give A Bit · Satohash
