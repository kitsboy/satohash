# Current Status — Satohash

**Version:** **5.0.0-ELITE**  
**Last Updated:** 2026-08-05 (Grok goodbye — 10s Kimi teaser on `/watch`)  
**Frontend:** https://satohash.io · www · CF Pages `satohash`  
**API:** https://api.satohash.io ✅ LIVE (THOR) — HQ metrics SoT  
**Analytics:** Umami analytics.giveabit.io (CORS noise possible)  
**HQ:** https://hq.giveabit.io  
**Git tip:** `af2268a` (+ session closeout) · `main` synced origin

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
| Status | **IBD syncing** (multi-day; headers complete) |
| ready_to_verify | false until IBD done |
| Process | systemd enabled · datadir `/root/.bitcoin` |
| Fallback | OTS calendars + mempool by design during IBD |

## Product surfaces
| Path | Notes |
|------|--------|
| `/` | Landing + marketing nav · CTA “Watch **10s** explainer” |
| `/stamp` · `/verify` | Free core loop · public routes |
| `/templates` | Category chips scroll/centered filters |
| `/watch` | **10s Kimi teaser** native video (`satohash-explainer-with-vo.mp4?v=10s-kimi-20260804`) |
| `/government` | Solutions + charts + humble Motopass concept |
| `/network` | Live calendars / bitcoin / stamps dashboard |
| Nav | Stamp · Verify · Templates · Pricing · More |
| Language | Elite dropdown · en es fr de pt sw zh |

## This session (2026-08-05)
- [x] 10s explainer script + review of Cam’s MP4  
- [x] `/watch` player swap to native video  
- [x] CTA 60s → 10s  
- [x] Edge cache fix (query bust + media TTL + redeploy)  
- [x] Handoff / session summary closeout  

## Ops still open
- [ ] Longer educational MP4 (~30s+) when Cam ready  
- [ ] IBD complete → ready_to_verify  
- [ ] Paywall only when Cam flips  
- [ ] Optional Socket.IO CORS / Umami header fixes  
- [ ] Store apps: PWA → Capacitor later (not started)  

## Agent entry
**AGENTS.md** · this file · `docs/handoff-log.md` · `docs/KIMI-HANDOFF.md` · `docs/MVP-CHECKLIST.md` · goodbye summary under `docs/archive/`
