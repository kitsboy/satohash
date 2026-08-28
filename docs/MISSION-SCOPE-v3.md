# Satohash — Proof of Truth, on Bitcoin

**Mission & Scope — Draft v3 (Claude pass)**

> "We don't need you to trust us. We need you to trust math."

---

## 1. The Founding Idea

Every dispute over "who did what, when" eventually comes down to one question: can you prove your version of events without asking anyone to take your word for it?

For centuries the answer was a notary, a lawyer, a registry, a company — some trusted third party who could vouch for a date. Satohash's founding bet is that this middleman is no longer necessary. **OpenTimestamps anchors a fingerprint of your file into the Bitcoin blockchain, permanently and verifiable, with no company standing between your document and the proof.** Add a private-key signature, and "this file existed" becomes "this file existed, and *I* am the one who created it" — proof of existence upgraded to proof of authorship, with nobody's permission required.

That's the whole idea. Everything below is either an explanation of it or a plan for growing it.

---

## 2. What Satohash Is Today

Satohash is a free, no-account browser tool. You drop in a document, contract, photo, or dataset, and it's hashed locally in your browser — your file never leaves your device. Only the hash (a SHA-256 fingerprint) is sent out to be anchored into Bitcoin's next block via OpenTimestamps. Once it's in a block, that timestamp can't be altered, backdated, or quietly removed — not by Satohash, not by anyone. Verification doesn't depend on Satohash staying online, either: proofs can be independently checked years later through opentimestamps.org, community CLI tools, or by inspecting the Bitcoin blockchain directly.

**Why Bitcoin specifically:** it's the most decentralized, longest-running, most attacked-and-survived public ledger that exists. Tens of thousands of independently operated nodes worldwide validate it, with no single company that could be bought, breached, or shut down. That's not marketing — it's the actual property that makes the proof durable.

**What it's good for right now:** proving a document, photo, manuscript, or dataset existed by a certain date — priority disputes, "I had this first," audit trails, discovery dates for research and IP. Frameworks like the US ESIGN Act and UETA, and the EU's eIDAS regulation, recognize timestamped electronic records as admissible evidence; Satohash produces exactly that kind of record. (Worth saying plainly: *admissibility isn't the same as automatic proof of a specific legal conclusion* — a court still weighs evidence in context. Satohash gives you strong, independently verifiable evidence of a date; it isn't a substitute for legal advice about your specific situation.)

Cost today: free. The team has floated a possible future micro-fee (a small Lightning payment, on the order of tens of satoshis) purely to cover hosting — the anchoring mechanism and its guarantees would stay identical either way.

---

## 3. What Satohash Doesn't Do Yet — Said Out Loud

A mission document that only lists strengths isn't trustworthy. Here's the honest gap list, because closing it *is* the roadmap:

| Limit | What it means in practice |
|---|---|
| **Proves "when," not "who"** | Anyone can stamp any file. Possession of a hash isn't proof of authorship — yet. |
| **One-way** | No signing, no encryption, no access control. Satohash timestamps; it doesn't protect or redact. |
| **No identity layer** | Nothing currently ties a proof to a specific person's cryptographic key. |
| **Hash confidentiality has edges** | The file itself never leaves your device — but a hash of a short, guessable, or low-entropy input (e.g., a single common word) can theoretically be reverse-matched via lookup tables. Fine for real documents; not a privacy shield for trivial inputs. |
| **~60-minute confirmation** | Anchoring waits for the next Bitcoin block. Not instant — by design, since block time is what makes the proof strong. |
| **Bitcoin-only** | Satohash is a Bitcoin-only company. No multi-chain anchoring, ever. |

The single sentence that matters most: **Satohash today proves existence. Adding a private-key layer turns that into proof of authorship — and that upgrade is the whole next chapter.**

---

## 4. Where This Goes: Proof of Authorship

Pairing an OpenTimestamps anchor with a signature from a user-held private key produces something categorically stronger: a trustless, non-custodial way to prove *"I, holding this specific key, created this specific file at this specific moment"* — verifiable by anyone, forever, without asking Satohash, a notary, or any company to vouch for it.

This single upgrade is the hinge the entire use-case map below swings on.

---

## 5. Who This Is For

**Legal, contracts & disputes**
- Sign and timestamp bylaws, tenant agreements, or dispute filings (airline, banking, insurance) to lock in exact execution dates and block after-the-fact tampering claims.
- Digital wills and estate documents — a timestamped will plus key-held proof of who signed it.

**Creative work, media & IP**
- Anchor design files, scripts, source code, or manuscripts to establish prior art and creative precedence before anything goes public.
- Fight synthetic media: capture devices sign and timestamp photos/video the instant they're shot, giving journalists and courts a chronological anchor for authenticity.

**Civic life & accountability**
- Timestamp civic proposals and public records so the historical record can't be quietly rewritten.
- Journalism and whistleblowing — prove you had the story, or the source material, before you published.

**Enterprise, finance & compliance**
- Board resolutions, asset records, and tax documentation anchored so auditors can independently confirm a ledger's state existed before a fiscal deadline.
- Supply-chain provenance — every handoff signed and timestamped so a dispute can't be resolved by editing a PDF after the fact.
- Certificates, diplomas, and licenses anchored so an issuer can't rewrite history and a holder can prove authenticity independently.
- Software integrity — sign binary releases, database migrations, and schemas so a node operator can verify the exact code they're running hasn't been swapped.

**Research & science**
- Lock in trial protocols, dataset hashes, and preliminary findings before results are known — pre-registration with teeth.
- Immutable audit trails for medical records and treatment history.

**Infrastructure & distributed systems**
- Authenticate mesh-network or remote-server requests via signed, timestamped calls to block replay attacks.
- Give decentralized messaging systems a trustless way to order events without a central clock.

---

## 6. Mission Statement

**No one owns truth, so no one should gate proof of it.**

Bitcoin is the most battle-tested public ledger in existence. OpenTimestamps is the open protocol that writes facts to it. Private-key cryptography is the missing piece that turns an anonymous fact into an *authored* one. Put together, they form a record that is trustless, sovereign, and quiet by design: your document never leaves your device, only a fingerprint ever touches the chain, and the resulting proof outlives Satohash itself, any single company, and any single government.

**Scope:** grow Satohash from a tool that proves *existence* into a layer that proves *authorship and origin* — free or near-free, available to anyone, in any industry, with no notary, no subscription, and no permission required. The legal standards already exist (ESIGN, UETA, eIDAS). The chain already exists. The work left is making this feel as simple, obvious, and trustworthy as reaching for a pen.

---

## 7. Suggested Roadmap (for the group to rebalance)

**Near-term — sharpen the core**
- Ship the private-key signing layer (this is the single highest-leverage feature on the whole list — it's what unlocks nearly every "enterprise/legal/IP" use case above).
- Batch-stamping for folders/datasets, so research teams and legal teams aren't stamping file-by-file.
- A public, independently-auditable verification page that doesn't depend on Satohash's servers being up.

**Mid-term — trust infrastructure**
- Optional key-to-identity binding (e.g., linking a public key to a verified name/organization) for use cases that need "signed by a known party," while keeping anonymous stamping available for whistleblowers and journalists.
- Developer API / SDK so other products (legal-tech, supply-chain software, research-data platforms) can embed Satohash proofs directly.
- Plain-language legal explainer per jurisdiction (US/EU to start) so non-lawyers understand what a Satohash proof actually establishes in court.

**Long-term — the app, and beyond**
- Native iOS/Android apps with device-level capture-and-sign (camera → hash → sign → anchor, all in one motion) — this is what makes the "combat deepfakes" and "chain of custody" use cases real-world usable instead of theoretical.
- A "personal sovereignty vault" mode — a self-custodied archive of a person's own proofs, owned by their keys, not by Satohash.

---

*Status: draft v3, refined for the premium launch. Rebalance scope with the group; cut what doesn't earn its place; lock concrete near-term goals.*
