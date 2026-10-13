<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.io · **Version:** 5.0.0-ELITE (Build 432) · **Updated:** 2026-10-13
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Satohash — The Sovereign Provenance Pitch

**Family pitch:** Prove a file existed. Never show the file. Bitcoin as a civic notary — `.ots` receipts that outlive any company. Lives in the Give A Bit suite: https://agents.giveabit.io/#suite

**Status (2026-10-12):** Live at **https://satohash.io**. Version **5.0.0-ELITE**. Stamps are **free** (`REQUIRE_LIGHTNING=false`). Proofs stay Bitcoin + OpenTimestamps. Own pruned bitcoind is at tip.

**Live product:** hash on your device → stamp the fingerprint → share `https://satohash.io/p/{hash}` → download the `.ots` receipt → anyone can verify. **Pending is not Confirmed.** Pending means the stamp is on its way. Confirmed means a Bitcoin block has sealed it, about an hour later. Family apps can complete `POST /api/stamp`. The CLI prints the proof card.

**Counted on 2026-10-12, 23:52 UTC** from `https://api.satohash.io/metrics.json`: **495** stamps, **492** confirmed, **1** still pending, **2** failed. Confirm rate **99.6%**. Paywall off.

**A proof you can open today** (checked the same hour with `POST /api/verify`, `verified: true`, own bitcoind): Bitcoin block **969,627**. Card: [satohash.io/p/515b2a393bbffcfe9c3511d04a4349e199dbff1959cc0ac1f76817cd92f53abd](https://satohash.io/p/515b2a393bbffcfe9c3511d04a4349e199dbff1959cc0ac1f76817cd92f53abd). Recorded 2026-10-02 19:00:22 UTC. Confirmed 2026-10-02 20:48:00 UTC. We do not publish the original filename.

Snapper, a redaction product, a 3D block explorer, and BOLT-12 billing are **not** what we sell. Paid Lightning rails are built and **not switched on**. Mission: **`docs/MISSION-SCOPE-v3.md`** — *Proof of truth, on Bitcoin.*

---

## What we do, in plain words

Picture a photo, a contract, or a page you wrote this morning. Later, someone may say it was not there, or that it was changed. You want a way to show the moment it existed. You also want to keep the file.

Satohash is that way.

You open [satohash.io/stamp](https://satohash.io/stamp) and choose the file. Your phone or computer makes a fingerprint of it. A fingerprint is a short code that matches that exact file and no other. The file stays with you. We never receive it, so we cannot read it, lose it, or sell it. Only the fingerprint is sent.

We hand that fingerprint to independent public calendars. They bundle many fingerprints together and write the bundle into **Bitcoin**. Bitcoin is a public notebook that is extremely hard to rewrite. When a block includes your fingerprint, the time is sealed.

You then hold two things anyone can use:

*   A **link** — `https://satohash.io/p/{hash}` — so a person, or a phone camera, can open the proof card.
*   A **receipt** — a small `.ots` file. Open tools can check that receipt against Bitcoin even if Satohash is gone. On the done screen the gold button is **View proof**. The receipt download sits under it as a text link.

**Pending** means we have sent the fingerprint and Bitcoin has not sealed it yet. **Confirmed** means a check against a Bitcoin block says yes, and we can name the block height. Give it about an hour. We show the wait on purpose. A stamp that is merely saved in our list is not the proof. The block is the proof.

It is **free today**. There is **no account**. We prove **when** a file existed. We do not pretend to prove **who** you are. An optional extra can attach a Nostr key you already hold. That key is not a legal name, and it is not the whole authorship chapter.

Behind **More** you can try a bundle of files, blacking out words, or a voice note. Those are **demos**. They still end in the same kind of stamp. They are not separate products.

The homepage, Verify, and the developer sample all point at the confirmed proof above, so a visitor can check a real one before they stamp their own. The picture on the explorer that looks like a tree is a **diagram**. It is labeled that way. It is not a stamp.

---

## 🏛 The Sovereign Pitch

> **"We don't need you to trust us. We need you to trust math."**

Every dispute over "who did what, when" comes down to one question: can you prove your version of events without asking anyone to take your word for it? For centuries the answer was a notary, a lawyer, a registry, a company — some trusted third party who could vouch for a date.

**Satohash's founding bet is that this middleman is no longer necessary for the moment a file existed.** OpenTimestamps anchors a fingerprint of your file into the Bitcoin blockchain — permanently and verifiable, with no company standing between your document and the proof. A later chapter can add a private-key signature, so "this file existed" can become *"this file existed, and I am the one who created it."* That signature is not what we sell today. Today we prove the moment.

**No account. Free today. Absolute privacy. Confirmation waits for the next Bitcoin block (~60 minutes).**

> **Your document. Your hash. Bitcoin's permanence.**

---

## 💎 What is live (and what is not)

The workbench is Plane 1. Higher planes may evolve later without invalidating proofs beneath them — they are **not** the product we sell today:

```
  PLANE 4: ATLAS     — chrome / demos (not a world index)
  PLANE 3: SETTLEMENT — L402 / BOLT-12  — built · staged · not live
  PLANE 2: IDENTITY  — Nostr lookup     — proves when, not who
  PLANE 1: PROOF     — OpenTimestamps → Bitcoin  — LIVE
```

### 1. Client-side hashing — the file never leaves the device
Privacy is non-negotiable. Your document **never leaves your machine**. The browser (or CLI, or family widget) computes SHA-256 locally. Only the 64-character hash is sent. We cannot read, leak, or sell your documents — **because we never receive them.**

### 2. OpenTimestamps on Bitcoin
Hashes go to public OTS calendars, aggregate into a Merkle tree, and commit to Bitcoin. **Pending** = calendars have the hash. **Confirmed** = a Bitcoin block has sealed it (~60 minutes). They are not the same.

### 3. Portable `.ots` + camera QR
You download a self-contained `.ots` receipt. Share `https://satohash.io/p/{hash}` — the zero-JS proof card. Phone cameras cannot read `.ots`; they open that URL. **If Satohash vanished tomorrow, the `.ots` remains verifiable with open tools.**

### 4. Family widget + CLI (complete the stamp)
Family sites paste `stamp.js` (Katoa, MotoPass, SherpaCarta, Give A Bit, TadBuy). Hash on-device. Default **POST**s `/api/stamp` and returns the proof card. Opt-in `data-mode="spa"` opens `/stamp?hash=&ref=`. CLI: `node packages/satohash-cli/bin/satohash.js stamp ./file.pdf` → prints `/p/<hash>`.

### 5. Authorship & Lightning — next, not now
Nostr NIP-05/NIP-07 is optional lookup. Verified, non-repudiable signatures are the authorship chapter — we do not market them as shipped. L402 / BOLT-12 are **built and staged**. Snapper, ZK redaction, and 3D Merkle theatre are cathedral — **not current features.**

---

## ⚡ The Honest Gap List (said out loud)

A mission that only lists strengths isn't trustworthy. Closing these gaps *is* the roadmap:

| Limit | What it means in practice |
|---|---|
| **Proves "when," not "who"** | Anyone can stamp any file. Possession of a hash isn't proof of authorship — yet. The private-key layer is the next chapter. |
| **~60-minute confirmation** | Anchoring waits for the next Bitcoin block. Not instant — by design, because block time is what makes the proof strong. |
| **Hash confidentiality has edges** | The file never leaves your device — but a hash of a short, guessable input can theoretically be reverse-matched. Fine for real documents; not a privacy shield for trivial inputs. |
| **Bitcoin-only, forever** | No multi-chain anchoring, ever. Bitcoin is the truth layer. |

---

## 🚀 Where This Goes: Proof of Authorship

Pairing an OpenTimestamps anchor with a signature from a user-held private key produces something categorically stronger: a trustless, non-custodial way to prove *"I, holding this specific key, created this specific file at this specific moment"* — verifiable by anyone, forever, without asking Satohash, a notary, or any company to vouch for it. **This single upgrade is the hinge the entire use-case map swings on.**

### The premium use cases

*   **Legal, Contracts & Disputes** — Sign and timestamp bylaws, tenant agreements, or dispute filings to lock exact execution dates and block after-the-fact tampering claims. Digital wills and estate documents with key-held proof of who signed.
*   **Creative Work, Media & IP** — Anchor design files, scripts, source code, or manuscripts to establish prior art before anything goes public. A later chapter can let a device the person already holds sign a photo at the moment it is made. That is how a timestamp helps against synthetic media. It is not a feature on the site today.
*   **Civic Life & Accountability** — Timestamp civic proposals and public records so the historical record can't be quietly rewritten. Journalism and whistleblowing — prove you had the story before you published.
*   **Enterprise, Finance & Compliance** — Board resolutions and tax documentation anchored so auditors can independently confirm a ledger's state existed before a fiscal deadline. Supply-chain provenance, signed and timestamped at every handoff. Certificates and licenses that can't be rewritten.
*   **Research & Science** — Lock in trial protocols, dataset hashes, and preliminary findings before results are known — pre-registration with teeth.
*   **Infrastructure & Distributed Systems** — Signed, timestamped calls to block replay attacks; trustless event ordering without a central clock.

---

## 🏢 Five Serious Lanes (the 3-day review focus)

One proof layer. Five serious lanes. Each is grounded in cited evidence (Rosa's `SATOHASH-FIVE-PILLAR-ADDENDUM.md`) and jurisdiction-specific legal posture (Lenny's `JURISDICTION-EXPLAINERS.md`). In every lane the promise is identical: **independently verifiable proof of what existed, when, unaltered — without the document ever leaving your control.**

### 1 · M&A Due-Diligence Data Rooms
The **integrity layer** for the deal room. ~2/3 of M&A data breaches happen during diligence, when confidential material moves across many systems and people. Satohash anchors each document's fingerprint to Bitcoin so buyers verify files match the seller's originals — privately, hash not file. *Honest: we prove document integrity; the access/audit-log extension is a product build, not claimed yet.*

### 2 · Family Offices & Multi-Generational Wealth
The **longevity layer** against the "three-generation curse." An `.ots` anchor proves a trust instrument, will, or property record existed in an exact state at a date — verifiable long after the advisor firm or software vendor is gone. *Honest: wealth-transfer stats are directional industry context, not hard fact.*

### 3 · Latin Markets (Spanish & Portuguese)
The **independent existence-at-a-time** layer alongside each market's regulated identity system. Across Brazil, Mexico, Argentina, Chile, Colombia, Peru, and Spain, electronic evidence is **admissible** — never rejected merely for being electronic. Identity is the regulated lane (ICP-Brasil, FEA/NOM-151, firma digital, eIDAS); Satohash *complements* it. *Honest: admissible, not presumed accurate. We never claim ICP-Brasil, NOM-151, or eIDAS compliance.*

### 4 · Tax & Compliance
The **evidence-strengthening** layer for record retention and audit trails — proving a supporting record existed in an exact state as of a date, years after the fact. *Honest: it does not file returns or satisfy any retention statute. Hash only — never raw PII/TPINs to a public chain.*

### 5 · Serious Business & Enterprise
The **privacy-preserving integrity anchor** — hash on-chain, file never leaves the device. In a contract dispute, "if a party claims a contract was altered, the cryptographic timestamp ends the argument." *Honest: enterprise offers (SLA, white-label, custom webhooks, volume) belong to the paid tiers; we do not claim readiness we haven't shipped.*

> **One proof layer. Five serious lanes. No trust required.**

---

## 🤝 The Tie to Give A Bit

Satohash is incubated and powered by **Give A Bit** — a Bitcoin-native studio building open-source micropayment rails, cryptographic proof systems, and decentralized legal infrastructure for the sovereign individual.

```
  ┌─────────────────────────────────────────────────────────────┐
  │                        GIVE A BIT                           │
  │            (Parent Studio & Incubator Site)                 │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                         SATOHASH                            │
  │          (Bitcoin-Native Sovereign Notarization)            │
  └─────────────────────────────────────────────────────────────┘
```

**The Mission:** Give A Bit believes Bitcoin is the ultimate global trust machine and micropayment standard — more than a speculative asset. Satohash is that belief made useful: Bitcoin's security solving everyday legal and digital authenticity problems.

**The Infrastructure:** Give A Bit hosts the sovereign validation node network and primary OTS calendar mirrors backing the Satohash Protocol, keeping high-availability routing for integrations.

**The Rails:** Give A Bit's L402 / BOLT-12 API developer gateways power billing inside Satohash — a live playground for honest Bitcoin micro-transactions, lit up only when they're real.

---

## ⚡ Bitcoin APPS F.O.S.S. Philosophy

In the spirit of Bitcoin, F.O.S.S. is the only way to build true trust infrastructure:

*   **Auditable Code** — Every line of Satohash is open source. Developers and legal counsel can verify there are no hidden backdoors or privacy leaks.
*   **Self-Hostable** — Clone the repo, run `npm install`, and host your own private Satohash workbench locally or on your own server.
*   **Global Commons** — By using free OpenTimestamps calendars, Satohash contributes to — and benefits from — a shared digital commons where proof is accessible to all.

---

## 🏛 Government, Diplomacy & Migration Programs

Agencies modernizing registries, travel documents, or tenders need proof of *"what existed when"* — **without uploading sensitive files to a new vendor cloud.**

**Satohash public-sector posture:** hash-only evidence · batch & custody chains · air-gapped friendly · free open path today (Lightning paywall off until operators choose).

**Quiet R&D (not a launch):** Give A Bit experiments with migration helpers. **MotoPass** is a humble early pattern — client-side hashing of passport-style packets + Satohash deep-link (`/stamp?hash=…&ref=…`) so biometrics never hit the proof API. Workshop concept, not a campaign.

**Partner first steps:** free sample stamp → deep-link from portals → batch hash cutovers → executive summary + security review before procurement language.

---

## 🛡 The Honesty Contract (why you can believe this pitch)

This pitch is not a promise — it is a *report*. We show you exactly what is live, what is staged, and how to check every claim yourself:

*   **Free stamps** — live and true today. `REQUIRE_LIGHTNING=false`. Free base is the never-paywalled trust anchor (no daily quota; about 5 requests a minute as an abuse guard, with a wait that follows the server’s Retry-After).
*   **A real confirmed example** — block **969,627**, checked 2026-10-12. Open the card. Do not treat a registry row, or Pending, as the same thing.
*   **What the site shows** — Choose file first. Gold action is the stamp, then View proof. `.ots` is a text link under that button. Bundle, black-out, and voice sit under More and are labeled demos. The first screen says the file stays on the device.
*   **Pricing (Cam-locked 2026-08-29)** — free base + optional premium tiers (Professional ~2,100 sats/mo ~$29, Business ~21,000 sats/mo ~$299) + pay-per-use API (1–5 sats/stamp). Premium rails built but not yet switched on.
*   **Bitcoin + OTS anchoring** — live, verified, own node at tip.
*   **File never leaves the device** — only the SHA-256 is submitted. Core promise.
*   **Pending ≠ Confirmed** — calendars vs a Bitcoin block (~60 minutes). Do not treat them as the same.
*   **Camera QR** — PDFs and email encode `https://satohash.io/p/{hash}` so phone cameras open the proof card.
*   **Family widget POST + CLI** — widget can complete `/api/stamp`; CLI prints the proof card.
*   **Proves "when," not "who"** — stated plainly; authorship is the next chapter.
*   **Portable `.ots`** — verifiable with open tools. Independent client-side verify (zero server trust) is on the roadmap — we'll say so until it ships.
*   **Snapper / ZK / BOLT-12 / 3D Merkle** — not current features. Cathedral or staged.
*   **Verify this yourself** — on every proof: free, open tools, no account, no KYC.
*   **Freshness, not guesswork** — every claim we surface carries when it was last confirmed. Honest stale beats confident wrong.

> **We can't lose your document — we never had it. We can't fake your proof — Bitcoin keeps the receipt. And you don't have to trust us — here's how to check it yourself.**

---

*Safe Harbour · Educational & informational only · Not legal, financial, or investment advice · Bitcoin involves risk · DYOR · Not your keys, not your cheese · Part of the Give A Bit family — Bitcoin sovereignty first.*
