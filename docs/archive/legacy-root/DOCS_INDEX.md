# Satohash Documentation Index

**Last updated:** 2026-06-10 (local authoritative copy; GitHub sync pending)

This index helps humans, agents (Claude, Kimi, Goose), and contributors quickly find the right document.

## Primary Handoff & Business Documents (for Kimi / stakeholders)
- [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md) — Robust business overview, problem/solution, features, market, advantages. **Primary artifact for handoff.**
- [MARKETING.md](./MARKETING.md) — Positioning, audiences, messaging, growth channels, brand voice.
- [MARKETING_FLYER.md](./MARKETING_FLYER.md) — One-page / printable marketing summary with ASCII art and feature table.
- [FINANCIALS.md](./FINANCIALS.md) — Cost structure, revenue projections, unit economics, risks (approximate planning numbers only).
- [PRODUCT_PITCH.md](./PRODUCT_PITCH.md) — The "Sovereign Provenance Mesh" deep pitch, four-plane architecture, Give A Bit synergy, F.O.S.S. philosophy, premium use cases.

## Technical & Protocol
- [OTS_SETUP.md](./OTS_SETUP.md) — Full explanation of OpenTimestamps, calendars used, verification steps, independent proof validation.
- [AI_INTEGRATION.md](./AI_INTEGRATION.md) — How to connect ChatGPT Actions, Claude tools, Make, Zapier, n8n, Python, Node, curl. Critical for agentic workflows.
- [DEPLOY-PLAYBOOK.md](./DEPLOY-PLAYBOOK.md) — Specific production commands (may be host-specific; review before use).

## Root-Level (high signal)
- [../README.md](../README.md) — Public entry point, quickstart, architecture snapshot, legal notes.
- [../CLAUDE.md](../CLAUDE.md) — Authoritative guide for AI coding agents (commands, architecture, endpoints, env vars, design decisions). Update when stack changes.
- [../SECURITY.md](../SECURITY.md) — Vulnerability reporting (email kimi@giveabit.io first).
- [../CHANGELOG.md](../CHANGELOG.md) — Historical releases (v1 base case → v3 institutional → v4.1 ELITE sovereign settlement).
- [../ROADMAP.md](../ROADMAP.md) — Phased plan (Phase III identity in progress, Vision 2027 mesh).
- [../DESIGN.md](../DESIGN.md) — Four-plane model, information architecture, Institutional Noir visual system, state machines.
- [../LAYOUT.md](../LAYOUT.md) — Responsive standards, containers, mobile-first, accessibility.
- [../PROTOCOL.md](../PROTOCOL.md) — Cryptographic attestation spec, Lightning/Nostr layers, security & compliance.
- [../REBUILD_PROMPT.md](../REBUILD_PROMPT.md) — Historical prompt used for the v4 Elite rebuild (useful context).
- [../STATUS.md](../STATUS.md) — Minimal cleanliness marker + current notes.

## Other
- `public/api/openapi.json` — Live OpenAPI 3 spec served at `/api-docs` (Swagger UI).
- `server/swagger.js` + routes — Backend API surface.
- Extension: see `extension/satohash-snapper/` (browser "Snapper" for forensic web capture; add context in future).

## Quick Navigation by Audience
- **Legal / Executive / Kimi handoff**: Start with EXECUTIVE_SUMMARY → PRODUCT_PITCH → MARKETING → FINANCIALS.
- **Developers / AI agents**: CLAUDE.md first, then AI_INTEGRATION.md, OTS_SETUP.md, openapi.json.
- **Deployers**: DEPLOY-PLAYBOOK.md + root README + Dockerfile + ecosystem.config.cjs.
- **Contributors**: CONTRIBUTING.md (to be expanded), SECURITY.md, CLAUDE.md, PR template in .github/.

## Notes on Organization (2026-06-10)
- The project deliberately keeps a small number of high-value root `.md` files for discoverability.
- Most detailed handoff/business material lives in `docs/`.
- Root technical specs (DESIGN, PROTOCOL, LAYOUT, etc.) may be consolidated into `docs/architecture/` in a future pass; for now they remain at root to match historical references and CLAUDE.md pointers.
- Local filesystem at `/Users/cam/projects/satohash` is the most current source of truth (GitHub push did not fully land).

*Maintained for seamless handoff and long-term sovereignty tooling.*
