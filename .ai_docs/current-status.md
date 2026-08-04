# Current Status — Satohash

**Version:** **5.0.0-ELITE**  
**Last Updated:** 2026-08-04 (Grok goodbye — mobile/nav/i18n/pages mega-session)  
**Frontend:** https://satohash.io · www · CF Pages `satohash`  
**API:** https://api.satohash.io ✅ LIVE (THOR) — HQ metrics SoT  
**Analytics:** Umami analytics.giveabit.io (CORS noise possible)  
**HQ:** https://hq.giveabit.io  
**Git tip:** `db1e493` · `main` synced origin (at closeout)

## Planes
- Proof API: THOR Docker + Caddy  
- SPA: CF Pages → **must** call `https://api.satohash.io`  
- Free stamps: `REQUIRE_LIGHTNING=false`  
- Code M3 · Ops Kimi/THOR  
- Bundles `/b/*`

## Bitcoin (THOR) — live
| Field | Value |
|-------|--------|
| Public source | **bitcoind** |
| Status | **IBD syncing** ~25% (height rising; headers complete) |
| ready_to_verify | false until IBD done |
| Process | systemd enabled · datadir `/root/.bitcoin` |
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
- [x] Docs/handoff/session summary closeout  

## Ops still open
- [ ] IBD complete → ready_to_verify  
- [ ] Paywall only when Cam flips  
- [ ] Optional Socket.IO CORS / Umami header fixes  
- [ ] Store apps: PWA → Capacitor later (not started)  

## Agent entry
**AGENTS.md** · this file · `docs/handoff-log.md` · `docs/KIMI-HANDOFF.md` · `docs/MVP-CHECKLIST.md` · goodbye summary under `docs/archive/`
