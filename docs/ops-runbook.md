# Ops runbook (VPS / Kimi / THOR)

Canonical short ops pointer. Detailed procedures remain in:

| Doc | Use |
|-----|-----|
| `docs/KIMI-VPS-RUNBOOK.md` | VPS step-by-step (Kimi) |
| `docs/DEPLOY-SERVER.md` | Docker API packaging |
| `docs/OPS-TWO-MACHINE.md` | M3 code vs THOR ops |
| `docs/ROLLBACK.md` | Rollback |
| `.ai_docs/current-status.md` | Live status snapshot |

## Daily truths

1. **API** on THOR Docker + Caddy → `api.satohash.io`
2. **SPA** on Cloudflare Pages → `satohash.io` (**Grok lane.** Kimi cannot alter Pages; Grok has standing auth to push SPA fixes.)
3. **Free stamps:** `REQUIRE_LIGHTNING=false` until Cam flips paywall
4. **Metrics SoT:** `https://api.satohash.io/metrics.json`
5. **No secrets in git / handoffs**
6. **One SPA deploy path:** GitHub Actions `Deploy` only — never Retry in the CF Pages UI while Actions is yellow

## When SPA flashes “System Desync” or hangs on `/stamp` `/verify`

Fixed **2026-08-31** (`ec1c69e`, live). Cause was lazy Stamp/Verify chunks importing the HTML entry + a service-worker / `vite:preloadError` / ErrorBoundary reload loop. Core loop is eager; `injectRegister: false`. If it returns: hard refresh once, then Grok (not a CF UI retry).

## When SPA shows `Unexpected token '<'`

1. Confirm main JS is real: `curl -sS https://satohash.io/b/index-….js | head -c 40` → must be `const`/`import`, not `<!doctype`
2. Purge **satohash.io** zone cache (not giveabit) if edge poison
3. Prefer single deploy path (GH Actions)

## Explainer / media

| Item | Path |
|------|------|
| Player | https://satohash.io/watch (native **~84s** Kimi/Pippa cut; 10s teaser toggle) |
| Primary MP4 | `public/media/video/satohash-explainer-with-vo2.mp4` (~83.7s, 1920×1080, VO + dance bed) |
| Teaser MP4 | `satohash-explainer-with-vo.mp4` (~10s) |
| Cache-bust | SPA loads `…vo2.mp4?v=kimi-noir-20260819` (overwrite same path carefully) |
| Close | Small Satohash **hash mark**, top-left, last ~3s |
| Legacy VO | `vo-complete.mp3` (~80s) — not a separate player |
| Music | Dance bed baked into vo2 (~15%); `satohash-explainer-music.mp3` is archive |
| Source | `videos/satohash-explainer/` (HyperFrames) · share https://hyperframes.dev/p/915356ed-8e2f-4c6e-97a4-d931b33b1341 |
| Ops notes | `docs/EXPLAINER-MUSIC-AND-VO.md` · `public/media/video/SCRIPT.md` |

If `/watch` shows stale video: hard refresh; check MP4 duration **~84s** (full) or ~10s (teaser). Marketing routes are eager-loaded.

**Cam (not Grok):** Pin on X account **@give_bit** (not @satohash). Suggested text (one paragraph, honest): 84 seconds. File never leaves the device. Free Bitcoin proof of existence. https://satohash.io/watch  
Card must be the player card (`/watch-player.html`). After pin, paste into cards-dev.twitter.com.

## Bitcoin own-node (bitcoind) — 2026-08-10 truth (**IBD COMPLETE**)

- Node: Bitcoin Core v28.1, pruned 10GB, datadir **`/root/.bitcoin`** (NOT package default `/var/lib/bitcoin`)
- Unit: `/etc/systemd/system/bitcoind.service` (override, **enabled**). Restart: `systemctl start bitcoind`
- Verify host: `bitcoin-cli -getinfo` · container: `docker exec satohash-satohash-api-1 node -e '<fetch repro>'` (no curl in container) → expect HTTP 200
- Health surface: `/api/public/readiness` → `.planes.bitcoin_node` (`/health` has NO bitcoin key in this build)
- **IBD finished ~2026-08-08.** At tip (e.g. 961,960/961,960) · `initialblockdownload=false` · verification ~100% · `source: bitcoind` · local mempool live · deep health green
- mempool.space is **fallback only** if RPC dies — not the normal path while node is at tip
- If you ever see `status:"syncing"` again after a reindex/re-IBD, treat as healthy progress (not an outage); OTS calendars still work
- OOM history 2026-07-28 (killed bitcoind) — watch `free -h`; node ~1GB RSS; 7.8G RAM / 8G swap on THOR
- API logs may show "fetch failed"/HTTP 500/timeout right after node start (startup flap) — re-check after 3-5 min

### Daily RAM (Kimi / THOR)

On THOR: `free -h`  
`node scripts/watch-bitcoind-health.mjs`  
Exit 1 if not `ready_to_verify`. History: OOM 2026-07-28.

## RSS → Nostr cron (Kimi / THOR)

`scripts/nostr-publish-feed.js` publishes kind-1 notes from `https://satohash.io/feed.xml`. **Default is dry-run** (print events, do not publish, do not write state). `--publish` is explicit.

- Env `NOSTR_PRIVATE_KEY` (64 hex) **only on THOR**, never git, never a hook, never this file.
- Do not add this script to git hooks.
- Cron every 15 min (after a dry-run looks right):

```cron
*/15 * * * * cd /root/satohash && node scripts/nostr-publish-feed.js
```

Until Kimi sets `NOSTR_PRIVATE_KEY` on THOR, leave the crontab off or keep invoking without `--publish`.

**Kind-0 profile (once, THOR; public fields only):** name Satohash · `lud16` satohash@breez.tips · `nip05` satohash@satohash.io · website https://satohash.io. nsec stays on THOR.

## Kimi — API image rebuild (**DONE 2026-08-31**, Grok on THOR)

Live SHA is **`GET https://api.satohash.io/health` → `gitSha`** (do not trust this paragraph’s hash). Last Grok check 2026-09-08: `7cc0932`, image ~818MB, `Cache-Control: no-store`, Caddy `OK  caddy reload --config /etc/caddy/Caddyfile`. `REQUIRE_LIGHTNING=false`. Metrics still have `raw.last10` + `raw.familyClients`. Recipe: `cd /root/satohash && git fetch origin && git reset --hard origin/main && GIT_SHA=$(git rev-parse --short HEAD) bash scripts/vps-deploy-api.sh`. Do **not** change `/api/*` paths.

Confirm (should already pass):

```bash
curl -sS https://api.satohash.io/metrics.json | python3 -c 'import json,sys; d=json.load(sys.stdin); r=d.get("raw") or {}; print("last10", len(r.get("last10") or [])); print("familyClients", bool(r.get("familyClients"))); print("requireLightning", r.get("requireLightning"))'
```

## Handoffs

Newest session notes: `docs/handoff-log.md` (also append `docs/KIMI-HANDOFF.md` until fully migrated).  
MASTER-BRAIN paste: `docs/MASTER-BRAIN-INGEST.md` → **THOR VPS Obsidian** (not M4).  
Cloudflare (Cam): `docs/CLOUDFLARE-PAGES.md` — do not log in unless the site is broken.