# Current Status — Satohash

**Version:** **5.0.0-ELITE**  
**Last Updated:** 2026-07-29 (Grok session closeout — explainer VO + docs cleanup)  
**Frontend:** https://satohash.io · www · giveabit · CF Pages project `satohash`  
**API:** https://api.satohash.io ✅ LIVE (THOR) — **HQ metrics SoT**  
**Analytics:** ✅ Umami analytics.giveabit.io  
**HQ:** https://hq.giveabit.io  
**Git tip:** see `LATEST-UPDATE.md` · branch `main`

## Planes
- Proof API: THOR Docker + Caddy TLS  
- SPA: Cloudflare Pages → **must** call `https://api.satohash.io`  
- Metrics: HQ → API; SPA `/metrics.json` → CF Function proxy  
- Family free stamp: `REQUIRE_LIGHTNING=false` until paywall  
- Code M3 · Ops Kimi/THOR · `docs/OPS-TWO-MACHINE.md`  
- Bundles under **`/b/*`** (not `/assets/*`) — avoids apex edge HTML-as-JS poison  

## Live product surfaces (marketing)
| Path | What |
|------|------|
| `/` | Landing — free model `#free-and-fees`, verify `#verify-ots` |
| `/watch` · `/explainer` | **60–80s explainer** — slides + music + **vo-complete.mp3** |
| `/docs/executive-summary` | Premium exec summary + charts + formal brief |
| `/stamp` | Free stamp (API) |
| `/pricing` | Free / 21 sats / Pro sketch |

## Explainer media (`public/media/video/`)
| Asset | Role |
|-------|------|
| `01-stamp-hero.jpg` … `06-cta-split.jpg` | Visual beats |
| `kimi-teacher.jpg` | Talent / PIP |
| `satohash-explainer-music.mp3` | Ambient BGM under VO |
| **`vo-complete.mp3`** | Full VO ~79.8s (drives `/watch` clock) |
| `vo-section-1/2/3.mp3` | Optional stems |
| `satohash-explainer-with-vo.mp4` | Slides + music + VO mix ~80s |
| `SCRIPT.md` | Timing board |

## This mega-session (done)
- [x] Apex edge poison diagnosis; `/b/*` assets; cache purge guidance  
- [x] Landing free OTS + future pricing sketch  
- [x] Docs consolidation: AGENTS, deploy.md, architecture, marketing/, archive  
- [x] Server route split (`server/routes/*`, thin `index.js`)  
- [x] Components folders: layout/stamps/ui/shared/dashboard/forms/marketing  
- [x] Executive summary redesign + formal prose  
- [x] Nav upgrade (mobile drawer, Pixel-safe targets)  
- [x] Explainer graphics + music + VO wire-up; eager `/watch`  
- [x] Full docs/handoff/MASTER-BRAIN ingest refresh (this closeout)  

## Ops still open (Kimi/THOR)
- [ ] bitcoind IBD → health `source: bitcoind` when ready  
- [ ] Live Docker: `client_id` + directory on metrics if still missing  
- [ ] LNbits / on-chain wallets when Cam requests paywall flip  
- [ ] Optional: ElevenLabs re-VO if British quality not accepted  
- [ ] Homepage CTA → `/watch` if not already wired  

## Agent entry
**`AGENTS.md`** only · status **`.ai_docs/current-status.md`** · log **`docs/handoff-log.md`**
