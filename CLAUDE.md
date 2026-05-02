# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (runs Express server + Vite concurrently)
npm run dev

# Build for production
npm run build

# Run backend server only
npm run server

# Production build + serve
npm run production

# Lint
npm run lint
npm run lint:fix

# Format
npm run format

# Unit tests (Vitest)
npm test
npm run test:watch

# E2E tests (Playwright)
npm run test:e2e

# PM2 production process manager
npm run start:pm2
```

Frontend dev server runs on port **3000**, backend API on port **3001**.

## Architecture

### Two-Process App
The app is a **Vite SPA + Express API server** running concurrently. In production, Express serves the built `dist/` folder as static files. In dev, Vite runs on 3000 and proxies API calls to Express on 3001.

### Frontend (React 18 + Vite + Tailwind CSS v4)
- **Entry**: `src/main.jsx` → `src/App.jsx`
- **Routing**: React Router v6. Routes split into **public** (`/`, `/access`, `/about`, `/trust`) and **authenticated** (all others). Public routes render without `AppShellNoir`; authenticated routes are wrapped in it.
- **Shell**: `src/components/AppShellNoir.jsx` — the master layout with desktop left rail (`LeftRailNav`), top signal bar (`TopSignalBar`), mobile header, and mobile bottom nav (`MobileBottomNav`). Also houses the global `⌘K` command palette.
- **Pages**: `src/pages/` — lazy-loaded via `React.lazy`. Several routes reuse pages as placeholders (`/audit-log` → `<Vault>`, `/documentation` → `<Developer>`, `/status` → `<Atlas>`).
- **CSS**: **Tailwind v4** using `@import 'tailwindcss'` (NOT the old `@tailwind` directives). Design tokens are CSS custom properties defined in `src/index.css` under `:root`. Component utility classes (`.glass-card`, `.btn-holographic`, `.pill-*`, etc.) are in `@layer components` in `index.css`. Do NOT use `@apply` with custom component classes in Tailwind v4 — inline all styles.
- **Icons**: `lucide-react` throughout.
- **Animations**: `framer-motion` for all transitions. Custom keyframes (`breathing`, `shimmer`, `float`, `fadeIn`, `slideUp`, `fadeUp`) are defined in `index.css`.
- **Path alias**: `@` resolves to `src/`.

### Design Token System
All colors, spacing, and shadow values use CSS variables from `src/index.css`:
- Backgrounds: `--bg-primary`, `--bg-secondary`, `--surface-raised`
- Text: `--text-primary`, `--text-secondary`
- Accents: `--accent-active` (blue), `--accent-pending` (amber), `--accent-success` (emerald), `--accent-danger` (red), `--accent-purple`
- Borders: `--border`, `--border-bright`
- Shadows: `--shadow-noir`, `--shadow-glow`

**Known inconsistency**: `tailwind.config.js` defines `primary: '#6366F1'` (indigo) but `index.css` uses `--accent-active: #3b82f6` (blue). Components in `index.css` reference `var(--primary)` and `var(--accent)` which are not defined in `:root` — these are dead references inherited from an older design system.

The light theme is toggled via `data-theme='elite'` attribute (not a CSS class). `ThemeProvider.jsx` exists but is not wired into `App.jsx`.

### Backend (Express + SQLite)
- **Entry**: `server/index.js`
- **Database**: SQLite via `better-sqlite3` + Knex migrations. DB file at `data/satohash.db`. Migrations run at startup via `server/migrations.js`.
- **Key modules**: `server/db.js` (SQLite connection), `server/nostr.js` (Nostr relay publishing), `server/mesh.js` (peer node witness network), `server/upgrade-daemon.js` (background OTS upgrade polling), `server/pdf-injector.js`, `server/git.js`.
- **Middleware**: `server/middleware.js` exports `correlationIdMiddleware`, `tieredRateLimiter`, `paywallMiddleware`.
- **Caching**: `server/cache.js` (ioredis — optional, degrades gracefully if Redis unavailable).
- **API docs**: Swagger UI at `/api-docs`.
- **Real-time**: Socket.io on the same HTTP server. Events: `ots:stamped`, `ots:collaborated`, `ots:revoked`.
- **Metrics**: Prometheus at `/metrics`. Health check at `/health?deep=true`.

### Core API Endpoints
| Endpoint | Purpose |
|---|---|
| `POST /api/stamp` | Create OTS timestamp from SHA-256 hash |
| `POST /api/verify` | Verify `.ots` file |
| `POST /api/upgrade` | Upgrade pending OTS proof |
| `GET /api/stamps/:id` | Get stamp metadata or download `.ots` binary |
| `GET /api/history` | Recent 50 timestamps |
| `POST /api/git/stamp` | Notarize current git repo state |
| `POST /api/capture/url` | Notarize a URL |
| `POST /api/capture/snapper` | Browser extension endpoint |
| `POST /api/collaboration/sign` | Add co-signer (Nostr npub) |
| `POST /api/revoke/:id` | Revoke/supersede a proof |
| `POST /api/pdf/inject/:id` | Inject OTS metadata into PDF |
| `GET /api/vault/images` | Notarized images only |
| `GET /api/system/fees` | Bitcoin fee estimates |
| `GET /api/system/backup` | Full DB export |
| `POST /api/mesh/verify` | Peer witness verification |
| `GET /admin/stats` | Admin dashboard (requires Bearer token) |

### Key Design Decisions
- **Zero-knowledge by design**: Document contents never leave the browser. Only SHA-256 hashes are sent to the server.
- **Local-first**: Client-side hashing happens in the browser via Web Crypto API before any network call.
- **Four planes**: Proof (OTS/Bitcoin), Identity (Nostr NIP-05), Settlement (BOLT-12/Lightning L402), Atlas (Chain intelligence).
- **OTS proof lifecycle**: `pending` → (upgrade daemon polls) → `confirmed` with `bitcoin_block_height`.

### Environment Variables
Copy `.env.example` to `.env`. Key vars:
- `PORT` — API server port (default 3001)
- `VITE_API_URL` — frontend API base URL
- `VITE_MEMPOOL_API_URL` — mempool.space API
- `SENTRY_DSN` / `VITE_SENTRY_DSN` — optional error tracking
- `ADMIN_KEY` — bearer token for `/admin/*` routes
- `SNAPPER_KEY` — browser extension auth key
- `NODE_ID` — peer node identity for mesh network

### Build Output
`npm run build` outputs to `dist/`. The Express server serves this directory as static files in production, enabling a single-process deployment.
