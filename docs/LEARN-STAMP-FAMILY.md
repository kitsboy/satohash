# Learn — Stamp family handoff (2026-07-27)

**Status:** Canonical lessons from Cam feedback + live smoke.  
**Audience:** Grok M3 (satohash + family clients), Kimi THOR.  
**Read with:** `docs/OTS-DEEP-LEARN.md`, `docs/FAMILY-API.md`, `docs/HQ-FEED.md`

---

## What Cam saw

“Stamp it” on Sherpa opened something that felt broken. First diagnosis blamed deep-link UX; **real root cause on production SPA** was worse:

| Symptom | Actual cause |
|---------|----------------|
| Landed on home `/?hash=&ref=` | Sherpa used home URL (weak handoff) |
| Even after SPA deep-link shipped | **SPA had no `VITE_API_URL` at build time** |
| Stamp “worked” locally/browser-ish | Fallback to **browser OTS** |
| No shareable proof | **No durable API stamp `id`** |
| HQ `api_clients: 0` | Live Docker not storing `client_id` yet |

---

## Lesson 1 — CF Pages is not the API

- SPA hosts: `satohash.io`, `satohash.giveabit.io` (Cloudflare Pages static)
- API host: `api.satohash.io` (THOR Docker)
- **Never** let `getApiUrl()` default to `window.location.origin` on production SPA hosts
- Fix layers (all three):
  1. `.env.production` / GHA `VITE_API_URL=https://api.satohash.io`
  2. Runtime host fallback in `src/config/constants.js`
  3. `isApiExplicitlyConfigured()` true on production hosts (`src/config/mvp.js`)

**Regression test:** production bundle must contain `https://api.satohash.io` as the API base for stamp POST, not only in an error string.

---

## Lesson 2 — Canonical deep-link contract

```
https://satohash.io/stamp?hash=<64hex>&ref=<productId>[&label=][&campaign=][&filename=]
```

Also accept (SPA redirects):

```
https://satohash.io/?hash=<64hex>&ref=<productId>
```

| Param | Role |
|-------|------|
| `hash` | Prefill SHA-256; reject if not 64 hex |
| `ref` / `source` | Product chip + `X-Satohash-Client` |
| `label` / `filename` / `campaign` | UX + attribution |

**Family clients must not invent alternate contracts.**

---

## Lesson 3 — No demo poison / no fake success

| Rule | Practice |
|------|----------|
| Never show success without real `id` | `if (!data?.id) throw` |
| Pending ≠ confirmed | Toast: “submitted — pending”; “Bitcoin confirmed” only on `status=confirmed` |
| Metrics | `raw.demo: false` when numbers come from DB (zeros OK) |
| No fake curves | Series from DB day buckets; no synthetic growth |
| No invented uptime | `uptimePct24h: null` until measured |
| No secrets in metrics | No keys, nsec, emails, PII |

HQ schema: `gab.product-metrics.v1` — required `schema`, `productId`, `updatedAt`, `health`, `kpis[]`.  
Prefer live: `https://api.satohash.io/metrics.json` over SPA static mirror.

---

## Lesson 4 — Attribution is the family moat

```http
POST /api/stamp
X-Satohash-Client: sherpacarta
Content-Type: application/json

{"hash":"<64 hex>","filename":"charter"}
```

- SPA deep-link: `ref` → header  
- Stored as `timestamps.client_id`  
- HQ segments: `by_client`  
- Live API without Docker rebuild may still return `client_id: null` — **ops gap, not SPA gap**

---

## Lesson 5 — Split of work (stop thrashing)

| Who | Owns |
|-----|------|
| **Grok satohash** | SPA deep-link, verify lifecycle, honest UX, metrics payload code, CF SPA deploy via git push |
| **Grok family (Sherpa, etc.)** | Open `/stamp?hash=&ref=`, send client header, show `verify/{id}`, rebuild bundles |
| **Kimi THOR** | Docker rebuild, `REQUIRE_LIGHTNING` / `FAMILY_API_KEYS`, OTS calendars, `client_id` live, directory on metrics |

---

## Lesson 6 — Pre-commit / docs:sync footguns

- `version:bump` every commit → headers must be staged with build metadata (fixed pre-commit)
- `docs:sync` must `trim()` both ends or blank lines accumulate
- Dual git remote push URL (SSH + HTTPS) → HTTPS fails noisily; SSH is fine

---

## Acceptance (suite-wide)

1. `https://satohash.io/stamp?hash=9da88734e32d3d2f931c187016d18cfbb0f7404ca90479ed4d6718c49289ee1b&ref=sherpacarta`  
   → prefilled + CTA → **real** `id`  
2. `/?hash=…&ref=…` → `/stamp?…`  
3. `/verify/{id}` hard refresh works  
4. `curl -s https://api.satohash.io/metrics.json \| jq '.schema,.raw.demo,.kpis[:4]'`  
5. Same on `satohash.giveabit.io`  
6. From Sherpa live: Stamp → same path  

---

## Related commits (satohash)

- `69b9daf` — SPA deep-link + verify lifecycle  
- `fd5e661` — HQ metrics + client_id code path  
- `cee9227` — **production API URL fix** (root cause)  
- Sherpa `b2584ae` — open `/stamp?hash=&ref=`  

---

## Propagate

- Family apps: use this contract only  
- MASTER-BRAIN: see `docs/MASTER-BRAIN-INGEST.md` paste block (updated)  
- Sherpa Grok prompt: `sherpacarta/docs/GROK-PROMPT-STAMP-HANDOFF.md`  
