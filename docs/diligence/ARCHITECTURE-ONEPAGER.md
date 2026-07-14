---
title: Technical Architecture One-Pager
project: Satohash
version: 1.0.0
audience: developers, technical partners
last_updated: 2026-07-13
owner: Kimi (Orchestrator) + Nova (Docs)
self_evolving: true
update_rule: >
  Any material change to product, stack, deploy path, traction, or ask
  MUST update this file in the same PR/commit when possible.
  Weekly freshness target: score >= 7 (see nova-product-management).
tags: [diligence, pitch, mvp, giveabit]
---
# Satohash — Technical Architecture One-Pager

**Live:** https://satohash.io · **Repo:** https://github.com/kitsboy/satohash · **Version:** `4.1.0-ELITE`

## Stack
React/Vite · Web Crypto · OpenTimestamps · optional Lightning/Nostr · Cloudflare Pages

## System map (boxes)
```
[User browser]
     |
     v
[SPA / static app on Cloudflare Pages]
     |
        +--------+--------+
|                 |
        v                 v
[Public APIs / LN / Nostr / OTS]   [Optional M3/M4 services]
```

## Architecture notes
- Browser hashes files (never upload full document)
- OTS calendars → Bitcoin block commitment
- Four planes: Proof · Identity · Settlement · Atlas
- Primarily static frontend; optional support services
- Proofs verifiable without Satohash existing forever

## Deploy path
Auto-deploy main → Cloudflare Pages (dist/ client)

## Data & privacy posture
Prefer client-side and user-held keys. Minimize PII. Bitcoin rails where payments exist. See project privacy/security docs if present.

## MVP boundary
- **In MVP now:** Hash → OTS → verify UX; multi-plane product surface live.
- **Explicitly later:** L402/paywalls, mobile, enterprise SSO, suite-wide embeds.

## Dependencies
Bitcoin/OTS calendars; optional LN + Nostr

## How a technical helper starts (15 min)
```bash
git clone https://github.com/kitsboy/satohash.git
cd satohash
# typically:
npm install
npm run dev
```
Read `README.md`, `docs/DEPLOYMENT.md` (or `DEPLOY.md`), and this file.

## Known gaps (full disclosure)
See Investor one-pager risks + project `LATEST-UPDATE.md` / handoffs. Do not claim production hardness without tests/deploy verification.

## Related
- [Investor one-pager](./INVESTOR-ONEPAGER.md)
- [Ask sheet](./ASK-SHEET.md)
- Deeper docs: `docs/ARCHITECTURE.md` (if present), `SOURCE-OF-TRUTH.md`, `docs/.ai_docs/`

---
**Safe Harbour:** Educational / informational only. Not financial, legal, or investment advice.
Bitcoin involves risk. DYOR. Not your keys, not your cheese.
Part of the [Give A Bit](https://giveabit.io) family.
