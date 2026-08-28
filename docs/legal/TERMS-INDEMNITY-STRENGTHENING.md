# Satohash — Strengthened Terms Language (Indemnity + Liability + Paid-Tier Clauses)

**Prepared by:** Lenny (Legal & Compliance, Give A Bit) · **Date:** 2026-08-29
**Target:** Drop into `src/pages/legal/TermsOfService.jsx` (and matching i18n `legalPages.*` strings) ahead of premium-services launch.
**Status:** Draft for counsel review — do not ship without counsel sign-off.

> These are plain-language contract clauses. They are drafted to be fair and readable (per the family voice), but they are **not** a substitute for a lawyer's review in the governing jurisdiction.

---

## 1. Indemnification (NEW section — R2)

> Replace the absence of indemnity. Insert as a dedicated section between "What You Agree To" and "Intellectual Property."

**Section — Indemnification**

You agree to indemnify, defend, and hold harmless Satohash, Give A Bit, and our respective officers, directors, employees, agents, and contributors from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to:

1. your use of the Service, including any document, hash, or content you submit or timestamp;
2. your breach of these Terms, including the representations and warranties in the "What You Agree To" section;
3. any claim that your timestamped content or your use of the Service infringes the rights of a third party or violates applicable law; or
4. your reliance on any proof or output of the Service in a manner inconsistent with these Terms or our published educational materials.

This indemnification survives termination of your use of the Service. We may, at our option, assume the exclusive defense and control of any matter subject to indemnification; if we do, you agree to cooperate with us and not settle any such matter without our prior written consent.

**Plain language:** If your use of Satohash causes a problem for someone else, you take responsibility for it — not us.

---

## 2. Strengthened Limitation of Liability (R7)

> Amend the existing "Limitation of Liability" section. Keep the 12-month cap, add explicit no-warranty on confirmation/timeliness and third-party dependency.

**Additional bullets for the existing list:**

- We do not warrant that any stamp will be confirmed in Bitcoin by any particular time, or at all. **Pending** means submitted to OpenTimestamps calendars; **Confirmed** means a Bitcoin block includes the attestation. Confirmation depends on third-party calendars and the Bitcoin network, which are outside our control.
- Because a Bitcoin-anchored proof is only as strong as the original file, we are not liable for your failure to preserve the original document bytes or your .ots proof file.
- We are not responsible for the acts or omissions of third-party OpenTimestamps calendars, Bitcoin miners, nodes, or network participants.
- Our proofs are not guaranteed to be accepted as evidence by any court, tribunal, or regulator in any jurisdiction. We provide a technical tool, not a legal service.

**Add explicit warranty-disclaimer clause (in addition to the "as is" box):**

**No Warranty.** TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY, OR THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT STAMPS WILL CONFIRM IN A PARTICULAR TIME. THE ENTIRE RISK ARISING OUT OF USE OF THE SERVICE REMAINS WITH YOU. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES, SO SOME OF THE ABOVE EXCLUSIONS MAY NOT APPLY TO YOU.

---

## 3. Subscription, Payments & Refunds (NEW — R3)

**Section — Paid Tiers, Billing & Refunds**

1. **Subscriptions.** Professional and Enterprise tiers are billed on the periodic basis shown at sign-up (monthly unless otherwise agreed). Subscription fees are non-refundable except as set out below.
2. **Automatic renewal.** Unless you cancel before the end of the current billing period, your subscription renews automatically at the then-current price. You may cancel at any time in your account settings or by contacting hello@giveabit.io; cancellation takes effect at the end of the current paid period and does not entitle you to a pro-rated refund except as required by law.
3. **Free tier.** The free tier is offered without charge, subject to reasonable usage limits published in the application. We may adjust or discontinue the free tier with reasonable notice.
4. **Price changes.** We may change prices for paid tiers with at least 30 days' notice. Continued use after the price change takes effect constitutes acceptance of the new price.
5. **Refunds.** If a paid Service feature fails materially and we cannot remedy it within 30 days of written notice, you may request a refund of the fees paid for the then-current period for the affected feature. All refund requests are handled at our discretion unless required by law. Nothing in this section limits any statutory consumer rights you may have.
6. **Payments & Lightning.** Where a payment is made via Lightning Network (L402 / BOLT-12), the transaction is final and irreversible by design of the Bitcoin network. Refunds, where available, are issued as new payments, not chargebacks.
7. **Taxes.** You are responsible for any taxes applicable to your use of the Service.

**Plain language:** Paid plans auto-renew monthly until you cancel. Free stamps stay free. If a paid feature breaks and we can't fix it in 30 days, we'll consider a refund. Lightning payments can't be reversed — that's the point.

---

## 4. Service Level Agreement — Enterprise (NEW — R3, quantified)

**Section — Enterprise SLA (summary for Terms; full SLA by separate agreement)**

For Enterprise accounts, we offer a best-efforts service availability target of **99.5% monthly uptime**, measured against the public status of the core stamping and verification endpoints, excluding scheduled maintenance and force majeure.

**Remedy.** If we fail to meet the availability target in a calendar month, you may request a service credit equal to **5% of that month's Enterprise fee** for each full percentage point (or partial) below the target, up to a maximum of **20% of the monthly fee**. Service credits are applied as a discount to the next billing cycle and are your sole and exclusive remedy for availability failures. This SLA does not guarantee confirmation times for individual stamps, which depend on third-party calendars and the Bitcoin network.

**Plain language:** Enterprise gets a 99.5% uptime promise. If we miss it, you get a discount off the next month — but not cash for any individual stamp delay.

> ⚠️ **Counsel note:** Do not ship a bare "SLA" label on the pricing page without this quantification, or the word "SLA" becomes an open-ended promise.

---

## 5. Dispute Resolution (NEW — R5)

**Section — Dispute Resolution**

1. **Informal resolution first.** Before filing any claim, you agree to notify us in writing at hello@giveabit.io and give us 30 days to resolve the dispute informally.
2. **Governing law & forum.** These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict-of-law principles. Subject to the informal-resolution step, any claim not resolved informally shall be brought exclusively in the state or federal courts located in Delaware, and you consent to the personal jurisdiction of those courts.
3. **Small claims.** Either party may bring an individual claim in small-claims court if it qualifies, rather than through the courts referenced above.
4. **No class actions.** To the extent permitted by law, disputes shall be resolved on an individual basis; you waive the right to participate in any class or representative action against us.
5. **Survival.** This section survives termination of these Terms.

> **Counsel note:** Arbitration is an option we deliberately did NOT include as mandatory — for a small, privacy-first operator, informal resolution + Delaware forum + class-waiver is simpler and lower-cost than running an AAA arbitration. Add binding arbitration only if counsel recommends it for your risk profile.

---

## 6. International & Data Note (NEW — R6, compact DPA-flavored)

**Section — International Use & Data**

- The Service may be used from any jurisdiction where such use is lawful. You are responsible for complying with the laws of your jurisdiction, including any export-control or sanctions requirements that may apply to your use.
- Satohash processes only the minimal metadata described in our Privacy Policy (primarily hashes and optional labels). It does not process document contents. For Enterprise customers who require a data-processing agreement, we will provide a short DPA confirming this posture on request at hello@giveabit.io.
- Blockchain data (Bitcoin) is public by nature. Once a hash is committed, it is permanent and outside our control.

---

## 7. Entity & Effective Date (R4 — pending Cam/counsel)

- Replace "**Satohash Inc.**" with the **actual legal entity** that operates the service (see LAWYER-BRIEF.md §2 — this is an open decision).
- Bump **Effective Date** and **Last Reviewed** to the launch date; add a version note (e.g., "v5.0.0-ELITE legal, rev 2026-08").

---

*Drafted by Lenny for counsel review. Not legal advice. Verify all caps-clauses against the governing law before publication.*
