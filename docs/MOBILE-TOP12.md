# Mobile Top 12 — shipped 2026-08-10

| # | Item | Where |
|---|------|--------|
| 1 | Sticky one-thumb stamp CTA | `StampStickyBar` on `/stamp` |
| 2 | Camera / gallery / file pickers | Stamp dropzone (all viewports) |
| 3 | Share sheet + QR | `StampSuccessActions` + Web Share |
| 4 | Success route (no double-submit) | `/stamp/done` |
| 5 | Deep-link family preview | `data-testid=deep-link-banner` |
| 6 | Giant pending/confirmed pill | `ProofStatusPill` |
| 7 | Safe-area + 16px inputs | `src/index.css` + sticky bar |
| 8 | Verify ELI-5 toggle | `VerifyEli5` on `/verify` |
| 9 | PWA icons + `start_url=/stamp` | `site.webmanifest`, `/icons/*` |
| 10 | Mobile e2e | `tests/e2e/mobile-stamp-loop.spec.js` |
| 11 | Lighthouse mobile gate | `npm run lh:mobile` |
| 12 | Empty/error + proof package | `EmptyState`, `proofPackage.js` |

**Graphics:** Imagine → `public/icons/icon-*.png`, `public/media/ui/empty-proof.jpg`
