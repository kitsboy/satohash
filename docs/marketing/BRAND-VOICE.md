# Satohash — Brand Voice & Honesty System

**Version:** 5.0.0-ELITE · **Updated:** 2026-08-29 · **Owner:** Mimi (Creative Direction) / Give A Bit
**Canonical mission:** `docs/MISSION-SCOPE-v3.md` (Mission & Scope draft v3 — proof of truth, on Bitcoin)
**Purpose:** The single creative north-star for every Satohash word and pixel. It exists so the pitch is *undeniable* — and so it stays *honest*.

---

## 1. The one-line truth

> **Prove a file existed. Never show the file. Bitcoin keeps the receipt forever.**

That is the entire product, the entire brand, and the entire pitch. Everything else is decoration — beautiful, but decoration. If a sentence does not serve that truth, cut it.

**The founding bet (v3):** the notary middleman is no longer necessary. OpenTimestamps anchors a fingerprint of your file into the Bitcoin blockchain — permanently, verifiable, with no company between your document and the proof. Add a private-key signature and "this file existed" becomes "this file existed, *and I am the one who created it*."

### The three beats every audience must feel

1. **You don't trust us.** Your file never leaves your device; only a fingerprint is stamped. We cannot read it, leak it, or lose it — because we never had it.
2. **You can check us.** Every claim we make carries a proof you can verify yourself with open tools and a public Bitcoin block. No account. No KYC. No "trust the marketing team."
3. **The proof outlives any company.** A `.ots` receipt anchored to Bitcoin's proof-of-work verifies forever — even if Satohash vanished tomorrow.

---

## 2. Voice — "a lawyer who understands Bitcoin, who refuses to oversell"

| Quality | What it means in practice |
|---------|---------------------------|
| **Confident** | We state what we do plainly and let the math speak. We never hedge a true claim, never inflate a soft one. |
| **Precise** | SHA-256, OpenTimestamps, Bitcoin proof-of-work — we name the real machinery, because precision *is* the trust signal. |
| **Calm** | No hype, no "revolutionary", no exclamation marks at the podium. A premium terminal, not a crypto casino. |
| **Warm** | Still human. An ELI16 visitor (Cam's rule) must understand the "why" without a glossary. Plain sentences win. |
| **Sovereign** | The user owns the proof. We are the honest workbench, never the vault they must depend on. |

### Voice do's
- "Your document never leaves your device."
- "Verify it yourself — free, open tools, one click."
- "A fingerprint on Bitcoin. Portable proof. Forever."
- "No trust required — not even in us."
- "Prove it existed. Prove you made it." *(authorship upgrade)*
- "No one owns truth, so no one should gate proof of it." *(mission)*

### Voice don'ts
- ❌ "Revolutionary", "game-changing", "disruptive" — vague hype.
- ❌ "Blockchain" without naming Bitcoin. (The truth is Bitcoin.)
- ❌ Promising paid/signing/verify features we haven't shipped (see §5 Honesty Gates).
- ❌ "Trust our secure servers" — we don't have your file, that's the point.
- ❌ Overstating enterprise readiness while signing is unverified and billing is staged.
- ❌ Claiming we prove *who* made a file — today we prove *when* it existed. Authorship is the next chapter (v3).

---

## 3. Visual language — Glacier Jewel / Institutional Noir

Satohash is a **Bitcoin-native sovereign notary** — the UI and every marketing asset must feel like a premium financial terminal: severe, elegant, trustworthy. Never a crypto casino, never an admin template.

### Tokens (canonical — `docs/DESIGN-TOKENS.md`, source `src/index.css`)

| Token | Value | Use |
|-------|-------|-----|
| `--bg-primary` | `#0e1c2a` (deep glacier teal-navy) / `#f6f1e8` (elite parchment) | Base — never flat, always gradient |
| `--jewel-sky` | `#38bdf8` | **Satohash identity** · interactive · info · pipes |
| `--jewel-gold` | `#f0b429` | **Bitcoin CTA** · block height · primary action |
| `--jewel-cyan` | `#22d3ee` | Electric secondary (settlement) |
| `--jewel-violet` | `#8b5cf6` | Nostr / identity / comms |
| `--jewel-ice` | `#d4f0f8` | Glacier ink tint |
| `--accent-success` | `#34d399` | Confirmed proofs |
| `--accent-pending` | `#f0b429` | Pending OTS upgrade |
| `--accent-danger` | `#fb7185` | Revoked / errors / STALE |

**Fonts:** Space Grotesk (headings) · Plus Jakarta Sans (UI) · JetBrains Mono (hashes, proof paths).

### Design rules (non-negotiable)
1. **No pure black, no pure white, no neutral grey.** Any R=G=B is a bug. Every surface is a tinted gradient + tinted border — never flat.
2. **Jewel-tone hairline edges** (sky→gold) on proof steps, cards, CTAs — the "electric top hairline" is the Satohash signature.
3. **Rich + alive:** aurora mesh drift, glow on hover — but motion is *restrained*, disabled under `prefers-reduced-motion`. Calm authority, not fireworks.
4. **Gold = Bitcoin, sky = identity, success = confirmed.** Status colors are sacred: green ok / amber warn / red err / sky info.
5. **Mobile-first, 320px up.** Touch targets ≥ 44px. The 60%+ of users who stamp from a phone are not second-class.

---

## 4. The Honesty Visuals — the soul of the brand

Cam's doctrine: **"We'd rather show you old truth than new lies."** Honesty is not a feature — it is the brand. Every proof surface must *show* truth, not just *claim* it. Two honesty visuals carry this:

### 4.1 The Proof Badge — "this claim is checkable"
The embeddable "Secured by Satohash" attestation (`/widgets`, `proof-dna.js`, `BadgeGenerator`, `.pill-*`). A badge is only beautiful if it *verifies*. Rules:
- Every badge links to a live verify surface (`/verify/<hash>`) — it must *prove* what it attests, not just brand.
- Use the three-state pill language: **confirmed** (green) / **pending** (gold) / **stale or revoked** (red) — never imply proof that isn't there.
- In marketing, the proof badge means: *show the block height and the open-tool verify path*. Don't say "verified" — say "confirm it here."

### 4.2 The Freshness Ring — "we tell you when our claim got old"
`days_stale > 45 → STALE` (Trust Glass / gate-check). Honesty about *verification recency*, not just *accuracy*. Rules:
- Any fact, stat, or proof we present carries its freshness — how recently it was last confirmed.
- **Honest stale > confident wrong.** If a number is old, we say so in amber/red and in words — we never render a stale fact as fresh green.
- ELI16 copy: *"This was last double-checked 60 days ago. We mark it stale so you never over-trust old info."*
- In marketing, live KPIs (stamps, block height, uptime) must be live-sourced (`/metrics.json`), never fabricated at render.

### 4.3 "Verify this yourself" — the standing invitation
`VerifyYourselfCard`: *"Don't take our word for it — check the proof with free, open tools. No account. No KYC."* Every page, every deck, every ad should carry the standing invitation to leave our narrative and check the truth independently. That is the most premium trust signal we own.

### 4.4 Honest gaps, said out loud (v3 doctrine)
A mission that only lists strengths isn't trustworthy. v3 requires we name the limits plainly — it *is* the roadmap:
- **Proves "when," not "who"** — today. Authorship via private-key signing is the whole next chapter.
- **~60-minute confirmation** — anchoring waits for the next Bitcoin block. That's the price of strength, not a bug.
- **Hash confidentiality has edges** — a hash of a short, guessable input can theoretically be reverse-matched. Fine for real documents; not a privacy shield for trivial inputs.
- **Bitcoin-only, forever** — no multi-chain anchoring, ever.

---

## 5. Honesty Gates — what the code actually does (2026-08-29)

Copy may only claim what the live product delivers. These gates are the contract between marketing and engineering (Ziggy's `ENGINEERING-SCOPE-PREMIUM.md`):

| Claim | Honest status | Gate |
|-------|--------------|------|
| Free stamps | ✅ **TRUE** — `REQUIRE_LIGHTNING=false` | Free base — never paywalled trust anchor. Optional premium tiers (Professional ~2,100 sats/mo ~$29, Business ~21,000 sats/mo ~$299) + pay-per-use API (1–5 sats/stamp) are the revenue model (Cam-locked 2026-08-29). |
| Bitcoin + OTS anchoring | ✅ **TRUE** — live, verified | Calendar pools fixed, bitcoind at tip. |
| Zero-knowledge (file never leaves device) | ✅ **TRUE** — Web Crypto client hash | Core brand promise. Always lead here. |
| Proves *when*, not *who* | ✅ **TRUE** — honest framing | Authorship (private-key signing) = next chapter (v3), Phase 1 in Ziggy's plan. |
| Portable `.ots` proof, verify independently | ⚠️ **MOSTLY TRUE** — verify works; true independent client-side `.ots` (zero DB trust) is **Phase 3, not shipped** | May say "portable & OTS-verifiable"; must NOT say "independent of our server" until Phase 3 lands. |
| Multi-party signing | ⚠️ **PARTIAL** — cosign stores *unverified* hex + npub; real verified-signature signing is **Phase 1** | Must NOT pitch "non-repudiable multi-party signing" to premium until Phase 1. |
| Paid tiers / L402 / Lightning | ⚠️ **NOT LIVE** — built but stubbed; LND has **0 channels**, >5k sats fails | Must NOT advertise paid plans or charge until channels funded + tested. |
| Ethereum / cross-chain | ❌ **OUT** — Cam declined; v3 is explicit: Bitcoin-only, ever | Never mention Ethereum in premium. |

**Golden rule:** when in doubt, under-claim. The honesty system is what makes the premium feel *real* — a pitch that says "free today, honest about every gap, and here's how to check every claim yourself" is more undeniable than any hype.

---

## 6. The premium pitch (humble + undeniable)

### Elevator (8 seconds)
**"Satohash proves a file existed at a precise moment — permanently anchored to Bitcoin — without ever seeing your file."**

### The pitch (30 seconds)
"Every day, deepfakes, AI output, and edit-at-will platforms make 'what happened when' harder to prove. Satohash turns existence into math: your file's fingerprint is stamped into a Bitcoin block via the open OpenTimestamps standard. Your document never leaves your device. The receipt is portable and verifies forever with open tools — no account, no KYC, and no trust in us. That's sovereignty you can hold in one file."

### The authorship upgrade (v3 — the next chapter)
"Add your private key, and 'this file existed' becomes 'this file existed, and I am the one who created it' — proof of authorship, verifiable by anyone, forever, with no permission required. That's the whole story of where Satohash is going."

### The undeniable closer
**"We can't lose your document, because we never had it. We can't fake your proof, because Bitcoin's proof-of-work keeps the receipt. And you don't have to trust us — here's how to check it yourself."**

---

## 7. Approved messages bank

| Message | Surface |
|---------|---------|
| Prove a file existed. Never show the file. | Hero / masthead |
| Proof of truth, on Bitcoin. | v3 tagline / masthead alt |
| Your document. Your hash. Bitcoin's permanence. | Position line |
| We can't read it. We can't lose it. We never had it. | Trust block |
| No trust required — not even in us. | Verify CTA |
| A fingerprint on Bitcoin. Portable proof. Forever. | Footer / seal |
| Free today. Honest forever. | Pricing / status |
| Deepfakes make timestamps more important, not less. | Thought-leadership |
| No one owns truth, so no one should gate proof of it. | Mission statement |
| Prove it existed. Prove you made it. | Authorship upgrade |
| We'd rather show you old truth than new lies. | Family / brand |

---

## 8. The Five Commercial Pillars (2026-08-29 · for the 3-day lawyer review)

Each pillar has an **honest creative angle** — grounded in Rosa's `SATOHASH-FIVE-PILLAR-ADDENDUM.md` and Lenny's `JURISDICTION-EXPLAINERS.md`. In every lane the rule is the same: **beautiful, and honest. "Admissible, not presumed accurate."** Never claim a regulated status we don't hold; never claim a product behavior we haven't shipped. The premium feel comes from being the most *verifiable* vendor in the room — not the loudest.

### PILLAR 1 — M&A Due-Diligence Data Rooms
**Angle:** Satohash is the *integrity layer* for a data room. Hash-on-chain proves each document existed, when, and unaltered — without exposing the files themselves.
- Honest claim: the `.ots` receipt anchors file fingerprints to Bitcoin privately (hash, not file). ~2/3 of M&A breaches happen during diligence; the integrity problem is quantified.
- **Do NOT claim** the audit-log extension (who accessed what when) — that's a product build, not current behavior.
- Creative: "The deal room where every document can prove itself."

### PILLAR 2 — Family Offices & Multi-Generational Wealth
**Angle:** Satohash is the *longevity layer* against the "three-generation curse." A `.ots` anchor proves a trust document, property record, or will existed in an exact state at a date — verifiable long after the advisor firm or software vendor is gone.
- Honest: wealth-transfer and "curse" stats are **directional context** (secondary/industry sources), never hard fact.
- Creative: "Records that outlive the firms that held them. Trust that survives generations."

### PILLAR 3 — LATAM (Spanish + Portuguese) — highest-value, highest-uncertainty
**Angle:** Satohash is the *independent existence-at-a-time* layer that works alongside each market's regulated identity system — complement, not replacement.
- Honest truth (Lenny's non-negotiable): evidence is **admissible** across BR/MX/ES/AR/CL/CO/PE; **identity** is the regulated layer (ICP-Brasil, FEA/NOM-151, firma digital, eIDAS). A Bitcoin timestamp is admissible but carries **no automatic presumption** — probative value is a judge's call.
- **Never** say "certificado" / imply notarial status. Use "evidencia de apoyo" / "prova de existência."
- **Never** claim ICP-Brasil, NOM-151, or eIDAS compliance.
- Stamp + notary is the strong pattern: Satohash for the timestamped provenance trail, notary for the final act where required.
- Creative (ES): *"Su documento nunca sale de su dispositivo. El sello vive en Bitcoin."* (PT): *"Seu documento nunca sai do seu dispositivo. A prova vive no Bitcoin."*

### PILLAR 4 — Tax & Compliance
**Angle:** Satohash *strengthens* the evidence layer for record retention and audit trails — it never replaces retention policy or tax-law compliance.
- Honest: proves a supporting record existed in an exact state as of a date, years after the fact. Does NOT file returns or satisfy any statute.
- **Never** stamp raw tax records with PII/TPINs to a public chain — hash only.
- Creative: "Proof of what was on file at the deadline."

### PILLAR 5 — Commercial & Enterprise
**Angle:** the *privacy-preserving integrity anchor* — hash on-chain, file never leaves the device. The differentiator vs document-management SaaS that stores full files.
- Honest: enterprise-grade claims (SLA, white-label, custom webhooks, volume) belong to the paid tiers; do not claim enterprise readiness we haven't shipped.
- Creative: "Document integrity you can verify, without surrendering the document."

### The five-pillar keyline (one line for the whole set)
> **One proof layer. Five serious lanes. No trust required.**

---

*Safe Harbour · Educational & informational only · Not legal, financial, or investment advice · Part of the Give A Bit family — Bitcoin sovereignty first.*
