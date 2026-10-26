# Satohash Protocol Roadmap

Canonical copy: [`docs/roadmap.md`](docs/roadmap.md). This file stays in sync so either path shows the same order.

> **Live product (2026-10-13):** stamp on the device → `.ots` → Bitcoin verify → `/p/{hash}`. Stamps are free. Lightning billing is off. The file stays. SPA `4134150` (build 431) is the last confirmed product deploy. API `gitSha` `e814a57`. Paywall off. Do not rebuild for copy.

Do the next open item in [`docs/roadmap.md`](docs/roadmap.md), then the one after it.

## Upgrade in progress — do these first

1. **Done — plain words.** History, drop card, sign-in, and the file-stays lines. Do not redo.
5. **Chapter jumps** on the 70s film. Do not regenerate voice or pictures.
6. **Quieter phone install hint.**
7. **Public example** only if Cam picks a file. The picture stamp stays private.
8. **Cam:** pin `/watch` on `@give_bit`. Agents cannot post.
9. **Cam:** iPhone preview of `/p/<hash>`, later.

Do not flip the paywall, change `/api/*`, add Arabic, rebuild the API for copy, or sell Snapper, ZK redaction, 3D Merkle, or BOLT-12 as live.

## Archive phases (not the work order)

Old phase checkmarks below are not the work order. Snapper is a scaffold. BOLT-12 billing is off. Do not pitch them as shipped.

## ✅ PHASE I: THE BASE CASE (COMPLETED)
1.  **[x] Bitcoin Anchoring**: Core OpenTimestamps integration.
2.  **[x] Multi-Party Signing**: Distributed signature flow for digital contracts.
3.  **[~] Localization**: Seven locales in the picker (EN, ES, FR, DE, PT, SW, ZH). **Not done.** Finish the whole site in these seven — plan in `docs/I18N.md`. Do not add Arabic until then.

## ✅ PHASE II: INSTITUTIONAL HARDENING (COMPLETED)
4.  **[ ] The Satohash Snapper**: Scaffold only. Do not sell as a shipped court tool.
5.  **[x] Institutional UI**: Migration to premium Light-Mode/Indigo design system.
6.  **[x] Developer Portal**: Public API sandbox and institutional documentation.

## 🚧 PHASE III: IDENTITY & ORCHESTRATION (Q3-Q4 2026)
7.  **[x] NIP-05 Identity**: Verifiable identity links for contract signers (static nostr.json + Identity page).
8.  **[x] Proof DNA Widgets**: Embeddable, verifiable badges at /widgets + proof-dna.js v2.
9.  **[ ] Mobile Signer Pro**: Dedicated iOS/Android secure enclave signing app.
10. **[ ] BOLT-12 Offers**: Not live. Stamps are free. Lightning billing is off.

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
| **B — public marketing** | **[x]** | Public marketing + demos + templates. Offers deferred. |
| **C — app / ops** | **[x]** | Chrome + template catalog. Offers deferred. Snapper scaffold. |
| Catalog debt | **[x]** | en/es/fr/de/pt/sw/zh `translations/*.json` **250** keys. Stop growing inline `index.jsx` |

Gate: `npm run i18n:check`. Keep Bitcoin / OpenTimestamps / `ots-cli` / hash hex / Pending·Confirmed in English.

## 🔭 PHASE VI: VISION 2027 (The Sovereign Settlement Mesh)
19. **[ ] Fedimint Privacy Shields**: Using blinded tokens for zero-knowledge notarization.
21. **[ ] AI Notary Oracles**: Autonomous agents for real-time legal/logical validation of proofs.
22. **[ ] Decentralized Governance**: Transitioning protocol parameters to community-led governance.

---
*Status: 2026-10-13. The work order is the upgrade list at the top and in `docs/roadmap.md`. Phase VI is vision, not current work. BOLT-12 and Snapper are not live.*
