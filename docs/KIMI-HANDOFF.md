## Session — 2026-07-27 (Grok M3 — GOODBYE)

**Chat:** Stamp family handoff fix + learn docs + Kimi Bitcoin wallet request + full handoff.

### Done this session

**A) Stamp UX root cause (Cam “not fully working”)**
- Production SPA had no `VITE_API_URL` → same-origin → browser OTS without durable API `id`
- Fixed: runtime host fallback (`satohash.io` / `satohash.giveabit.io` → `api.satohash.io`)
- GHA `deploy.yml` + `deploy.sh` + `.env.production` bake `VITE_API_URL`
- Honest UX: require real stamp `id`; pending ≠ Bitcoin confirmed
- Commits: `cee9227` (code) · follow-ups docs `c54151a` · wallets request `3eab2d9`

**B) Learn / docs**
- `docs/LEARN-STAMP-FAMILY.md` — canonical suite lessons
- OTS-DEEP-LEARN, MASTER-BRAIN-INGEST, FAMILY-API, HQ-FEED, GROK-SESSION-PROTOCOL updated
- Sherpa paste prompt: `sherpacarta/docs/GROK-PROMPT-STAMP-HANDOFF.md` (pushed `a0cb705`)

**C) Kimi — Bitcoin L1 + L2 for Satohash donations/tips**
- Full spec: **`docs/KIMI-REQUEST-BITCOIN-WALLETS.md`**
- Checklist for Kimi:
  1. LNbits wallet **`satohash`** (product-isolated)
  2. Public on-chain **bc1…** receive
  3. Public L2: **LNURL-pay** + LUD-16 e.g. `satohash@giveabit.io`
  4. Invoice/admin keys → **HQ Vault only** (hq.giveabit.io) — never git/chat
  5. Handback public details to Grok/Cam (template in request doc)
  6. Grok publishes SPA **only after** handback (`constants.js`, Landing, DesktopAppNav, Contribute)
- SPA placeholders: `BTC_ADDRESS` (temp shared), `LN_ADDRESS` / `LNURL_PAY` empty until handback

### Still open for Kimi / THOR

| # | Item | Spec |
|---|------|------|
| 1 | Docker rebuild `satohash-api` | live `client_id` + `raw.directory` on metrics |
| 2 | Confirm `REQUIRE_LIGHTNING=false` (or family keys) | free suite stamp |
| 3 | **Satohash Bitcoin wallets** | `docs/KIMI-REQUEST-BITCOIN-WALLETS.md` |
| 4 | Dual-host / GHA SPA smoke | bundle calls `api.satohash.io` |

### Still open for other Grok sessions

- **Sherpa:** execute `docs/GROK-PROMPT-STAMP-HANDOFF.md` (audit URLs, bundle, deploy)
- **Satohash after wallet handback:** wire public L1/L2 into SPA

### Decisions

- CF Pages is never the API plane
- Metrics: real DB only; no fake uptime/growth
- Product wallets isolated (Satohash ≠ Sherpa treasury)
- Secrets only HQ Vault / THOR env

### Git State

- SHA: (see LATEST-UPDATE after this goodbye commit)
- Branch: `main` → push origin
- Unpushed before this goodbye: none (prior `3eab2d9` pushed)

### Acceptance (post-deploy)

```
https://satohash.io/stamp?hash=9da88734e32d3d2f931c187016d18cfbb0f7404ca90479ed4d6718c49289ee1b&ref=sherpacarta
curl -s https://api.satohash.io/metrics.json | jq '.schema,.raw.demo,.kpis[:4]'
curl -s https://api.satohash.io/health
```

**Archive:** `docs/archive/SESSION-SUMMARY-2026-07-27-goodbye.md`

---

## Session — 2026-07-27 (Grok M3 — Kimi: Satohash Bitcoin wallets)

**Request for Kimi (full):** `docs/KIMI-REQUEST-BITCOIN-WALLETS.md`

### Kimi checklist (Satohash — not Sherpa)

1. **LNbits** — create/confirm wallet labeled **`satohash`** (product-isolated).
2. **On-chain (L1)** — public **bc1…** receive for that wallet; document mempool link.
3. **Lightning (L2)** — enable public **LNURL-pay** + prefer **LUD-16** e.g. `satohash@giveabit.io`.
4. **HQ Vault only** — invoice/admin/read keys, wallet id, any seed material → https://hq.giveabit.io vault (never git, never chat).
5. **Handback to Grok/Cam** — public only: `on_chain_address`, `lud16`, optional `lnurl_pay`, smoke notes (template in the request doc).
6. **Grok publishes after handback** — `src/config/constants.js`, Landing donation, DesktopAppNav QR, Contribute; optional `public/data/wallets.json`.

**Current SPA:** `BTC_ADDRESS` in constants is a **shared suite address** — replace with Satohash-dedicated receive after handback.  
**Do not** paste invoice keys into this file.

**Still open (ops):** THOR Docker rebuild for `client_id` + metrics directory; SPA GHA deploy verify.

---

## Session — 2026-07-27 (Grok M3 — /learn + Sherpa prompt + docs)

**Done:**
- `docs/LEARN-STAMP-FAMILY.md` — canonical lessons (SPA API plane, deep-link, honest metrics)
- `docs/OTS-DEEP-LEARN.md` — family path section
- `docs/MASTER-BRAIN-INGEST.md` — updated paste block (2026-07-27)
- `docs/KIMI-REQUEST-SATOHASH.md` — resolution log
- `.ai_docs/current-status.md` refreshed
- Sherpa: `docs/GROK-PROMPT-STAMP-HANDOFF.md` — paste-ready list for Grok in sherpacarta

**Tell Cam for Sherpa session:** open that prompt file or paste the task block.

**Still open:** THOR Docker rebuild; Sherpa live CF after audit; GHA SPA deploy verification.

---

## Session — 2026-07-27 (Grok M3 — stamp UX root-cause + honest metrics)

**Root cause (Cam “not fully working”):**  
Production SPA build had **no `VITE_API_URL`**, so `getApiUrl()` used same-origin (`satohash.io`). `POST /api/stamp` never hit THOR → browser OTS fallback **without durable stamp id**.

**Shipped (SPA + build path):**
- Runtime host fallback: `satohash.io` / `satohash.giveabit.io` → `https://api.satohash.io`
- GHA `deploy.yml` + `deploy.sh` set `VITE_API_URL=https://api.satohash.io`
- `isApiExplicitlyConfigured()` true on production SPA hosts
- Honest UX: no “Bitcoin confirmed” until status=confirmed; require real API `id`
- Metrics: stop inventing `uptimePct24h: 99.9` (null until measured)
- SPA `public/metrics.json` refreshed from live API (`raw.demo: false`)
- Family deep-link contract documented in `docs/FAMILY-API.md`

**Already in place (prior):** `/stamp?hash=&ref=` card, home `/?hash=` redirect, poll, `/verify/:id`, `X-Satohash-Client`, metrics payload with client segments (needs Docker).

**Still needs THOR / Kimi:**
1. **Docker rebuild** `satohash-api` so live `/metrics.json` includes `raw.directory` + stores `client_id`
2. Confirm `REQUIRE_LIGHTNING=false` (or family keys) for suite free stamp
3. Dual-host smoke after CF deploy
4. **Bitcoin wallets** — `docs/KIMI-REQUEST-BITCOIN-WALLETS.md`

**Env names for Cam/Kimi (values stay on THOR/Vault only):**
- `REQUIRE_LIGHTNING`, `FAMILY_API_KEYS`, `CORS_ORIGIN`, DB path via compose volume
- SPA public only: `VITE_API_URL` (now in GHA — not a secret)
- LNbits satohash wallet keys → HQ Vault only

**Acceptance smoke after deploy:**
```
https://satohash.io/stamp?hash=9da88734e32d3d2f931c187016d18cfbb0f7404ca90479ed4d6718c49289ee1b&ref=sherpacarta
```

**Spec:** `docs/KIMI-REQUEST-SATOHASH.md` · wallets: `docs/KIMI-REQUEST-BITCOIN-WALLETS.md` · learn: `docs/LEARN-STAMP-FAMILY.md`

---

## Session — 2026-07-27 (Grok — Sherpa URLs + HQ feed + tidy)

**Done:**
- **Sherpa:** stamp deep-links → `https://satohash.io/stamp?hash=&ref=` (charter + Canada + helpers); sc-bundle rebuilt
- **HQ feed:** `server/metrics-payload.js` — real client segments, DB series, `raw.directory`, richer KPIs
- **API:** store `client_id` from `X-Satohash-Client` on `POST /api/stamp`; `GET /api/public/directory`
- **Docs:** `docs/HQ-FEED.md`, `docs/REPO-LAYOUT.md`

**Deploy note:** API changes need **THOR Docker rebuild** for live metrics.directory + client_id.

---

## Session — 2026-07-26 (Grok M3 — stamp deep-link + verify lifecycle)

**Done (SPA):** Home `/?hash=` → `/stamp`; deep-link card; poll; VerifyPublic; family refs.

**Git State:** SHA `69b9daf` · GHA Deploy #136 success  

**Spec:** `docs/KIMI-REQUEST-SATOHASH.md`

---
