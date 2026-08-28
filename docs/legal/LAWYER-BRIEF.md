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

### 2a. CURRENT CORPORATE & LEGAL STATUS (updated 2026-08-29, per Cam)

**Honest, current state — as instructed by Cam:**

- **No entity registered.** Satohash is **not registered** as a company anywhere. There is no "Satohash Inc." (the prior Terms placeholder) and **no** "GIVEABIT LTD. REGISTERED IN THE SEYCHELLES" (the footer claim — **confirmed false; removed**).
- **Free, non-commercial product.** Satohash is currently free. No subscription is billed and no payment is accepted today.
- **Server in Germany.** The Satohash API server is hosted in Germany. German law (including on data and, where relevant, electronic records) is therefore the most directly applicable operating jurisdiction for the infrastructure.
- **Identity intentionally not disclosed — anti-dox.** Cam personally owns two companies in Vancouver, Canada, but Satohash is **not** registered under either, and he does **not** want to register it or reveal personal/company identity yet. Rationale: the product is free and he wants to audit how well it actually works before making any identity or entity commitment.

**Consequences for the legal posture:**
1. The **Seychelles footer claim is removed** (verified false — no such entity).
2. The Terms use **[ENTITY TBD]** and **[GOVERNING LAW TBD]** placeholders — correct and retained.
3. **Paid-tier + SLA + billing clauses are forward-looking drafts only** — NOT live or enforceable, because the payment portal is not started or finished. They activate only if/when paid services launch.
4. For now the Terms are a **minimal, honest non-commercial free-service Terms** — no entity, no payment, no enforceable commercial commitments.

**Counsel must advise on:**
- Whether operating a free service from a Germany-hosted server, with no legal entity, creates any registration/consumer obligations (e.g., German Impressum/telemedia requirements for a website offering services to EU users) — this may be the single most concrete compliance gap.
- When and whether to establish an entity before any commercial launch.
- Whether anti-dox (non-disclosure of identity) is sustainable once any paid service or EU-facing site operates — several jurisdictions require an imprint/identity disclosure.

### The family umbrella (as Cam wants highlighted)
Satohash is part of the **Give A Bit** family: giveabit.io, the family of Bitcoin-native products (Katoa, SherpaCarta, MotoPass, and others), and the **@giveabit.io NIP-05 Nostr namespace** for open timestamping and sovereign identity. Legal materials should present Satohash as a Give A Bit family product, with the family as the umbrella — even while the exact legal entity remains to be determined.

- **Entity status (RESOLVED per Cam 2026-08-29):** There is currently **no entity** — not "Satohash Inc.," not a Seychelles company, not a Give A Bit legal entity. Cam owns two Vancouver companies but Satohash is not under either, and he does not want to register or disclose identity yet (anti-dox, pending product audit). See §2a above for the full current status. The remaining open question for counsel is purely: **when and in what form to establish an entity before any commercial launch, and what German/EU obligations attach to the free service in the meantime** (Impressum/telemedia).

## 3. Claims-cleanliness (highest priority — R1)

We must remove unsubstantiated "compliance" claims before launch:
- Trust Center now labels ESIGN/UETA **"Supporting evidence"** and eIDAS **"Evidentiary."** ✅ Applied.
- Exec summary and pitch no longer claim Satohash "exceed[s] ESIGN and eIDAS compliance." ✅ Removed across code, i18n, and docs.
- Counsel should still confirm the final wording (see `JURISDICTION-EXPLAINERS.md` for the defensible language).

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
