# KIMI REQUEST — Satohash Bitcoin treasury (on-chain + Lightning)

**From:** Grok (M3) · satohash  
**To:** Kimi (THOR / LNbits) + HQ Vault ops  
**Priority:** Medium-high — product donations / tips currently share a **non-product** on-chain address  
**Product:** **Satohash** only (not SherpaCarta, not Motopass)  
**HQ glass:** https://hq.giveabit.io  

---

## Why

Satohash SPA still hard-codes a shared suite address in `src/config/constants.js` (`BTC_ADDRESS`).  
We need a **dedicated Satohash wallet plane**:

| Plane | Use |
|-------|-----|
| **On-chain (L1)** | Tips, larger donations, cold-friendly receive |
| **Lightning (L2)** | Micro-tips, LNURL-pay / LUD-16 for mobile wallets |

Proof stamping stays free/family-tier as designed. This request is for **voluntary support / treasury**, not for paywall invoice keys on every stamp (unless Cam later enables `REQUIRE_LIGHTNING`).

---

## What Kimi must provision

### 1. LNbits wallet named for Satohash

- Create (or confirm) wallet **`satohash`** on THOR LNbits  
- Distinct from `sherpacarta`, suite default, or personal wallets  
- Label in LNbits / HQ: **Satohash · OTS proof plane**

### 2. On-chain receive address (L1)

- Derive/export a **public** Bitcoin receive address for that wallet (or dedicated funding source Kimi documents)  
- Prefer **bc1… (native segwit)** mainnet  
- Confirm it is **Satohash-only** receive (not Sherpa treasury, not Give A Bit parent unless Cam decides otherwise)  
- Optional: note change/xpub policy in HQ Vault only (never git)

### 3. Lightning public receive (L2)

- Enable **LNURL-pay** on the satohash wallet  
- Prefer **LUD-16** of the form:  
  `satohash@giveabit.io`  
  (or `tips@…` / product-scoped alias Kimi documents — **must resolve publicly**)  
- Optional: long **LNURL** string as backup for wallets that don’t do Lightning Address  
- CORS / public reachability same class as other suite LN endpoints (Caddy / Tailscale already pattern for LNbits)

### 4. Secrets → HQ Vault only (never git, never chat)

Store **only** in HQ Vault / THOR secrets (https://hq.giveabit.io vault patterns):

| Secret | Where |
|--------|--------|
| LNbits admin / invoice / read keys for wallet `satohash` | HQ Vault |
| Any funding xprv / seed / admin macaroon | HQ Vault / offline only |
| Internal LNbits wallet id | HQ Vault + ops notes |

**Never** commit invoice keys, admin keys, or seeds to `kitsboy/satohash`.

### 5. Public handback package (what Kimi returns to Grok/Cam)

When ready, document on **HQ** and paste a **status-only** note into satohash `docs/KIMI-HANDOFF.md` (or HQ handoffs feed):

```text
SATOHASH_WALLET_HANDBACK
status: ready | blocked
on_chain_address: bc1…          # public receive only
lud16: satohash@giveabit.io     # public Lightning Address
lnurl_pay: LNURL1…              # optional public
mempool_url: https://mempool.space/address/<bc1…>
lnbits_wallet_label: satohash
smoke: on-chain test? lightning test invoice paid?
hq_vault: keys stored (yes/no) — do not paste keys
notes: …
```

Also mirror public fields in HQ product registry if that is how suite wallets are tracked (same discipline as other products).

### 6. Grok publishes **only after** that handback

Grok on M3 will wire public fields into:

| Location | What goes public |
|----------|------------------|
| `src/config/constants.js` | `BTC_ADDRESS`, `LN_ADDRESS` / `LUD16` (public only) |
| `src/pages/Landing.jsx` | Donation modal — on-chain + Lightning |
| `src/components/DesktopAppNav.jsx` | QR `bitcoin:` + optional LN QR |
| `src/pages/Contribute.jsx` | Support / tip section if present |
| Optional `public/data/wallets.json` | Machine-readable public receive endpoints |
| `docs/HQ-FEED.md` / metrics links | No secrets; optional “support” link |

Until handback: **do not invent** addresses; keep current placeholder marked non-final or leave unchanged.

---

## Acceptance smoke (Kimi)

1. **On-chain:** address shows on mempool.space; zero or test dust optional  
2. **Lightning:** create LNURL-pay / LUD-16 → pay tiny amount from a phone wallet → LNbits balance ticks  
3. **Isolation:** funds do not land in Sherpa wallet  
4. **HQ Vault:** invoice/admin keys present; **not** in GitHub  
5. **Handoff:** public triple (bc1, lud16, optional lnurl) written for Grok  

## Acceptance smoke (Grok after handback)

1. Landing donation shows **Satohash** on-chain + L2  
2. Copy + QR use the new values  
3. `git grep` for old shared address removed from product UI constants  
4. No LNbits keys in repo  

---

## Explicitly out of scope

- Enabling stamp paywall (`REQUIRE_LIGHTNING`) — separate Cam decision  
- Customer refunds / multi-sig redesign  
- Publishing admin/invoice keys anywhere public  

---

## One-line for Kimi

**Stand up LNbits wallet `satohash` with public on-chain + LUD-16/LNURL-pay; vault the keys on HQ; hand Grok only public receive details so satohash.io can tip/donate without sharing Sherpa’s treasury.**

— Grok · M3 · satohash · 2026-07-27
