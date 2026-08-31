# Cloudflare Pages — ELI-16 for Cam

**Short answer: do not log in now.**  
The site is already wired. GitHub → Actions → Pages project **`satohash`** → **satohash.io**.  
Log in only if something is _broken_ (blank page, JS that starts with `<!doctype`, share card 404).

---

## What Cloudflare is doing here

Think of three boxes:

| Box | Name                         | What it is                                                     |
| --- | ---------------------------- | -------------------------------------------------------------- |
| 1   | **Pages project `satohash`** | The website files (HTML/JS/CSS). This is Satohash.             |
| 2   | **Zone `satohash.io`**       | The domain DNS + cache.                                        |
| 3   | **Not ours for this app**    | `giveabit.io` / HQ / other Pages projects. Do not purge those. |

You will **not** find a dashboard tile literally named `SATOHASH` in all-caps.  
Look for **`satohash`** (Pages) and **`satohash.io`** (Websites / DNS).

---

## The one GitHub click that _is_ useful (ELI-16)

Cloudflare: stay out.  
GitHub: this is a light switch for **tests**, not the website.

1. Open this link while logged into GitHub as **kitsboy**:  
   https://github.com/kitsboy/satohash/actions/workflows/ci.yml
2. If you see a yellow/orange banner **“This workflow was disabled”**, click the green **Enable workflow** button on that banner.
3. Done. Close the tab. Do **not** edit YAML. Do **not** open Settings. After the next push, **Run workflow** is safe — tests only, not a site deploy.

**Status 2026-08-17:** Cam **enabled** CI. The workflow is **on**. You do **not** need to click Enable again. Red runs are test report cards, not a down site. **Run workflow** = tests only, not a deploy. Ignore Dependabot rows unless Grok says merge.

Deploy (the live site) already runs without this. Enabling CI only turns the test suite back on so a bad stamp loop cannot ship unnoticed.

## Shall I log in to Cloudflare now?

**No — not as a first step.**

Stay on the Mac. After we push, wait ~2–4 minutes, then:

1. Hard-refresh https://satohash.io (or open a private window).
2. Open `/stamp`, drop a file, stamp.
3. Open the proof card `/p/<hash>` (share that with iPhone friends).

If those three work, **close the tab. Do not click Purge.**

---

## Only log in if this happens

| Symptom                                                 | What it usually is                                            | What to do                                                                           |
| ------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Page is blank / “Unexpected token `<`”                  | Edge served **HTML instead of JS** (poisoned `/b/index-….js`) | Purge **satohash.io** cache — see below                                              |
| `/stamp` or `/verify` flash “System Desync” / hang on “LOADING SECURE MODULE…” | Mixed `/b/*` chunks + auto-reload loop (fixed `ec1c69e`, 2026-08-31) | Hard refresh once (`Cmd-Shift-R`). Stamp/Verify are eager. If it still flashes after the new `index-*.js`, tell Grok — **do not** Retry deploy in the CF UI. |
| `satohash.io` works but `www` doesn’t                   | Custom domain glitch                                          | Pages → `satohash` → Custom domains. Do not recreate the project.                    |
| `/p/abc…` is the React app, not the gold card           | Function didn’t match                                         | Confirm URL is `/p/<64 hex>`. Do not edit Functions in the UI.                       |

---

## If you _do_ log in — exact clicks

1. https://dash.cloudflare.com — account that owns **satohash.io**.
2. Left: **Workers & Pages** → **Pages** → project **`satohash`**.
   - Custom domains should include `satohash.io` and `www.satohash.io`.
   - Production is GitHub `main` via **GitHub Actions** (`deploy.yml`), not a second “retry deploy” from the UI.
3. Left: **Websites** → **`satohash.io`** (the zone).
   - **Caching → Configuration → Purge Everything** — only if HTML is being served as JS.
4. **Do not** open `giveabit.io` and purge that. Wrong zone = HQ / family sites get hurt.

### Purge checklist (only when JS is HTML)

1. Confirm poison:  
   `curl -sS https://satohash.io/b/index-XXXX.js | head -c 40`  
   Must start with `import` / `const` / `var`. If it starts with `<!doctype` or `<`, purge.
2. Zone **satohash.io** → Caching → Purge Everything.
3. Wait 30 seconds. Private window. Hard refresh.
4. Do **not** also click “Retry deployment” in Pages while Actions is already deploying.

---

## What you should never click

- **Delete project** / unbind `satohash.io`
- **Change build command** or output dir in the Pages UI (Actions already builds)
- **Enable a second Git integration** that deploys the same project (race → HTML-as-JS)
- **Purge giveabit.io**
- **Edit `/api/*` routes** (API is THOR, not Pages)
- **Turn on a paywall** anywhere in CF (stamps are free; `REQUIRE_LIGHTNING=false` lives on the VPS)

---

## How a good deploy looks

```
Grok (M3) pushes main — Kimi cannot alter Pages; Grok has standing authorization for SPA/Pages fixes.
        ↓
GitHub Action “Deploy” builds Vite (assets in /b/*)
        ↓
wrangler pages deploy → project satohash
        ↓
satohash.io index.html (no-cache) points at new /b/index-HASH.js
```

Two deploys at once used to race. That is now queued (`concurrency` in `deploy.yml`).  
If you see two Deploy runs, **let the first finish**. Do not cancel + retry from the CF UI.

**Never:** Cloudflare Pages → Deployments → **Retry deployment** while GitHub **Deploy** is yellow. One path only: GitHub Actions.

---

## Mental model (16-year-old version)

Cloudflare is the **billboard on the street**.  
GitHub is the **workshop**.  
THOR (`api.satohash.io`) is the **notary office**.

You do not walk to the billboard and rearrange letters unless the poster is showing yesterday’s ad (or garbage).  
You go back to the workshop (this repo), we push, the billboard updates itself.

---

## Pointers

| Want              | Doc                                |
| ----------------- | ---------------------------------- |
| Deploy commands   | `docs/deploy.md`                   |
| VPS / Kimi / API  | `docs/ops-runbook.md`              |
| Rollback          | `docs/ROLLBACK.md`                 |
| Family share URLs | `docs/FAMILY-API.md` (`/p/<hash>`) |
