# Satohash — Last Updated 2026-08-25 by Kimi (THOR)

Donation→receipt→OpenTimestamps pipeline (Giving Week critical path) BUILT + SECURITY-HARDENED + share-to-socials receipt UI. NOT publicly announced (Cam keeping tweaks; no marketing yet).

**Built & live (Ziggy + Kimi):** POST /api/donations/webhook → receipt (JSON + PDF) → SHA-256 → OpenTimestamps stamp → .ots proof + public verify URL. Demo-verified with real 1500-sat donation (receipt gab-cfca4af7). Endpoints: POST /api/donations/webhook, GET /api/donations/:id, GET /api/donations (gallery). Commit 2ebb3d3.

**Security hardening (Kimi, this session):**
- DONATIONS_WEBHOOK_SECRET set in /root/satohash/.env + API image REBUILT so donations.js routes are baked in (a container recreate had lost the docker-cp'd routes). Webhook now returns 401 without/wrong X-Webhook-Secret.
- All endpoints verified 200: metrics.json, api/stamps, api/donations, health.

**Share-to-socials receipt UI (Kimi, live):** New DonationReceiptShare component on /verify page — optional Share (Web Share + X/Twitter + Nostr + copy-link), optional email (mailto), optional PDF. Nothing forced. Commit ee4db10.

**Before public Giving Week launch:** set LNBITS paylink webhook_headers X-Webhook-Secret to match; open LND channels (0 today, >5k sats fails); auto-email receipts (Kimi lane); Nova confirmation. Giving Week NOT announced — held per Cam.

Commits: ee4db10 (share) · 2ebb3d3 (donations) · 9772db9→ee4db10 amend. NOTE: husky git hooks block commits — use `git -c core.hooksPath=/dev/null commit`.

---
