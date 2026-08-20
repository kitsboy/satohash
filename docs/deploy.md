<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.io · **Version:** 5.0.0-ELITE (Build 247) · **Updated:** 2026-08-20
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Deploy — canonical

**Single deploy doc.** Prefer this over `DEPLOY-PLAYBOOK.md`, `DEPLOY-SERVER.md`, `DEPLOYMENT.md`, and `KIMI-VPS-RUNBOOK.md` (those remain as detailed annexes until fully inlined).

> **Live SPA:** https://satohash.io · **API:** https://api.satohash.io · **Version:** see `package.json`

---

## 1. Local SPA

```bash
npm ci
export VITE_API_URL=https://api.satohash.io VITE_MVP_MODE=true VITE_APP_NAME=Satohash
npm run dev          # Vite :3000
# optional API: npm run server / docker
```

Build:

```bash
export VITE_API_URL=https://api.satohash.io VITE_MVP_MODE=true VITE_APP_NAME=Satohash VITE_MEMPOOL_API_URL=https://mempool.space/api
npm run build
npm run build:verify
```

---

## 2. Cloudflare Pages (SPA)

**Preferred path:** push `main` → GitHub Actions `.github/workflows/deploy.yml` → `wrangler pages deploy`.

Manual (M3):

```bash
npm run build
npx wrangler pages deploy ./dist --project-name=satohash
```

| Domain               | Notes                                      |
| -------------------- | ------------------------------------------ |
| satohash.io / www    | Custom domains on Pages project `satohash` |
| satohash.pages.dev   | Production alias                           |
| satohash.giveabit.io | Same project                               |

**Do not:** dual-race wrangler + GH + CF Git without waiting — partial deploys can SPA-fallback HTML onto JS URLs (edge poison). Prefer **one** production path.

**Headers:** hashed bundles under `/b/*` (not long-lived immutable on `/assets/*`). Shell `index.html` is `max-age=0`.

**Purge:** zone **satohash.io** → Caching → Purge Everything if edge serves HTML as JS.

Cam-facing walkthrough (when to log in, what to click, what not to touch): `docs/CLOUDFLARE-PAGES.md`.

**CSP:** Pages `_headers` ships enforcing `Content-Security-Policy` (2026-08-17). If a third-party fetch is blocked, check the console before widening `connect-src`.

**One deploy path:** GitHub Actions **Deploy** only. Never click **Retry deployment** in the Cloudflare Pages UI while Actions is running.

**Smoke:** `.github/workflows/deploy.yml` → `scripts/pages-smoke.sh` (JS-is-JS, JPEG OG, www, `/stamp`, `/verify`, `/p/<hash>` Function card).

Annex: `docs/ROLLBACK.md`.

---

## 3. API / Docker / VPS (THOR)

API lives on THOR, not CF Pages.

```bash
# see docker-compose.vps.yml + scripts/vps-deploy-api.sh
# env: REQUIRE_LIGHTNING=false for free stamps
# FAMILY_API_KEYS=... for family free tier
# OTS_CALENDARS=... public calendars
```

Annex: `docs/KIMI-VPS-RUNBOOK.md`, `docs/ops-runbook.md` (Docker packaging detail: `docs/DEPLOY-SERVER.md` if present).

---

## 4. Env (public SPA only)

| Var                    | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `VITE_API_URL`         | Must be `https://api.satohash.io` in production builds |
| `VITE_MVP_MODE`        | `true` for product surface                             |
| `VITE_APP_NAME`        | Satohash                                               |
| `VITE_MEMPOOL_API_URL` | mempool.space API                                      |

Never bake secrets into the SPA.

---

## 5. CI gates

GitHub Actions `.github/workflows/ci.yml`:

| Gate                            | When                               | Fail CI?                                            |
| ------------------------------- | ---------------------------------- | --------------------------------------------------- |
| lint · i18n · unit · Vite build | `test_and_build`                   | yes                                                 |
| Playwright (Chromium + WebKit)  | Node 20 · skips live stamp loop    | yes                                                 |
| `npm run lh:mobile` preview     | **own job** `lighthouse_preview`   | yes (`FAIL_HARD=1`) — does **not** skip `live_loop` |
| `npm run test:live-api`         | `live_loop` after `test_and_build` | yes (429 soft pass)                                 |
| Live SPA stamp loop             | `live_loop`                        | **no** — `continue-on-error`                        |
| Weekly LH vs satohash.io        | `lighthouse-weekly.yml`            | **no** — artifact only                              |

Local:

```bash
npm run test:live-api
npm run test:e2e:safari
BASE_URL=https://satohash.io npm run lh:mobile
```

---

## 6. Smoke after deploy

```bash
curl -sf https://satohash.io/ | grep -oE '/b/index-[^"]+\.js'
# main JS body must start with const/import — never <!doctype
curl -sf https://api.satohash.io/health
curl -sf https://api.satohash.io/metrics.json | head -c 200
```

---

## 7. Rollback

CF Pages → previous Production deployment. API: previous Docker image / compose. See `docs/ROLLBACK.md`.
