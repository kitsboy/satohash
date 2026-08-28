# Satohash — Five-Pillar Legal Case (For Counsel)

**Prepared by:** Lenny (Legal & Compliance, Give A Bit) · **Date:** 2026-08-29
**For:** Cam's lawyer review (3-day deadline)
**Purpose:** Build the legal and indemnity case around the five focus areas Cam gave the lawyer. Each pillar: what it is, the legal exposure, the honest positioning, and the indemnity posture.

> Principle running through all five: **Satohash proves existence-at-a-time.** It is strong, independently verifiable evidence. It is not a notary, a signature, a qualified time stamp, or a compliance certification. Every claim below respects that line — because that is what survives a lawyer's scrutiny.

---

## PILLAR 1 · M&A — due diligence & data-room documents

### What it is
Buyers, sellers, and their counsel need to prove the *state of documents at a moment in time* before closing: virtual data-room (VDR) exports, financial statements, board approvals, share registers, material contracts, disclosure schedules.

### The legal problem it solves
In a dispute after closing ("this version wasn't what we agreed"), the classic fight is *which version existed when*. A Satohash anchor on a data-room export or diligence package proves that exact byte set existed by block N — independently verifiable by both sides' counsel, no reliance on the VDR vendor's own records.

### Honest positioning
- **Strong:** Anchored evidence of *state-at-a-time* for diligence packages, versioned contracts, and closing-bundle snapshots. Chain of custody (who held the file + the `.ots`) makes it stronger.
- **Line we do NOT cross:** We are not a virtual data room, not a signing agent, and we do not authenticate the *content* of a document (that's the deal's own diligence). An anchor proves existence and integrity of the bytes, not that the business is financially sound.

### Indemnity angle
For premium M&A/enterprise use, our Terms' indemnification must be reciprocal and bounded: the customer uses our tool on documents it owns, and indemnifies us against claims from their own documents/deal; we in turn cap our liability (12-month fees) and exclude consequential loss. The VDR/deal-flow use is *their* transaction — our tool is neutral evidence.

### Defensible claim
> "Satohash lets M&A teams anchor diligence and data-room documents to prove their exact state before closing — independently verifiable evidence of existence-at-a-time, useful in post-closing disputes over which version was in play. It is not a data room or a substitute for deal diligence."

---

## PILLAR 2 · FAMILY OFFICES — long-horizon records & multi-generational proof

### What it is
Family offices keep long-horizon records: wills, trusts, deeds, asset registers, powers of attorney, tax filings, succession documents. The horizon is decades to generations.

### The legal problem it solves
Records kept only in a proprietary system are only as durable as that system. A Bitcoin-anchored hash survives vendor failure, corporate closure, and (for the sovereign-family use case) jurisdiction or regime change. The `.ots` proof is portable and verifiable forever with open tools.

### Honest positioning
- **Strong:** Multi-generational integrity — the record can't be quietly altered or lost to a closed system. Wealth-sovereignty framing: the *proof* of an asset document is self-custodied, not held by a third party.
- **Line we do NOT cross:** We do not store, custody, or manage the documents, keys, or assets. We are not an escrow, a custodian, or a succession-planning service. Self-custody of the original file and keys remains the family's responsibility — which is precisely why the open, portable proof matters.

### Indemnity angle
Family-office premium use leans heavily on *privacy and self-custody*. Our privacy-by-architecture (hash only, no document bytes) is the indemnity shield: we cannot be compelled to disclose what we never held. Indemnity here protects us against misuse (e.g., stamping third parties' documents or unlawful material) while the zero-knowledge design protects the family's confidentiality.

### Defensible claim
> "Satohash gives family offices a multi-generational integrity layer: asset documents, wills, and registers anchored to Bitcoin so their existence and state are provable for decades, verifiable forever with open tools, and never held or custodied by us."

---

## PILLAR 3 · LATIN MARKETS — jurisdiction & legal standing

### What it is
Spanish- and Portuguese-speaking markets (Brazil, Mexico, Argentina, Chile, Colombia, Peru, Spain) have civil-law, notarial traditions where evidence rules differ from common law.

### The legal problem it solves
Local law determines whether a Bitcoin-anchored hash is admissible and what weight it gets. The regulated lanes (ICP-Brasil, FEA/NOM-151, firma digital, eIDAS) govern *identity*; Satohash provides the *existence-at-a-time* anchor that complements them.

### Honest positioning
- **Strong:** In most LatAm jurisdictions, electronic records cannot be rejected *merely for being electronic*, and hash integrity supports authenticity. See `JURISDICTION-EXPLAINERS.md` §E for the per-country matrix.
- **Line we do NOT cross:** We never claim ICP-Brasil, NOM-151, firma digital, or eIDAS compliance, and never use the word "certificado" in a way that implies notarial status. Stamp + notary is the strong pattern: Satohash for the provenance trail, notary for the final act where law requires one.

### Indemnity angle
LatAm premium/localization: the indemnity must not be undercut by a consumer-protection regime that voids user-indemnities in favor of consumers. Where local law makes user-side indemnification unenforceable, our own liability cap + disclaimer must carry the load. Counsel should confirm per-market enforceability (Brazil CDC, Mexico LFPDPPP, etc.).

### Defensible claim
> "In Latin American civil-law systems, Satohash evidence supports proof of existence and integrity of electronic records and is admissible as supporting evidence in most jurisdictions. It does not replace the notary where local law requires one, and complements regulated identity lanes (ICP-Brasil, FEA, firma digital)."

---

## PILLAR 4 · TAX — records, audits, fiscal deadlines

### What it is
Tax authorities require records to exist, be unchanged, and be provable as of the relevant fiscal period. Timestamps support retention, audit trails, and reconstructing what was on file at a deadline.

### The legal problem it solves
In a reconstruction audit or a deadline dispute ("this return draft wasn't what I filed"), an anchor proves a record's state at block N. Integrity + timeliness, independently verifiable.

### Honest positioning
- **Strong:** Evidentiary support for audit trails and fiscal-deadline disputes. Pair with a documented retention/DLP policy to make the practice auditable.
- **Line we do NOT cross:** We do not file returns, replace statutory record-keeping, or certify compliance. Regulators weigh evidence; they don't "certify" timestamps. And never stamp raw tax records with PII/TPINs to a public chain — hash only.

### Indemnity angle
Tax is high-stakes and document-heavy. Our liability cap (12-month fees) + exclusion of consequential loss (penalties, interest) is essential, and the user-side indemnity covers their records/returns. The "no raw PII to the public chain" rule is both a privacy and an indemnity protection.

### Defensible claim
> "Satohash evidence supports tax compliance by independently proving the existence and integrity of records as of a given time — useful for audit trails, retention, and fiscal-deadline disputes. It does not file returns or replace statutory record-keeping obligations."

---

## PILLAR 5 · BUSINESS — commercial/enterprise use & indemnity for premium tiers

### What it is
Commercial and enterprise buyers use Satohash at volume (API, batch, integration into their products) and pay for premium tiers.

### The legal problem it solves
The premium Terms must allocate risk fairly and durably: user-side indemnification for misuse/third-party claims, our bounded liability, and a quantified SLA so "premium" isn't an open-ended promise.

### Indemnity posture (the core of Pillar 5)
Implemented in Terms §04 (Indemnification), §06 (Limitation + No Warranty), §08 (Enterprise SLA), §07 (Billing/Refunds), §10 (Dispute Resolution):

1. **User indemnifies us** for: their use of the Service, breach of Terms/warranties, third-party IP or law claims from their content, and reliance inconsistent with our published materials.
2. **We cap our liability** at fees paid in the preceding 12 months and exclude indirect/consequential damages (lost profits, data, reputation).
3. **No warranty on confirmation timing** — pending ≠ confirmed; third-party calendars + Bitcoin network are outside our control. This is the single most important business-risk shield.
4. **Quantified SLA** (99.5% uptime / 5%·20% remedy) so Enterprise isn't an open-ended uptime promise.
5. **Dispute resolution** — informal 30-day step, Delaware forum, small-claims carve-out, class-action waiver (no mandatory arbitration, unless counsel adds it).

### Defensible claim
> "Satohash premium tiers ship with a fair, bounded commercial agreement: the customer takes responsibility for their own documents and use, our liability is capped and excludes consequential loss, and the Enterprise SLA is quantified and limited."

---

## Counsel sign-off checklist (per pillar)

| Pillar | Key documents | Sign-off item |
|---|---|---|
| M&A | Terms §Service, Evidence Admissibility | Confirm anchor-as-diligence framing; VDR non-claim |
| Family offices | Terms §Service, §Privacy | Confirm self-custody non-claim; zero-knowledge indemnity shield |
| LatAm | JURISDICTION-EXPLAINERS §E | Per-market enforceability of indemnity (Brazil/Mexico/etc.) |
| Tax | Compliance explainer + JURISDICTION-EXPLAINERS §F | Liability cap vs. penalties; PII-to-chain rule |
| Business | Terms §04, §06, §07, §08, §10 | Indemnity + SLA + liability cap + dispute resolution |

---

*Prepared by Lenny for counsel. Not legal advice. Final terms and claims require qualified counsel review in the governing jurisdiction.*
