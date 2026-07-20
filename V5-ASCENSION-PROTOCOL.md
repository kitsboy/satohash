══════════════════════════════════════════════════════════════════
SATOHASH v5.0.0-ELITE — THE SOVEREIGNTY ASCENSION PROTOCOL
══════════════════════════════════════════════════════════════════

Read GROK-SESSION-PROTOCOL.md first. Read .ai_docs/current-status.md.
The API is LIVE at https://api.satohash.io — SPA rebuilt with VITE_API_URL.
Build 114. This push takes us to Build 214. 100 major upgrades. ONE SHOT.

Rules:
- Every deployable change gets a build bump via `npm run version:bump`
- Push after every 10 items
- .ai_docs updated at the end
- docs/KIMI-HANDOFF.md appended at the end
- No secrets in git. No touching Caddy/nginx/VPS config.
- If something already exists, SKIP it — don't redo. Check first.

Build counter: starts at 114. After 100 items = Build 214.

───

# PHASE 1: API APOCALYPSE — Backend Goes Nuclear (items 1–20)

## 1. Public Stats Endpoint
Add `GET /api/public/stats` — 24h rolling stats: stamps_created, clients_active, avg_confirm_time, calendar_health. Cache 60s.

## 2. Paginated Stamp List
Add `GET /api/stamps` — paginated list of all stamps (public meta only: hash, status, created_at, no keys). Query params: `?page=&limit=&status=&client=`

## 3. Hash Lookup
Add `GET /api/stamps/:hash/by-hash` — lookup stamp by content hash instead of ID.

## 4. Batch Stamping
Add `POST /api/stamps/batch` — accept array of `{hash, filename}` objects (max 50). Returns array of stamp results.

## 5. Recent Stamps Feed
Add `GET /api/stamps/recent` — last 20 stamps with minimal fields for HQ real-time feed.

## 6. Server Uptime
Add `GET /api/public/uptime` — server uptime + last restart + total stamps lifetime.

## 7. Calendar Health Dashboard
Add `GET /api/public/calendar-status` — per-calendar health: last submission, last confirmation, response time ms.

## 8. Verification Endpoint
Add `POST /api/verify` — accept hash + optional .ots file in body (base64), return verification status (pending/confirmed/not_found). Local verify via OTS library if ots provided, else check DB.

## 9. Network Info
Add `GET /api/public/network` — Bitcoin fee estimate (mempool.space), block height, halving countdown.

## 10. Web Capture Stamp
Add `POST /api/stamp/webcapture` — accept URL, fetches page content, hashes it, stamps it, returns stamp + screenshot reference. Rate limited: 5/min.

## 11. Request ID Middleware
Add middleware: request ID (uuid) on every request, returned in response header `X-Request-Id`.

## 12. Structured Logging
Add pino-http structured request logging for all endpoints (ensure it's logging to stdout).

## 13. DID Document
Add `GET /api/public/did` — return satohash DID document: `did:web:api.satohash.io` with public key (generate once on startup, store in env).

## 14. File Upload Stamp
Add `POST /api/stamp/multihash` — accept file upload (multer, max 10MB), compute SHA-256 on server, stamp it, return hash + stamp ID + OTS file download link.

## 15. OTS File Download
Add `GET /api/stamps/:id/ots` — download the .ots file for a completed stamp.

## 16. Cache Headers
Add cache headers to all `GET /api/public/*` endpoints: `Cache-Control: public, max-age=60`.

## 17. Version Endpoint
Add `GET /api/public/version` — returns version string, commit SHA (from build-metadata), build number.

## 18. Co-Signing
Add `POST /api/stamp/cosign` — accept stamp ID + signature (hex), attach second signature to stamp record. Returns updated stamp.

## 19. Proof Package
Add `GET /api/stamps/:id/proof-package` — return JSON with all proof artifacts: hash, .ots link, merkle proof if available, block height, timestamp.

## 20. Stale Stamp Pruning
Add scheduled cron job (node-cron already imported): every 12h, prune stamps older than 365 days that are still "pending" (OTS never confirmed). Log count.

───

# PHASE 2: FRONTEND MUTATION — UI Becomes a Cathedral (items 21–40)

## 21. Particle Network Hero
New hero section for Landing: particle network background (three.js or canvas), each particle = a stamp. Gold for confirmed, blue for pending. Animates on scroll.

## 22. Proof of Existence Page
Add `/proof-of-existence` page — enter any hash, see its entire proof chain: OTS calendar path, block height, merkle root, visual chain-of-custody timeline.

## 23. Network Dashboard
Add `/network` page — real-time dashboard: live stamp counter, active clients map (hardcoded pin locations per client), OTS calendar health gauges, Bitcoin mempool fee chart.

## 24. Admin Metrics Dashboard
Add `/dashboard/metrics` — authenticated page (ADMIN_KEY header), shows per-client stamp counts, error rates, response time p50/p95, last 24h graph (Chart.js or recharts).

## 25. Theme Toggle Persistence
Add dark/light theme toggle persistence — store in localStorage, respect OS preference on first visit, add smooth transition animation.

## 26. Proof DNA Widget v3
Add embeddable iframe widget: `<iframe src="https://satohash.io/widget/proof/{hash}" />`. Show status badge + verify button + timestamp. Lightweight (<50KB).

## 27. Batch Verification Page
Add `/verify/batch` — paste up to 50 hashes (textarea or file upload), verify all at once, show table of results with green/red status dots. Export CSV button.

## 28. Drag-and-Drop Stamping
Add `/stamp/drag-and-drop` — drag-and-drop zone for files (not just URLs). File gets hashed client-side, then stamped. Show progress bar per file.

## 29. Live Stamp Feed (SSE)
Add `/stamp/live-feed` — Server-Sent Events endpoint (`GET /api/events/stamps`), frontend subscribes, shows real-time new stamps. Auto-scroll. Pause button.

## 30. QR Scanner
Add `/mobile-scanner` — camera-based QR code scanner for stamp hashes. Uses `navigator.mediaDevices`. Scan a proof QR → auto-verify.

## 31. Templates Masonry
Redesign TemplatesShowcase — masonry grid, category filters animate, hover shows stamp preview. Add "Quick Stamp" button on each template card.

## 32. Vault v2
Add Vault v2 — grid view (not list), thumbnail for stamped images, bulk select, batch export (.ots ZIP), search bar with autocomplete.

## 33. Comparison Tool
Add `/compare` — side-by-side comparison tool: paste two hashes, see a diff of their proof chains. Animated timeline merge view.

## 34. Pro Stamp Wizard
Add `/stamp/wizard-pro` — multi-step stamp wizard: step 1 (select file/hash/URL), step 2 (choose template overlay), step 3 (review + sign with Nostr key if available), step 4 (confirm + social share).

## 35. Global Command Palette
Add instant search (Cmd+K or Ctrl+K) — global command palette: search templates, stamps, pages, recent hashes. Framer-motion slide-in overlay.

## 36. API Playground
Add developer API playground — interactive Swagger/OpenAPI UI at `/developer/playground`. Load spec from `GET /api/openapi.json`. Try-it-now buttons.

## 37. Nostr Sign-In
Add Nostr key integration — sign in with Nostr extension (nip-07), show NIP-05 badge in header, allow stamping with signed Nostr event as proof of authorship.

## 38. History Timeline
Add `/history/timeline` — interactive horizontal timeline of every stamp the user has created. Scroll left-right. Click to expand.

## 39. Printable Proof Reports
Add `/stamp/{id}/report` — beautifully styled printable page with all proof artifacts, QR code, chain-of-custody diagram. Uses `@media print` CSS.

## 40. Accessibility Overlay
Add accessibility overlay — press `A` key to toggle high-contrast mode, font size controls, reduced-motion toggle. Persist preference.

───

# PHASE 3: BITCOIN THUNDER — Deep Chain Integration (items 41–55)

## 41. Bitcoin Node Health
Add `GET /api/public/bitcoin` — Bitcoin node health if `BITCOIN_RPC_URL` configured. Shows: block height, chain tip, peers, mempool count. Falls back to mempool.space API.

## 42. Bitcoin Fee Oracle
Add cache `GET /api/public/fee-estimates` from mempool.space (fastest, half-hour, hour, economy). Update every 60s. Return in `/api/public/network`.

## 43. Local Node Verification
Add `BITCOIN_RPC_URL` integration — when configured, verify stamps against local pruned node instead of public calendars. Add `/health?verify=bitcoin` deep check.

## 44. OP_RETURN Explorer
Add OP_RETURN explorer — show any OP_RETURN outputs associated with known stamp hashes. Link to block explorer.

## 45. LND Health Endpoint
Add `GET /api/public/lightning` — LND node status: synced to chain, channels, local balance, remote balance. Requires LND env vars.

## 46. LNURL-Pay Integration
Add LNURL-pay integration for stamp payments — generate LNURL for pay-per-stamp when `REQUIRE_LIGHTNING=true`. Use LNbits API. Feature-gated behind flag.

## 47. BOLT12 Offer Endpoint
Add `GET /api/public/offers` — return BOLT12 offer string for batch stamping. Use lnd for offer generation.

## 48. Stamp-to-Lightning Bell
Add Stamp-to-Lightning — when a stamp confirms (OTS done), optionally send a tiny Lightning payment (1 sat) as a "proof bell". Feature-gated.

## 49. Bitcoin Block Watcher (SSE)
Add `GET /api/events/bitcoin` — SSE endpoint that emits events on new blocks. Frontend shows "New Block!" toast.

## 50. Bitcoin Education Page
Add `/bitcoin` page — educational page: what is a Bitcoin timestamp, how OTS works, visual merkle tree diagram, embeddable explainer widget.

## 51. Partial Merkle Verify
Add lightweight JS function that proves a hash is in a Bitcoin block without downloading the full block. Use merkle proof from OTS calendar.

## 52. Block Explorer Page
Add `/block/{height}` page — show block info from local node or mempool.space API. Highlight any satohash stamps confirmed in that block.

## 53. HD Wallet Generator
Add HD wallet generator — generate a bitcoin address from a stamp hash (BIP32 derivation). Show address + QR code. For "prove you had the data before block N".

## 54. Taproot Verify Page
Add `/taproot-verify` — verify Taproot-based stamps (future OTS). Show script path vs key path spend. Educational page.

## 55. Bitcoin Dominance Widget
Add small dashboard card: BTC price (Coindesk API), dominance %, hash rate. Refresh every 5 min.

───

# PHASE 4: CROSS-CHAIN SUPREMACY — Beyond Bitcoin (items 56–65)

## 56. Cross-Chain Bridges Table
Fix `cross_chain_bridges` table — create the SQLite migration, wire it to the Ethereum bridge logic properly.

## 57. Ethereum Anchor
Add `POST /api/stamp/ethereum` — submit stamp hash to Ethereum calldata (Sepolia testnet first). Return tx hash + etherscan link.

## 58. Multi-Chain Proof View
Add `GET /api/stamps/:id/chains` — return proof across all chains: Bitcoin (OTS), Ethereum (calldata), Nostr (event id). Unified timeline view.

## 59. Polygon Bridge
Add Polygon testnet integration as secondary cross-chain anchor. Same pattern as Ethereum bridge.

## 60. IPFS Pinning
Fix IPFS pinning — stamps already generate CIDs. Pin to configurable service (Pinata, web3.storage). Add envs: `IPFS_PINNING_SERVICE`, `IPFS_API_KEY`.

## 61. IPFS Metadata Endpoint
Add `GET /api/stamps/:id/ipfs` — return full IPFS metadata: CID, gateway URLs (ipfs.io, pinata, dweb.link), pin status.

## 62. Nostr Proof Publishing Fix
Fix Nostr proof publishing — when stamp confirms, publish a Nostr event (kind 2727) with proof details. Fix relay connection errors.

## 63. Cross-Chain Verify Page
Add `/verify/cross-chain` — enter hash, see proof status on Bitcoin + Ethereum + Nostr. Green checkmarks per chain.

## 64. DID-Linked Proofs
Link stamp hash to a DID document. Return `did:web` URL in stamp response.

## 65. Filecoin Archive
Add `POST /api/stamp/archive` — for stamps older than 30 days, submit to Filecoin (via web3.storage) for long-term cold storage. Return deal ID.

───

# PHASE 5: AI NOTARY — Autonomous Intelligence (items 66–75)

## 66. AI Content Summary
When stamping a URL, use the `@anthropic-ai/sdk` (already in deps) to generate a 2-sentence summary of the page content. Store with stamp.

## 67. AI Summary Endpoint
Add `GET /api/stamps/:id/ai-summary` — return AI-generated summary + sentiment + key entities extracted from stamped content.

## 68. AI Notary Page
Add `/ai-notary` page — AI-powered notary assistant: "Is this document tampered?" Upload a PDF, get AI analysis of what changed between two versions.

## 69. AI Fraud Detection
Add `POST /api/verify/ai` — upload a document, AI checks for signs of tampering, deepfakes, or inconsistencies. Returns risk score.

## 70. Natural Language Stamping
Add `POST /api/stamp/natural` — "Stamp my contract with Bob about the house sale" → AI parses intent, generates metadata, stamps it.

## 71. AI Template Generator
Add `POST /api/templates/ai` — "Create a rental agreement template" → AI generates a notary template with fields. Returns template JSON.

## 72. Semantic Search
Add `GET /api/stamps/search?q=` — search stamps by AI summary content (not just hash). Full-text search on AI-generated descriptions.

## 73. AI Showcase Page
Add `/ai` page — showcase all AI features, demo playground, explainer on how AI + OTS = unbreakable proof.

## 74. Auto-Tagging
When stamping, AI suggests tags: "legal, contract, invoice, receipt, certificate". Store tags. Filterable in vault.

## 75. AI Proof Validator
Given two versions of a document, AI explains exactly what changed between them in natural language. "Section 3.2 was modified from $500 to $750".

───

# PHASE 6: SOCIAL PROOF — Community Layer (items 76–85)

## 76. Proof Wall
Add `/community/proof-wall` — public gallery of recent stamps (anonymized, hash only). Visitors see "proofs happening right now" — like a stock ticker.

## 77. Social Sharing Cards
Add `/stamp/{id}/share` — social sharing card with OG image: proof status, timestamp, hash preview. Generate OG image server-side.

## 78. Nostr Proof Feed
Subscribe to Nostr relay for custom kind (2727) events that reference satohash hashes. Show social proof activity.

## 79. Leaderboard
Add `/community/leaderboard` — top stampers (by count, anonymized hash prefix). "Most stamps this week/month/all time."

## 80. Stamp Reactions
Add emoji reactions to public stamps. Store in SQLite. Show reaction count.

## 81. Community Feed
Add `/community/feed` — hybrid feed: new stamps + AI summaries + community reactions. Infinite scroll.

## 82. Public Stamp Comments
Add comment field to public stamps. Support Nostr-signed comments (nip-07). Encrypted optional.

## 83. Badge System
Badges: "Genesis Stamper", "First 100", "OG Notary", "Cross-Chain Pioneer". Badges appear on profile/leaderboard.

## 84. Social Verify
Add `/verify/social` — verify a stamp shared on social media. Extract hash from tweet/post, verify it. One-click.

## 85. Email Notifications
When stamp confirms (pending→confirmed), send email via nodemailer (already in deps). Toggle in settings.

───

# PHASE 7: DEVELOPER ECOSYSTEM — SDK & API Gold (items 86–95)

## 86. OpenAPI Spec
Add `GET /api/openapi.json` — full OpenAPI 3.0 spec generated from route annotations. All endpoints documented.

## 87. Client SDK v2
`packages/satohash-client/` v2: TypeScript, full async/await, all endpoints, proper error types. Publish to npm as `@satohash/client`.

## 88. WebSocket Support
`/ws` endpoint using `ws` npm package. Events: `stamp.created`, `stamp.confirmed`, `block.new`. Auth via `X-Satohash-Key` query param.

## 89. CLI Tool
`packages/satohash-cli/` — npm package that installs `satohash` command: `satohash stamp file.txt`, `satohash verify <hash>`, `satohash status`, `satohash watch <hash>`.

## 90. Webhook Support
`POST /api/webhooks` — register a URL to receive POST callbacks on `stamp.confirmed`. Store in DB. Retry on failure (3x).

## 91. Rate Limit Tiers
Different rate limits per client: family=100/min, public=10/min, admin=1000/min. Return rate limit headers.

## 92. API Key Management
`POST /api/admin/keys` — generate, revoke, list API keys. Requires ADMIN_KEY. Keys stored hashed in DB.

## 93. Health Dashboard Component
`server/health-dashboard.js` — embedded HTML dashboard at `GET /health/ui` with charts, logs, status. Self-contained.

## 94. API Integration Test Suite
`tests/api/` — supertest tests for every endpoint. Run with `npm run test:api`. 90%+ coverage.

## 95. Docker Healthcheck Improvement
Add curl-based healthcheck to Dockerfile.api that exercises `/health` endpoint instead of just TCP check.

───

# PHASE 8: POLISH & CLOSE — Ship It (items 96–100)

## 96. Version Bump
Bump to 5.0.0-ELITE across package.json, build-metadata.json, CORS origins. Add 100-item CHANGELOG entry.

## 97. Full Test Suite
Run: `vitest run`, `playwright test`, `i18n:check`, `lint`. Fix any failures.

## 98. Full i18n Sweep
Ensure all new UI text has keys in all 7 locales (en, es, fr, de, pt, sw, zh). Run i18n:check. Fill gaps.

## 99. Doc Refresh
Update ALL `.ai_docs/*` — current-status, ecosystem-links, SOP, context-map, summary, kimi-training. Reflect v5.0.0-ELITE.

## 100. Final Handoff
Append to `docs/KIMI-HANDOFF.md`: v5 release entry with all 100 items, build number, SHA, decisions. Push to origin/main. Smoke test live site.

───

EXECUTION CONTRACT

- Start with item 1. Work forward. Don't skip.
- After item 10 → push: `git commit -m "v5 phase 1: API apocalypse (items 1-10)" && git push`
- After item 20 → push: `git commit -m "v5 phase 1 complete: API nuclear (items 11-20)" && git push`
- After item 30 → push: `git commit -m "v5 phase 2: frontend cathedral (items 21-30)" && git push`
- After item 40 → push: `git commit -m "v5 phase 2 complete: UI mutation (items 31-40)" && git push`
- After item 55 → push
- After item 65 → push
- After item 75 → push
- After item 85 → push
- After item 95 → push
- Item 100 = final push with handoff

IF something is already done → skip it, note it, DON'T redo. Check file contents before writing.

NEVER hardcode secrets. NEW env vars go in .env.example with change-me values and a comment.

SATOHASH V5. THE SOVEREIGNTY ASCENSION. GO.
