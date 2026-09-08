# Satohash SKU freeze — live vs staged

**Status:** FROZEN 2026-09-08 (Grok M3), per Lenny legal gate `t_b56fa721` (Kimi 2026-09-02).  
**Private ruling (do not copy into this public repo):** `/root/hq/docs/satohash-auto/ENTITY-TERMS-DONATE-RULING.md` on THOR / `kitsboy/HQ`.  
**Paywall:** `REQUIRE_LIGHTNING=false`. Do not flip.

This is the public SKU list. Anything not in **Live now** is staged or blocked. Do not sell, invoice, or label as paid until the gates in §3 are all true.

---

## 1. Live now

| SKU | What it is | Word on the site | Money |
|-----|------------|------------------|-------|
| **S0 Free stamp / verify / `.ots`** | Client-side SHA-256 → OpenTimestamps → Bitcoin. No account. | Free. Never paywalled. No daily quota. Abuse rate-limit only (5 stamps/min public, 30/min with API key). | $0 |
| **S1 Donate** | Gratuitous Lightning/on-chain tip. Breez `satohash@breez.tips` + on-chain address on `/donate`. | **Donate.** Honest: optional, does not buy a feature. | Voluntary |

Do **not** rename S1 to subscription, membership, or Proof Pack.

---

## 2. Staged — built in code, not for sale

| SKU | Sketch | May go live only when |
|-----|--------|------------------------|
| Professional ~2,100 sats/mo | Vault / API / webhooks (planned) | §3 gates |
| Business / Studio ~21,000 sats/mo | Teams / white-label sketch | §3 gates |
| Pay-per-use API 1–5 sats/stamp (L402) | Developer rail | §3 gates |
| Enterprise | Custom, partner-gated, not marketed | Entity + contract + Cam |

Copy may describe these as **built and staged**. Checkout, invoices, and “buy now” stay off.

---

## 3. Gates before any paid SKU

All four, in order. Skip none.

1. **Entity + governing law** filled in Terms (`[ENTITY TBD]` / `[GOVERNING LAW TBD]` today). Cam/counsel — not an agent.
2. **Lightning rail funded and tested** (LND / L402). Collection actually works.
3. **Cam flips** `REQUIRE_LIGHTNING=true` on THOR and says so in chat. Grok/Kimi do not guess.
4. **Word flip:** every payment-gated feature is **subscription** or **purchase**. **Never “donate.”** Activate Terms §07 (paid tiers / billing / refunds).

Until then: free service Terms as drafted are enough. Paid clauses in Terms are forward-looking drafts — fine to publish, not live.

---

## 4. Blocked (do not sell)

| Item | Why |
|------|-----|
| **S2 Proof Pack as paid** | Lenny: keep as **free waitlist** until entity + email infra exist. |
| Labeling L402 / paywall as **donate** | Deceptive practice; unenforceable refund waiver; false-advertising. |
| Inventing a German **Impressum** with a name/address | No registered entity; Cam anti-dox. Counsel item, not a footer hack. |
| Publishing giveabit.io parent Terms with `[OPERATING ENTITY]` | Draft lives in `PARENT-SITE-TERMS.md` (R8). Ship on the parent site only after the entity is real. |

---

## 5. Honesty rules (copy)

- Do not claim “2,400 professionals” or any user count we do not measure. Live social proof is **stamp count from `metrics.json`**.
- Do not claim a **10/day cap**. That quota was never implemented.
- Donate stays donate. Paid stays paid — when it exists.
- Safe Harbour stays on every public doc: educational, not legal/financial advice. Satohash is evidence of existence-at-a-time, not a notary, QTS, or e-signature.

See `docs/legal/AUTO-90-DAY-CALENDAR.md` for the 90-day sequence.
