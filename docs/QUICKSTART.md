# Satohash Quickstart

**Users:** stamp in the browser at [https://satohash.io/stamp](https://satohash.io/stamp) — no account, free today. The public guide is [`public/docs/quickstart.md`](../public/docs/quickstart.md) (also `/docs/quickstart` on the site).

**Developers:** clone and run locally in under 5 minutes.

## Prerequisites
- Node.js >= 20
- npm (or equivalent)
- Modern browser (for full UI features: Nostr extension optional, Web Crypto)

## 1. Clone & Install
```bash
git clone https://github.com/kitsboy/satohash.git
cd satohash
npm install
```

## 2. Environment (copy example)
```bash
cp .env.example .env
# Edit .env as needed. For local dev the defaults usually work.
```

Key vars for first run:
- `VITE_API_URL=http://localhost:3001`
- `PORT=3001`

## 3. Run (Development — two processes)
```bash
npm run dev
```
- Frontend (Vite): http://localhost:3000
- Backend API: http://localhost:3001
- API docs (Swagger): http://localhost:3001/api-docs

Vite proxies API calls automatically in dev.

## 4. First Timestamp (UI)
1. Open http://localhost:3000
2. Drag a PDF, image, or text file onto the dropzone (or use the Stamp page).
3. Watch the client-side SHA-256 hash compute locally.
4. Submit — you receive a pending proof.
5. Wait ~10 min (or use the upgrade flow) for Bitcoin confirmation.
6. Download the `.ots` file.

**Zero knowledge**: the original file never left your machine.

## 5. Verify Any Proof
- Use the built-in Verification Shield (drag `.ots` + original file).
- Or independent tools:
  ```bash
  # Python
  pip install opentimestamps-client
  ots verify mydoc.pdf.ots -f mydoc.pdf
  ```
- Or visit https://opentimestamps.org

## 6. CLI (basic)
The `bin/satohash.js` provides a starter CLI (extend as needed):
```bash
node bin/satohash.js stamp ./contract.pdf --server http://localhost:3001
```

## 7. Production Build & Run
```bash
npm run build          # outputs to dist/
npm run production     # builds + serves with Express
# or
npm run start:pm2      # via ecosystem.config.cjs
```

See [DEPLOY-PLAYBOOK.md](./DEPLOY-PLAYBOOK.md) and root `Dockerfile` / `docker-compose.yml` for containerized / host-specific flows.

## 8. API (for scripts / agents)
See full guide: [AI_INTEGRATION.md](./AI_INTEGRATION.md)

Minimal curl (after getting an API key from the dashboard):
```bash
# 1. Hash locally (example)
HASH=$(sha256sum contract.pdf | cut -d' ' -f1)

# 2. Stamp
curl -X POST http://localhost:3001/api/stamp \
  -H "X-API-Key: $YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"hash\":\"$HASH\",\"filename\":\"contract.pdf\"}"
```

## 9. Key Pages in the App
- `/stamp` — Primary anchoring flow
- `/verify` — Verification + 3D Merkle explorer
- `/vault` — Your proof history
- `/contracts` — Multi-party signing
- `/snapper` — Web forensic capture ("Snap & Stamp")
- `/atlas` — Live chain intelligence & mempool
- `/developer` — API playground + docs

## 10. Next Steps for Power Users
- Connect a Nostr signer (NIP-07) for cryptographic identity on contracts.
- Use the BOLT-12 Lightning drawer for paid/high-volume anchoring.
- Export courtroom-ready PDFs via the PDF customizer (watermarks, attestation blocks).
- Explore ZK redaction: prove a redacted version still matches the original Bitcoin anchor.
- Self-host or integrate via the REST + webhook surface.

## Troubleshooting
- Port conflicts: change `PORT` and `VITE_API_URL`.
- No mempool data: check `VITE_MEMPOOL_API_URL`.
- OTS pending forever: the upgrade daemon runs in background; you can also manually trigger upgrade.
- See `CLAUDE.md` for full architecture and `npm run lint` / `npm test` commands.

**Questions?** hello@giveabit.io | satohash.giveabit.io

Built by Give A Bit — Bitcoin sovereignty tooling.
