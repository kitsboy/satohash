---
title: Investor / Partner One-Pager
project: Satohash
version: 5.0.0-ELITE
audience: investors, partners, grants
last_updated: 2026-09-15
owner: Kimi (Orchestrator) + Nova (Docs)
self_evolving: true
update_rule: >
  Any material change to product, stack, deploy path, traction, or ask
  MUST update this file in the same PR/commit when possible.
  Weekly freshness target: score >= 7 (see nova-product-management).
tags: [diligence, pitch, mvp, giveabit]
---
# Satohash — Investor / Partner One-Pager

**Live:** [https://satohash.io](https://satohash.io) · **API:** [https://api.satohash.io](https://api.satohash.io) · **GitHub:** [https://github.com/kitsboy/satohash](https://github.com/kitsboy/satohash) · **Version:** `5.0.0-ELITE` · **Status:** LIVE MVP

## One sentence

Prove a file existed. Never show the file. Bitcoin keeps the receipt forever.

## Problem

Notaries and SaaS timestamping demand trust, expose documents, or charge recurring fees. Deepfakes make “what happened when” harder to prove.

## Solution

Client-side SHA-256 + OpenTimestamps + a Bitcoin block. The file never leaves the device. The receipt is a portable `.ots` file. Free stamps today. Paywall off.

## Who it's for

Anyone who needs a date they can check: journalists, creators, legal and compliance teams, researchers, and Give A Bit family apps (Katoa, MotoPass, Sherpa).

## Stage

Working MVP (`5.0.0-ELITE`). A stranger can stamp, download `.ots`, verify, and share `/p/<hash>` — no account. Phone cameras open `https://satohash.io/p/{hash}`. **Pending ≠ Confirmed** (~60 min). Family widget default POSTs `/api/stamp`.

## Traction (honest)

- Live SPA: [satohash.io](https://satohash.io)
- Live API: [api.satohash.io](https://api.satohash.io) (THOR Docker; own `bitcoind` at tip)
- Family widgets on Katoa, MotoPass, Sherpa, TadBuy, Give A Bit (`/tools`) — default **POST** `/api/stamp`. Live HQ 2026-09-15: those five ids 2–3 (read `metrics.json`; do not invent)
- Live stamp count is on [/network](https://satohash.io/network) and `https://api.satohash.io/metrics.json`

## Model / value flow

Free base (stamp / verify / `.ots` + client-side hashing) is the permanent trust anchor — never paywalled. Optional premium tiers and a pay-per-use API are designed, **not live**. Lightning / L402 / BOLT-12 are built but staged (`REQUIRE_LIGHTNING=false`; LND not configured).

## Honest gaps (mission v3)

| Limit | What it means |
|-------|----------------|
| Proves **when**, not **who** | Anyone can stamp any file. Authorship via private-key signing is the next chapter. |
| ~60-minute confirmation | Anchoring waits for the next Bitcoin block. Strength, not a bug. |
| Bitcoin-only | No multi-chain anchoring, ever. |
| Hash confidentiality has edges | Fine for real documents; not a privacy shield for trivial, guessable inputs. |
| Cathedral not shipped | Multi-party contracts, store-shipped Snapper, native store apps, ZK redaction, 3D Merkle, BOLT-12 billing. |

## Why Give A Bit

Part of an interlocking Bitcoin-sovereignty suite. Shared brand, Safe Harbour, open-source default. Family apps embed the same proof plane.

## 90-day north star (default)

Authorship (*who*) as the next product chapter. Pin `/watch` on @give_bit. Physical iPhone `/p/` unfurl. Keep this pack honest.

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| OTS calendar reliability | Multi-calendar submit + own `bitcoind` for verify |
| Legal admissibility varies by jurisdiction | Educational framing: admissible evidence of a date, not a presumed legal conclusion |
| Over-claiming unshipped planes | Brand voice honesty gates — under-claim |

## The ask (default — refine per conversation)

Protocol collaborators, legal design partners, distribution through the Give A Bit family. Not selling returns. Not claiming regulated notarial status.

## Demo path (60 seconds)

1. Open [https://satohash.io/stamp](https://satohash.io/stamp) — no account.
2. Drop a file. Hash stays on-device. Download the `.ots`.
3. Verify — **Pending ≠ Confirmed**. Share `/p/<hash>` (camera QR).
4. Point to this pack: `docs/diligence/`

## Related pack files

- [Architecture one-pager](./ARCHITECTURE-ONEPAGER.md)
- [Ask sheet](./ASK-SHEET.md)
- [Pack index](./README.md)
- Pitch (canonical): [docs/marketing/PITCH.md](../marketing/PITCH.md)
- Exec summary: [docs/marketing/EXECUTIVE-SUMMARY.md](../marketing/EXECUTIVE-SUMMARY.md)
- Mission v3: [docs/MISSION-SCOPE-v3.md](../MISSION-SCOPE-v3.md)
- Portfolio: [Family of 8](https://giveabit.io/family)

---
**Safe Harbour:** Educational / informational only. Not financial, legal, or investment advice.
Bitcoin involves risk. DYOR. Not your keys, not your cheese.
Part of the [Give A Bit](https://giveabit.io) family.
