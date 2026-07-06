# Satohash — Context Map

## Project Identity

- **Name:** satohash
- **Version:** 4.1.0-ELITE
- **License:** MIT
- **Studio:** Give A Bit (giveabit.io)
- **Node Requirement:** >= 20.0.0 (nvmrc: v20.11.0)
- **Package Manager:** npm
- **Module System:** ESM (`"type": "module"` in package.json)

---

## Directory Structure

```
satohash/
├── server/                    # Express API backend
│   ├── index.js              # Main entry — Express app + Socket.IO + all route handlers
│   ├── db.js                 # better-sqlite3 database (data/satohash.db)
│   ├── cache.js              # Redis client (ioredis, graceful fallback)
│   ├── logger.js             # pino logger
│   ├── swagger.js            # Swagger/OpenAPI spec (swagger-jsdoc)
│   ├── migrations.js         # DB migration runner
│   ├── authMiddleware.js     # JWT authentication middleware
│   ├── middleware.js          # Correlation ID, rate limiter, paywall middleware
│   ├── secrets-validator.js  # Production secrets validation
│   ├── admin.js              # Admin panel router
│   ├── nostr.js              # Nostr integration (publish, relay health)
│   ├── backup.js             # Database backup
│   ├── git.js                # Git metadata extraction
│   ├── gossip.js             # Peer gossip protocol
│   ├── mesh.js               # P2P mesh networking
│   ├── collaboration.js      # Multi-party co-signing
│   ├── pdf-injector.js       # PDF metadata injection
│   ├── templates-schema.js   # Notary template schema
│   ├── upgrade-daemon.js     # OTS upgrade daemon
│   ├── watcher.js            # File system watcher
│   ├── webhooks.js           # Outgoing webhooks
│   ├── routes/
│   │   ├── anchor.js         # Bitcoin anchor routes
│   │   ├── lightning.js      # BOLT-12 Lightning routes
│   │   └── nft.js            # NFT routes
│   ├── migrations/           # SQL migration files
│   │   ├── 001_initial.sql
│   │   ├── 002_extended_features.sql
│   │   ├── 004_multi_tenancy.sql
│   │   ├── 005_add_missing_columns.sql
│   │   ├── 006_performance_indexes.sql
│   │   ├── 006_upgrade_tracking.sql
│   │   ├── 007_user_scoping.sql
│   │   ├── 008_push_webhooks.sql
│   │   ├── 009_forum.sql
│   │   ├── 010_webhook_delivery.sql
│   │   ├── 0111-multi-tenancy.sql
│   │   └── 20260501_referrals.sql
│   └── daemons/
│       └── index.js           # Background daemon processes
├── src/                       # React frontend
│   ├── App.jsx               # Root React component with routing
│   ├── components/           # ~55+ UI components
│   │   ├── AppShellNoir.jsx  # Main app shell (desktop/mobile)
│   │   ├── ARViewer.jsx      # AR document viewer
│   │   ├── Api*.jsx          # API playground, search
│   │   ├── BadgeGenerator.jsx
│   │   ├── BlockchainPulse.jsx
│   │   ├── Bolt12InvoiceDrawer.jsx
│   │   ├── GlobalDropzone.jsx
│   │   ├── GlobalJurisdictionMap.jsx
│   │   ├── InstitutionalHUD.jsx
│   │   ├── LegalValidator.jsx
│   │   ├── LiveNetworkDashboard.jsx
│   │   ├── MempoolTicker.jsx
│   │   ├── Merkle3D.jsx / MerkleExplorer.jsx / MerkleHeart.jsx
│   │   ├── NostrSigner.jsx
│   │   ├── PdfCustomizer.jsx
│   │   ├── ProofAnalytics.jsx / ProofDNA.jsx / ProofExplorer.jsx
│   │   ├── VoiceStamp.jsx
│   │   ├── WebhookDocs.jsx
│   │   ├── ZKRedactionTool.jsx
│   │   └── ... (UI primitives: Button, Card, Modal, Toast, Nav, etc.)
│   ├── pages/                # ~30+ page views
│   │   ├── Landing.jsx       # Public landing page
│   │   ├── Dashboard.jsx     # User dashboard
│   │   ├── Stamp.jsx         # OTS timestamping
│   │   ├── Atlas.jsx         # Global atlas view
│   │   ├── Explorer.jsx      # Merkle tree explorer
│   │   ├── VerificationShield.jsx / VerificationTool.jsx
│   │   ├── WebCapture.jsx    # Forensic web capture
│   │   ├── BatchTimestamp.jsx
│   │   ├── Identity.jsx / Access.jsx
│   │   ├── Admin.jsx / AdminThrottle.jsx
│   │   ├── ProtocolStats.jsx
│   │   ├── Mesh.jsx / NostrHealth.jsx
│   │   ├── ImageVault.jsx / Vault.jsx
│   │   ├── NotaryTemplates.jsx
│   │   ├── Offers.jsx / ContractList.jsx
│   │   ├── Forum.jsx
│   │   ├── Settings.jsx
│   │   ├── Developer.jsx / DeveloperPortal.jsx
│   │   ├── MobileSigner.jsx
│   │   ├── About.jsx / Contribute.jsx
│   │   ├── contracts/        # Contract editor, list, view
│   │   ├── legal/            # CryptoNotice, PrivacyPolicy, TermsOfService
│   │   ├── onboarding/       # AccountCreation, BatchProof, ChooseTemplate, etc.
│   │   ├── signatures/       # SignatureFlow
│   │   ├── timestamp/        # FinalReview, TimestampExplanation, etc.
│   │   ├── trust/            # TrustCenter
│   │   └── verify/           # VerificationTool
│   ├── config/               # App constants + tests
│   ├── hooks/                # React custom hooks
│   ├── store/                # Zustand state stores
│   ├── utils/                # Utility modules
│   │   ├── crypto.js         # Client-side hashing (Web Crypto)
│   │   ├── opentimestamps.js # OTS client logic
│   │   ├── mempool.js        # Mempool.space API client
│   │   ├── merkle.js         # Merkle tree computation
│   │   ├── hashWorker.js     # Web Worker hash interface
│   │   ├── pdfGenerator.js   # PDF generation
│   │   ├── legalPDFGenerator.js
│   │   ├── certificate.js    # Certificate generation
│   │   ├── encryption.js     # Client encryption
│   │   ├── storage.js        # localStorage / IndexedDB
│   │   ├── analytics.js
│   │   ├── audio.js
│   │   ├── carbon.js         # Carbon footprint estimation
│   │   ├── nwc.js            # Nostr Wallet Connect
│   │   └── errors.js
│   ├── workers/              # Web Workers
│   │   └── hashWorker.js
│   ├── templates/            # Notary templates
│   └── test/                 # Test setup
├── bin/
│   └── satohash.js           # CLI tool
├── extension/
│   └── satohash-snapper/     # Browser extension (forensic web capture)
│       ├── manifest.json
│       ├── popup.html
│       ├── scripts/background.js
│       ├── scripts/popup.js
│       └── styles/popup.css
├── docs/                     # Documentation
│   ├── ARCHITECTURE.md
│   ├── DEPLOY-PLAYBOOK.md
│   ├── I18N.md
│   ├── MARKETING.md
│   ├── MISSION.md
│   ├── OTS_SETUP.md
│   ├── QUICKSTART.md
│   ├── SEO.md
│   └── SEO-*.md             # i18n SEO files (de, es, fr, pt, sw, zh)
├── archive/                  # Archived handoff docs
│   ├── EXECUTIVE_SUMMARY.md
│   ├── FINANCIALS.md
│   ├── MARKETING_FLYER.md
│   ├── PRODUCT_PITCH.md
│   └── ... 
├── public/                   # Static assets
│   ├── site.webmanifest     # PWA manifest
│   ├── sw.js                # Service worker
│   ├── sitemap.xml          # SEO sitemap
│   ├── robots.txt
│   ├── _headers / _redirects
│   └── api/                 # API public directory
├── tests/
│   └── e2e/
│       └── smoke.spec.js    # Playwright smoke test
├── scripts/
│   └── increment-build.js   # Build number auto-increment
├── data/                    # Runtime data (gitignored)
│   └── satohash.db          # SQLite database
├── .ai_docs/                # Agent documentation (this directory)
├── .agent/ .agents/         # Agent configuration
├── .github/workflows/       # CI/CD GitHub Actions
├── .husky/                  # Git hooks
├── .env.example             # Environment template
├── package.json
├── Dockerfile               # Multi-stage Node 20-alpine
├── docker-compose.yml       # app + redis services
├── ecosystem.config.cjs     # PM2 configuration
├── vite.config.js           # Vite build config
├── vitest.config.js         # Vitest test config
├── playwright.config.js     # Playwright E2E config
├── tailwind.config.js
├── postcss.config.js
├── deploy.sh                # Cloudflare Pages deploy script
├── index.html               # Vite entry HTML
└── build-metadata.json      # Build number tracking
```

---

## Dependency Table (by category)

### Express / API Server
| Package | Version | Purpose |
|---|---|---|
| express | ^5.2.1 | HTTP server framework |
| cors | ^2.8.6 | CORS middleware |
| helmet | ^8.1.0 | Security headers |
| compression | ^1.8.1 | Gzip/brotli response compression |
| hpp | ^0.2.3 | HTTP parameter pollution protection |
| express-rate-limit | ^8.3.1 | Rate limiting |
| multer | ^2.1.1 | File upload handling |
| swagger-jsdoc / swagger-ui-express | ^6.2.8 / ^5.0.1 | API docs |
| pino / pino-http / pino-pretty | ^10.3.1 | Structured logging |
| prom-client | ^15.1.3 | Prometheus metrics |
| xss-clean | ^0.1.4 | XSS sanitization |

### Bitcoin / OpenTimestamps
| Package | Version | Purpose |
|---|---|---|
| bitcoinjs-lib | ^7.0.1 | Bitcoin transaction building |
| ecpair | ^3.0.1 | EC key pair generation |
| tiny-secp256k1 | ^2.2.4 | secp256k1 elliptic curve |
| ethers | ^6.16.0 | Ethereum wallet (cross-chain) |
| opentimestamps | ^0.4.9 | Bitcoin timestamp proofs |

### Nostr / Identity
| Package | Version | Purpose |
|---|---|---|
| nostr-tools | ^2.23.3 | Nostr protocol (events, NIPs) |
| @simplewebauthn/server | ^13.3.0 | WebAuthn passkeys |
| jsonwebtoken | ^9.0.3 | JWT auth |
| qrcode / qrcode.react | ^1.5.4 / ^4.2.0 | QR generation |

### React / UI
| Package | Version | Purpose |
|---|---|---|
| react / react-dom | ^18.3.1 | UI framework |
| react-router-dom | ^6.28.0 | Client-side routing |
| framer-motion | ^12.34.0 | Animations |
| zustand | ^4.5.0 | State management |
| i18next / react-i18next | ^23.16.0 / ^14.1.0 | Internationalization |
| lucide-react | ^0.462.0 | Icons |
| tailwindcss / tailwind-merge | ^4.1.18 / ^3.4.0 | Styling |
| three | ^0.183.2 | 3D visualizations (Merkle trees) |
| sonner | ^2.0.7 | Toast notifications |
| clsx | ^2.1.1 | Class name utility |
| @radix-ui/react-tooltip | ^1.2.8 | Accessible tooltip |
| @tanstack/react-virtual | ^3.13.24 | Virtualized lists |
| react-dropzone | ^14.4.0 | File drag-and-drop |
| react-error-boundary | ^6.1.1 | Error boundaries |
| canvas-confetti | ^1.9.4 | Celebration effects |
| nprogress | ^0.2.0 | Loading bar |

### Database & Caching
| Package | Version | Purpose |
|---|---|---|
| better-sqlite3 | ^12.8.0 | SQLite (primary database) |
| knex | ^3.2.5 | SQL query builder (schema/migrations) |
| ioredis | ^5.10.1 | Redis client (caching, queues) |
| zod | ^4.3.6 | Schema validation |

### Media / Data Processing
| Package | Version | Purpose |
|---|---|---|
| jspdf | ^4.2.1 | PDF generation |
| pdf-lib | ^1.17.1 | PDF manipulation |
| jszip | ^3.10.1 | ZIP archive creation |
| howler | ^2.2.4 | Audio playback |
| comlink | ^4.4.2 | Web Worker RPC |
| buffer | ^6.0.3 | Buffer polyfill |

### Payments / Webhooks
| Package | Version | Purpose |
|---|---|---|
| stripe | ^16.10.0 | Credit card payments |
| axios | ^1.13.6 | HTTP client |
| node-fetch | ^3.3.2 | HTTP fetch (ESM) |

### Infrastructure
| Package | Version | Purpose |
|---|---|---|
| vite | ^6.0.5 | Bundler & dev server |
| vitest | ^3.2.4 | Unit test runner |
| playwright | ^1.58.2 | E2E test framework |
| concurrently | ^9.2.1 | Run multiple commands |
| cross-env | ^10.1.0 | Cross-platform env vars |
| @anthropic-ai/sdk | ^0.93.0 | Claude AI integration |
| @sentry/node / @sentry/react | ^10.45.0 | Error tracking |
| nodemailer | ^8.0.7 | Email sending |
| commander | ^14.0.3 | CLI argument parsing |
| node-cron / cron-validator | ^4.2.1 / ^1.4.0 | Cron scheduling |
| uuid | ^13.0.0 | UUID generation |
| date-fns | ^4.1.0 | Date utilities |
| ipfs-http-client | ^60.0.1 | IPFS (decentralized storage) |

---

## Ports & Networking

| Port | Service | Protocol | Notes |
|---|---|---|---|
| 3000 | Vite Dev Server | HTTP | Dev only, proxies /api → 3001 |
| 3001 | Express API Server | HTTP/WS | Production endpoint, Socket.IO |
| 6379 | Redis | TCP | Docker container only |
| — | PM2 Cluster | IPC | Auto-scales to CPU count |

Vite dev server (port 3000) proxies:
- `/api/*` → `http://localhost:3001`
- `/socket.io` → `http://localhost:3001` (WebSocket passthrough)

---

## API Endpoints

All API routes served from `http://localhost:3001/`:

| Route | Method | Purpose |
|---|---|---|
| `/api/stamp` | POST | Create OTS timestamp |
| `/api/history` | GET | List user's stamps (auth) |
| `/api/stamps/:id` | GET | Get stamp details |
| `/api/revoke/:id` | POST | Revoke a stamp |
| `/api/git/stamp` | POST | Stamp a git commit/tree |
| `/api/capture/url` | POST | Forensic web capture |
| `/api/capture/snapper` | POST | Browser extension capture |
| `/api/pdf/inject/:id` | POST | Inject proof into PDF |
| `/api/export/csv` | GET | Export stamps as CSV |
| `/api/collaboration/sign` | POST | Multi-party co-sign |
| `/api/auth/login` | POST | JWT authentication |
| `/api/auth/refresh` | POST | Token refresh |
| `/api/lightning` | * | BOLT-12 Lightning routes |
| `/api/nft` | * | NFT routes |
| `/api/vault/images` | GET | Image vault listing |
| `/api/subscribe` | POST | Email subscription |
| `/api/stripe/webhook` | POST | Stripe webhook (raw body) |
| `/api/nostr/profile/:npub` | GET | Nostr profile lookup |
| `/api/nostr/health` | GET | Nostr relay health |
| `/api/compliance-check` | POST | Document compliance check |
| `/api/templates/suggest` | POST | Notary template AI suggestion |
| `/health` | GET | Health check (DB + Redis) |
| `/metrics` | GET | Prometheus metrics |
| `/api-docs` | GET | Swagger UI |
| `/admin/` | * | Admin panel |

---

## Docker Setup

**Dockerfile:** Multi-stage (Node 20-alpine)
1. `base` — install deps
2. `build` — `npm ci` + `npm run build`
3. `production` — prod deps only, PM2-runtime, `EXPOSE 3001`

**docker-compose.yml:**
```yaml
services:
  app:
    build: .
    ports: ["3001:3001"]
    depends_on: [redis]
    healthcheck: curl -f http://localhost:3001/health
    volumes: [./data:/app/data]
  redis:
    image: redis:7-alpine
    volumes: [redis_data:/data]
    command: redis-server --appendonly yes
```

---

## Environment Variables

From `.env.example` — all configurable via `.env`:

| Variable | Default | Required | Notes |
|---|---|---|---|
| PORT | 3001 | Yes | Express server port |
| NODE_ENV | development | Yes | development / production / test |
| CORS_ORIGIN | * | No | Set to domain in production |
| ADMIN_KEY | — | Yes (prod) | Min 16 chars |
| JWT_SECRET | — | Yes (prod) | Min 32 chars |
| SNAPPER_KEY | — | Yes (prod) | Min 32 chars |
| REDIS_URL | redis://localhost:6379 | No | Graceful fallback |
| OTS_CALENDARS | (3 URLs) | No | OpenTimestamps calendars |
| NOSTR_SECRET_KEY | (generated) | No | Nostr bot identity |
| SENTRY_DSN | — | No | Error tracking |
| EMAIL_HOST/USER/PASS | — | No | SMTP email |
| SWAGGER_URL | http://localhost:3001 | No | Swagger UI base URL |
| NODE_ID | local-witness-1 | No | Mesh network node id |
| MESH_SECRET | — | No | Peer auth |
| IPFS_URL | http://localhost:5001 | No | IPFS daemon URL |

---

## PWA Configuration

- **Service Worker:** Auto-registered via `vite-plugin-pwa` with `workbox`
- **Manifest:** `public/site.webmanifest`
- **Caching:** Cache-first for Google Fonts, network-first else
- **Update Strategy:** `autoUpdate` (prompts via UpdatePrompt component)

---

## Database

- **Engine:** SQLite (via better-sqlite3)
- **File:** `data/satohash.db`
- **Pragma:** `journal_mode = WAL`
- **Migrations:** Automatic on startup from `server/migrations/*.sql`
- **Key Tables:**
  - `timestamps` — OTS timestamp records (id, hash, ots_binary, status, merkle_root, bitcoin_block_height, ipfs_cid)
  - `git_stamps` — Git commit associations (timestamp_id, repo, commit_hash, branch)
  - Migration tables added via SQL files (multi-tenancy, webhooks, forum, referrals, etc.)
