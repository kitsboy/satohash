# Satohash — Five-Pillar Evidence Addendum (Lawyer-Review Grounding)
**Author:** Rosa (@rosa) · **Date:** 2026-08-29 · **For:** Cam's lawyer review (3-day deadline) · **Feed target:** Lenny (Legal) first
**Scope:** Re-pointed per Hermes steering — grounding Satohash claims in five commercial/legal pillars. Complements `SATOHASH-RESEARCH-MEMO.md` (ESIGN/UETA/eIDAS core) and `SATOHASH-LEGAL-BRIEF.md`.

---

## PILLAR 1 — M&A Due-Diligence Data Rooms

**The claim to ground:** immutable, independently verifiable evidence of what documents existed, when, and unaltered — the exact integrity problem data rooms face.

**Evidence (cited):**
- Roughly **two-thirds of data breaches in M&A occur during due diligence**, when confidential information moves between many systems and people.[16] The integrity problem is real and quantified.
- Blockchain in data rooms creates "a shared, tamper-proof ledger that anyone involved in a deal can verify… **cryptographic proof that every document, timestamp, and access event is genuine**" — the hash is stored on the chain, **not the file itself**.[16]
- Deloitte's 2024 blockchain survey reported organizations using it for document verification saw "a marked drop in integrity disputes and data-access issues." Gartner noted smart-contract document workflows cut administrative effort nearly half.[16] [Gartner/Deloitte figures are secondary-cited within source 16 — treat as directional]
- Real-world result: a ~$500M cross-border acquisition with a blockchain-integrated data room "closed almost a third faster" because buyers could verify files matched the seller's originals (ConsenSys-tracked).[16]

**Satohash positioning (honest):** Satohash's hash-on-chain model is the natural integrity layer for a data room — **the .ots receipt anchors file fingerprints to Bitcoin without exposing the files themselves**, which is exactly the privacy-preserving verification data rooms need. This is a strong, defensible enterprise pitch.

**Open question for the product team:** Satohash anchors individual hashes (`.ots`), not full data-room activity/access logs. If we want the *audit-trail* (who accessed what when) claim, that's a product extension, not current behavior — do not claim it yet.

---

## PILLAR 2 — Family Offices & Long-Horizon Wealth Record Keeping

**The claim to ground:** multi-generation families need records that survive the "three-generation curse."

**Evidence (cited):**
- An estimated **~8,000 single family offices control ~$5.5 trillion** worldwide; one of the largest wealth transfers in history (~$18.3T by 2030) is approaching.[18]
- A 20-year Williams Group study: **70% of families lose their wealth within two generations, rising to 90% by the third** — the "three-generation curse."[17]
- Family offices' operational backbone is **documents**: "Trust instruments, legal agreements, investment records, tax filings, governance charters, entity documentation, property records, insurance policies… These materials define ownership, authority, and intent. When they are fragmented or poorly governed, risk increases… particularly during periods of transition."[17]
- **Fewer than 70% of family offices have fully formalized succession plans**, and governance documentation is "often incomplete or inconsistently maintained"; weaknesses "surface first through documents — missing records, unclear authority, and limited visibility."[17]
- Digital vaults for family offices center on "trusted advisor networks, preservation of institutional knowledge, and clear governance structures" across generations.[17]

**Satohash positioning (honest):** The pain is documented and severe — but the opportunity is not "a timestamping tool." It's an **integrity + longevity layer**: a .ots anchor proves a trust document, property record, or will existed in an exact state at a date, verifiable long after the advisor firm or software vendor is gone. This aligns with family-office digitization trends and the documented record-governance gap.

**Careful:** wealth-transfer projections ($18.3T) and the Williams Group "curse" statistics are from secondary/industry sources — citable as directional market context, not hard fact. Flag as such in marketing.

---

## PILLAR 3 — LATAM Legal Standing & Notarization Culture (ES + PT)

**The claim to ground:** timestamp/evidence admissibility equivalents in Spanish- and Portuguese-speaking markets. **This is the highest-value, highest-uncertainty pillar.**

### Brazil (Portuguese)
- **ICP-Brasil** (Instituto Nacional de Tecnologia da Informação) is the state-backed PKI. Per Gov.br: *"Os documentos eletrônicos assinados digitalmente com o certificado ICP-Brasil têm a mesma validade jurídica que documentos em papel com assinaturas manuscritas, conforme o art. 10, da MP n° 2.200-2/2001"* — **documents signed with an ICP-Brasil certificate have the same legal validity as paper with handwritten signatures.**[11]
- Digital signatures carry **autenticidade, integridade, confiabilidade, não-repúdio**; any change to the document invalidates the signature.[11]
- **Satohash angle:** ICP-Brasil covers *identity/authentication* (who signed). It does **not** by itself anchor *existence-at-a-time* independently. A Bitcoin .ots anchor is complementary — it adds a neutral, verifiable time/existence layer alongside ICP-Brasil identity. This is a genuinely strong, honest positioning for the Brazilian market.

### Mexico
- **NOM-151-SCFI-2016** is the official Mexican standard for data-message conservation: *"La NOM-151-SCFI-2016 exige que un PSC acreditado por la SE emita una constancia con sello de tiempo RFC 3161 y hash SHA-256"* — an **accredited service provider must issue a certificate with an RFC 3161 time stamp and SHA-256 hash**.[20]
- The "constancia de conservación" links the document's SHA-256 hash to an **RFC 3161 time stamp** — technically the same family as Satohash's hash-anchoring approach, but via a licensed PSC rather than a public chain.
- **Satohash angle:** Mexico already has a hash + time-stamp conservation standard; Satohash offers the same integrity model but **anchored to a global, decentralized ledger rather than a single accredited provider.** Complement, not competitor — but do NOT imply NOM-151 compliance; that requires an SE-accredited PSC we are not.

### Spain (Spanish-speaking EU anchor)
- Blockchain is **admissible as evidence but carries no automatic legal presumptions**: *"En España y en la Unión Europea, el uso de blockchain sí puede tener valor como prueba, pero no cuenta con presunciones legales automáticas. El hecho de que una evidencia esté registrada en blockchain no impide su aportación en un procedimiento, ya que una prueba no puede rechazarse por el mero hecho de ser electrónica."*[13] — mirrors the ESIGN/eIDAS non-discrimination principle.
- The same source is emphatic on limits: **"Blockchain no certifica documentos en sentido jurídico. Lo que hace es registrar evidencias técnicas."** and "Blockchain no está regulada como servicio de confianza."[13] A hash on a public chain ≠ an eIDAS-qualified time stamp.
- A major IP firm (ClarkeModet) concludes: across jurisdictions including Spain and Argentina, there is currently **"no existe ningún argumento que apunte a que las pruebas aportadas a través de este sistema no serán válidas"** — no argument that blockchain-based evidence won't be admitted, provided probative value is established.[14]

### Argentina
- **Decree 182/2019** explicitly references blockchain for "conservación de documentos electrónicos, gestión de contratos inteligentes y otros servicios digitales."[14]

### Honest LATAM synthesis
- **The consistent regional picture:** (1) digital/electronic evidence is **admissible** — it cannot be rejected merely for being electronic; (2) **identity** is the regulated layer (ICP-Brasil in BR, e.firma/NOM-151 in MX, eIDAS in ES); (3) **blockchain timestamps are admissible but carry no automatic presumption** — probative value is a judge's call, often needing expert testimony.
- **Recommended positioning:** Satohash = the *independent existence-at-a-time* layer that works alongside each market's regulated identity system. Strong, defensible, not overreaching. Do NOT claim compliance with ICP-Brasil, NOM-151, or eIDAS-qualified status.

---

## PILLAR 4 — Tax Record Retention & Audit-Trail Compliance

**The claim to ground:** timestamps help meet record-retention and audit-evidence obligations.

**Evidence (cited):**
- **US IRS:** *"taxpayers should keep records for three years from the date they filed the tax return"*; employment tax records for **at least four years**.[15][19] Longer periods apply for underreported income (6 years) and bad-debt/worthless-securities claims (7 years) per IRS guidance.[unverified — secondary]
- Records must **support items reported on tax returns** — the taxpayer bears the burden of proof to substantiate deductions.[15][19]
- **The audit-trail value:** "Well-organized records… help provide answers if the return is selected for examination or if the taxpayer receives an IRS notice."[19]

**Satohash positioning (honest):** A timestamp does **not** replace the underlying record — but it solves a real audit problem: proving a supporting record **existed, in an exact state, as of a date** years after the fact. An .ots anchor is strong evidence of existence-and-integrity-at-time for a record you must retain and substantiate. This is genuinely useful for tax record retention and audit trails.

**Careful:** IRS retention periods are US-specific; do not imply Satohash satisfies any jurisdiction's record-retention statute. It strengthens the evidence layer; it does not replace retention policy or tax law compliance.

---

## PILLAR 5 — Commercial & Enterprise Business Use

**The claim to ground:** enterprises need verifiable document integrity for contracts, compliance, and disputes.

**Evidence (cited):**
- Data-protection regimes (GDPR, HIPAA, SOX) **demand detailed audit trails** showing who accessed what and when; blockchain replaces "trust the provider's logs" with **verifiable, timestamped proof** auditors can confirm without internal access.[16]
- In litigation/contract disputes, "if a party claims a contract was altered, the cryptographic timestamps end the argument."[16]
- McKinsey estimates nearly a quarter of large enterprises already use blockchain for document verification, potentially doubling within two years.[16] [directional]

**Satohash positioning (honest):** Enterprise value is the **privacy-preserving integrity anchor** — hash on-chain, file never leaves the device. This is the differentiating strength vs. document-management SaaS that stores full files. Strong for compliance-driven commercial use.

**Careful:** enterprise-grade claims (SLA, white-label, custom webhooks, volume) belong to the paid tiers; do not claim enterprise readiness we haven't shipped. The current free/voluntary model is a fine pilot, but enterprise sales need the premium rail (see revenue model).

---

## PRIORITY RECOMMENDATIONS (what to fix before the lawyer sits down)

1. **LATAM is our strongest untapped market story — lead with the honest version:** evidence is admissible across BR/MX/ES/AR; identity is the regulated layer; our value is the independent existence-at-a-time anchor that complements (not replaces) ICP-Brasil/NOM-151/eIDAS. Do NOT imply compliance with any regulated scheme.
2. **Keep the "admissible, not presumed accurate" framing everywhere** — it is corroborated by Spanish-language sources (SaveTheProof, ClarkeModet) and the EUIPO Marseille case.
3. **Pillar 1 (data rooms) is a genuine enterprise wedge** — but the audit-log claim requires a product extension; don't claim it yet.
4. **Tax retention:** position as evidence-strengthening for retention/audit, never as tax-law compliance.
5. **All market-size and "curse" statistics are directional** (secondary/industry sources) — cite as context, never as hard fact.

---

## Sources

[11] https://www.gov.br/iti/pt-br/acesso-a-informacao/perguntas-frequentes/certificacao-digital — Gov.br ITI: Certificação Digital ICP-Brasil (validade jurídica)
[13] https://www.savetheproof.com/blockchain-o-eidas — SaveTheProof: ¿Blockchain o eIDAS? valor probatorio España
[14] https://www.clarkemodet.com/articulos/el-blockchain-utilizado-como-registro-de-evidencias-es-considerado-como-valido-en-sede-judicial — ClarkeModet: Blockchain como registro de evidencias válido en sede judicial
[15] https://www.irs.gov/businesses/small-businesses-self-employed/recordkeeping — IRS: Recordkeeping (how long to keep records)
[16] https://chainbusinessinsights.com/insights-blog/the-role-of-blockchain-in-modern-data-rooms — Blockchain in Data Room Security and Compliance
[17] https://www.pwmnet.com/content/d8b1d55f-0697-524f-8445-26f3950ea94c — PWM: Digitalisation key to wealth preservation for family offices
[18] https://tiger21.com/insights/four-family-office-strategies-for-multi-generation-wealth-preservation-collective-intelligence-report — TIGER 21: family office wealth preservation stats
[19] https://www.irs.gov/newsroom/good-recordkeeping-year-round-helps-taxpayers-avoid-tax-time-frustration — IRS: Good recordkeeping year-round
[20] https://allsign.io/learn/nom-151 — NOM-151-SCFI-2016: requisitos y sello de tiempo RFC 3161
