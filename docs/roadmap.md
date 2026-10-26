# Satohash Protocol Roadmap

> **Live product (2026-10-13):** stamp a file on the device → download `.ots` → verify on Bitcoin → share `https://satohash.io/p/{hash}`. Pending means on the way. Confirmed means a Bitcoin block sealed it, about an hour later. Stamps are free. Lightning billing is off. The file stays on the device. Optional NIP-07 who is shipped and is not a legal name. Player is the ~70s film. SPA `4134150` (build 431) is the last confirmed product deploy. API `/health` ok, `gitSha` `e814a57`, paywall off. Kimi: do not rebuild for copy. If `6c8ae2e` is only on THOR, do not push it.

SoT: `.ai_docs/current-status.md` · session `docs/archive/SESSION-SUMMARY-2026-10-13-goodbye.md`.

Do the next open item, commit, and push. Then take the one after it. Do not skip into “Do not do yet.”

## Upgrade in progress — do these first

### Shipped this arc (do not redo)

- ~70s explainer is the player. Voice is Kokoro Isabella. Quiet bed. Old 83.5s file stays in place and is not the player.
- Security, trust, glossary, about, comparison, and the executive-summary card say the file stays.
- Glossary Lightning and BOLT-12 say stamps are free and Lightning billing is off. Terms stay English.
- Dashboard Lightning row is gone. Status rows and the side column follow the language picker. Dark Vault, Bitcoin, `.ots`, AES-256-GCM, API, eIDAS, ESIGN, and UETA stay English.
- Sign-in share text and the trust chip say the key stays on the device. `4134150` is live (`/b/index-Bt__WPpD.js`).

### 1. Shipped  — plain words (do not redo)

1. History says “Recent stamps”, not the raw key.
2. The drop card says “Stamp a file”. Dark Vault stays English.
3. Sign-in says the key stays on this device. It is not a payment.
4. Review, batch, and the privacy lines say the file stays. No redaction pitch.


### 2. Next — calmer film and phone

5. **Chapter jumps** on `/watch` for the 70s film. Do not regenerate the voice or the pictures.
6. **Quieter phone install hint.** Keep the play button easy to reach. Do not add a louder install card.
7. **Public example.** Swap the homepage example only if Cam picks a file. Cam’s picture stamp stays private. Do not publish that filename.

### 3. Cam only

8. Pin `https://satohash.io/watch` on `@give_bit` when Cam wants. Paste-ready copy is in `docs/marketing/GIVE-BIT-X-PACK.md`. Agents cannot post as that account.
9. Check the iPhone / iMessage preview of `/p/<hash>`. Deferred until Cam has the phone.

### 4. Do not do yet

- Do not flip `REQUIRE_LIGHTNING`. Paywall stays off.
- Do not change live `/api/*` paths.
- Do not rebuild the API for copy. Do not push THOR-only `6c8ae2e`.
- Do not add Arabic.
- Do not sell Snapper, ZK redaction, 3D Merkle, BOLT-12, or L402 as live.
- Do not npm-publish `@satohash/cli` unless Cam asks.
- TadBuy’s dead same-origin `/api/*` is the TadBuy repo, not this API.

### 5. Kimi

Ingest `docs/KIMI-HANDOFF.md` and `docs/archive/SESSION-SUMMARY-2026-10-13-goodbye.md` into THOR Obsidian (MASTER-BRAIN / Kanban). Vault is on THOR, not M4. Pages stay Grok’s. Keep `REQUIRE_LIGHTNING=false`.

## Archive phases (not the work order)

The phases below are old notes. Several checked items are **not live**. Snapper is a scaffold. BOLT-12 billing is off. Do not pitch them as shipped.

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
| **B — public marketing** | **[x]** | Donate, proof-pack, about, pitch, network, explorer/atlas **demos**, identity lookup, developer, exec, batch, trust, distressed-asset, `/nodes`, templates. Offers deferred. |
| **C — app / ops** | **[x]** | Chrome + template catalog field labels in 7 locales. Offers deferred. Snapper scaffold. |
| Catalog debt | **[x]** | en/es/fr/de/pt/sw/zh `translations/*.json` **250** keys. Stop growing inline `index.jsx` |

Gate: `npm run i18n:check`. Keep Bitcoin / OpenTimestamps / `ots-cli` / hash hex / Pending·Confirmed in English.

## 🔭 PHASE VI: VISION 2027 (The Sovereign Settlement Mesh)
19. **[ ] Fedimint Privacy Shields**: Using blinded tokens for zero-knowledge notarization.
21. **[ ] AI Notary Oracles**: Autonomous agents for real-time legal/logical validation of proofs.
22. **[ ] Decentralized Governance**: Transitioning protocol parameters to community-led governance.

---
*Status: 2026-10-13. The work order is the upgrade list at the top. Phase VI is vision, not current work. BOLT-12 and Snapper are not live.*
