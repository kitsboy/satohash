# Satohash — Brief for Counsel

**Prepared by:** Lenny (Legal & Compliance, Give A Bit) · **Date:** 2026-08-29
**For:** Cam's counsel, ahead of the legal review sitting.
**Context:** Satohash is a Bitcoin-anchored document-timestamping service (SHA-256 + OpenTimestamps → Bitcoin). We are preparing to offer premium (paid) tiers: Professional, Enterprise, and pay-per-use API (Lightning/L402). We need counsel's confirmation on the points below and sign-off on the drafted terms.

---

## 1. What the product is (and is not)

- **Is:** Client-side SHA-256 hashing; only the 64-hex hash is submitted; OpenTimestamps calendars aggregate; Bitcoin block confirms. User gets a portable `.ots` proof, independently verifiable forever. Zero-knowledge: document bytes never leave the device.
- **Is not:** A notary, an electronic-signature service, a regulated Time Stamping Authority (TSA), or a qualified electronic time stamp (QETS) under eIDAS.
- **Payment:** Free tier today (`REQUIRE_LIGHTNING=false`). **Mission & Scope draft v3 frames premium as "a small Lightning payment, on the order of tens of satoshis purely to cover hosting — the anchoring mechanism and its guarantees stay identical."** Note: the exec summary/pricing pages currently show $29/mo Professional + $299/mo Enterprise subscription tiers. **Counsel + Cam must reconcile these two models** — micro-fee per stamp vs. subscriptions — before the terms are final.

## 1b. Alignment with Mission & Scope draft v3 (found 2026-08-29)

- The draft's legal framing (§2) is **already aligned with our corrected posture**: it says ESIGN/UETA/eIDAS "recognize timestamped electronic records as admissible evidence" and adds the honest caveat "admissibility isn't the same as automatic proof of a specific legal conclusion." This validates the R1 wording we shipped. 
- The draft's "Who This Is For" §5 maps directly to the five pillars (M&A/due diligence, family offices via estate/wills, LatAm, tax, enterprise/indemnity). 
- The draft names the next chapter as **proof of authorship via private-key signing** (not yet shipped). Counsel should note that authorship claims are future-state, not current claims, so marketing must not imply signed-authorship today.
- The draft calls for "plain-language legal explainer per jurisdiction (US/EU to start)" — delivered in `JURISDICTION-EXPLAINERS.md`.

## 2. Open entity / governing-law decisions (need Cam + counsel)

- Terms currently say **"Satohash Inc."** and **"State of Delaware."** We have **no confirmed registered entity** for Satohash or Give A Bit. The family operates as "Give A Bit." Counsel must confirm:
  1. Which entity actually operates Satohash (an incorporated entity, a Give A Bit entity, or none yet)?
  2. Is **Delaware** the correct choice-of-law and forum, or should it follow the entity's state of formation?
  3. Should Terms be issued in the name of the operating entity (recommended) or Give A Bit as brand owner?
- **Lenny's recommendation:** Stand up (or confirm) a single operating entity and make all legal pages consistent with it before launch. Do not launch paid tiers under an entity that doesn't exist or isn't the true operator.

## 3. Claims-cleanliness (highest priority — R1)

We must remove unsubstantiated "compliance" claims before launch:
- Trust Center currently labels ESIGN/UETA **"Compliant"** and eIDAS **"Compatible."** → Change to **"Supporting evidence / Evidentiary."**
- Exec summary and pitch claim Satohash "exceed[s] ESIGN and eIDAS compliance." → Remove.
- Counsel should confirm the final wording for these labels (see `JURISDICTION-EXPLAINERS.md` for our proposed defensible language).

## 4. New Terms clauses drafted (see `TERMS-INDEMNITY-STRENGTHENING.md`)

Counsel review requested on:
1. **Indemnification** (user indemnifies us for misuse/third-party claims) — new.
2. **Strengthened Limitation of Liability + No Warranty** (incl. no warranty on confirmation timing; third-party calendar/network dependency; original-file preservation) — amended.
3. **Subscription, Billing & Refunds** (auto-renewal, non-refundable default, 30-day price-change notice, Lightning irreversibility, taxes) — new.
4. **Enterprise SLA** (99.5% monthly uptime target; 5%/point service credit capped at 20%; explicit carve-out for stamp confirmation times) — new. **Question for counsel:** is 99.5% / 5% / 20% proportionate for an early-stage product, or should the target be lower (e.g., 99% / 4% / 15%)?
5. **Dispute Resolution** (informal 30-day step, Delaware forum, small-claims carve-out, class-action waiver, **no mandatory arbitration**). **Question for counsel:** should we add binding arbitration?
6. **International Use & Data / compact DPA** (GDPR-aligned minimal-metadata confirmation; DPA on request for Enterprise). **Question for counsel:** is a one-page "minimal data" DPA letter sufficient for EU enterprise buyers, or do we need a fuller DPA template?

## 5. Questions for counsel (consolidated)

1. Entity + governing law (above).
2. SLA metrics/remedy proportions appropriate for launch?
3. Add mandatory arbitration or keep informal + court?
4. Is the compact DPA posture adequate for EU enterprise, or prepare a full DPA?
5. Any state where UETA differs materially enough to affect our copy (NY, IL, WA)?
6. eIDAS 2.0 (Regulation 2024/1183) — confirm our time-stamp framing stays accurate through the phased 2024–2026 rollout.
7. Export-control / sanctions framing for a global, permissionless timestamping service — any additional clause we need?
8. Is a Bitcoin/Lightning payment "no chargeback" stance enforceable as drafted, or does the EU's Payment Services framework (PSD2) require anything different for refunds?
9. **Seychelles entity claim (NEW, unverified).** The Satohash footer copyright reads "© 2026 GIVEABIT LTD. REGISTERED IN THE SEYCHELLES" across all i18n files. We have **no record of a Give A Bit Seychelles entity** anywhere in the family documents. Counsel must confirm whether this entity exists and is the true operator — if not, the footer misstates the operator and must be corrected before launch. If it exists, we need the registered name/registration number for the Terms.

## 5b. Focus pillars for the legal case (steer from Cam, via Hermes)

The lawyer review will be organized around five pillars. Our drafted language and explainers map to them as follows:

| Pillar | Legal relevance | Where covered |
|---|---|---|
| **M&A / due diligence** | Data-room + deal documents timestamped to prove state before closing; chain of custody for virtual data rooms | `FIVE-PILLAR-LEGAL-CASE.md` §1 + `JURISDICTION-EXPLAINERS.md` §G |
| **Family offices** | Long-horizon record & asset-document keeping; wealth sovereignty; multi-generational proof; no custody | `FIVE-PILLAR-LEGAL-CASE.md` §2 + `JURISDICTION-EXPLAINERS.md` §H |
| **Latin markets** | Jurisdiction + legal standing in ES/PT-speaking countries; eIDAS-equivalents in LatAm; notarization culture differences | `FIVE-PILLAR-LEGAL-CASE.md` §3 + `JURISDICTION-EXPLAINERS.md` §E |
| **Tax** | Record retention, audit trails, tax-document integrity across fiscal deadlines; how timestamps support tax compliance | `FIVE-PILLAR-LEGAL-CASE.md` §4 + `JURISDICTION-EXPLAINERS.md` §F |
| **Business / enterprise** | Commercial + enterprise use; indemnity for premium tiers | `FIVE-PILLAR-LEGAL-CASE.md` §5 + Terms §04/§06/§07/§08/§10 |

**The consolidated five-pillar case, with per-pillar indemnity posture and a counsel sign-off checklist, is in `FIVE-PILLAR-LEGAL-CASE.md`.** Counsel should treat the indemnity + paid-tier clauses (Pillar 5) and the LatAm/tax explainers (Pillars 3–4) as the highest-priority review items.

## 6. What we are NOT asking for (defaults)

- Not selling investment advice.
- Not promising returns or regulatory approval.
- Not positioning Satohash as a substitute for qualified signatures/timestamps where law requires them.
- No legal advice from Satohash to end users — that boundary stays firm in all copy.

---

## 7. Readiness checklist before the lawyer sits down

- [ ] R1: "Compliance" overclaims removed from TrustCenter, exec summary, pitch, i18n (Lenny + Nova/M3).
- [ ] R2: Indemnity clause added to Terms (Lenny drafted; counsel sign-off; Nova/M3 to implement).
- [ ] R3: Billing/refund/SLA clauses added to Terms; Pricing page links Terms (Lenny drafted; Nova/M3 implement).
- [ ] R4: Entity + governing law decided (Cam + counsel) and applied consistently.
- [ ] R5: Dispute-resolution clause added (Lenny drafted; counsel decide arbitration).
- [ ] R6: Compact DPA note available for Enterprise (Lenny drafted; counsel confirm sufficiency).
- [ ] R8: giveabit.io parent Terms drafted (pattern from Satohash Terms once settled).
- [ ] Version bump: Terms effective date + "last reviewed" updated; counsel's sign-off recorded.

---

*This brief is a risk-management aid prepared by an AI compliance function. It is not legal advice. Counsel's independent review and sign-off is required before public launch of paid tiers.*
