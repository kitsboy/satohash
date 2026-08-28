# Satohash — Legal Positioning Brief (Lawyer-Ready)
**Prepared by:** Rosa (@rosa) · **For:** Cam's lawyer review · **Feed target:** Lenny (Legal) · **Date:** 2026-08-29
**Deadline context:** 3 days. This is the legal-facing material, distilled from the full research memo (`SATOHASH-RESEARCH-MEMO.md`). Every legal statement below is cited to a primary/authoritative source and backed by verbatim evidence.

---

## 1. THE NON-NEGOTIABLE CORRECTION (outright factual error)

**Current text (learn-eidas-ueta-explained.md):** "eIDAS Article 41 even mentions the use of technologies like blockchain for long-term preservation of records."

**Status: FALSE.** I full-text-searched the consolidated eIDAS Regulation (EU) No 910/2014, as amended by Regulation (EU) 2024/1183 (eIDAS 2.0), from EUR-Lex. The words "blockchain" and "distributed ledger" appear **zero times** in the regulation. Article 41 is titled **"Legal effect of electronic time stamps."**

**Action:** Delete that sentence. Replace with the true, stronger hook:

> "eIDAS Article 41 says an electronic time stamp shall not be denied legal effect or admissibility as evidence in legal proceedings solely because it is in electronic form."

---

## 2. WHAT ESIGN / UETA / eIDAS ACTUALLY SAY (the accurate, citable core)

### ESIGN — US federal (15 U.S.C. § 7001)
Core rule, verbatim from the U.S. Code: *"a signature, contract, or other record relating to such transaction may not be denied legal effect, validity, or enforceability solely because it is in electronic form."*[1]
- Effect: removes the "electronic-form objection." An electronic record can't be struck down just for being electronic.
- Limit: it is a **non-discrimination floor, not a seal of approval** — no special evidentiary presumption for timestamps; admissibility and outcome remain court decisions.
- § 7001(g): allows electronic notarization to satisfy notarization requirements when the authorized person's e-signature is attached — relevant only if we ever offer in-app notarization by an authorized notary.

### UETA — US states
Adopted in **49 states + D.C. + Puerto Rico + U.S. Virgin Islands. New York has NOT adopted UETA** (it uses its own statute, ESRA).[12]
- Draft's "nearly every US state" is accurate. **Never write "all 50 states."**
- Same non-discrimination function at state level (electronic records/signatures satisfy legal writing requirements).

### eIDAS — EU (Reg. 910/2014, as amended by Reg. 2024/1183)
- **Art. 41(1):** *"An electronic time stamp shall not be denied legal effect and admissibility as evidence in legal proceedings solely on the grounds that it is in an electronic form or that it does not meet the requirements of the qualified electronic time stamp."*[4] — **This is the honest hook we should use.**
- **Art. 41(2):** *"A qualified electronic time stamp shall enjoy the presumption of the accuracy of the date and the time it indicates and the integrity of the data to which the date and time are bound."*[4] — **CRITICAL:** this presumption attaches ONLY to *qualified* time stamps issued by a *qualified trust service provider* (QTSP) meeting Art. 42 requirements (QTSP signature/seal, UTC-linked time source). Satohash is not a QTSP, so **our stamps do not carry this presumption.**[4] We must not imply otherwise.
- **eIDAS 2.0 (2024/1183)** added the **"qualified electronic ledger"** (Art. 45l), recognized across Member States. The regulation text itself never uses the word "blockchain."

---

## 3. THE HONEST POSITIONING (admissible, not presumed accurate)

**Keep this line verbatim in all materials:**

> "Admissible in most places, yes. Automatically presumed accurate, no."

**The correct framing for Satohash:**
- Our `.ots` proof is strong, independently verifiable **evidence that a file existed at a time and has not changed since** — mathematically anchored to Bitcoin proof-of-work.[unverified]
- Under ESIGN/UETA/eIDAS, that electronic evidence **cannot be denied effect or admissibility solely for being electronic.**[1][4]
- It does **not** prove who created or signed the content, and courts still weigh it under ordinary evidence standards.[unverified] For "who," pair the timestamp with a signature (DocuSign/Adobe for process; Nostr keys for sovereign identity).[unverified]

---

## 4. STRONG SUPPORTING AUTHORITY (use this — it's genuinely compelling)

| Authority | Point |
|---|---|
| **FRE 902(13)/(14)** | Self-authentication via hash values — the advisory committee names hashes as a process of digital identification.[7] Cleanest US evidentiary hook. |
| **Vermont 12 V.S.A. § 1913; Arizona A.R.S. § 44-7061** | Blockchain-specific evidence statutes.[7] |
| **France — Marseille, Tribunal judiciaire, 20 Mar 2025 (RG 23/00046)** | Court gave **full probative weight** to Bitcoin-ledger timestamp reports in a copyright dispute (EUIPO source).[8] |
| **China — Hangzhou Internet Court (2018)** | Accepted blockchain-preserved evidence; SPC later generalized.[7] |
| **Italy — Law 12/2019, Art. 8-ter** | Grants blockchain timestamps legal effect equivalent to eIDAS electronic timestamps.[unverified — secondary-source; directional] |

---

## 5. RECOMMENDED WORDING CHANGES (before lawyer sees them)

| Current | Corrected |
|---|---|
| "exceeding ESIGN and eIDAS compliance" (PITCH.md) | "aligns with the intent of ESIGN/UETA/eIDAS" / "operates within their framework" — do NOT claim regulatory compliance we don't have |
| "IP / Patent priority" (use-case table) | "evidence of conception / public disclosure / prior-art support" |
| "courtroom-ready PDF customizer" | keep honesty framing: strong evidence of existence-at-a-time; admissibility is a court's call[7] |
| "a qualified electronic time stamp is presumed correct in court" | keep, but explicitly add we are not a QTSP so our stamps don't carry the Art. 42(2) presumption |

---

## Sources

[1] https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title15-section7001&num=0&edition=prelim — 15 USC 7001 ESIGN general rule of validity
[4] https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02014R0910-20241018 — eIDAS consolidated text 910/2014 (incl 2024/1183)
[7] https://getproofsnap.com/posts/how-to-verify-opentimestamps-ots-file-bitcoin-blockchain-2026.html — OpenTimestamps .ots legal admissibility (Proofsnap)
[8] https://www.euipo.europa.eu/en/law/recent-case-law/he-court-of-marseille-recognised-blockchain-timestamping-as-legitimate-evidence-of-copyright-ownership — EUIPO: Court of Marseille recognised blockchain timestamping as evidence
[12] https://www.nycbar.org/issues-policy/advocacy-campaigns/ueta-esra-new-york-electronic-transactions-law — NYC Bar: UETA adoption + New York ESRA
