# Current Status — Satohash

**Version:** **5.0.0-ELITE** (Sovereignty Ascension)  
**Last Updated:** 2026-07-20  
**Frontend:** https://satohash.io  
**API:** https://api.satohash.io ✅ LIVE (THOR)

## Planes
- Proof API on VPS Docker + Caddy TLS  
- SPA on Cloudflare Pages (`VITE_API_URL=https://api.satohash.io`)  
- Family free tier + public open stamp (`REQUIRE_LIGHTNING=false` until paywall)  
- Code M3 · Orchestration Kimi/THOR  

## v5 highlights
- Public: `/api/public/stats|uptime|calendar-status|network|version|did|bitcoin|lightning`  
- Stamps: list, recent, by-hash, batch, multihash, webcapture, cosign, proof-package, ots, chains, ipfs  
- SSE: `/api/events/stamps`, `/api/events/bitcoin`  
- OpenAPI stub, admin keys, webhooks register, eth sepolia stub, 12h pending prune  
- SPA routes: network, proof-of-existence, batch verify, live feed, community, AI hub, widget, wizard  
- CLI package `packages/satohash-cli`, client helpers expanded  

## Next
- Deploy API image on THOR (`git pull` + compose rebuild) to pick up v5 routes  
- SPA deploy after push for new pages  
- HQ metrics card (other repo)  
