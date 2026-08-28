# Satohash — Jurisdiction Explainers (US ESIGN/UETA + EU eIDAS)

**Prepared by:** Lenny (Legal & Compliance, Give A Bit) · **Date:** 2026-08-29
**Purpose:** Courtroom-ready explainers for counsel and for the public `/counsel`, `/evidence-admissibility`, and `/trust` pages. These replace the overclaiming "exceeds compliance" framing with precise, defensible language.
**Usage:** Distill the "One-paragraph" blocks into page copy; keep the "Fine print" blocks in internal/counsel docs and footnotes.

---

## A. United States — ESIGN & UETA

### A.1 What they are (one paragraph)
The **ESIGN Act** (Electronic Signatures in Global and National Commerce Act, 15 U.S.C. §§ 7001 et seq., 2000) is the federal statute, and **UETA** (Uniform Electronic Transactions Act) is the nearly-identical state law adopted by 49 states, the District of Columbia, and several territories. Together they provide that a signature, contract, or other record shall not be denied legal effect solely because it is in electronic form, and that an electronic record satisfies a law requiring a "writing." ESIGN applies to interstate and foreign commerce; UETA applies at the state level where adopted. Both contain consumer-consent provisions and carve-outs (wills, certain notices) that do not affect our timestamping use.

### A.2 What they mean for a Satohash stamp (precise)
- A Satohash stamp is an **electronic record of existence-at-a-time**: a SHA-256 fingerprint committed through OpenTimestamps into Bitcoin.
- ESIGN/UETA mean a *record* is not denied effect *because it is electronic*. They support the proposition that a hash-based electronic record is a valid electronic record.
- They do **not** convert a timestamp into a signature, and they do **not** guarantee admissibility or weight. Admissibility and weight remain governed by the rules of evidence (e.g., Federal Rules of Evidence 901 — authentication), which generally favor evidence with a demonstrable chain of custody and independent verifiability.

### A.3 Defensible claim (use this)
> "Satohash creates an electronic record of existence-at-a-time that is independently verifiable via the public Bitcoin blockchain. ESIGN and UETA provide that electronic records are not denied legal effect merely because they are electronic. Whether a specific stamp is admitted, and the weight it receives, depends on the rules of evidence and the specific proceeding."

### A.4 Fine print (internal/counsel)
- ESIGN § 7001(c) consumer-consent provisions do not apply because we are not delivering disclosures or e-signatures to consumers — but be careful never to market Satohash as a consumer e-signature replacement.
- 47 states (not all 50) have UETA in substantively identical form; New York, Illinois, and Washington use comparable but distinct statutes (e.g., NY's Electronic Signatures and Records Act). Counsel should note state-level variation rather than a blanket "compliant in all 50 states."
- **Do not claim "compliance."** Claim *alignment / evidentiary support*. Compliance implies meeting a mandated standard; ESIGN/UETA set a floor for electronic records, not a certification for timestamping providers.

---

## B. European Union — eIDAS

### B.1 What it is (one paragraph)
**eIDAS** (Regulation (EU) No 910/2014) establishes the EU legal framework for electronic identification and trust services. It recognizes **electronic signatures** (with three levels: electronic, advanced, qualified) and — critically for us — **electronic time stamps** (ETS) and **qualified electronic time stamps** (QETS). Under eIDAS Article 41 and 42, an ETS "shall not be denied legal effect solely on the grounds that it is in electronic form," and a **qualified** electronic time stamp (issued by a supervised/accredited Time Stamping Authority, TSA, per Article 42) enjoys a presumption of accuracy of the date and time and the integrity of the data.

### B.2 What it means for a Satohash stamp (precise)
- A Satohash stamp is **not** a qualified electronic time stamp under eIDAS: it is not issued by an accredited TSA and does not carry the Article 42 presumption.
- It is **supporting cryptographic evidence** of existence-at-a-time. It can strengthen an evidence package alongside, or instead of, a formal QETS where a QETS is not required.
- The 2014 eIDAS was updated by **Regulation (EU) 2024/1183** (eIDAS 2.0, applicable in phases from 2024–2026) — keep the explainer current on the phased rollout; the time-stamp framework remains substantially similar but counsel should confirm the current text.

### B.3 Defensible claim (use this)
> "Satohash provides independently verifiable cryptographic evidence of existence-at-a-time anchored to Bitcoin. It is not a qualified electronic time stamp under eIDAS and does not carry the eIDAS presumption of accuracy. In the EU, a formal qualified time stamp from an accredited Time Stamping Authority should be used where the law requires one; Satohash evidence can complement such an arrangement."

### B.4 Fine print (internal/counsel)
- The only eIDAS provision that mentions blockchain is **Article 41** (electronic time stamps) and, in eIDAS 2.0, **Article 45b/45c** on the European Digital Identity Wallet and the Commission's mandate to examine decentralized ledgers — NOT an endorsement that any blockchain timestamp is automatically a QETS.
- "Qualified" under eIDAS is a strict, regulated status. **Never** describe Satohash as "eIDAS-compliant" or "eIDAS-qualified." Claim *alignment with the goals* of trustworthy, long-term, verifiable time records.
- For Member-State proceedings, evidentiary weight is decided by national civil-procedure law, not by eIDAS alone.

---

## C. Cross-jurisdiction summary (for the Trust Center / Evidence table)

| Framework | Region | Precise status | Do NOT say |
|---|---|---|---|
| ESIGN | US (federal) | Electronic record; evidentiary support | "ESIGN-compliant" |
| UETA | US (47 states + similar elsewhere) | Electronic record; evidentiary support | "UETA-compliant in all 50 states" |
| eIDAS ETS | EU | Supporting cryptographic evidence | "eIDAS-compliant" / "qualified" |
| eIDAS QETS | EU | NOT provided by Satohash (TSA required) | "we issue QETS" |
| GDPR | EU | Zero document bytes; minimal metadata | "GDPR-certified" (no such thing) |
| UK civil evidence | UK | Evidentiary with chain of custody | "UK-compliant" |

---

## D. The honest bottom line (reuse verbatim in copy)
> "A Satohash stamp proves a specific file existed, in a specific form, by a specific time — mathematically, and verifiable by anyone, forever. It is strong evidence. It is not a notary, a signature, or a regulated timestamp authority. For proceedings that require those, pair it with the appropriate qualified service and take advice from counsel in your jurisdiction."

---

## E. Latin America — legal standing (ES/PT markets) 🆕

### E.1 Notarization culture — the key difference
Most LatAm legal systems are **civil-law (notarial)** traditions. Public notaries (*escribanos / notarios*) hold a quasi-public role: many documents have legal effect only when granted before a notary and registered. This matters because a Bitcoin timestamp is **evidence**, not a notarial act — it cannot replace the notary for documents the law requires to be notarized (e.g., property transfers, powers of attorney in many countries, corporate registry filings).

### E.2 Electronic-evidence equivalents (eIDAS-analogues)
There is no single eIDAS equivalent covering all of LatAm, but the regional picture:

| Jurisdiction | Framework | Status of hash evidence |
|---|---|---|
| **Brazil** | Lei 14.063/2020 (electronic gov. signatures, incl. **carimbo de tempo** — time-stamping); MP 2.200-2/2001 (ICP-Brasil PKI) | Hash/OTS evidence is admissible supporting evidence; ICP-Brasil e-signatures are the regulated lane for public acts |
| **Mexico** | Ley de Firma Electrónica Avanzada (FEA) + NOM-151-SCFI-2016 (conservación de mensajes de datos) | Timestamped electronic records admissible as evidence; FEA certificates are the regulated e-signature lane |
| **Argentina** | Código Civil y Comercial (arts. 286–288); Ley 25.506 (firma digital); Ley 26.685 (expediente digital) | Digital records admissible; strong digital signature (PKI) carries presumption of authorship |
| **Chile** | Ley 19.799 (documentos electrónicos y firma electrónica) | Electronic documents admissible; simple e-signature is low-assurance, advanced/firma electrónica avanzada is stronger |
| **Colombia** | Ley 527/1999 (UNCITRAL Model Law); Decreto 2364/2012 | Data messages admissible; hash integrity evidence supports authenticity |
| **Peru** | Ley 27269 (firmas y certificados digitales) | Electronic records admissible; INACERT certificates for the regulated lane |
| **Panama / Central America** | Various UNCITRAL-based electronic-commerce laws | Generally admissible as supporting evidence |

### E.3 Defensible claim (LatAm)
> "In Latin American civil-law systems, Satohash evidence supports proof of existence and integrity of electronic records, and is admissible as supporting evidence in most jurisdictions. It is not a notarial act and does not replace the notary where local law requires one. Where a regulated electronic signature or timestamp is required (e.g., ICP-Brasil, FEA, firma digital), that should be used — Satohash evidence can complement it."

### E.4 Fine print
- **Spanish/Portuguese copy must never say "certificado" or imply notarial status.** Use "evidencia de apoyo / prova de existência."
- Do not claim "legal value" universally — say "valor probatorio as supporting evidence, subject to the judge's assessment."
- Stamp + notary is the strong pattern: use Satohash for the *timestamped draft/provenance trail*, notarize the *final act* where required.

---

## F. Tax compliance — records, audits, fiscal deadlines 🆕

### F.1 What tax authorities care about
Retention, integrity, and timeliness: records must exist, be unchanged, and be provable as of the relevant fiscal period. Regulators (IRS, HMRC, AEAT, Receita Federal, SAT, etc.) all accept electronic records when their integrity and custody are demonstrable.

### F.2 How a timestamp helps (and its limits)
- **Integrity + timeliness:** a Bitcoin anchor proves a record (policy, ledger export, invoice, returns draft) existed in a specific form by block N — useful for reconstruction audits and disputes over what was on file at a deadline.
- **Retention:** anchors do not preserve the original bytes; you must still keep the file + `.ots` under your retention schedule.
- **Not a substitute for the return/filing itself:** timestamping a draft does not file your taxes. It evidences the draft's state before submission.
- **Public-chain privacy:** never stamp raw tax records containing PII/TPINs to a public chain — hash only, or use a private/enterprise calendar.

### F.3 Defensible claim (Tax)
> "Satohash evidence supports tax compliance by independently proving the existence and integrity of records as of a given time — useful for audit trails, retention, and reconstructing what was on file at a fiscal deadline. It does not file returns or replace statutory record-keeping obligations."

### F.4 Fine print
- The value is **evidentiary**, not a compliance certification. Regulators do not "certify" timestamps; they weigh evidence.
- Pair with your retention/DLP policy so the practice is documented and auditable (a written policy makes evidence stronger).

---

*Prepared by Lenny for counsel review and public-page use. Not legal advice. Confirm current statutory text (incl. eIDAS 2.0 rollout and LatAm e-signature updates) before publication.*
