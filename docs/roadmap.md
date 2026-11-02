# Satohash Protocol Roadmap

> **Live product (2026-11-02):** stamp a file on the device → download `.ots` → verify on Bitcoin → share `https://satohash.io/p/{hash}`. Pending means on the way. Confirmed means a Bitcoin block sealed it. Stamps are free. Lightning billing is off. The file stays. Public calendars write the commitment. THOR bitcoind checks it (height 974,293, IBD done, on 2026-11-02). A home node joins that check only after it reaches the same tip. Do not point RPC at Umbrel while it is still downloading. API `gitSha` was `6b84073` before this website push. Paywall off. Do not rebuild for this copy.

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


### 2. Shipped 2026-11-02 — the path and the tools

The homepage says file stays, calendars write, our node checks. The live block number sits inside the check step, and the same three steps sit at the top of Network. Stamp, Verify, and Network are the main tools on desktop and in the phone menu. Templates are under More. Search does not offer L402 billing. Pricing is the three-column page again: the free stamp is open, and Professional (~2,100 sats/month, ~$29) and Business / Studio (~21,000 sats/month, ~$299) say coming soon. Those paid plans are not for sale.

### 3. Shipped 2026-11-02 — chapters, quiet install, honest prices

Chapter buttons on `/watch` seek the existing 70s film and the 10s teaser. The voice and pictures were not regenerated. The phone install hint is a quiet text line, and it only shows when the phone offers Add to Home Screen. Paid pricing cells that are not on sale say Planned. The three steps say a new stamp waits about an hour, and the block number is the tip. Network says Alice and Bob are enough when only Finney is down, and it warns when two calendars are down. The home-node switch rule is in `docs/ops-runbook.md`. Do not switch yet.

### 4. Shipped 2026-11-02 — compare page, phone path, one clock, payment prep

The compare page says Planned for BOLT-12, multi-party signing, and Snapper. On a phone the three steps sit above the film. The done page, the proof card, and the iMessage line use one sentence: a new stamp waits about an hour. The paywall still stays off. A typed payment header does not count. The paid path, once Cam turns it on, is capped at 20 stamps an hour. The free path stays 5 a minute. Thor is running API image `7c68076` with the flag false. The live stamp index backup is `/app/data/backups/satohash-2026-11-02T22-10-41-681Z.enc` inside the API container. The practice stamp is confirmed in Bitcoin block **974302**. The company name and the law still wait on Cam and Lenny. No charge until Cam says the word.

### 5. Next — public example only if Cam picks a file

7. **Public example.** Swap the homepage example only if Cam picks a file. Cam’s picture stamp stays private. Do not publish that filename.

### 6. Cam only

8. Pin `https://satohash.io/watch` on `@give_bit` when Cam wants. Paste-ready copy is in `docs/marketing/GIVE-BIT-X-PACK.md`. Agents cannot post as that account.
9. Look at the iPhone / iMessage preview of `/p/<hash>` after this Pages deploy. The card copy now says about an hour. Cam still confirms it on a phone.

### 7. Do not do yet

- Do not flip `REQUIRE_LIGHTNING`. Paywall stays off.
- Do not change live `/api/*` paths.
- Do not rebuild the API for a copy-only push. The payment-prep push does change `server/`. Rebuild that one with the flag still false.
- Do not point Bitcoin RPC at Umbrel until that node is at the same tip as THOR. LND stays off.
- Do not add Arabic.
- Do not sell Snapper, ZK redaction, 3D Merkle, BOLT-12, or L402 as live.
- Do not npm-publish `@satohash/cli` unless Cam asks.
- TadBuy’s dead same-origin `/api/*` is the TadBuy repo, not this API.

### 8. Kimi

Ingest `docs/KIMI-HANDOFF.md` and `docs/archive/SESSION-SUMMARY-2026-10-13-goodbye.md` into THOR Obsidian (MASTER-BRAIN / Kanban). Vault is on THOR, not M4. Pages stay Grok’s. Keep `REQUIRE_LIGHTNING=false`. After the payment-prep push, rebuild the API with that flag still false, then run `node scripts/backup-stamp-index.mjs` on THOR.

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
