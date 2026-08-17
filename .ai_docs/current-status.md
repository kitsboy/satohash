# Current Status — Satohash

**Version:** **5.0.0-ELITE**  
**Last Updated:** 2026-08-17 (Grok 4.6 — live e2e + LH soft gate + visual polish)  
**Frontend:** https://satohash.io · www · CF Pages `satohash`  
**API:** https://api.satohash.io ✅ LIVE (THOR) — HQ metrics SoT  
**Analytics:** Umami analytics.giveabit.io (CORS noise possible)  
**HQ:** https://hq.giveabit.io  
**Git tip:** see `main` after this session push

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
| Blocks | **at tip** (live readiness; was 962,885 on 2026-08-17) |
| Verification | **~100%** |
| initialblockdownload | **false** |
| Pruned | 10 GB target · active · healthy |
| Service | systemd `bitcoind` active |
| Mempool | local node live |
| Deep health | green · deps 200 |
| ready_to_verify | **true** (own-node path) |

**Story:** During IBD the API correctly used mempool.space fallback. That path is **off** now — chain height + mempool come from the local node.

## Product surfaces
| Path | Notes |
|------|--------|
| `/` | Landing + marketing nav · live node chip · CTA “Watch **10s** explainer” |
| `/stamp` · `/verify` | Free core loop · public routes · `LiveNodeChip` |
| `/stamp/done` | Success route (no double-submit) · hash → verify |
| `/templates` | Category chips scroll/centered filters |
| `/watch` | **10s Kimi teaser** native video |
| `/government` | Solutions + charts + humble Motopass concept |
| `/network` | Live calendars / bitcoin / stamps dashboard |
| Nav | Stamp · Verify · Templates · Pricing · More |
| Language | Elite dropdown · en es fr de pt sw zh |

## Recent product (through 2026-08-17)
- [x] 10s explainer on `/watch` + cache-bust  
- [x] Mobile / nav / i18n closeout  
- [x] Landing lighthouse perf + a11y contrast  
- [x] **IBD complete — own-node at tip**  
- [x] **Mobile Top 12** — sticky stamp, /stamp/done, share+QR, package, ELI-5, PWA icons  
- [x] **Mobile overflow** — tooltips, language menu, More nav stay on-screen  
- [x] **Public docs** — 5.0.0-ELITE truth + `/docs` facelift  
- [x] **Live e2e** landing → stamp → API → verify (`tests/e2e/live-stamp-verify.spec.js` + `npm run test:live-api`)  
- [x] **CI Lighthouse mobile soft gate** (`lh:mobile`, `continue-on-error`)  
- [x] **WebKit / Safari chrome QA** (`safari-chrome.spec.js`)  
- [x] **Visual polish** — sheen CTAs, vault rings, theme-aware HUD, live node jewelry  

## Ops still open
- [ ] Longer educational MP4 (~30s+) when Cam ready  
- [x] ~~IBD complete → ready_to_verify~~ **DONE**  
- [x] ~~Full e2e stamp→verify vs live API · CI lh mobile gate~~ **DONE** (physical Safari device still optional)  
- [ ] Paywall only when Cam flips  
- [ ] Optional Socket.IO CORS / Umami funnel events  
- [ ] Store apps: PWA → Capacitor later (not started)  
- [ ] Watch bitcoind RAM/OOM (history 2026-07-28)  

## Agent entry
**AGENTS.md** · this file · `docs/handoff-log.md` · `docs/KIMI-HANDOFF.md` · `docs/MVP-CHECKLIST.md` · goodbye summary under `docs/archive/`
