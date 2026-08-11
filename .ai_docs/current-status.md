# Current Status — Satohash

**Version:** **5.0.0-ELITE**  
**Last Updated:** 2026-08-10 (Grok goodbye — **Mobile Top 12 live** + IBD done)  
**Frontend:** https://satohash.io · www · CF Pages `satohash`  
**API:** https://api.satohash.io ✅ LIVE (THOR) — HQ metrics SoT  
**Analytics:** Umami analytics.giveabit.io (CORS noise possible)  
**HQ:** https://hq.giveabit.io  
**Git tip:** `5fea2a3` · `main` synced origin

## Planes
- Proof API: THOR Docker + Caddy  
- SPA: CF Pages → **must** call `https://api.satohash.io`  
- Free stamps: `REQUIRE_LIGHTNING=false`  
- Code M3 · Ops Kimi/THOR  
- Bundles `/b/*`

## Bitcoin (THOR) — live (IBD DONE)

| Field | Value |
|-------|--------|
| Public source | **bitcoind** (not mempool.space fallback) |
| Blocks | **961,960 / 961,960** (= chain tip) |
| Verification | **~100%** (0.999996) |
| initialblockdownload | **false** |
| Pruned | 10 GB target · active · healthy |
| Service | systemd `bitcoind` active · load calm (~2.0) |
| Mempool | local node live |
| Deep health | green · deps 200 |
| ready_to_verify | **true** (own-node path) |
| History | Restored Aug 4 @ ~508k → finished ~Aug 8 → tip since |

**Story:** During IBD the API correctly used mempool.space fallback. That path is **off** now — chain height + mempool come from the local node. Suite products (satohash, katoa fees, tadbuy/motopass tickers, stranded stats) can lean on own-node.

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

## Recent product (through 2026-08-10 tip `5fea2a3`)
- [x] 10s explainer on `/watch` + cache-bust  
- [x] Mobile / nav / i18n closeout  
- [x] Landing lighthouse perf + a11y contrast  
- [x] **IBD complete — own-node at tip** (Kimi 2026-08-10)  
- [x] **Mobile Top 12** — sticky stamp, /stamp/done, share+QR, package, ELI-5, PWA icons (live)  

## Ops still open
- [ ] Longer educational MP4 (~30s+) when Cam ready  
- [x] ~~IBD complete → ready_to_verify~~ **DONE**  
- [ ] Full e2e stamp→verify vs live API · CI lh mobile gate  
- [ ] Paywall only when Cam flips  
- [ ] Optional Socket.IO CORS / Umami funnel events  
- [ ] Store apps: PWA → Capacitor later (not started)  
- [ ] Watch bitcoind RAM/OOM (history 2026-07-28)  

## Agent entry
**AGENTS.md** · this file · `docs/handoff-log.md` · `docs/KIMI-HANDOFF.md` · `docs/MVP-CHECKLIST.md` · goodbye summary under `docs/archive/`
