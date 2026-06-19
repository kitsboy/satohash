# satohash - Status

**Last cleaned / prepped:** 2026-06-10 (local authoritative tree)

This project is under clean Git management on the `main` branch.

## Current Snapshot Notes (for Kimi handoff & future agents)
- **Local FS is source of truth**: `/Users/cam/projects/satohash` as of 2026-06-10. Recent push to https://github.com/kitsboy/satohash did not fully land. Reconcile GitHub later.
- **Recent work staged**: Enhanced executive + marketing docs (EXECUTIVE_SUMMARY, MARKETING, new FINANCIALS + MARKETING_FLYER) + new elite UI components (Bolt12InvoiceDrawer, MempoolTicker, NostrSigner, PdfCustomizer, ZKRedactionTool updates, useOfflineSync hook, AppShellNoir refinements).
- **Added during this prep pass (no app code disturbed)**:
  - `LICENSE` (was missing despite MIT badge)
  - `docs/ARCHITECTURE.md` (synthesized four-plane reference)
  - `docs/CONTRIBUTING.md`, `docs/QUICKSTART.md`, `docs/DOCS_INDEX.md`
  - `extension/satohash-snapper/README.md`
  - `SOURCE-OF-TRUTH.md` + `KIMI-HANDOFF-satohash-2026-06-10.md` (per giveabit-project-handoff skill)
  - Major embellishments to README.md, EXECUTIVE_SUMMARY.md, MARKETING*.md, FINANCIALS.md, and cross-links.
- **Known root cruft** (harmless, historical):
  - `lint_output.txt`, `lint_results.txt`, `lint_staged_output.txt` (empty or old)
  - `src/pages/Developer.jsx.bak`
  - `build-metadata.json`
  These can be cleaned in a dedicated hygiene pass; documented so they don't surprise anyone.
- **Docs organization**: Root retains high-signal historical files (DESIGN.md, PROTOCOL.md, CLAUDE.md, etc.). Deeper business/handoff material and new synthesized docs live in `docs/`. See `docs/DOCS_INDEX.md` for the map. Future tidy-up could move more specs under `docs/architecture/` without breaking references.
- **Version alignment**: Handoff docs now consistently reference 4.1.0-ELITE / four-plane model. Older root docs (ROADMAP, CHANGELOG, etc.) left as historical records.
- **Key handoff artifacts ready**: EXECUTIVE_SUMMARY + PRODUCT_PITCH + MARKETING + FINANCIALS + ARCHITECTURE + SOURCE-OF-TRUTH + dated KIMI-HANDOFF. Simple pitch and two-machine instructions included.

**Next after handoff**: Re-push / reconcile with GitHub, optional root cruft sweep, continue Phase III identity/orchestration work per ROADMAP.

Maintained for seamless Kimi / Give A Bit Master Brain continuity.

---

*Mathematics > signatures. Bitcoin as global truth layer.*

