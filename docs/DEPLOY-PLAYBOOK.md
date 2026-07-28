<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.giveabit.io · **Version:** 5.0.0-ELITE (Build 158) · **Updated:** 2026-07-28
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Satohash Deploy Playbook

> **Live:** https://satohash.io · https://satohash.giveabit.io  
> **Host:** Cloudflare Pages · project name **`satohash`**  
> **M3 path:** `~/projects/satohash`

## What production is

Satohash production is a **static React SPA** on Cloudflare Pages. There is **no Express server** on the live site.

| Layer | Production | Local dev only |
|-------|------------|----------------|
| Frontend | Cloudflare Pages (`./dist`) | Vite on port 3000 |
| `server/` Express API | **Not deployed** | `npm run dev` on port 3001 |

**Hashing** runs in the browser (file never uploaded). **OTS stamp/verify** currently requires the Express API — see `docs/DEPLOY-SERVER.md` (planning; not deployed yet).

## Deploy (M3 Terminal)

```bash
cd ~/projects/satohash
git pull origin main
./deploy.sh
```

Or step by step:

```bash
cd ~/projects/satohash
npm ci
npm run build
npm run build:verify
npx wrangler pages deploy ./dist --project-name=satohash
```

**Must use project name `satohash` and output folder `./dist`.**

Auth: `npx wrangler login` (one-time in Terminal.app) **or** set `CLOUDFLARE_API_TOKEN` in the environment.

## After push (GitHub)

1. `git push origin main` — code is on GitHub
2. **Deploy is not automatic** unless GitHub Actions has `CLOUDFLARE_API_TOKEN` set, or you run `./deploy.sh` locally
3. Verify live bundle: `npm run build:verify` checks local build; production should not contain bare `.fees.high` in the Landing chunk

## API server (future)

When MVP needs live stamp/verify: deploy `server/` per **`docs/DEPLOY-SERVER.md`** → `api.satohash.io`. Frontend stays on Cloudflare; rebuild with `VITE_API_URL=https://api.satohash.io`.

## Rollback

Cloudflare Dashboard → **Workers & Pages** → **satohash** → **Deployments** → **Rollback to this deployment**

## Stack (Give A Bit ecosystem)

| Machine | Role |
|---------|------|
| **M3** (Cam laptop) | Grok codes, builds, `./deploy.sh` |
| **M4** (HERMES) | Kimi orchestration, docs, Obsidian vault |

Other projects on M3 deploy separately (e.g. **TadBuy** uses Supabase + its own Cloudflare project). This playbook is **Satohash only**.

## Agent rules (Grok + Kimi)

- **Never** assume `git push` updates satohash.io without a Cloudflare upload
- After Landing or build changes, verify production bundle or run `./deploy.sh`
- `server/` is local development only — not production

---
© 2026 Satohash
