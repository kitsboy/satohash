# Current Status — Satohash

**Version:** **5.0.0-ELITE**  
**Last Updated:** 2026-08-04 (Kimi ops truth + Grok handoff persist)  
**Frontend:** https://satohash.io · www · giveabit · CF Pages project `satohash`  
**API:** https://api.satohash.io ✅ LIVE (THOR) — **HQ metrics SoT**  
**Analytics:** ✅ Umami analytics.giveabit.io  
**HQ:** https://hq.giveabit.io  
**Git tip (THOR):** `fb1a28a` · branch `main` (M3 may be ahead with SPA/menu uncommitted)

## Planes
- Proof API: THOR Docker + Caddy TLS  
- SPA: Cloudflare Pages → **must** call `https://api.satohash.io`  
- Metrics: HQ → API; SPA `/metrics.json` → CF Function proxy  
- Family free stamp: `REQUIRE_LIGHTNING=false` until paywall  
- Code M3 · Ops Kimi/THOR · `docs/OPS-TWO-MACHINE.md`  
- Bundles under **`/b/*`** (not `/assets/*`) — avoids apex edge HTML-as-JS poison  

## Bitcoin node (THOR) — 2026-08-04 truth
| Field | Value |
|-------|--------|
| Public source | **`bitcoind`** (restored ~02:33 UTC) |
| Status | **IBD syncing** (~20% progress; headers complete) |
| ready_to_verify | false until IBD done |
| Process | systemd `bitcoind.service` **enabled** (datadir `/root/.bitcoin`) |
| History | OOM-killed 2026-07-28 → dead ~6d → restarted 2026-08-04 |
| ETA | ~3.7–4 days at ~85 blk/min (order-of-magnitude) |
| Fallback | mempool.space still available by design if RPC dies |

## Live product surfaces
| Path | What |
|------|------|
| `/` | Landing — free model `#free-and-fees`, verify `#verify-ots` |
| `/watch` · `/explainer` | Explainer — VO + music |
| `/templates` | Category chip strip fixed (scroll, no overflow) |
| `/stamp` | Free stamp (API) |
| `/pricing` | Free / 21 sats / Pro sketch |

## Metrics / HQ
- SoT: `https://api.satohash.io/metrics.json`  
- **client_id aggregates** ✅ live  
- **`raw.directory`** ✅ live  
- Health green; bitcoin-anchor may stay **amber** during IBD (pending confirmations)

## Recent product (M3)
- [x] Templates category bar + menus MVP polish + CF Pages deploy  
- [x] MVP checklist `docs/MVP-CHECKLIST.md` · `npm run mvp:smoke`  

## Ops status (Kimi/THOR)
- [x] **source: bitcoind** public (syncing, not finished IBD)  
- [x] client_id + directory on metrics  
- [ ] IBD **complete** → `ready_to_verify=true` / confirmed path (~4d)  
- [ ] LNbits / wallets / paywall **only when Cam flips**  
- [ ] Watch free RAM — OOM risk was real (node ~1GB RSS)  

## Standing non-negotiables
REQUIRE_LIGHTNING=false · no secrets in git · HQ metrics API only · free stamps for strangers  

## Agent entry
**`AGENTS.md`** · status **this file** · log **`docs/handoff-log.md`** · Kimi detail **`docs/KIMI-HANDOFF.md`** · MVP **`docs/MVP-CHECKLIST.md`**
