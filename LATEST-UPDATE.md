# satohash — Last Updated 2026-07-07 by Hermes (M4)

**Previous update:** 2026-07-06 — Docs cleanup & organization  
**This update:** 2026-07-07 — Builds 14-36: Content, Social, A11y, Polish

### What Was Done (24 Builds Today)
- **Documentation hub**: /docs with 22 docs, 5 categories, static DocViewer, ToC, breadcrumbs, ratings, print, GitHub edit links
- **New pages**: FAQ (14 Qs), Pricing (3 tiers), Comparison (4-way matrix), Security (5 sections), Guides (4 articles), Glossary (18 terms), Integrations (API + code samples)
- **Templates**: Public gallery, 14 templates, category filters, search, autocomplete, sort, recently viewed, preview modal, detail page
- **Kimi**: Contact modal with Email/NIP-05 choice, glowing card, verified badge, online status
- **Social sharing**: usePageMeta hook — dynamic OG + Twitter tags on every page (12 unique)
- **A11y**: skip-to-content, focus-visible, reduced motion, high-contrast, print styles, aria-expanded on FAQ
- **UX**: BackToTop button, card 3D lift, input focus ring, skeleton shimmer, button spinner
- **SEO**: BreadcrumbList JSON-LD, sitemap (18 pages), canonical satohash.io, robots.txt
- **Privacy**: Removed /Users/cam/ paths from public docs
- **Footer**: Links to FAQ, Pricing, Guides, Glossary, Integrations, Security, Documentation
- **Builds**: 14 through 36 deployed

### Live
- satohash.io — v4.1.0-ELITE (Build 36)
- GitHub: fully pushed (origin/main)
- Docs: all 22 .md files served statically (no backend needed)

### Still Needed
- Backend server deployment (VPS per kanban card t_50bac963)
- Phase III: NIP-05 identity, Proof DNA Widgets, Mobile Signer Pro
- Server-dependent features (stamp, auth, history, vault) need Express backend
