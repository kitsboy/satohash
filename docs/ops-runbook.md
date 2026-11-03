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

## Home node cutover — do not switch yet

Umbrel is Cam’s home Bitcoin node. It is not the checker. Thor bitcoind stays the checker.

Switch `BITCOIN_RPC_URL` to the home node only when every line below is true:

1. Cam says the first download is finished.
2. `initialblockdownload` is false on that node.
3. Its block height matches the Thor tip within one block.
4. Cam asks for the switch.

Until then, stamps keep using the node already at the tip. LND stays off. `REQUIRE_LIGHTNING` stays false. Do not install BTCPay on Umbrel and call that the stamp checker. A payment box is a later step and does not move the checker. On 2026-11-02 the first download was about 92% and this switch was not made.

## Stamp index backup (Kimi / THOR)

The stamp index is the API SQLite file. Back it up on THOR, not on the home node. This does not change `/api/*` and does not turn on payments.

The live index is the database inside the API container, on volume `satohash_satohash_data`. The host file `/root/satohash/data/satohash.db` is an old 208 KB copy from 2026-08-29. Do not back that file up as the live index.

`/root/satohash` is branch `fix/locale-de-fr-legal-scope` at `c632289` and the tree is dirty. Do not `git reset --hard` that checkout.

```bash
docker exec -w /app satohash-satohash-api-1 node scripts/backup-stamp-index.mjs
```

The command prints the new file path and nothing else. It does not print `BACKUP_KEY`. The Alpine image has no `zip` tool, so the snapshot is an encrypted `.enc` when the key is set. Keep it on THOR. Do not commit it.

Latest snapshot from the 2026-11-02 rebuild: `/app/data/backups/satohash-2026-11-02T22-10-41-681Z.enc`.

A typed `L402` header is not a payment. `REQUIRE_LIGHTNING` stays false. The payment check is already in image `7c68076` and does nothing while the flag is false. When Cam later sets the flag to true, the server accepts a stamp only after LNbits says that invoice is paid and the preimage hashes to that payment. The paid path is also capped at 20 stamps an hour per IP. The free path stays 5 a minute. Family keys stay free. This goodbye does not need another rebuild.

## Current (2026-11-03)

API image `7c68076` is running. `GET /health?deep=true` at 16:10 UTC was ok, paywall `free_open`, our node at block **974,408**, IBD done. Practice stamp confirmed in block **974302**. Live homepage shell `/b/index-BlXgiPcI.js`. Do not rebuild for this docs goodbye. Do not `git reset --hard` `/root/satohash`. Ingest the top of `docs/KIMI-HANDOFF.md` into THOR Obsidian.

The October status line (SPA `4134150`, `gitSha` `e814a57`) is history. `6c8ae2e` was later pushed as `90392e7`. Do not treat the October “do not push” line as current.

## API rebuild (2026-09-11) — DONE

Kimi on THOR: live `GET https://api.satohash.io/health` → **`gitSha=5ec7756`**. Keep-alive 65s / headers 66s / timeout 120s. Paywall off. Caddy OK. Vault ingest done (THOR Obsidian).

Recipe for a **future** rebuild only (when Grok ships new server code). Do not run this reset on `/root/satohash`. That checkout is dirty. Use the clean worktree:

```bash
cd /root/satohash-deploy && git fetch origin && git reset --hard origin/main
# .env is a symlink to /root/satohash/.env. Confirm REQUIRE_LIGHTNING=false first.
GIT_SHA=$(git rev-parse --short HEAD) docker compose -p satohash -f docker-compose.vps.yml up -d --build
```

If `/root/satohash-deploy` is missing, add it with `git worktree add --detach /root/satohash-deploy origin/main` from `/root/satohash`, then link `.env`. Do not change `/api/*`. Do not touch Pages. Do not rebuild just because this paragraph exists. The 2026-11-03 goodbye does not need a rebuild.

## When SPA flashes “System Desync” or hangs on `/stamp` `/verify`

Fixed **2026-08-31** (`ec1c69e`, live). Cause was lazy Stamp/Verify chunks importing the HTML entry + a service-worker / `vite:preloadError` / ErrorBoundary reload loop. Core loop is eager; `injectRegister: false`. If it returns: hard refresh once, then Grok (not a CF UI retry).

## When SPA shows `Unexpected token '<'`

1. Confirm main JS is real: `curl -sS https://satohash.io/b/index-….js | head -c 40` → must be `const`/`import`, not `<!doctype`
2. Purge **satohash.io** zone cache (not giveabit) if edge poison
3. Prefer single deploy path (GH Actions)

## Explainer / media

| Item | Path |
|------|------|
| Player | https://satohash.io/watch (native **~70s** Kimi cut; 10s teaser toggle stays) |
| Primary MP4 | `https://videos.giveabit.io/media/video/satohash-explainer-wise-70.mp4` (~70.1s, 1920×1080) |
| Teaser MP4 | `satohash-explainer-with-vo.mp4` (~10s) — unchanged |
| Cache-bust | SPA loads `…wise-70.mp4?v=kimi-wise-70-20261013` |
| Close | Kimi, gold `satohash.io`, hash mark. A real proof card names block **969,627** |
| Voice | Young British English (Kokoro Isabella) until HeyGen Pippa can be signed in again |
| Music | Quiet dark ambient under the voice. The old dance bed is not in this cut |
| Source | `videos/satohash-explainer/` (HyperFrames, local, not in git) |
| Ops notes | `docs/EXPLAINER-MUSIC-AND-VO.md` · `public/media/video/SCRIPT.md` |

If `/watch` shows stale video: hard refresh; check MP4 duration **~70s** (full) or ~10s (teaser). Marketing routes are eager-loaded.

**Cam (not Grok):** Pin on X account **@give_bit** (not @satohash). Paste-ready copy: `docs/marketing/GIVE-BIT-X-PACK.md`.  
Card must be the player card (`/watch-player.html`). After pin, paste into cards-dev.twitter.com.

## Card Validator (after every Pages deploy)

X/OG unfurls read crawler HTML (Twitterbot), not the SPA shell. After a Pages deploy (or before a `/watch` pin), from M3:

```bash
node scripts/cards-validate.mjs
```

| Check | Want |
|-------|------|
| UA | `Twitterbot/1.0` (hits CF prerender) |
| `/` `/stamp` one learn article `/identity` `/status` `/counsel` | `twitter:card=summary_large_image` + JPEG `og:image` |
| `/watch` | `twitter:card=player` + `twitter:player` → `https://satohash.io/watch-player.html` |
| `/p/<hash>` | last10 hash from `https://api.satohash.io/metrics.json` · JPEG `01-stamp-hero.jpg` |
| `twitter:site` | `@give_bit` |

Fail closed on PNG hero, missing player tags, or `@satohash`. Clips for social: `bash scripts/cut-explainer-clips.sh` (writes `/tmp/satohash-clips/`, not git).

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

`scripts/nostr-publish-feed.js` publishes kind-1 notes from `https://satohash.io/feed.xml`. **Default is dry-run** (print events, do not publish, do not write state). `--publish` is explicit. Do **not** duplicate this script.

- Env `NOSTR_PRIVATE_KEY` (64 hex) **only on THOR**, never git, never a hook, never this file. Prefer `EnvironmentFile=` over inline crontab env.
- Do not add this script to git hooks.
- Cron every 15 min (after a dry-run looks right):

```cron
*/15 * * * * set -a; . /etc/satohash/nostr.env; set +a; cd /root/satohash && /usr/bin/node scripts/nostr-publish-feed.js --publish
```

Until Kimi sets `NOSTR_PRIVATE_KEY` on THOR, leave the crontab / timer off or keep invoking without `--publish`.

### systemd (preferred on THOR)

`/etc/satohash/nostr.env` (mode `600`, root-only; **not** in git):

```
NOSTR_PRIVATE_KEY=<64-hex>
# NOSTR_RELAYS=wss://relay.damus.io,wss://nos.lol,wss://relay.primal.net
# NOSTR_NIP05=satohash@satohash.io
```

`/etc/systemd/system/satohash-nostr-feed.service`:

```
[Unit]
Description=Satohash RSS → Nostr kind-1
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
WorkingDirectory=/root/satohash
EnvironmentFile=/etc/satohash/nostr.env
ExecStart=/usr/bin/node /root/satohash/scripts/nostr-publish-feed.js --publish
Nice=10
```

`/etc/systemd/system/satohash-nostr-feed.timer`:

```
[Unit]
Description=Satohash RSS → Nostr every 15 min

[Timer]
OnBootSec=2min
OnUnitActiveSec=15min
AccuracySec=1min
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
# dry-run first (no --publish)
cd /root/satohash && set -a && . /etc/satohash/nostr.env && set +a && node scripts/nostr-publish-feed.js --dry-run
systemctl daemon-reload
systemctl enable --now satohash-nostr-feed.timer
systemctl list-timers satohash-nostr-feed.timer
```

## Kind-0 Nostr profile (once, THOR)

Public fields only. nsec / `NOSTR_PRIVATE_KEY` stays on THOR.

| Field | Value |
|-------|--------|
| name | Satohash |
| about | Free Bitcoin proof of existence (hash on device, receipt on Bitcoin) |
| lud16 | satohash@breez.tips |
| website | https://satohash.io |
| nip05 | satohash@satohash.io (omit with `NOSTR_NIP05=`) |

```bash
# dry-run (default; no key required)
node scripts/nostr-kind0-profile.js
# publish once — same EnvironmentFile as the feed timer
set -a && . /etc/satohash/nostr.env && set +a
node scripts/nostr-kind0-profile.js --publish
```

Do not log the key. Do not add to git hooks. Kind-0 is a one-shot, not a cron.

## Sentry Vault (Cam-gated)

Code is wired (`SENTRY_DSN` server, `VITE_SENTRY_DSN` SPA) and **off** when empty. Do **not** invent a DSN. Cam creates a sentry.io project (free tier is enough) and pastes both values into **Cam Vault** + THOR / Pages env. Never git, never this file, never a handoff.

Self-hosting Sentry on THOR is **not** recommended (kafka + clickhouse ~8GB RAM). Leave both env vars blank until Cam pastes them. SPA: Cloudflare Pages env `VITE_SENTRY_DSN` (rebuild required). API: THOR `.env` `SENTRY_DSN` then API container recreate. Confirm empty today: `grep SENTRY .env` must not appear in git.

## Kimi — API image rebuild (**DONE 2026-08-31**, Grok on THOR)

**Family widgets (2026-09-15):** live stamps verified (katoa/motopass/sherpacarta/tadbuy=2, giveabit=3). Giveabit widget is `/tools`. HQ was not zeros. Do **not** rebuild Satohash API. SoT: `docs/FAMILY-API.md`.

Live SHA is **`GET https://api.satohash.io/health` → `gitSha`** (do not trust this paragraph’s hash). Last check in this paragraph was 2026-09-08 (`7cc0932`). Current image and the safe rebuild steps are in **Current (2026-11-03)** above. Do not `git reset --hard` `/root/satohash`. Do **not** change `/api/*` paths.

Confirm (should already pass):

```bash
curl -sS https://api.satohash.io/metrics.json | python3 -c 'import json,sys; d=json.load(sys.stdin); r=d.get("raw") or {}; print("last10", len(r.get("last10") or [])); print("familyClients", bool(r.get("familyClients"))); print("requireLightning", r.get("requireLightning"))'
```

## Handoffs

Newest session notes: `docs/handoff-log.md` (also append `docs/KIMI-HANDOFF.md` until fully migrated).  
MASTER-BRAIN paste: `docs/MASTER-BRAIN-INGEST.md` → **THOR VPS Obsidian** (not M4).  
Cloudflare (Cam): `docs/CLOUDFLARE-PAGES.md` — do not log in unless the site is broken.