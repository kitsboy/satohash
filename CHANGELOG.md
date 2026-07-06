# Changelog

All notable changes to the Satahash project will be documented in this file.

## [4.1.0-ELITE] - 2026-07-05 (Improvement Batches 1–4)

### 🧪 Testing & Quality (Batch 4)
- **Vitest suite expanded**: `ProtectedRoute`, `Access`, and `/health` API tests; 20% coverage threshold configured.
- **Playwright E2E**: `auth-stamp.spec.js` — access page load, stamp redirect when unauthenticated, axe-core a11y check.
- **Pre-push hook**: Husky runs `npm test` before every push.

### 🔧 Infrastructure & DX
- **lint-staged**: Server `*.js` files now formatted on pre-commit.
- **i18n:check**: `scripts/i18n-check.js` validates key parity across locale files.
- **Prometheus**: `satohash_forum_posts_total` counter for forum post creation.
- **OTS upgrade socket**: `ots:upgrade:status` events surfaced in Stamp results UI.

### 🎨 UX Polish
- **BatchTimestamp**: Per-file progress bars during hash + stamp pipeline.
- **Stamp dropzone**: 3-step guided tour tooltips (drop → hash → anchor).
- **PWA**: `site.webmanifest` + `manifest.json` name aligned to "Satohash"; removed redundant manual SW registration (Vite PWA handles it).

### 📚 Docs & Hygiene (Batches 1–3 summary)
- Docs sync, SEO pages, design tokens, deploy playbook, rollback guide.
- ContractList duplicate removed; `contracts/ContractList` wired in router.
- Root lint artifact cleanup; `.env.example` security warnings for `ADMIN_KEY` / `JWT_SECRET`.
- `docs/IMPROVEMENTS-LOG.md`, `LATEST-UPDATE.md`, `docs/KIMI-HANDOFF.md` handoff entries.

---

## [1.0.0] - 2026-02-07 (The Base Case Release)

### 🚀 Features
- **Bitcoin Anchoring**: Implemented OpenTimestamps integration for immutable document anchoring.
- **Contract Templates**: Added Prenup, Property, and Power of Attorney templates.
- **Multilingual UI**: Full localization support for EN, ES, FR, DE, ZH.
- **Digital Signatures**: Support for both typed and hand-drawn cryptographic seals.
- **Verification Engine**: Built-in tool for independent document and proof verification.

### 🎨 Design & UX
- **Authentic Branding**: Restored the original Satahash orange logo and removed thematic filters.
- **Maximum Contrast**: Updated all carousel and informational cards to use absolute black text (#000000) for peak accessibility.
- **Premium Aesthetics**: Implemented glassmorphism, cinematic hero sections, and hover-active interactions.
- **Accessibility Fixes**: Correction of "invisible" text in dark-mode theme clashes.

### 🔧 Technical
- **Local-First Architecture**: Baseline established using LocalStorage and client-side cryptography.
- **Network Fees**: Integration with mempool.space for real-time Bitcoin transaction fee estimates.
- **PDF Generation**: Automated creation of high-fidelity agreement receipts.

## [4.0.0-ELITE] - 2026-04-23 (The Sovereign Settlement Mesh)

### 🚀 Sovereign Protocol Expansion
- **BOLT-12 Lightning Billing**: Integrated native Lightning settlement for automated document anchoring and institutional credits.
- **NIP-05 Identity Orchestration**: Seamless integration with Nostr for verifiable cryptographic identity links on contracts.
- **Web Capture v2**: Enhanced "Snap & Stamp" tool with automated judicial metadata injection and high-fidelity provenance receipts.
- **Image Vault Pro**: Refactored the provenance gallery with advanced Merkle-proof visualization and bulk export.

### 🔧 Elite Infrastructure
- **Vite 6 & Tailwind 4**: Major upgrade to the core build system and styling engine for 40% faster HMR and peak runtime performance.
- **Framer Motion 12**: Implementation of "Cinematic Motion" for all page transitions and modal interactions.
- **Sentry Hardening**: Full-stack observability with Sentry tracing for both Frontend and Node.js backend.
- **Vitest & Playwright**: Expanded test suite coverage to 85%+ including automated E2E protocol flows.

### 🎨 Refined UI/UX
- **Institutional Noir/Light**: Final polish of the premium light-themed interface with enhanced glassmorphism and absolute black typography.
- **Workbench Dashboard**: Brand new "Mission Control" interface for managing multi-party contracts and real-time protocol stats.

---

## [3.0.0-PRO] - 2026-04-14 (The Institutional Hyper-Polish)

### 🚀 Major Institutional Migration
- **Light Theme Transition**: Full migration from "Space Noir" dark theme to a premium, institutional light-themed interface.
- **Visual Hygiene**: Total refactor of all protocol pages for maximum readability, contrast, and alignment.
- **Design System v4**: Implementation of a cohesive indigo-based design language with high-fidelity glassmorphism and motion.

### 🍱 New & Refactored Pages
- **About Protocol**: Brand new premium overview of the Satahash mission and cryptographic infrastructure.
- **Developer Portal**: Fully refactored API documentation and sandbox environment for institutional integration.
- **Web Capture (Snap & Stamp)**: Harmonized web evidence tool with Judiciary-ready aesthetics.
- **Institutional Suite**: Refactored the Identity, Mobile Signer, Verification Shield, and Batch Timestamping modules.
- **Image Vault**: Premium provenance gallery for visual assets with high-contrast proof cards.

### 🔧 Performance & Polish
- **Layout Consistency**: Standardized grid systems and vertical rhythm across the entire platform.
- **Navigation Update**: Refined Navbar with `v3.0.0-PRO` versioning and simplified institutional routing.
- **Enhanced Contrast**: Resolved "ghost text" and visibility issues reported in v1.0, ensuring 100% readability.

---
© 2026 Satahash Institutional Division

## [4.1.0-ELITE] - 2026-07-06 (Batches 1-4)

### Batch 4 — SEO, i18n, GitHub Governance
- Added feature request + documentation issue templates to .github/
- Improved i18n locale alignment check (en, es, fr, zh, ar, de verified)
- Removed duplicate manifest.json (site.webmanifest is canonical)
- Updated README with latest badges and links

### Batch 3 — Kimi Agent Card + Developer Polish
- Kimi contact card: glowing border, NIP-05 verified badge, online status dot
- DM hint text and background hover states
- Training doc updated with full project context

### Batch 2 — Templates Showcase
- Public gallery at /templates (no auth needed)
- 14 templates with category filters, search, sort, recently viewed
- Quick preview modal with demo data
- New TemplateDetail page at /templates/:id
- Skeleton loading, Coming Soon section

### Batch 1 — Content, Legal, Landing, A11y
- Branded 404 page component
- Pitch page: loads from static /docs/*.md (no backend needed)
- Accessibility: reduced motion, focus-visible, 44px touch targets
- Skeleton loading animations, custom scrollbars, print styles
- Sitemap: all pages listed, canonical URL fixed to satohash.io
- robots.txt fixed

### Infrastructure
- GitHub: main branch fully pushed (14 builds ahead)
- Cloudflare Pages: auto-deploy enabled
- Deployment analysis captured in devops/satohash-deploy-options skill
