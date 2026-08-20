# GROK BOOT — READ THIS EVERY SESSION

**This file lives in every repo's ref/ directory.** Every time you open this project, read ref/GROK-BOOT.md first.

## Also read (Satohash-specific)

1. `ref/AGENTS.md` + `docs/KIMI-HANDOFF.md` (top)
2. `docs/FAMILY-API.md`
3. `.ai_docs/current-status.md`

## Current state (2026-08-10)

- **API:** v5.0.0-ELITE on THOR Docker — fully operational
- **SPA:** satohash.io + www.satohash.io (CF Pages, both 🟢 200)
- **AI:** local embed + fraud ML live (no ANTHROPIC_KEY needed)
- **Bitcoin node:** Bitcoin Core v28.1 pruned — **IBD complete** (~Aug 8); at tip; `source: bitcoind`; local mempool
- **Paywall:** REQUIRE_LIGHTNING=false (free stamps). LNbits invoice key wired — flip-ready.
- **Nostr:** Multi-relay publish on stamp (2/3 relays ok, damus.io flaky)
- **Explain video:** /watch ~84s Kimi/Pippa cut (primary) · 10s teaser toggle · hash mark top-left on close
- **HQ:** 🟢 Green on `api.satohash.io/metrics.json`

## Hard rules

- No secrets in git (nsec, invoice keys, `.env`, PATs)
- API lives only on `api.satohash.io` — SPA calls via `VITE_API_URL`
- HQ SoT = `api.satohash.io/metrics.json` (not the SPA mirror)
- M3/M4 = code + push; THOR/Kimi = Docker/node/bitcoind/LN/backups
- www.satohash.io: if 522, check CF Pages custom domain (not THOR)

## Need help?
Ask Kimi on THOR (via Hermes) for Docker, bitcoind, LNbits. Code stays on M3/M4.
