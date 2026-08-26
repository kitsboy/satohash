# satohash — Handoff 2026-08-26 (Hermes/Kimi, end of session)

**Brief:** Video offload to R2 done + live, and the verification sweep's dead-github-links fix landed. Bitcoin L1+L2 verified green.

## What landed
- **Video offload → R2** (t_c16aa991, commit 37ec778): /watch explainer films (vo2 + vo) moved off the bundle → R2 bucket `giveabit-videos`, served at https://videos.giveabit.io. Verified HTTP 206 + byte-range. Commit already on origin/main.
- **Dead github links fixed** (t_ca0c3f14): kitsboy/giveabit + opentimestamps-spec links pointed at wrong/missing targets → corrected.
- **L1/L2 verify** (t_0acd7659): OTS/on-chain API surface all green (164 stamps, block 964178, mempool fees, proof-package w/ bitcoin_block_height). One POST /api/stamp endpoint flagged for follow-up.

## Notes
- REQUIRES_LIGHTNING=false stays (free stamps, family tier). SPA must call https://api.satohash.io (never same-origin on CF Pages).
- Repo is THOR-side at /root/satohash (has its own .git) — note /root/ref/satohash also exists as a checkout reference.
- See /root/hq/docs/KIMI-HANDOFF.md + FIXES-LOG.md for the full session.
