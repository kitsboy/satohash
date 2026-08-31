<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.io · **Version:** 5.0.0-ELITE (Build 275) · **Updated:** 2026-08-31
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Satohash — Marketing Strategy

**Platform:** https://satohash.io  
**Version:** 5.0.0-ELITE · **August 2026**  
**Creative north-star:** `docs/marketing/BRAND-VOICE.md` · **Canonical mission:** `docs/MISSION-SCOPE-v3.md`

---

## Positioning Statement

**For legal professionals, developers, journalists, and digital creators who need to prove when something existed — and, increasingly, who created it**, Satohash is a Bitcoin-native proof platform that provides cryptographically immutable proof of digital existence — without lawyers, notary fees, or trusted intermediaries.

> **Your document. Your hash. Bitcoin's permanence.**

### The three beats (the emotional core of every campaign)
1. **We can't see it.** Your file never leaves your device — only a fingerprint is stamped.
2. **You can check us.** Every claim carries a proof you verify yourself with open tools, no account, no KYC.
3. **It outlives us.** A `.ots` receipt anchored to Bitcoin verifies forever — even if we vanished tomorrow.

### The next chapter (v3)
**Proof of authorship:** add your private key and "this file existed" becomes "this file existed, and I am the one who created it" — trustless, non-custodial, verifiable by anyone, forever. This single upgrade is the hinge the entire enterprise/legal/IP use-case map swings on.

---

## Target Audiences

### Primary: The Verifiers
People who create things they may later need to prove:

| Persona | Pain Point | Our Message |
|---|---|---|
| **IP Attorneys & Law Firms** | Manual notarization is slow and expensive | Court-ready Bitcoin proof in 60 seconds |
| **Freelancers & Creators** | Client disputes over ownership | Your work, timestamped before the dispute |
| **Journalists & Researchers** | Documents get altered, lost, or denied | Immutable record before publication |
| **Software Developers** | Prove code state at release time | git commit + Bitcoin block forever |
| **AI/ML Teams** | Model output provenance increasingly required | Hash your outputs before they're contested |

### Secondary: The Builders
- **SaaS founders** wanting to add notarization to their product (via API)
- **Compliance teams** needing audit trails
- **Government technologists** exploring blockchain evidence standards

### The Five Commercial Lanes (2026-08-29 · 3-day review focus)
Beyond personas, Satohash speaks to five serious commercial lanes — each with an honest, evidence-backed angle (see `BRAND-VOICE.md` §8 and `SATOHASH-FIVE-PILLAR-ADDENDUM.md`):

| Lane | Positioning |
|---|---|
| **M&A Due Diligence** | The integrity layer for data rooms — hash-on-chain proves documents existed, when, unaltered, without exposing files. |
| **Family Offices & Wealth** | The longevity layer — a `.ots` anchor outlives any advisor firm or vendor, proving record state across generations. |
| **LATAM (ES/PT)** | The independent existence-at-a-time layer beside ICP-Brasil/FEA/NOM-151/eIDAS. Admissible, not presumed accurate; complement, never "certificado." |
| **Tax & Compliance** | Evidence-strengthening for retention/audit — proof of what was on file at the deadline; never tax-law compliance. |
| **Enterprise** | The privacy-preserving integrity anchor — hash on-chain, file never leaves the device. |

> Keyline: **One proof layer. Five serious lanes. No trust required.**

---

## Key Messages (v5 ELITE — premium, honest)

### Headline Messages
1. **"Proof of truth, on Bitcoin."** *(v3 tagline — the math, not the company)*
2. **"Prove a file existed. Never show the file."** *(the family pitch — unmistakable)*
3. **"No trust required — not even in us."** *(our signature)*
4. **"Courtroom-ready. Cryptographically sound. Takes 60 seconds."**
5. **"Deepfakes make timestamps more important, not less."** *(why now)*
6. **"Prove it existed. Prove you made it."** *(authorship upgrade)*

### Supporting Points
- SHA-256 hash, not your document — **100% private by design**
- Bitcoin blockchain — the most secure ledger ever created
- OpenTimestamps standard — **independently verifiable anywhere, forever**
- Works without a Bitcoin wallet, account, or credit card (free tier)
- **Verify this yourself** — every proof links to open, no-KYC verification

### Honesty guardrails (never say until true)
- ❌ No "non-repudiable multi-party signing" until verified signatures ship (Phase 1 / authorship upgrade).
- ❌ No "fully independent of our server" verify until client-side `.ots` verify ships (Phase 3).
- ❌ No paid-plan pricing claims / "buy now" until L402 + LND channels are funded and tested.
- ❌ No Ethereum / cross-chain — ever. Bitcoin is the truth layer.
- ❌ No "we prove who made it" — today we prove *when*. Authorship is the next chapter.

---

## The Honesty Visuals (brand system)

These are Cam's doctrine made visible — they belong in every campaign, not just the product:

### 1. The Proof Badge — "this claim is checkable"
Embeddable "Secured by Satohash" attestations (`/widgets`, `proof-dna.js`, `BadgeGenerator`). Rules:
- Every badge links to a live `/verify/<hash>` surface — it proves what it attests.
- Three-state pill language: **confirmed** (green) / **pending** (gold) / **stale or revoked** (red).
- In ads: never say "verified" — say "confirm it here" and show the block path.

### 2. The Freshness Ring — "we tell you when our claim got old"
`days_stale > 45 → STALE` (Trust Glass). Honesty about *verification recency*:
- Every fact/stat surfaces when it was last confirmed.
- **Honest stale > confident wrong.** Old data renders amber/red, never fresh green.
- ELI16: *"This was last double-checked 60 days ago. We mark it stale so you never over-trust old info."*
- Live KPIs (block height, stamp count, uptime) come from `/metrics.json` — never fabricated.

### 3. "Verify this yourself" — the standing invitation
On every page, deck, and ad: *"Don't take our word for it — check the proof with free, open tools. No account. No KYC."* The most premium trust signal we own.

### 4. The honest gap list — said out loud (v3 doctrine)
A mission that only lists strengths isn't trustworthy. We name the limits because closing them *is* the roadmap: proves *when* not *who* (today), ~60-minute confirmation (by design), hash confidentiality has edges for trivial inputs, Bitcoin-only forever.

---

## Content Strategy

### SEO Pillars
1. **"How to timestamp a document"** — 22K monthly searches
2. **"Bitcoin proof of existence"** — 5K monthly searches  
3. **"Blockchain notarization"** — 8K monthly searches
4. **"OpenTimestamps tutorial"** — 2K monthly searches
5. **"Document timestamp legal"** — 15K monthly searches
6. **"Deepfake / AI provenance proof"** — emerging greenfield
7. **"Prove you created it / proof of authorship"** — next-chapter pillar (v3)

### Content Calendar (Month 1–3)

| Week | Topic | Format | Channel |
|---|---|---|---|
| 1 | "How Bitcoin notarization works" | Blog + video | Website, YouTube |
| 2 | "5 times a timestamp saved a freelancer" | Case study | Twitter, LinkedIn |
| 3 | "OTS vs DocuSign: real differences" | Comparison | SEO blog |
| 4 | "Proof of existence for AI outputs" | Thought leadership | Hacker News |
| 5 | API tutorial: "Timestamp files in Python" | Code tutorial | Dev.to, GitHub |
| 6 | "Your contract vs Bitcoin" | Infographic | Twitter, Reddit |
| 7 | "Verify this yourself" explainer | Interactive demo | Website, LinkedIn |
| 8 | "Why 'honest stale' beats 'confident wrong'" | POV / brand | Newsletter, Nostr |
| 9 | "Proof of authorship: the next chapter" | Thought leadership | LinkedIn, HN |

---

## Growth Channels

### Organic (Priority 1)
- **SEO blog** at satohash.io/blog — educational content targeting "how to" queries
- **GitHub presence** — open-source examples, developer integrations
- **Nostr / Bitcoin Twitter** — organic community building
- **Reddit** — r/bitcoin, r/legaladvice, r/freelance

### Product-Led Growth
- **Free base** — unlimited verifications, 10 stamps/day, never paywalled trust anchor — get users in the funnel
- **Shareable proof links** — every OTS proof embeds "Verified by Satohash"
- **API developer onboarding** — free developer stamps for builders

### Paid (Phase 2 — after Honesty Gates clear)
- **Google Search** — "notarize document", "timestamp document online"
- **LinkedIn** — IP attorneys, compliance officers, legal ops
- **Sponsoring Bitcoin podcasts / newsletters** — What Bitcoin Did, TFTC, Bitcoin Magazine

### Partnerships
- **Law firm integrations** — white-label Satohash as their timestamping solution
- **Freelance platforms** — Toptal, Contra, Arc — built-in proof generation
- **AI platforms** — model output hashing integration
- **Cloudflare** — listed as recommended tool in their developer docs

---

## Launch Strategy

### Phase 1: Developer Launch (Month 1–2)
- Product Hunt launch
- Hacker News Show HN
- Developer blog post series
- GitHub open-source repo

### Phase 2: Legal / Professional Launch (Month 3–6) *(gated on authorship signing + independent verify)*
- Legal tech conference presence (LegalWeek, CLOC)
- Law firm cold outreach (50 targets)
- Case study with a real attorney
- Press release for a notable use case (AI, IP dispute, journalism)

### Phase 3: Enterprise (Month 6–12) *(gated on live billing + audit hygiene)*
- Direct sales to compliance teams
- SOC 2 Type II certification (if needed)
- White-label offering launch
- Partner referral program (20% recurring)

---

## Social Media Playbook

### Twitter/X
- Daily: Bitcoin block mined = proof sealed
- Weekly: "Did you know?" OTS fact
- Case studies: real use cases in the wild
- Honesty posts: show a live stamp being verified — "check it yourself, here's the block"

### LinkedIn  
- Long-form: "Why Bitcoin beats notaries for IP protection"
- Company updates, product features
- The freshness-ring POV: "we mark our own claims stale — you should too"
- The authorship essay: "Why proving *who* made something is Bitcoin's next job" (v3)

### Nostr
- Core community building
- NIP-07 identity integration showcase

---

## Brand Guidelines (summary — see BRAND-VOICE.md for the full system)

**Voice:** Confident, technical, trustworthy — like a lawyer who understands Bitcoin, who refuses to oversell.  
**Tone:** Premium financial terminal, not a crypto casino. Calm authority.  
**Avoid:** "blockchain" without context, "revolutionary", vague Web3 language, hype punctuation.  
**Emphasize:** Bitcoin specifically, mathematical proof, real-world legal use cases, *verify-this-yourself*, honest gaps said out loud.

**Colors:** Glacier Jewel — deep navy `#0e1c2a`, sky identity `#38bdf8`, Bitcoin gold `#f0b429`. No pure black/white/grey.  
**Typography:** Space Grotesk (headings) · Plus Jakarta Sans (UI) · JetBrains Mono (hashes/proof paths).  
**Signature detail:** the sky→gold jewel hairline on proof steps, cards, and CTAs.

---

*Questions: hello@giveabit.io | https://satohash.io | Creative north-star: docs/marketing/BRAND-VOICE.md*
