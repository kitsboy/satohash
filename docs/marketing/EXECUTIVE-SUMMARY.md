<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.io · **Version:** 5.0.0-ELITE (Build 392) · **Updated:** 2026-09-14
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Satohash — Executive Summary

**Version:** 5.0.0-ELITE  
**Date:** 2026-09-14 (aligned to the live product; Mission & Scope v3)  
**Live at:** https://satohash.io (primary) · API https://api.satohash.io  
**Built by:** Give A Bit (https://giveabit.io)  
**GitHub:** https://github.com/kitsboy/satohash  
**Creative north-star:** `docs/marketing/BRAND-VOICE.md` · **Canonical mission:** `docs/MISSION-SCOPE-v3.md`

---

## What Is Satohash?

> **Prove a file existed. Never show the file. Bitcoin keeps the receipt forever.**

Satohash is a Bitcoin-anchored proof-of-existence workbench. Anyone — a person, a family app, or a CLI — can hash a file on-device, stamp only the fingerprint, and receive a portable `.ots` receipt. Third parties verify it with open OpenTimestamps tools and a Bitcoin block. **No account. No KYC. Stamps are free today.** The document **never leaves the device.**

**Core loop (live):** hash locally → stamp the SHA-256 → download `.ots` → share the proof card at `https://satohash.io/p/{hash}` → verify. Phone cameras cannot read `.ots` files; they open the QR, which is that URL.

**Pending is not Confirmed.** Pending means public calendars have the hash. Confirmed means a Bitcoin block has sealed it (~60 minutes — the price of strength, not a bug). Today Satohash proves **when** a file existed, not **who** made it.

**The founding idea (v3):** for centuries, proving a date meant a notary, lawyer, or registry. Satohash's bet is that this middleman is no longer necessary for *existence-at-a-time*. OpenTimestamps anchors a fingerprint into Bitcoin, with no company between the document and the proof. Private-key authorship — *"this file existed, and I am the one who created it"* — is the next chapter, not a current claim.

Higher planes (identity, Lightning settlement, atlas chrome) can evolve later without invalidating Plane 1 proofs. **They are not current features.** Snapper, ZK redaction, 3D Merkle theatre, and BOLT-12 billing are cathedral / staged — do not sell them as live.

---

## The Problem

Proving that something existed *before* a specific date has enormous legal, commercial, and intellectual value — especially in an era of generative AI, deepfakes, and eroding institutional trust.

| Use Case                    | Traditional Friction                  | Satohash Solution                          |
|-----------------------------|---------------------------------------|--------------------------------------------|
| IP / creative precedence    | Expensive, slow legal filings         | Evidence of conception / prior-art support |
| Freelance / creator disputes| "He said / she said", no evidence     | Cryptographic timestamp before delivery    |
| Investigative journalism    | Sources alter or deny content         | Immutable forensic snapshot + OTS          |
| Smart contract / escrow evidence | Custodial third parties            | Self-sovereign, portable mathematical proof|
| AI model / output provenance| No standard, easy to contest later    | Hash at generation time → Bitcoin block    |
| Web content preservation    | Archives can be edited or taken down  | Hash a capture on-device, stamp the fingerprint (Snapper store extension is later) |
| Multi-party contracts       | Signature chains, repudiation risk    | Existence-at-a-time today; verified co-sign is the authorship chapter |
| Compliance / audit trails   | Expensive manual processes            | Family API + CLI + portable `.ots` (not a replacement for retention law) |

---

## How It Works (Zero-Knowledge)

1. **Hash** — The browser (or CLI) computes the SHA-256 fingerprint of your file using the Web Crypto API. The original bytes **never leave your device**.
2. **Stamp** — Only the 64-character hex hash is sent to Satohash, which forwards it to three independent public OpenTimestamps calendars (alice, bob, finney).
3. **Anchor** — Calendars aggregate thousands of hashes into a Merkle tree and commit the root to Bitcoin in an OP_RETURN (or Taproot) transaction.
4. **Confirm** — Within ~**60 minutes** a Bitcoin block permanently seals the commitment (block time is what makes the proof durable). **Pending ≠ Confirmed.** Pending = calendars have the hash. Confirmed = a Bitcoin block has sealed it.
5. **Prove** — Download the `.ots`. Share `https://satohash.io/p/{hash}` (QR on PDFs and email; phone cameras open that URL). Verify in the SPA, with `ots verify`, or any compatible tool + a Bitcoin explorer. The receipt remains valid even if Satohash vanished.

**No trust required.** The security comes from Bitcoin's proof-of-work, not from any company or server.

---

## What is live (v5 ELITE — 2026-09-14)

Cathedral chrome (ZK redaction, Snapper-as-judiciary-ready, 3D Merkle theatre, BOLT-12 billing) is **not** the current product. This is:

### Core loop
- Drag-and-drop stamp on [satohash.io/stamp](https://satohash.io/stamp) — no account
- SHA-256 on-device (Web Crypto). Only the 64-hex hash is submitted
- Portable `.ots` download
- Public verify at `/verify` — **Pending** vs **Confirmed** are different states
- Zero-JS proof card at `https://satohash.io/p/{hash}` — cameras open this URL; they cannot read `.ots`

### Family widget (completes stamps)
Family sites (Katoa, MotoPass, SherpaCarta, Give A Bit, TadBuy) paste:

```html
<div data-satohash-stamp data-client="katoa" data-theme="jewel"></div>
<script src="https://satohash.io/widgets/stamp.js" async></script>
```

The file is hashed on-device (never uploaded). Default **POST**s `https://api.satohash.io/api/stamp` (`X-Satohash-Client`) and returns the proof card. Opt-in `data-mode="spa"` opens `/stamp?hash=&ref=`. Contract: `docs/FAMILY-API.md`. Do not invent `/api/*` paths.

### CLI
From the repo (`packages/satohash-cli` — not the stale `bin/satohash.js`):

```bash
node packages/satohash-cli/bin/satohash.js stamp ./file.pdf
```

Defaults to `https://api.satohash.io`. Sends `X-Satohash-Client: cli`. Prints `https://satohash.io/p/<hash>` on success.

### Also live
- Free stamps (`REQUIRE_LIGHTNING=false`). Paywall off.
- Production API at `api.satohash.io` + own pruned `bitcoind` at tip
- Explainer at `/watch` (~84s)
- Batch stamp in the SPA (rate-limited; public 5/min)

### Not current features (cathedral / staged)
- **ZK redaction** — demo chrome, not a shipped redaction product
- **Snapper** — unpacked MV3 scaffold; not store-shipped, not judiciary-ready
- **3D Merkle explorer** — public demo, not a live block explorer
- **BOLT-12 / L402** — built and staged; Lightning not configured
- **Multi-party signing / authorship** — next chapter; today proves *when*, not *who*

---

## Technology Stack (Current)

| Layer          | Technology                                      |
|----------------|-------------------------------------------------|
| Frontend       | React 18 + Vite 6 + Tailwind CSS 4 + Framer Motion |
| Shell & UX     | AppShellNoir (LeftRail + TopSignal + Mobile), Institutional Noir design tokens |
| Cryptography   | Web Crypto (client) + opentimestamps (server) + bitcoinjs-lib |
| Blockchain     | Bitcoin Mainnet via 3 public OTS calendars      |
| Payments       | Off (`REQUIRE_LIGHTNING=false`). BOLT-12 / L402 built & staged, not live |
| Identity       | Optional Nostr NIP-05 lookup / NIP-07 — proves *when*, not *who* |
| Backend        | Node 20+ + Express 5 + Socket.io + better-sqlite3 + Knex |
| Persistence    | SQLite (metadata only) + client IndexedDB / LocalStorage for local-first |
| Observability  | Sentry (full-stack), Pino, Prometheus           |
| Real-time      | Socket.io (`ots:*` events)                      |
| Build / Deploy | Vite build → `dist/` → Cloudflare Pages (`satohash` project) |

---

## Market Opportunity

- Global notarization / legal attestation market still largely paper-era (~$5B+/yr).
- Legal tech ~$27B+ and growing double digits.
- AI provenance and deepfake defense are brand-new, exploding greenfield categories.
- Bitcoin-anchored, zero-trust, portable proofs have <1% penetration — massive first-mover + standards position.

**Primary buyers:** IP attorneys & law firms, compliance / records teams at enterprises, investigative journalists, freelance creative & dev platforms, AI research labs, government technologists exploring evidence standards.

---

## Who This Serves — The Five Lanes (2026-08-29 · for the 3-day review)

One proof layer, five serious lanes. Each is grounded in cited evidence (Rosa's `SATOHASH-FIVE-PILLAR-ADDENDUM.md`) and, where applicable, jurisdiction-specific legal posture (Lenny's `JURISDICTION-EXPLAINERS.md`). In every lane the promise is the same: **independently verifiable proof of what existed, when, unaltered — without the document ever leaving your control.** And in every lane we stay honest about what is evidence vs. what is certification.

### 1 · M&A Due-Diligence Data Rooms
The **integrity layer** for the deal room. Roughly two-thirds of M&A data breaches occur during due diligence, when confidential material moves across many systems and people — the integrity problem is quantified. Satohash anchors each document's fingerprint to Bitcoin so buyers can verify files match the seller's originals, privately (hash, not file). *Honest: we prove document integrity; the access/audit-log extension is a product build, not claimed yet.*

### 2 · Family Offices & Multi-Generational Wealth
The **longevity layer** against the "three-generation curse" (70% of families lose wealth by the second generation, 90% by the third — directional industry context). Trust instruments, wills, governance charters, property records: an `.ots` anchor proves they existed in an exact state at a date — verifiable long after the advisor firm or software vendor is gone. *Honest: these statistics are secondary/industry context, not hard fact.*

### 3 · Latin Markets (Spanish & Portuguese) — highest-value, highest-uncertainty
The **independent existence-at-a-time** layer alongside each market's regulated identity system. Across Brazil, Mexico, Argentina, Chile, Colombia, Peru, and Spain, electronic evidence is **admissible** — it cannot be rejected merely for being electronic. Identity is the regulated lane (ICP-Brasil, FEA/NOM-151, firma digital, eIDAS). Satohash *complements* these with a neutral, verifiable time/existence anchor. *Honest: admissible, not presumed accurate. We never claim ICP-Brasil, NOM-151, or eIDAS compliance. Stamp + notary is the strong pattern — Satohash for the provenance trail, notary for the final act where required.*

### 4 · Tax & Compliance
The **evidence-strengthening** layer for record retention and audit trails. Satohash proves a supporting record existed in an exact state as of a date — years after the fact, useful for reconstruction audits and "what was on file at the deadline." *Honest: it does not file returns or satisfy any jurisdiction's retention statute. Never stamp raw records with PII/TPINs to a public chain — hash only.*

### 5 · Serious Business & Enterprise
The **privacy-preserving integrity anchor** — hash on-chain, file never leaves the device. The differentiator vs document-management SaaS that stores full files. In contract disputes, "if a party claims a contract was altered, the cryptographic timestamp ends the argument." *Honest: enterprise-grade offers (SLA, white-label, custom webhooks, volume) belong to the paid tiers; we do not claim enterprise readiness we haven't shipped.*

> **One proof layer. Five serious lanes. No trust required.**

---

## Revenue Model (see FINANCIALS.md for projections)

| Tier            | Price                | Notes                                      |
|-----------------|----------------------|--------------------------------------------|
| Free            | $0                   | Free base — never paywalled trust anchor. Stamp/verify/.ots + client-side hashing, no daily quota |
| Professional    | ~2,100 sats/mo (~$29) | Unlimited, full vault, API, PDF exports    |
| Business        | ~21,000 sats/mo (~$299) | White-label, SLA, custom webhooks, volume  |
| Pay-per-use API | 1–5 sats/stamp       | Lightning (L402) — no subscription friction |

**The reconciled model (Cam-locked, 2026-08-29):** *Free base (never paywalled trust anchor) + optional premium tiers (Professional ~2,100 sats / ~$29, Business ~21,000 sats / ~$299) + pay-per-use API (1–5 sats/stamp).* The free tier is the permanent trust anchor and is **never** paywalled. Premium tiers + L402/LND billing rails are built but **not yet switched on** — we launch paid only when channels are funded and tested. Gross margins are extremely high once past fixed infra (Bitcoin anchoring itself is effectively free via public OTS calendars).

---

## Competitive Advantages (Durable)

1. **Trustless & Portable** — Proofs verify without Satohash forever.
2. **True Zero-Knowledge** — We literally cannot see or store your documents.
3. **Bitcoin Security** — The hardest, most decentralized timestamping root in existence.
4. **Open Standard** — Any OTS verifier in the world works; no vendor lock-in.
5. **Lightning-ready economics (staged)** — Sub-cent settlement for volume *when* rails are funded. Not live today.
6. **Self-Sovereign Identity (next chapter)** — Optional Nostr lookup today; authorship signing is the roadmap.
7. **Open stack** — F.O.S.S., self-hostable. Higher planes do not rewrite Plane 1 proofs.

---

## Team & Backing

Engineered by **Give A Bit** (giveabit.io) — a Bitcoin-native studio building open-source micropayment rails, cryptographic proof systems, and decentralized legal infrastructure for the sovereign individual.

**Contact**  
Partnerships / press: hello@giveabit.io  
Technical / developer: satohash.giveabit.io/developer or the in-app API playground

---

## The Honesty Contract

This executive summary is a report, not a promise. Every claim carries its honest state:

- ✅ **Free stamps, Bitcoin+OTS anchoring, on-device hashing** — live and true today.
- ✅ **Proof card + camera QR** — `https://satohash.io/p/{hash}`. Phone cameras open that URL.
- ✅ **Pending ≠ Confirmed** — ~60 minutes to a Bitcoin block. Do not treat them as the same.
- ✅ **Family widget + CLI** — widget can complete `POST /api/stamp`; CLI prints the proof card.
- ✅ **Proves "when," not "who"** — stated plainly; authorship via private-key signing is the next chapter (v3).
- ⚠️ **Independent client-side verify (zero server trust)** — on the roadmap; until it ships we say so.
- ⚠️ **Verified multi-party signing** — partial today (unverified cosign); real non-repudiation on the roadmap.
- ⚠️ **Paid tiers / Lightning / BOLT-12** — built and staged; not live. Snapper, ZK redaction, 3D Merkle are cathedral — not current features.
- ❌ **Ethereum / cross-chain** — out of scope, forever. Bitcoin is the truth layer.
- 🛡 **Verify this yourself** — every proof carries a standing invitation to check with open tools, no account, no KYC.
- ⏱ **Freshness, not guesswork** — every fact surfaces when it was last confirmed. Honest stale beats confident wrong.

> *Mathematics on an immutable ledger beats any signature or notary stamp.*

---

*Safe Harbour · Educational & informational only · Not legal, financial, or investment advice · Part of the Give A Bit family — Bitcoin sovereignty first.*
