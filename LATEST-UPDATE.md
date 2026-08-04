# satohash — Last Updated 2026-08-04 (Grok closeout + Kimi truth sweep)

**Brief:** Mobile MVP + full nav/language redesign + page polish shipped to CF Pages; free stamps ON.

**Git tip:** `9bbacf1` on `main`  
**API:** 5.0.0-ELITE green · `REQUIRE_LIGHTNING=false`  
**SPA:** satohash.io · peek deploys via wrangler throughout session  

**Key URLs**
- https://satohash.io/stamp · /templates · /government · /network · /watch  
- Status: `.ai_docs/current-status.md` · log: `docs/handoff-log.md`  
- Session: `docs/archive/SESSION-SUMMARY-2026-08-04-goodbye.md`  

**Bitcoind (Kimi truth 2026-08-04):** RESTORED — was OOM-killed 2026-07-28 22:12, down ~6 days (IBD stalled 20.2%). New systemd override unit (/etc/systemd/system/bitcoind.service, enabled). Public source now **bitcoind** + syncing (rising ~85 blk/min, ETA ~4d). mempool.space fallback by design until IBD done.

**Kimi:** monitor IBD; no paywall. **Cam:** `/whatsup` to resume.
