<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.giveabit.io · **Version:** 4.1.0-ELITE (Build 94) · **Updated:** 2026-07-16
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Satohash MVP Readiness

> **Status:** Frontend at the doorstep — API deploy is the remaining gate  
> **Updated:** 2026-07-07 · Build 85+

## MVP definition

A stranger can open satohash.io, stamp a file, download `.ots` proof, and verify it — no account, no login wall.

## NIP-05 / Kimi identity — do we need NSEC?

| Item | Need for MVP? | Notes |
|------|---------------|-------|
| **Public key (hex / npub)** | ✅ Already have | `076fbd67…f8d4` in `src/config/mvp.js` and `public/.well-known/nostr.json` |
| **NIP-05 `kimi@giveabit.io`** | ✅ Public lookup | Resolved from **giveabit.io** `/.well-known/nostr.json` — not satohash.io |
| **NSEC (private key)** | ❌ **Never** | Never commit, never paste to Grok, never put in frontend. Kimi signs on M4 only. |

Frontend only **verifies** NIP-05 (fetch public JSON, compare pubkey). Signing is optional via browser extension (NIP-07).

## Architecture at MVP doorstep

```
[LIVE]  satohash.io          Cloudflare Pages — static SPA (Build 85+)
[READY] Frontend             MVP_MODE, public /stamp /verify /vault
[WAIT]  api.satohash.io      Express API — see docs/DEPLOY-SERVER.md
[SKIP]  Bitcoin full node    Not required for MVP
```

## Static-edge capabilities (no api.satohash.io)

- [x] Browser OpenTimestamps stamping via public calendars (`public/vendor/ots.browser.js`)
- [x] MotoPass deep-links: `/stamp?hash=…`, `/verify/{hash}`
- [x] Local vault fallback, offline queue sync via browser OTS
- [x] Structural `.ots` verify in browser
- [x] Government pages: `/government`, `/motopass-verify`, `/batch-hash`, `/chain-of-custody`
- [x] Wave 2 polish: Stamp/Vault i18n, Widgets v3 white-label, Comparison mobile cards, lazy locale loading
- [x] W3C Verifiable Credential export on verify page
- [x] `security.txt` at `/.well-known/security.txt`

## Frontend checklist (done in code)

- [x] `VITE_MVP_MODE` — `/stamp`, `/verify`, `/vault` public (no `/access` redirect)
- [x] `VITE_API_URL` — `.env.production.example` → `https://api.satohash.io`
- [x] `opentimestamps.js` uses `getApiUrl()` not localhost hardcode
- [x] `DeepHealthBanner` — silent on static-only; warns when API configured but down
- [x] Landing proof count — `—` instead of fake `847,293`
- [x] Nav — Forum/Contracts hidden in MVP mode
- [x] Mobile nav — Verify in primary tab bar
- [x] `KIMI_NOSTR` pubkey documented (no secrets)

## API checklist (when VPS ready)

- [ ] Deploy `server/` per `docs/DEPLOY-SERVER.md`
- [ ] `VITE_API_URL=https://api.satohash.io npm run build && ./deploy.sh`
- [ ] Smoke: stamp → download `.ots` → verify on `/verify/:id`
- [ ] CORS allows `https://satohash.io`

## Timeline

| Milestone | Est. |
|-----------|------|
| **Now** | Frontend ready; site is brochure + local vault |
| **+ VPS API deploy** | ~1–2 weeks → **shippable MVP** |
| **+ Bitcoin node** | +1–2 days optional later |

## Evolution log

| Date | Build | Change |
|------|-------|--------|
| 2026-07-07 | 85+ | MVP frontend prep — public routes, API wiring, NIP-05 clarity |

---
© 2026 Satohash










