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
2. **SPA** on Cloudflare Pages → `satohash.io`
3. **Free stamps:** `REQUIRE_LIGHTNING=false` until Cam flips paywall
4. **Metrics SoT:** `https://api.satohash.io/metrics.json`
5. **No secrets in git / handoffs**
6. **One SPA deploy path:** GitHub Actions `Deploy` only — never Retry in the CF Pages UI while Actions is yellow

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

## Kimi — API image rebuild (**DONE 2026-08-31**, Grok on THOR)

Live image from git `78e2a8f`: authored field on `POST /api/stamp` is enforced (bad `authored.file_sha256` → 400). `REQUIRE_LIGHTNING=false`. Metrics still have `raw.last10` + `raw.familyClients`. Recipe for a future rebuild: `cd /root/satohash && git pull origin main && bash scripts/vps-deploy-api.sh`. Do **not** change `/api/*` paths.

Confirm (should already pass):

```bash
curl -sS https://api.satohash.io/metrics.json | python3 -c 'import json,sys; d=json.load(sys.stdin); r=d.get("raw") or {}; print("last10", len(r.get("last10") or [])); print("familyClients", bool(r.get("familyClients"))); print("requireLightning", r.get("requireLightning"))'
```

## Handoffs

Newest session notes: `docs/handoff-log.md` (also append `docs/KIMI-HANDOFF.md` until fully migrated).  
MASTER-BRAIN paste: `docs/MASTER-BRAIN-INGEST.md` → **THOR VPS Obsidian** (not M4).  
Cloudflare (Cam): `docs/CLOUDFLARE-PAGES.md` — do not log in unless the site is broken.