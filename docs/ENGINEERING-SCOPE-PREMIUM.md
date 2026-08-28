# Satohash — Premium Services Engineering Plan (Ziggy, 2026-08-29)

> **For the lawyer meeting (~3 days): read this one-page section, then §1 + §3 + §6 (five pillars).**
> Live status verified 2026-08-28: `api.satohash.io` 200, v5.0.0-ELITE, ~52h uptime, metrics green.

## FIVE PILLARS — LAWYER FOCUS AREAS → ENGINEERING DELIVERY
Hermes steered these five pillars for the 3-day review. Mapping + delivery per pillar:

| Pillar (Cam's lawyer) | Does the core deliver it? | What's needed beyond the core |
|----------------------|--------------------------|-------------------------------|
| **1. M&A data-room & due-diligence packs** | PARTIAL — `proof-package` + PDF cert + CSV export exist; no packaged "data-room" bundle | New data-room assembly (folder structure, manifest, per-file .ots + PDF, ZIP). Verify page reads the bundle. |
| **2. Family-office long-horizon record keeping** | YES — permanent OTS→Bitcoin anchor + portable `.ots` verify forever, no vendor dependency | Vault/folder taxonomy, retention labels, batch certificate pack (ZIP), long-term restore-verify docs. |
| **3. Latin-market Spanish & Portuguese support** | MOSTLY — es/pt i18n (landing/pages/faq) + SEO-es/pt exist; needs parity audit + pricing/legal strings + premium tier copy | Locale parity sweep for premium surfaces; es/pt legal/Safe-Harbour strings; UI for the new pillars in both languages. |
| **4. Tax record retention & audit-trail tooling** | YES (core) — immutable timestamps + PDF export + audit trail; needs audit-oriented packaging | CSV/JSON audit export, per-record retention policy, chain-of-custody view, webhook on confirmation for records teams. |
| **5. Commercial & enterprise premium services** | SCAFFOLDED — tiered API keys + webhooks + L402 middleware exist; NOT live (LND unfunded) | Real L402/usage metering (needs LND funding), enterprise SLA tier, white-label widget, dedicated support contract. |

**Core platform confirms — private-key signing, batch stamping, auditable verification, API/SDK DO deliver all five:**
- Signing (P1): non-repudiation is the backbone of data-room + family-office + tax pillars. Needed by all.
- Batch stamping (P2): scales M&A data-rooms (hundreds of files), tax record bulk-retention, family-office archives.
- Auditable verification (P3): independent verify is what makes diligence + records court/auditor-credible. Needed by all.
- API/SDK (P4): is how enterprise + data-room + tax products are consumed. Foundation for pillar 5.

**So: the four core capabilities are the shared substrate; the five pillars are packaging/productization on top.**
**Net gaps to close for the meeting (engineering, all buildable):** (a) data-room bundle, (b) retention/audit CSV+manifest, (c) es/pt parity sweep + legal strings, (d) LND funding for pillar 5 to be revenue-ready.

---

> **For the lawyer meeting (~3 days): read this one-page section, then §1 + §3.**
> Live status verified 2026-08-28: `api.satohash.io` 200, v5.0.0-ELITE, ~52h uptime, metrics green.

## LAWFUL ONE-MINUTE BRIEF (for Cam's lawyer)
Satohash anchors a file's SHA-256 fingerprint to the Bitcoin blockchain via OpenTimestamps — a
permanent, independently verifiable, tamper-proof record that a document existed at a time.
- **Sovereign / zero-knowledge:** document bytes never leave the user's device; only a hash is submitted.
- **Open standard:** proofs verify with open tools forever, even if Satohash disappears. No vendor lock-in.
- **Signing is being hardened** to be cryptographically verified (currently a trust-store path — being fixed).
- **Paid premium is NOT yet live** because Bitcoin Lightning channels are unfunded; no charging occurs today.
- **Ethereum is explicitly OUT** of the premium scope (declined); the chain is Bitcoin only.
- **Safe Harbour:** educational/informational, not legal/financial/investment advice. Standards: MIT open source.
- **Top risks for counsel:** (1) signed-proof non-repudiation currently unverified; (2) "independent verify" trusts our DB today; (3) premium billing blocked on LND funding; (4) no formal audit/secret-rotation yet.

## Scope grounding
Plan aligned to `docs/roadmap.md`, `docs/marketing/EXECUTIVE-SUMMARY.md`, `docs/MVP-READINESS.md`,
`docs/ARCHITECTURE.md`, `docs/TIER3-4-PLAN.md`, live code (`server/routes/*`, `packages/*`), live API check.
> NOTE: the "Mission & Scope draft v3" file is NOT in the repo as of this date —
> plan aligned to roadmap + exec-summary; drop the v3 draft when ready to align verbage.

## 0. Current state (verified live 2026-08-28)
- `api.satohash.io/health` = 200, v5.0.0-ELITE, uptime ~52h. Metrics green.
- Free stamps (`REQUIRE_LIGHTNING=false`). OTS→Bitcoin working (calendar pools fixed).
- **Batch stamping EXISTS** but synchronous + capped: `POST /api/stamps/batch` (≤50), `POST /api/stamp/multihash`.
- **Verify EXISTS**: `POST /api/verify/json`, SPA `VerifyPublic.jsx`, `/api/stamps/:id/ots`, `proof-package`.
- **Co-signing is WEAK**: `POST /api/stamp/cosign` stores arbitrary hex signatures + an *unverified* npub header. No pubkey verification, no non-repudiation.
- **API keys EXIST**: `/api/admin/keys` (hashed, tier field) — good foundation.
- **Client SDK EXISTS** (thin): `packages/satohash-client` (stampHash, batchStamp, getStamp, proof-package). **CLI exists**: `packages/satohash-cli`.
- **Webhooks EXIST**: `/api/webhooks/register`, `stamp.confirmed` event. OpenAPI at `/api/openapi.json`.
- **Paywall scaffolding EXISTS**: `paywallMiddleware` + `X-L402-Token` headers in `server/index.js`.
- Persistence: SQLite (better-sqlite3 + Knex) for metadata only. bitcoind at tip on THOR.

## 1. Honest gaps vs the premium roadmap
1. **Signing is not real signing.** Marketing says "multi-party signing"; code stores unverified hex + unverified npub. Premium-grade needs signature verification against a pubkey + non-repudiation.
2. **Verify is not truly "independent."** Hash lookup trusts our SQLite DB. True independence = client verifies the `.ots` bytes against Bitcoin via public calendar/explorer with zero DB trust.
3. **Batch is synchronous & capped.** Sequential loop, ≤50. Premium volume needs an async job + SSE/webhook completion.
4. **L402 paywall is stubbed, not live.** Requires LND channels; **LND has 0 channels, >5k sats fails today**. Premium CANNOT charge until channels are funded + tested.
5. **No tiered rate limits / usage metering.** Public 5/min only; no per-key quotas or billing hooks.
6. **Secrets + audit hygiene.** ADMIN_KEY/LNbits/LND creds live in `/root/satohash/.env` (not git — good) but no rotation/audit-log story for multi-tenant premium keys.

## 2. Engineering plan (Ziggy's lane — server/infra/API/verification)

### Phase 0 — Foundation & infra (prereq for everything premium)
- Tiered key enforcement middleware keyed off `api_keys.tier` (public/pro/enterprise).
- Per-tier rate limiting (5/min public; pro/ent higher).
- Append-only, hashed audit log for premium compliance.
- SQLite stamp-DB backup + restore-verify (LNbits postgres 06:30 + R2 offsite already live — add the stamp DB).
- Deep-health alert on stamp/OTS failures (uptime-guard covers edge liveness only).
- Secrets: move server secrets to env/vault, add rotation.

### Phase 1 — Private-key signing layer (sovereign-first)
- **Design decision: signing is client-side** (browser WebCrypto / NIP-07 extension). Server never stores private keys — matches "no secrets, sovereignty-first."
- Signed stamp request: signature over `{hash, timestamp, nonce}`; server verifies against the caller's pubkey before accepting.
- **Replace weak `/stamp/cosign`**: verify signature against pubkey, store pubkey (not just npub header). Non-repudiable.
- Proof-package includes signature + pubkey so any party can verify the signer independently.

### Phase 2 — Batch stamping (async)
- New `POST /api/stamps/batch/async` → `jobId`; background worker chunks the work; complete via SSE + webhook.
- Keep sync `/batch` for ≤50. Certificate pack (zip) generation.
- Usage metering per job → feeds billing.

### Phase 3 — Independently auditable verification page
- Client-side `.ots` verify in the browser: parse bytes, resolve against Bitcoin block via public explorer/calendar. **Zero DB trust.**
- `/verify/<hash>` with uploaded `.ots` → block height, merkle path, ✓ verified.
- Document the audit path (open-source code, no server dependency for the verdict).

### Phase 4 — Developer API + SDK
- Publish `satohash-client` + `satohash-cli` to npm (versioned).
- Auth tiers: family free (`X-Satohash-Key`) + paid pro/enterprise keys.
- **Webhook HMAC signing** so integrators verify payloads.
- Complete OpenAPI + interactive playground + agent guides (Claude tool_use, GPT Actions, Make/Zapier/n8n).
- Idempotency, error codes, rate-limit headers documented.

### Phase 5 — Premium services live
- Real L402 wiring + `REQUIRE_LIGHTNING` flip (**GATE: LND funding**).
- Usage metering → invoices/billing per key.
- Sentry DSN (cam-gated) + structured logs.

## 3. Risks (flagged early)
| Risk | Severity | Mitigation |
|------|----------|-----------|
| L402 paywall can't charge until LND channels funded (>5k sats fails) | HIGH | Fund + test channels before any premium launch; ship free/pro-gated-on-volume meanwhile |
| Cosign is non-repudiably weak today | HIGH | Build verified-signature flow (Phase 1) before marketing "multi-party signing" to premium |
| "Independent verify" currently trusts our DB | MED-HIGH | Client-side .ots verify (Phase 3) — must ship with the claim |
| Batch sync loop caps premium volume | MED | Async job system (Phase 2) |
| Secrets/audit not premium-ready | MED | Phase 0 hygiene before issuing paid keys |
| Sentry DSN cam-gated & unused | LOW | One 2-min Cam setup unblocks full observability |

## 4. Decisions I need from Cam/Kimi
1. **The actual Mission & Scope draft v3** — not in repo; drop it so I align premium-tier verbage.
2. **Signing custody: confirm client-side (sovereign)**, never server-managed keys. (Strongly recommend client-side.)
3. **Ethereum is OUT of premium** (Cam declined) — confirm so the pitch doesn't claim cross-chain.
4. **LND channel funding** — who funds, when, what amount? Blocks Phase 5 (paid premium).
5. **Code-lane split**: I (Ziggy) own server/infra/API/verification; SPA/UI (Verify page, batch UI) → Grok/M3. Confirm so we don't collide.

## 5. What I need from Hermes to move
- The v3 scope draft (verbage alignment).
- Go-ahead on Phase 0 (infra/secrets/audit) + Phase 1 (verified signing) — these are server-side and unblock everything; I can start now.
- Confirm code-lane split + Ethereum exclusion.
