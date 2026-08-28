# Satohash — Legal Posture Audit & Risk Register

**Prepared by:** Lenny (Legal & Compliance, Give A Bit) · **Date:** 2026-08-29
**Purpose:** Court-readiness sweep before counsel sits down with Cam. Gap list, risk tiers, and required fixes for premium-services launch.
**Scope:** Satohash SPA legal pages, marketing/exec docs, jurisdiction explainers, giveabit.io parent legal surface.

> Status flags: 🟢 adequate · 🟡 strengthen before launch · 🔴 fix now (material risk)

---

## 1. Assets audited

| Asset | Location | Status |
|---|---|---|
| Terms of Service | `src/pages/legal/TermsOfService.jsx` | 🟡 — solid base, missing indemnity + paid-tier clauses |
| Privacy Policy | `src/pages/legal/PrivacyPolicy.jsx` | 🟢 — zero-data posture, GDPR rights, strong |
| Crypto Notice | `src/pages/legal/CryptoNotice.jsx` | 🟢 — accurate is/is-not framing |
| Trust Center | `src/pages/trust/TrustCenter.jsx` | 🔴 — compliance table overclaims "Compliant"/"Compatible" |
| Evidence Admissibility | `src/pages/government/EvidenceAdmissibility.jsx` | 🟡 — good caveats, labels need precision |
| For Counsel one-pager | `src/pages/Counsel.jsx` + `public/docs/counsel.md` | 🟢 — correct and conservative |
| eIDAS/UETA explainer | `public/docs/learn-eidas-ueta-explained.md` | 🟡 — educational but overclaims ESIGN standing |
| Compliance-audit explainer | `public/docs/learn-timestamping-compliance.md` | 🟢 — honest, well-caveated |
| Mission + Safe Harbour | `public/docs/mission.md` | 🟢 |
| Exec summary | `docs/marketing/EXECUTIVE-SUMMARY.md` | 🟡 — "exceeding ESIGN and eIDAS compliance" overclaim |
| Pitch | `docs/marketing/PITCH.md` | 🟡 — same overclaim; "legal teams" claims |
| Pricing | `src/pages/Pricing.jsx` | 🔴 — no refund/terms link, SLA claim unqualified |
| giveabit.io parent | `src/components/sections/Privacy.jsx` | 🟡 — privacy good; **no standalone Terms** on parent |
| Ask sheet / diligence | `docs/diligence/` | 🟡 — "legal design partners" framing needs care |

---

## 2. Risk register (ordered by severity)

### R1 — 🔴 Claimed regulatory "compliance" we cannot substantiate
- **TrustCenter.jsx** labels ESIGN/UETA as **"Compliant"** and eIDAS as **"Compatible"**.
- **Exec summary** (line ~90) and **PITCH.md** say Satohash "exceed[s] ESIGN and eIDAS compliance."
- **Reality:** A Bitcoin-anchored OTS hash is *strong evidence of existence-at-a-time*. It is **not** a qualified electronic timestamp under eIDAS (QTS requires a supervised/accredited TSA) and it is **not** an electronic signature under ESIGN/UETA. Claiming compliance invites a misrepresentation or false-advertising exposure the moment a premium user relies on it.
- **Fix:** Re-label as **"supporting evidence / evidentiary"** everywhere. Remove "exceeds ... compliance." Keep "aligned in spirit / educational reference." Do this in TrustCenter.jsx, EvidenceAdmissibility.jsx, exec summary, pitch, and the i18n files that carry the same strings.

### R2 — 🔴 No indemnification clause in Terms
- **TermsOfService.jsx** has a *Limitation of Liability* section but **no indemnification** (user indemnifies us for misuse / claims arising from their use). For a paid service where users timestamp legal/confidential material, the absence of a user-side indemnity is a real exposure.
- **Fix:** Add a dedicated **Indemnification** section (drafted in `TERMS-INDEMNITY-STRENGTHENING.md`).

### R3 — 🔴 Paid tiers launched with consumer-protection gaps
- Pricing advertises Professional ($29/mo) and Enterprise ($299+/mo, includes **SLA**) with no refund policy, no subscription/billing terms, no trial terms, no automatic-renewal disclosure, no price-change notice.
- **"SLA"** in the Enterprise tier is a hard commitment. If we cannot quantify uptime and a remedy (service credit), a bare "SLA" is a liability magnet.
- **Fix:** Add **Subscription & Payments**, **Refunds**, **SLA** (quantified, with remedy) sections. Link Terms from Pricing page.

### R4 — 🟡 Governing-law / jurisdiction mismatch
- Terms say **"State of Delaware"** and "Satohash Inc." We have **no evidence Satohash is a Delaware entity** — the family runs under Give A Bit (no confirmed registered entity for either). Governing law and "Inc." must match the *actual* operating entity or counsel will flag it.
- **Fix (decision needed from Cam/counsel):** Confirm legal entity (Satohash Inc.? Give A Bit LLC? none yet?). Until then, keep Delaware choice-of-law as a *proposed* clause flagged "pending entity formation," or reference Give A Bit as operator.

### R5 — 🟡 No dispute-resolution / arbitration clause
- Only a forum-selection (Delaware courts) clause. For an international product, an **informal-dispute-resolution + arbitration option** reduces cost and jurisdictional surprise.
- **Fix:** Add a **Dispute Resolution** section (drafted) with an optional small-claims carve-out.

### R6 — 🟡 No DPA / international data posture for Enterprise
- GDPR posture is "by design" (we hold only hashes + labels). For EU enterprise buyers we should offer a short **Data Processing Agreement** mirroring that (even a "no personal data processed beyond the enumerated metadata" letter) so procurement can tick the box.
- **Fix:** Draft a compact DPA note in the privacy section for Enterprise.

### R7 — 🟡 Warranty disclaimer present but could be tightened for services
- Terms say "as is," good. Add explicit **no-warranty on timeliness/confirmation** and a caveat that **pending ≠ confirmed** and finality depends on third-party calendars + Bitcoin.
- **Fix:** Include in strengthened Limitation/Warranty section.

### R8 — 🟡 giveabit.io parent has no Terms
- Parent site has Privacy + Safe Harbour but no Terms of Service. As the family hub linking to paid products, it needs a Terms page (or at least an expanded Safe Harbour linking to product terms).
- **Fix:** Draft a parent-site Terms (short) or a consolidated family Terms.

### R9 — 🟢 Minor copy precision
- Counsel one-pager and evidence page already carry correct "is / is not." Carry the same discipline into all new paid-tier marketing copy.

### R10 — ✅ RESOLVED 2026-08-29: False Seychelles footer claim REMOVED
- Prior footer claimed **"GIVEABIT LTD. REGISTERED IN THE SEYCHELLES"** across all i18n. **Cam confirmed no such entity exists.**
- **Removed** the claim from all 7 language copyright strings (now: "© 2026 Give A Bit — family of Bitcoin-native tools. All rights reserved." — no entity, no jurisdiction). Also removed the misleading "Seychelles (Give A Bit HQ)" label from `JurisdictionPicker.jsx` and the "exceed eIDAS/ESIGN" overclaims in all 7 language legal footers.

### R4 — ✅ RESOLVED 2026-08-29 (entity): No entity; free non-commercial service
- Cam confirmed there is **no registered entity** for Satohash (or Give A Bit). Terms now use **[ENTITY TBD]** / **[GOVERNING LAW TBD]**. Server is in Germany. Identity intentionally undisclosed (anti-dox) pending product audit.
- **Paid-tier + SLA + billing clauses re-framed as forward-looking drafts only** — not live/enforceable, since the payment portal is not built. Terms add a "current status: free, non-commercial service" notice.
- Open for counsel: German Impressum/telemedia obligations for a free EU-facing service with no entity.

### R11 — 🟡 Premium pricing model mismatch (NEW, 2026-08-29)
- **Mission & Scope draft v3** frames premium services as "a small Lightning payment, on the order of tens of satoshis purely to cover hosting." The **exec summary + pricing page** currently advertise $29/mo Professional and $299+/mo Enterprise subscription tiers.
- Two different commercial models (micro-fee-per-stamp vs. subscription). The terms I drafted cover subscriptions + Lightning micro-fees; counsel must confirm which model launches so billing/refund/SLA language matches reality.
- **Fix:** Cam/counsel reconciles the pricing model; align exec summary, pricing page, and Terms.

---

## 3. What must change before the lawyer sits down

1. **Fix R1 everywhere** — remove unsubstantiated "compliance" claims. **✅ DONE 2026-08-29:** TrustCenter, EvidenceAdmissibility, Landing SVG, LegalValidator, TemplateLibrary, WebCapture, FAQ (en/es/fr/de/zh), landing i18n (7 langs), glossary pages (fr/zh), SEO keyword files (en + 6 langs), public pitch translations (6 langs), legal PDF generator — all rewritten to "supporting evidence / aligned / evidentiary." Compiled clean (esbuild EXIT 0 on all 7 edited JSX).
2. **Add R2 indemnity + R3 billing/refund/SLA sections** to Terms. **✅ DONE 2026-08-29:** implemented in `TermsOfService.jsx` (sections 04 Indemnification, 07 Paid Tiers/Billing/Refunds, 08 Enterprise SLA, 10 Dispute Resolution, 11 International & Data; strengthened 06 Limitation + No Warranty).
3. **Decide R4 entity + governing law** (Cam/counsel). **✅ RESOLVED 2026-08-29** — no entity; Terms carry [ENTITY TBD]; paid-tier clauses are forward-looking drafts. Remaining: counsel on German/EU obligations for a free EU-facing service (Impressum).
4. **Add R5 dispute resolution + R6 DPA note + R7 warranty tightening.** **✅ DONE** (in TermsOfService.jsx §10, §11, §06).
5. **Parent site Terms (R8)** — draft once Terms for Satohash is settled, reuse pattern.
6. **R10 Seychelles entity claim** — **✅ REMOVED 2026-08-29** (confirmed false by Cam; scrubbed from all i18n + JurisdictionPicker).

Drafted language for 2–7: see `TERMS-INDEMNITY-STRENGTHENING.md`.
Jurisdiction explainers (incl. LatAm + tax pillars): see `JURISDICTION-EXPLAINERS.md`.
What counsel must confirm: see `LAWYER-BRIEF.md`.

---

*This audit is a risk-management document, not legal advice. Final terms must be reviewed by qualified counsel in the relevant jurisdiction.*
