# Satohash — Research Memo: Scope, Use-Case Map & Legal Claims
**Author:** Rosa (@rosa), Chief Researcher · **Date:** 2026-08-28
**Status:** Pre-lawyer review. Every load-bearing legal claim below carries a primary/authoritative citation; model-knowledge claims are flagged `[unverified]`.

---

## 1. EXECUTIVE SUMMARY — what must change before Cam's lawyer reads this

| # | Claim in current drafts | Verdict | Fix |
|---|---|---|---|
| 1 | "eIDAS **Article 41 even mentions the use of technologies like blockchain** for long-term preservation of records" (learn-eidas-ueta-explained.md) | **FALSE** — the full consolidated eIDAS text (910/2014 + 2024/1183) contains **zero** occurrences of "blockchain" or "distributed ledger"; Art. 41 is titled "Legal effect of electronic time stamps.".[4] | Delete the sentence. Replace with the *true* and *more helpful* hook: Art. 41(1) says a non-qualified time stamp shall not be denied legal effect/admissibility *solely* because it is electronic.[4] |
| 2 | "exceeding **ESIGN and eIDAS compliance**" (PITCH.md) | **Overstated / legally meaningless** — you don't "exceed compliance" with a permissive statute; Satohash is not a regulated e-signature or QTSP service. | Rephrase to "aligns with the intent of ESIGN/UETA/eIDAS" or "operates within their framework." Do not imply regulatory compliance we do not have. |
| 3 | "a 'qualified electronic time stamp' is presumed correct in court" (learn article) | **Accurate** about QTS — but Satohash is **not** a QTSP, so **our** stamps do **not** get the Art. 42(2) presumption. The draft implies more than is true for our product. | State the distinction explicitly: EU courts won't deny a non-qualified stamp admissibility *solely* for being electronic (Art. 41(1)), but the *presumption of accuracy* attaches only to QTSP-issued qualified stamps. |
| 4 | "IP / Patent **priority**" (exec-summary use-case table) | **Overstated** — a timestamp is *evidence of existence/conception*, but patent **priority** is a specific legal concept tied to filing date. A hash anchor does not establish priority. | Rephrase to "evidence of conception / public disclosure / prior-art support." |
| 5 | "Global notarization market **~$5B+/yr**" | **Weak/unsourced** — I found no clean "$5B+ notarization market" figure.[unverified] | Drop or replace with a sourced number (see §4). |
| 6 | "Legal tech **~$27B+** and growing double digits" | **Defensible but slightly stale** — 2025 estimates are $28.7B–$33.97B, CAGR ~10–12%.[5][6] | Bump to "~$29–34B in 2025" with citation.[5][6] |
| 7 | "**<1% penetration**" | **Unverifiable** — no source.[unverified] | Mark `[unverified]` or delete. |
| 8 | "**courtroom-ready** PDF customizer" | **Overstated** — admissible ≠ presumed accurate.[7] | Keep the honesty framing: the proof is *strong evidence of existence-at-a-time*; admissibility is a court's call.[7] |

**Bottom line:** The product's honest legal story is genuinely strong — it just doesn't need the overreach. Fix the eIDAS "Article 41/blockchain" error (the one outright falsehood), remove "exceeding compliance," and tighten the "courtroom-ready / priority" language. Everything else survives scrutiny with better sourcing.

---

## 2. LEGAL FRAMEWORK — what ESIGN / UETA / eIDAS actually say (cited)

### 2.1 ESIGN (US, federal) — 15 U.S.C. § 7001
The core rule, verbatim: *"a signature, contract, or other record relating to such transaction may not be denied legal effect, validity, or enforceability solely because it is in electronic form."*[1]
- **What it does:** removes the *electronic-form objection* — an electronic record can't be struck down just for being electronic.
- **What it does NOT do:** create a special evidentiary presumption for timestamps, and it doesn't guarantee admissibility or a ruling. It is a non-discrimination floor, not a seal of approval.
- § 7001(g) also lets electronic notarization satisfy notarization requirements when the authorized person's e-signature is attached — relevant only if we ever do in-app notarization by an authorized notary.

### 2.2 UETA (US, states) — Uniform Electronic Transactions Act
Adopted in **49 states + D.C. + Puerto Rico + U.S. Virgin Islands**; **New York has NOT adopted UETA** (it uses its own statute, ESRA).[12]
- The draft's "adopted by nearly every US state" is accurate. Do **not** write "all 50 states" — NY is the exception.[12]
- UETA does the same non-discrimination work at the state level (electronic records/signatures satisfy legal writing requirements).

### 2.3 eIDAS (EU) — Reg. 910/2014, as amended by Reg. 2024/1183 (eIDAS 2.0)
The exact text from the consolidated regulation:[4]
- **Art. 41(1) — the hook we should use:** *"An electronic time stamp shall not be denied legal effect and admissibility as evidence in legal proceedings solely on the grounds that it is in an electronic form or that it does not meet the requirements of the qualified electronic time stamp."*[4]
- **Art. 41(2) — the presumption, and it is conditional:** *"A qualified electronic time stamp shall enjoy the presumption of the accuracy of the date and the time it indicates and the integrity of the data to which the date and time are bound."*[4] This presumption **only** attaches to *qualified* time stamps issued by a *qualified trust service provider* (QTSP) meeting Art. 42 requirements (signed/sealed by the QTSP, UTC-linked time source).[4]
- **eIDAS 2.0** (2024/1183) added a **"qualified electronic ledger"** (Art. 45l) recognized across Member States,[4] and the regulation text **does not use the word "blockchain" anywhere** (verified by full-text search).[4] The blockchain connection is the EU's separate EBSI policy and the DLT-friendly design of the ledger provisions — not an explicit Article 41 endorsement.[unverified]

**Why this matters for Satohash:** Our `.ots` proofs are *non-qualified* electronic time stamps under eIDAS. The honest, defensible claim is: **EU law says our stamp cannot be denied legal effect/admissibility merely for being electronic (Art. 41(1))** — that is real and citable.[4] We must **not** imply our stamps carry the Art. 42(2) presumption, because that requires QTSP issuance we do not provide.[4] If premium services later add a QTSP-backed qualified timestamp (as some competitors do), *that* is the layer that earns the presumption.[unverified]

---

## 3. CASE LAW & EVIDENCE STANDARDS — the genuinely strong material

This is where the honest case is compelling. Courts and evidence rules increasingly accept cryptographic/Bitcoin timestamps as admissible evidence of existence-at-a-time:

- **US Federal Rules of Evidence — self-authentication via hashes.** FRE 902(13) covers a record generated by an electronic process producing an accurate result; **902(14)** covers data authenticated by "a process of digital identification" — and the advisory committee names **hash values** as that process.[7] This is the cleanest US evidentiary hook for `.ots` proofs.[7]
- **State statutes:** Vermont (12 V.S.A. § 1913) and Arizona (A.R.S. § 44-7061) have blockchain-specific evidence statutes.[7]
- **France — Marseille, Tribunal judiciaire, 20 March 2025 (case RG 23/00046):** the court "accorded full probative weight to the 'Blockchain timestamp reports'" anchored on the **Bitcoin ledger** in a fashion copyright dispute, treating them as establishing the claimant's rights "from the dates recorded on the distributed ledger" even after a seizure report was annulled.[8]
- **China — Hangzhou Internet Court (2018)** accepted blockchain-preserved evidence in a copyright case; the SPC later generalized the approach.[7]
- **Italy — Law 12/2019, Art. 8-ter** grants blockchain timestamps legal effect equivalent to eIDAS electronic timestamps.[unverified — secondary sources; treat as directional]

**The honest framing (keep this verbatim in materials):** *"Admissible in most places, yes. Automatically presumed accurate, no."*[7] Admissibility ≠ a win; the timestamp proves *existence and integrity at a time*, not who created it or that the content is true.[7] For "who," pair the timestamp with a signature (DocuSign/Adobe for process, Nostr keys for sovereign identity).[unverified]

---

## 4. INDUSTRY / MARKET MAP — stress-testing the numbers

### 4.1 Market sizing
| Claim | Reality |
|---|---|
| "Global notarization ~$5B+/yr" | **Not cleanly sourced.** Published figures are fragmented and category-specific: digital-notary-for-government ~$4.2B (2025); e-notary software ~$3.3B (2024); mobile-notary ~$0.5B. There is no single authoritative "$5B+" notarization figure. **Recommend replacing with the legal-tech figure below.** |
| "Legal tech ~$27B+, double digits" | **Right direction, slightly stale.** 2025 global legal-tech estimates: $28.7B (Grand View),[6] $29.8B (Precedence)[5], $33.97B (Fortune BI)[unverified]; CAGR ~10–12%.[5][6] **Recommend "~$29–34B in 2025, growing ~10%+ annually."** |
| "<1% penetration" | **Unverifiable.** Delete or mark `[unverified]`.[unverified] |

### 4.2 Use-case map (from exec summary §Problem) — stress-tested
| Use case | Stress-test verdict |
|---|---|
| IP / patent priority | **Overstated.** → "evidence of conception / public disclosure / prior-art support." |
| Freelance / creator disputes | **Sound** — proof of existence before delivery is a genuine, commonly-litigated fact. |
| Investigative journalism | **Sound** — immutable snapshot + OTS; strongest when combined with signature/identity. |
| Smart contract / escrow evidence | **Sound** — self-sovereign, portable mathematical proof. |
| AI output provenance | **Sound & growing** — timestamping LLM outputs at generation is a real emerging need (deepfake defense). |
| Web content preservation | **Sound** — Snapper + fingerprint + OTS; pairs with a screenshot-evidence chain. |
| Multi-party contracts | **Sound but identity-dependent** — timestamp proves *when*; the Nostr co-signing layer supplies *who*. |
| Compliance / audit trails | **Strong** — the independent-verification property is exactly what auditors want; keep the "written policy strengthens evidence" caveat. |

---

## 5. WHAT I NEED FROM YOU TO MOVE FURTHER

- **Confirm the marketing doc scope of this revision** (which files are in the "v3" set — exec-summary, PITCH, MARKETING, mission, the three learn articles, or more), so I know exactly which files to patch with corrected/cited language.
- **Own bitcoind / calendar status** (technical, Ziggy or Andrea): confirm the live calendar set is exactly alice/bob/finney (the exec-summary claim) and that Taproot-vs-OP_RETURN is accurate, so the tech layer is as clean as the legal layer.
- **Decide the "qualified timestamp" question:** do we want premium services to *eventually* offer a QTSP-backed qualified stamp (the only route to the eIDAS Art. 42 presumption)? That's a product/positioning decision that materially changes the legal claims we can make.
- **Flag to Kimi/Cam:** the eIDAS "Article 41/blockchain" line is a factual error that must not reach the lawyer. I can patch all affected docs once you confirm scope.

---

## Sources

[1] https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title15-section7001&num=0&edition=prelim — 15 USC 7001 ESIGN general rule of validity
[4] https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02014R0910-20241018 — eIDAS consolidated text 910/2014 (incl 2024/1183)
[5] https://www.precedenceresearch.com/legal-technology-market — Legal Tech Market Size (Precedence Research)
[6] https://www.grandviewresearch.com/industry-analysis/legal-technology-market-report — Legal Technology Market (Grand View Research)
[7] https://getproofsnap.com/posts/how-to-verify-opentimestamps-ots-file-bitcoin-blockchain-2026.html — OpenTimestamps .ots legal admissibility (Proofsnap)
[8] https://www.euipo.europa.eu/en/law/recent-case-law/he-court-of-marseille-recognised-blockchain-timestamping-as-legitimate-evidence-of-copyright-ownership — EUIPO: Court of Marseille recognised blockchain timestamping as evidence
[12] https://www.nycbar.org/issues-policy/advocacy-campaigns/ueta-esra-new-york-electronic-transactions-law — NYC Bar: UETA adoption + New York ESRA
