# AGENT Kimi — Satohash Training

## Your Identity
You are **Kimi**, the Give A Bit orchestration agent. You handle docs, automation, and cross-project coordination.

## Satohash — What You Need to Know

### The Pitch (simple)
Satohash lets anyone prove a document existed at a specific time by locking a cryptographic fingerprint into the Bitcoin blockchain using OpenTimestamps. The file never leaves your device — only the math fingerprint goes out. Proofs are permanent, free, and verifiable even if Satohash disappears.

### Version
**v4.1.0-ELITE (Build 8)** — LIVE at satohash.io and satohash.giveabit.io

### Four-Plane Architecture
1. **Proof** — SHA-256 → OpenTimestamps → Bitcoin block anchoring
2. **Identity** — Nostr NIP-05/NIP-07 key verification for signer provenance
3. **Settlement** — BOLT-12 Lightning reusable offers for frictionless payments
4. **Atlas** — Chain intelligence (mempool + on-chain monitoring)

### Key Features
- Zero-knowledge: documents never leave browser (Web Crypto API)
- Court-admissible: eIDAS + ESIGN compliant
- Free for basic use (OpenTimestamps — only Bitcoin TX fee when calendar commits)
- Multi-party contracts with co-signing
- Satohash Snapper browser extension for web evidence capture
- PWA: installable, offline-capable
- JSON-LD structured data for Google rich results
- 6 languages: EN, ES, FR, DE, PT, SW, ZH

### Tech Stack
- **Frontend:** Vite + React (SPA, BrowserRouter)
- **Styling:** Tailwind CSS + custom design tokens
- **Backend:** Express.js + better-sqlite3 + Socket.IO
- **Identity:** Nostr (NIP-05/NIP-07)
- **Payments:** BOLT-12 Lightning / L402
- **Deploy:** Cloudflare Pages (satohash.io)
- **GitHub:** github.com/kitsboy/satohash
- **Parent:** Give A Bit (giveabit.io)

### What GROK Built (July 5, 2026)
- Complete routing consolidation — all pages wired with legacy redirects
- 100 improvement items across 4 batches (routing, UX, tests, docs)
- Vitest + Playwright e2e tests, 20% coverage threshold
- PWA: manifest alignment, SW registration fix
- SEO: JSON-LD, Open Graph, Twitter/X cards, sitemap
- Design: theme toggle, empty states, skeletons, PIN modal
- Self-evolving docs pipeline

### What I (Hermes/Kimi) Did (July 6, 2026)
- Removed 10 conflicting/outdated docs that duplicated GROK's work
- Committed cleanup, pushed to GitHub, deployed (Build 8)
- Updated Twitter/X handle to @give_bit
- Updated Kimi agent profile card with new avatar
- Created this training document

### NIP-05 Identity
Kimi's Nostr NIP-05 handle: **kimi@giveabit.io**
Public pubkey hex: `076fbd672795bfba1f905084bbe05dcee4937aa1db995c2f87d616ea0f73f8d4` (see `src/config/mvp.js`).
Resolved via giveabit.io `/.well-known/nostr.json`. **Never store or request NSEC** in repo or chat — signing stays on M4 only.

### Roadmap — Phase III Active
- [/] NIP-05 Identity (in progress)
- [ ] Proof DNA Widgets (embed badges)
- [ ] Mobile Signer Pro (iOS/Android)
- [x] BOLT-12 Offers (done)

## Batch 3 Updates — July 6, 2026

### What Was Added
- TemplatesShowcase: public gallery at /templates with 14 templates, filters, search, recently viewed, preview modal
- TemplateDetail page: individual template view at /templates/:id
- NotFound: branded 404 page
- Accessibility CSS: reduced motion, focus-visible, touch targets, skeleton loading
- Pitch page: now renders from static /docs/*.md instead of backend API
- Sitemap: includes all pages, correct canonical URLs
- Kimi card: glowing border, NIP-05 verified badge, online status dot, DM hint
- robots.txt: fixed Sitemap URL to satohash.io

### What's Still Needed
- Backend server deployment (VPS) — without it, stamping, history, auth, forum don't work
- NIP-05 identity verification end-to-end
- Proof DNA Widgets
Mobile Signer Pro
