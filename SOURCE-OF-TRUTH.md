# SOURCE-OF-TRUTH.md — Satohash

**Generated for Kimi hand-off (Give A Bit project)**  
**Date:** 2026-06-10  
**Machine:** M3 (current dev) → M4 HERMES / Obsidian vault via Tailscale

## Project Identity
- **Name:** Satohash (v4.1.0-ELITE "Sovereign Settlement Mesh")
- **One-line:** Bitcoin-native, zero-knowledge document timestamping and multi-party cryptographic notarization platform anchored to OpenTimestamps + Bitcoin.
- **Folder (authoritative):** `/Users/cam/projects/satohash`
- **GitHub (intended source of truth):** https://github.com/kitsboy/satohash.git
  - **Important:** A recent push attempt did not fully land. **The local filesystem here is the most current version as of 2026-06-10.** Treat local as primary until GitHub is reconciled.
- **Live URLs:** https://satohash.io and https://satohash.giveabit.io
- **Parent:** Give A Bit (https://giveabit.io) — Bitcoin-native software studio.

## Deployment & Infra Snapshot
- **Frontend:** React 18 + Vite 6 + Tailwind CSS 4 + Framer Motion (Institutional Noir design language)
- **Backend:** Node/Express + SQLite (better-sqlite3 + Knex migrations) + Socket.io
- **Build output:** `dist/` served statically by Express in production.
- **Dev:** `npm run dev` (concurrently runs server on 3001 + Vite on 3000 with proxy)
- **Prod managers:** PM2 (ecosystem.config.cjs), Docker / docker-compose, deploy.sh
- **Hosting notes:** Cloudflare Pages mentioned in older docs; current deploys often direct Node/PM2 or container on VPS/Umbrel-style hosts (see docs/DEPLOY-PLAYBOOK.md for host-specific paths).
- **Key env:** See `.env.example` (ADMIN_KEY, SNAPPER_KEY, NOSTR_SECRET_KEY, OTS_CALENDARS, etc.)
- **Observability:** Sentry (Node + React), Pino, Prometheus `/metrics`
- **Real-time:** Socket.io events for `ots:stamped`, `ots:collaborated`, etc.
- **PWA + Extension:** Service worker, webmanifest, and `extension/satohash-snapper/` (forensic "Snap & Stamp" browser capture tool).

## Git Snapshot (at time of handoff prep + update-kimi)
- Branch: main
- Ahead of origin/main by 1 commit
- **Current status (post review pass):**
  - Modified: README.md, STATUS.md, docs/EXECUTIVE_SUMMARY.md (MM), docs/MARKETING.md (MM)
  - Added/modified in docs/: FINANCIALS.md (A), MARKETING_FLYER.md (A)
  - Original staged app changes (still present): AppShellNoir.jsx (M), new Bolt12InvoiceDrawer.jsx, MempoolTicker.jsx, NostrSigner.jsx, PdfCustomizer.jsx, updated ZKRedactionTool.jsx, new useOfflineSync.js
- Untracked (new handoff deliverables from this pass):
  - LICENSE, SOURCE-OF-TRUTH.md, KIMI-HANDOFF-satohash-2026-06-10.md
  - docs/ARCHITECTURE.md, docs/CONTRIBUTING.md, docs/DOCS_INDEX.md, docs/QUICKSTART.md
  - extension/satohash-snapper/README.md
- Recent commit: 324b3cd "Add STATUS.md - project cleaned"
- Full recent log available via `git log`.

**Note:** The "update-kimi satohash" command was used to refresh these handoff records after the full folder review, organization improvements, and embellishments were completed.

## Key Local Documentation (source of truth files)
**Business / Handoff (primary for Kimi):**
- `docs/EXECUTIVE_SUMMARY.md`
- `docs/MARKETING.md`
- `docs/MARKETING_FLYER.md`
- `docs/FINANCIALS.md`
- `docs/PRODUCT_PITCH.md`

**Technical / Agent guides:**
- `README.md` (root)
- `CLAUDE.md` (the most important file for any coding agent — commands, architecture, endpoints, env, design decisions, known inconsistencies)
- `docs/AI_INTEGRATION.md`
- `docs/OTS_SETUP.md`
- `docs/DEPLOY-PLAYBOOK.md`
- `docs/ARCHITECTURE.md` (newly added in this prep for clarity — synthesizes DESIGN + PROTOCOL + CLAUDE)
- `docs/CONTRIBUTING.md`, `docs/QUICKSTART.md`, `docs/DOCS_INDEX.md` (added)
- Root specs: `DESIGN.md`, `LAYOUT.md`, `PROTOCOL.md`, `ROADMAP.md`, `SECURITY.md`, `CHANGELOG.md`, `REBUILD_PROMPT.md`, `STATUS.md`

**Other artifacts:**
- `public/api/openapi.json` (served Swagger)
- `public/Satohash_Executive_Pitch.pdf`, `Satohash_Layman_Tutorial.pdf`
- `extension/satohash-snapper/` (with its own README added)
- `bin/satohash.js` (starter CLI)
- `server/migrations/` (SQL history showing multi-tenancy, webhooks, referrals, etc.)

## Simple Everyday Marketing Pitch (use exactly in Obsidian / with Hermes)
Satohash is a free, open-source tool that lets you prove a digital document, photo, contract, AI output, or webpage existed at a specific moment by locking a tiny secret fingerprint of it into the Bitcoin blockchain using OpenTimestamps. 

The actual file never leaves your computer — only the math fingerprint goes out. Later, anyone in the world can check the proof file and be mathematically certain the original hasn't been changed since that exact time. 

It's like a global, tamper-proof, courthouse-grade notary that costs almost nothing, requires no middleman or subscription for basic use, and works even if Satohash disappears tomorrow. 

Built by Give A Bit to bring Bitcoin's ultimate trust machine to real problems lawyers, creators, journalists, developers, and AI agents face every day: proving when something was true.

## Mission Alignment (Give A Bit values)
- Privacy-first / zero-knowledge by design (PYNYM-adjacent thinking, no document custody).
- Bitcoin sovereignty (proof-of-work as the ultimate timestamping commons via OTS).
- Lightning micropayments (BOLT-12 / L402 native settlement).
- Nostr identity (NIP-05/07) for signer provenance without fragile email.
- Open source, self-hostable, auditable.
- Safe Harbour / legal infrastructure for the decentralized era.
- Always link back to giveabit.io as the parent studio.

## Recent Changes / What's New in This Snapshot (v4 Elite direction)
- Major UI components for institutional flows: live Mempool ticker, BOLT-12 invoice drawer, Nostr signer integration, advanced PDF customizer for courtroom exports, enhanced ZK redaction that preserves Bitcoin anchors on redacted docs, offline sync hook.
- AppShellNoir refinements.
- Documentation push: richer executive, marketing, financial, and flyer artifacts explicitly for Kimi handoff.
- Ongoing four-plane architecture (Proof / Identity / Settlement / Atlas).

## Known Gaps / Improvements Noted (do not block handoff)
- GitHub remote is behind local (re-push / force or manual reconciliation needed later).
- Root directory has some historical cruft (empty lint_*.txt files, a Developer.jsx.bak, build-metadata.json). Documented in STATUS.md and DOCS_INDEX.md. Safe to ignore or clean in a dedicated pass.
- Some root-level design docs (DESIGN.md etc.) could eventually move under `docs/architecture/` for tidiness, but left in place for now to avoid breaking any internal references.
- Version strings vary slightly across docs (some still say "v2.0"); the handoff docs have been updated toward 4.1-ELITE.
- No full SOC2 or formal legal opinion letters yet (as expected for this stage).
- DEPLOY-PLAYBOOK.md contains host-specific paths (Umbrel-style) — treat as example, not universal.

## Files Created / Updated During This Prep Pass (2026-06-10)
- LICENSE (was completely missing despite MIT badge in README)
- docs/DOCS_INDEX.md (new navigation hub)
- docs/QUICKSTART.md (new)
- docs/CONTRIBUTING.md (new)
- docs/ARCHITECTURE.md (new synthesis)
- extension/satohash-snapper/README.md (new)
- SOURCE-OF-TRUTH.md (this file)
- KIMI-HANDOFF-satohash-2026-06-10.md (self-contained prompt for Kimi)
- Enhanced: README.md, docs/EXECUTIVE_SUMMARY.md, docs/MARKETING.md, docs/MARKETING_FLYER.md, docs/FINANCIALS.md, STATUS.md (notes), and cross-links.

**Update via "update-kimi satohash" command (same session):** Handled full project folder review for best organization, added all missing docs identified, made executive summary + marketing docs robust, followed giveabit-project-handoff skill to produce clean Kimi payload. All changes are documentation + handoff artifacts only — no app source code was modified.

## Update History
- **2026-06-10 (initial prep):** Full review + embellish pass completed. Handoff files generated.
- **2026-06-10 (update-kimi satohash):** Refreshed SOURCE-OF-TRUTH and KIMI-HANDOFF after verification of all new files and git state. Confirmed local is authoritative. Ready for sync to M4 / Obsidian.

## Next Actions Recommended for Kimi / Hermes (see also the KIMI-HANDOFF file)
1. Ingest this SOURCE-OF-TRUTH + the dated KIMI-HANDOFF file + the key docs/ files into the Obsidian vault.
2. Update MASTER-BRAIN.md, any project Kanban / architecture maps, and cross-reference with other Give A Bit projects (e.g. Tadbuy).
3. Educate yourself and Hermes on the four-plane model, ZK + OTS invariants, BOLT-12 + Nostr integration points, and the "Institutional Noir" design language.
4. Note that local FS is current; watch for future GitHub sync.
5. Add weekly reminder prompt for user to run context updates / ask 3 useful questions.

## Confirmation
When Kimi processes the handoff prompt, she should reply confirming:
- Files integrated into vault / MASTER-BRAIN
- Specific updates made (e.g. "Added Satohash to project map, updated architecture section with four planes, noted GitHub lag...")
- Any questions or gaps she spots.

---

**This file + the KIMI-HANDOFF companion are the official hand-off record.**  
Everything else in the folder is supporting material. Local disk is source of truth until further notice.

Maintained in the spirit of the giveabit-project-handoff skill.
