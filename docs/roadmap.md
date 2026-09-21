# Satohash Protocol Roadmap

> **Live product (2026-09-21):** stamp → `.ots` → verify (Bitcoin, not registry) → camera QR `https://satohash.io/p/{hash}`. Pending ≠ Confirmed. Optional NIP-07 who is shipped (not a legal name). Family widgets POST `/api/stamp`. Snapper, ZK, 3D Merkle, BOLT-12 are **not** current features. API live `21476f8`. Kimi: do not rebuild for copy.

## Next for the next LLM

1. **TadBuy (other repo):** dead same-origin `/api/*` on the static Pages demo.
2. **Cam:** pin `/watch` on `@give_bit`; iPhone `/p/` unfurl.
3. **Optional:** npm `@satohash/cli` if Cam asks.
4. **Do not:** API rebuild for copy; paywall; Arabic; Snapper-as-court-ready; M4 vault. Optional who is shipped — do not sell as legal identity.

SoT: `.ai_docs/current-status.md`.

This roadmap tracks the evolution of Satohash from a standalone notary tool to a **Global Sovereign Settlement Mesh**. Phase checkmarks below include cathedral items that are **not live** — do not pitch them as shipped.

## ✅ PHASE I: THE BASE CASE (COMPLETED)
1.  **[x] Bitcoin Anchoring**: Core OpenTimestamps integration.
2.  **[x] Multi-Party Signing**: Distributed signature flow for digital contracts.
3.  **[~] Localization**: Seven locales in the picker (EN, ES, FR, DE, PT, SW, ZH). **Not done.** Finish the whole site in these seven — plan in `docs/I18N.md`. Do not add Arabic until then.

## ✅ PHASE II: INSTITUTIONAL HARDENING (COMPLETED)
4.  **[x] The Satohash Snapper**: "Snap & Stamp" web evidence capture tool.
5.  **[x] Institutional UI**: Migration to premium Light-Mode/Indigo design system.
6.  **[x] Developer Portal**: Public API sandbox and institutional documentation.

## 🚧 PHASE III: IDENTITY & ORCHESTRATION (Q3-Q4 2026)
7.  **[x] NIP-05 Identity**: Verifiable identity links for contract signers (static nostr.json + Identity page).
8.  **[x] Proof DNA Widgets**: Embeddable, verifiable badges at /widgets + proof-dna.js v2.
9.  **[ ] Mobile Signer Pro**: Dedicated iOS/Android secure enclave signing app.
10. **[x] BOLT-12 Offers**: Native Lightning Network billing for automated anchoring.

## 🚀 PHASE V: SOVEREIGNTY ASCENSION — v5.0.0-ELITE (Q3 2026)
11. **[ ] API Apocalypse**: 20 backend upgrades — public stats, batch stamping, web capture, DID, co-signing, proof packages, SSE feeds
12. **[ ] Frontend Cathedral**: 20 UI mutations — particle hero, proof explorer, live network dashboard, QR scanner, pro wizard, command palette
13. **[ ] Bitcoin Thunder**: 15 deep chain integrations — local node verify, LNURL/BOLT12, Bitcoin SSE watcher, merkle proofs, HD wallet generator
15. **[ ] AI Notary**: 10 autonomous features — content summarization, fraud detection, semantic search, natural language stamping, template generation
16. **[ ] Social Proof**: 10 community features — proof wall, leaderboard, reactions, badges, social verify, email notifications
17. **[ ] Developer Ecosystem**: 10 SDK improvements — OpenAPI spec, npm client SDK, CLI tool, WebSocket, webhooks, rate limit tiers
18. **[ ] Polish & Ship**: Full test suite, **finish 7-locale i18n** (`docs/I18N.md`), complete `.ai_docs` refresh

## 🌐 I18N FINISH (active — Grok / M3, 2026-09)

Cam: whole site in the seven languages we already offer. Commit + push after each page.

| Slice | Status | Surfaces |
|-------|--------|----------|
| **A — product loop** | **[x]** `89262b1` | Stamp leftovers, Verify, `/stamp/done`, `/p/<hash>` SPA + zero-JS, Counsel, Status, Watch, nav/footer |
| **B — public marketing** | **[x]** | Donate, proof-pack, about, pitch, network, explorer/atlas **demos**, identity lookup, developer, exec, batch, trust, distressed-asset, `/nodes`, templates. Offers deferred. |
| **C — app / ops** | **[x]** | Chrome + template catalog field labels in 7 locales. Offers deferred. Snapper scaffold. |
| Catalog debt | **[x]** | en/es/fr/de/pt/sw/zh `translations/*.json` **250** keys. Stop growing inline `index.jsx` |

Gate: `npm run i18n:check`. Keep Bitcoin / OpenTimestamps / `ots-cli` / hash hex / Pending·Confirmed in English.

## 🔭 PHASE VI: VISION 2027 (The Sovereign Settlement Mesh)
19. **[ ] Fedimint Privacy Shields**: Using blinded tokens for zero-knowledge notarization.
21. **[ ] AI Notary Oracles**: Autonomous agents for real-time legal/logical validation of proofs.
22. **[ ] Decentralized Governance**: Transitioning protocol parameters to community-led governance.

---
*Status: I18N finish is active (Grok SPA). Vision 2027 still on the board. Phase III finalizing.*
