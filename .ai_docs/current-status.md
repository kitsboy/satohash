# Current Status — Satohash

**Version:** **5.0.0-ELITE**  
**Last Updated:** 2026-08-04 (Grok mobile/nav closeout + Kimi truth sweep — bitcoind restored)  
**Frontend:** https://satohash.io · www · giveabit · CF Pages `satohash`  
**API:** https://api.satohash.io ✅ LIVE (THOR) — **HQ metrics SoT**  
**Analytics:** ✅ Umami analytics.giveabit.io (CORS noise possible)  
**HQ:** https://hq.giveabit.io  
**Git tip:** `9bbacf1` · `main` (Kimi truth-sweep push, after Grok closeout)

## Planes
- Proof API: THOR Docker + Caddy  
- SPA: CF Pages → **must** call `https://api.satohash.io`  
- Free stamps: `REQUIRE_LIGHTNING=false`  
- Code M3 · Ops Kimi/THOR  
- Bundles `/b/*`

## Bitcoin (THOR) — live
| Field | Value |
|-------|--------|
| Public source | **bitcoind** (restored 2026-08-04 04:32 CEST — was OOM-killed 2026-07-28 22:12, down ~6 days) |
| Status | **IBD syncing** — 20.2% at restore, rising ~85 blk/min; headers 960,956 (100%) |
| ETA | ~4 days to block 960,954 at current rate |
| ready_to_verify | false until IBD done |
| Process | systemd enabled (`/etc/systemd/system/bitcoind.service`) · datadir `/root/.bitcoin` (prune 10GB) |
| RPC | 0.0.0.0:8332 · container reachable via 172.19.0.1 (verified HTTP 200) |
| Fallback | OTS calendars + mempool by design during IBD |

## Product surfaces
| Path | Notes |
|------|--------|
| `/` | Landing + marketing nav |
| `/stamp` · `/verify` | Free core loop · public routes |
| `/templates` | Category chips scroll/centered filters |
| `/watch` | Explainer (marketing public, no app bottom dock) |
| `/government` | Solutions + charts + humble Motopass concept |
| `/network` | Live calendars / bitcoin / stamps dashboard |
| Nav | Stamp · Verify · Templates · Pricing · More |
| Language | Elite dropdown · en es fr de pt sw zh |

## This mega-session (done)
- [x] Mobile MarketingShell · scroll-to-top · health banner under nav  
- [x] Language switcher reliability + clean UI  
- [x] Marketing/desktop nav redesign  
- [x] Government / evidence / about / legal / network / motopass / pitch / footer  
- [x] Eager-load critical public pages for link stability  
- [x] Docs/handoff/session summary closeout (Grok)  
- [x] **bitcoind restored** (Kimi truth sweep): OOM-killed Jul 28 → new systemd override unit → public source bitcoind + syncing; full procedure in skill `satohash-v5-ascension`

## Ops still open
- [ ] IBD complete → ready_to_verify (ETA ~4d; keep mempool fallback)
- [ ] Paywall only when Cam flips (`missing_for_paid` empty — flip-ready)
- [ ] Top-level `directory` key on metrics (data live under `raw.directory`; client-attribution live — 4 ids)
- [ ] Optional Socket.IO CORS / Umami header fixes  
- [ ] Optional: rotate creds in root-level `bitcoin.conf` template (gitignored 2026-08-04)
- [ ] Store apps: PWA → Capacitor later (not started)  
- [ ] LNbits / on-chain wallets when Cam requests paywall flip
- [ ] Optional: ElevenLabs re-VO if British quality not accepted

## Agent entry
**AGENTS.md** · this file · `docs/handoff-log.md` · `docs/KIMI-HANDOFF.md` · `docs/MVP-CHECKLIST.md` · goodbye summary under `docs/archive/`
