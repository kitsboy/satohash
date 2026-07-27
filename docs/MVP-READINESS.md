<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.giveabit.io · **Version:** 5.0.0-ELITE (Build 135) · **Updated:** 2026-07-27
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Satohash MVP Readiness

> **Status:** Frontend live · API **packaged for VPS** — Kimi runbook is the remaining gate  
> **Updated:** 2026-07-20 · See `docs/KIMI-VPS-RUNBOOK.md`

## MVP definition

A stranger can open satohash.io, stamp a file, download `.ots` proof, and verify it — no account, no login wall.

## NIP-05 / Kimi identity — do we need NSEC?

| Item | Need for MVP? | Notes |
|------|---------------|-------|
| **Public key (hex / npub)** | ✅ Already have | `076fbd67…f8d4` in `src/config/mvp.js` and `public/.well-known/nostr.json` |
| **NIP-05 `kimi@giveabit.io`** | ✅ Public lookup | Resolved from **giveabit.io** `/.well-known/nostr.json` — not satohash.io |
| **NSEC (private key)** | ❌ **Never** | Never commit, never paste to Grok, never put in frontend. Kimi signs on VPS/agent host only. |

Frontend only **verifies** NIP-05 (fetch public JSON, compare pubkey). Signing is optional via browser extension (NIP-07).

## Architecture at MVP doorstep

```
[LIVE]  satohash.io          Cloudflare Pages — static SPA (Build 111+)
[READY] Frontend             MVP_MODE, public /stamp /verify /vault
[READY] VPS package          docker-compose.vps.yml + FAMILY_API_KEYS
[WAIT]  api.satohash.io      Kimi executes docs/KIMI-VPS-RUNBOOK.md
[OPT]   Bitcoin pruned node  Verify independence (not required for create)
```

## Static-edge capabilities (no api.satohash.io)

- [x] Browser OpenTimestamps stamping via public calendars (`public/vendor/ots.browser.js`)
- [x] MotoPass deep-links: `/stamp?hash=…`, `/verify/{hash}`
- [x] Local vault fallback, offline queue sync via browser OTS
- [x] Structural `.ots` verify in browser
- [x] Government pages: `/government`, `/motopass-verify`, `/batch-hash`, `/chain-of-custody`
- [x] Wave 2 polish: Stamp/Vault i18n, Widgets v3 white-label, Comparison mobile cards, lazy locale loading
- [x] Desktop nav v2: centered grid tabs (Stamp/Vault/Verify/Templates + More), no sidebar overlap
- [x] Templates showcase: government special sections render without features-array crash
- [x] Government templates wired: passport, national ID, diplomatic note, UBO, apostille companion
- [x] Marketing i18n: 28 missing stamp/verify/evidence keys filled for de/es/fr/pt/sw/zh
- [x] Local API smoke: `npm run api:smoke` (requires `npm run server`)
- [x] W3C Verifiable Credential export on verify page
- [x] `security.txt` at `/.well-known/security.txt`

## Frontend checklist (done in code)

- [x] `VITE_MVP_MODE` — `/stamp`, `/verify`, `/vault` public (no `/access` redirect)
- [x] `VITE_API_URL` — `.env.production.example` → `https://api.satohash.io`
- [x] `opentimestamps.js` uses `getApiUrl()` not localhost hardcode
- [x] `DeepHealthBanner` — silent on static-only; warns when API configured but down
- [x] Landing proof count — `—` instead of fake `847,293`
- [x] Nav — Forum/Contracts hidden in MVP mode
- [x] Desktop nav — `DesktopAppNav` + `MarketingDesktopNav` (Build 98–99)
- [x] Mobile nav — Verify in primary tab bar
- [x] `KIMI_NOSTR` pubkey documented (no secrets)

## API checklist (Kimi VPS + M3)

- [ ] Kimi: `docs/KIMI-VPS-RUNBOOK.md` §2 (docker, DNS, TLS, family keys)
- [ ] Public `GET https://api.satohash.io/health` = 200
- [ ] Public `GET https://api.satohash.io/api/public/status` = 200
- [ ] M3: `VITE_API_URL=https://api.satohash.io npm run build && ./deploy.sh`
- [ ] Smoke: family stamp from motopass + SPA stamp/verify
- [ ] CORS allows suite origins (see `.env.vps.example`)

## Timeline

| Milestone | Est. |
|-----------|------|
| **Now** | Frontend ready; site is brochure + local vault |
| **+ VPS API deploy** | ~1–2 weeks → **shippable MVP** |
| **+ Bitcoin node** | +1–2 days optional later |

## Evolution log

| Date | Build | Change |
|------|-------|--------|
| 2026-07-18 | 103+ | i18n 28 keys; government templates in TEMPLATES + manifest; api:smoke |
| 2026-07-15 | 100 | Templates crash fix — guard `specialSections.features` |
| 2026-07-15 | 98–99 | Desktop nav v2 — centered grid, compact primary tabs |
| 2026-07-15 | 94–95 | Static-edge wave 2 — lazy i18n, Stamp/Vault polish, 73 tests |
| 2026-07-07 | 85+ | MVP frontend prep — public routes, API wiring, NIP-05 clarity |

---
© 2026 Satohash
