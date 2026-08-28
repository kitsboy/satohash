# Give A Bit — Parent-Site Terms of Service (DRAFT)

**Prepared by:** Lenny (Legal & Compliance, Give A Bit) · **Date:** 2026-08-29
**Target:** giveabit.io (the family hub / parent site that links to all product sites, incl. Satohash).
**Status:** Draft for counsel review. The family hub currently has a Privacy policy + Safe Harbour but **no standalone Terms** (R8 in the audit).
**Entity placeholder:** ⚠️ Replace `[OPERATING ENTITY]` with the confirmed legal entity (see §5) before publishing — do not ship with an unverified legal name.

> These Terms cover the **giveabit.io hub site** (navigation, educational content, links to product sites, contact form). Each product (Satohash, Katoa, SherpaCarta, etc.) has its own Terms, which govern when you use that product. This is the umbrella.

---

## 1. Acceptance of These Terms

By accessing or using the Give A Bit website (giveabit.io, the "Site"), you agree to these Terms of Service. If you do not agree, please do not use the Site.

**Plain language:** By using our site you're agreeing to these rules. We keep them short because we believe in plain language.

## 2. What This Site Is

Give A Bit ("we", "us", "[OPERATING ENTITY]") is a Bitcoin-native studio and educational hub. The Site provides:
- **Educational content** about Bitcoin, self-custody, digital sovereignty, and the Give A Bit family of tools;
- **Links and descriptions** of family products (Satohash, Katoa, SherpaCarta, MotoPass, and others), each operated under its own Terms and Privacy Policy;
- **Interactive tools** that run client-side in your browser; and
- A **contact form** for reaching our team.

We operate the Site for **educational and informational purposes only**. Nothing on this Site constitutes legal, financial, investment, or tax advice.

**Plain language:** This is a knowledge and connection hub, not a place to get legal or financial advice.

## 3. No Financial, Legal, or Investment Advice

Nothing on this Site is a recommendation to buy, sell, or hold any asset, including Bitcoin. We are not your financial advisor, broker, lawyer, or tax advisor. Any decisions you make about Bitcoin, self-custody, or digital assets are your own, and you bear full responsibility for them. Do your own research.

## 4. Third-Party Products & Links

The Site links to family products and external resources. Each product is a separate service with its own Terms and Privacy Policy. When you use a product, that product's Terms apply to you.

- We do **not** control, operate, or endorse the content of external third-party sites we link to.
- We are **not responsible** for your use of any third-party site, product, or service.
- Where the Site mentions tools that hold or transfer value (including Bitcoin and Lightning), those transactions are **non-custodial**: we do not hold your funds, keys, or assets.

**Plain language:** Our products are separate services. When you use them, their own rules apply — and we never hold your money or keys.

## 5. Operator & Contact

The Site is operated by **[OPERATING ENTITY]**.

- **Contact / privacy requests:** via the Site contact form or hello@giveabit.io.
- **Legal / abuse:** legal@giveabit.io.

> ⚠️ **Entity placeholder — DO NOT SHIP WITHOUT FILLING IN.** The operating entity must be confirmed by Cam/counsel before these Terms publish. See the Satohash LAWYER-BRIEF.md §5 Q9 (Seychelles claim) — the same entity confirmation applies here. Until confirmed, do not name an entity that may not exist.

## 6. Intellectual Property

The Give A Bit name, logo, branding, and the original content of this Site are owned by us and protected by applicable intellectual-property laws. You may not reproduce, distribute, or create derivative works from our branding or proprietary content without written permission.

Open-source tools and protocols we reference (Bitcoin, OpenTimestamps, Nostr, and others) remain under their respective licenses and are not owned by us.

**Plain language:** Our branding and writing are ours; open-source tech stays open-source.

## 7. Acceptable Use

You agree not to use the Site to:
- Violate any applicable law or regulation;
- Infringe the rights of any third party;
- Transmit malware, attempt unauthorized access, or disrupt the Site; or
- Misrepresent your identity or affiliation.

We may restrict or remove access to the Site, without notice, if you breach these Terms.

## 8. Disclaimers & Limitation of Liability

The Site is provided "as is" and "as available," without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, or non-infringement. To the maximum extent permitted by law, we are not liable for any indirect, incidental, special, or consequential damages arising from your use of the Site, including lost profits, data, or reputation.

Nothing in these Terms limits rights that cannot be limited under applicable law (including statutory consumer rights).

**Plain language:** The site is provided as-is, and we're not liable for how you use it.

## 9. Bitcoin & Non-Custody

If you choose to send Bitcoin or Lightning payments to any address displayed on this Site, those transactions occur entirely on the Bitcoin network. We do not operate a payment processor, do not hold your funds, and do not have access to your wallet or private keys. Bitcoin transactions are public and pseudonymous by nature — exercise appropriate privacy practices.

## 10. Governing Law & Disputes

These Terms are governed by the laws of **[GOVERNING JURISDICTION, per confirmed entity]** , without regard to conflict-of-law principles. Before filing any claim, you agree to contact us and allow 30 days to resolve the dispute informally. Disputes not resolved informally shall be brought in the courts of the governing jurisdiction, to the extent permitted by law.

## 11. Changes to These Terms

We may update these Terms to reflect operational or legal changes. The current version is always available at this URL. Continued use of the Site after changes take effect constitutes acceptance. Material changes that affect your rights will be noted with an updated effective date.

## 12. Safe Harbour

**Safe Harbour:** We operate this Site for educational and informational purposes related to Bitcoin and digital sovereignty. Nothing herein constitutes financial, legal, or investment advice. Bitcoin is a sovereign choice — do your own research, use your own judgment, and take full responsibility for your actions.

---

## Implementation notes (for Nova/M3)
- Add a `/terms` route + `Terms.jsx` component mirroring `Privacy.jsx` structure (same `PageShell` + `document-paper` styling), link from footer "Learn & Legal" (`src/data/footerNav.js`) alongside Privacy.
- Replace `[OPERATING ENTITY]` and `[GOVERNING JURISDICTION]` once Cam/counsel confirm the entity.
- The Site's existing `Privacy.jsx` Safe Harbour block already aligns with §12 — keep consistent.

---

*Prepared by Lenny for counsel review. Not legal advice. Do not publish until the entity placeholder is resolved and counsel signs off.*
