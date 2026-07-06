# Satohash — Standard Operating Procedure (SOP)

## Overview

Satohash is an institutional-grade digital notary & cryptographic settlement mesh (v4.1.0-ELITE).  
**Architecture:** Dual-server — Express API server (port 3001) + Vite dev server (port 3000, proxies `/api` and `/socket.io` to 3001).  
**Stack:** React 18 + Vite 6 + Tailwind CSS 4 (frontend), Express 5 + better-sqlite3 + Redis (backend).

---

## 1. Prerequisites

- Node.js >= 20.0.0 (see `.nvmrc` — v20.11.0 recommended)
- npm (shipped with Node)
- Redis (optional — app degrades gracefully without it)
- Docker & Docker Compose (optional, for containerized deployment)

---

## 2. Install Dependencies

```bash
npm install
```

Uses `npm ci` in CI/Docker builds for deterministic installs.

---

## 3. Environment Configuration

Copy and customize the example env:

```bash
cp .env.example .env
```

Key environment variables:

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | 3001 | Express API server port |
| `NODE_ENV` | development | Runtime mode |
| `CORS_ORIGIN` | * | CORS allowed origin |
| `ADMIN_KEY` | change-me-min-16-chars | Admin authentication |
| `JWT_SECRET` | (32+ chars) | JWT signing secret |
| `REDIS_URL` | redis://localhost:6379 | Redis connection |
| `OTS_CALENDARS` | (3 calendar URLs) | OpenTimestamps calendar servers |
| `NOSTR_SECRET_KEY` | (auto-generated) | Nostr bot identity key |

⚠️ **Production:** Change `ADMIN_KEY`, `JWT_SECRET`, `SNAPPER_KEY`, and `MESH_SECRET` immediately.

---

## 4. Development

### 4a. Start Both Server + Vite Dev Server

```bash
npm run dev
```

This runs `concurrently "npm run server" "vite"`:
- **Express API** starts on `http://localhost:3001`
- **Vite dev server** starts on `http://localhost:3000`
- Vite proxies `/api/*` → `localhost:3001` and `/socket.io` → `localhost:3001` (with WebSocket)

### 4b. Start API Server Only

```bash
npm run server
# Starts just server/index.js on PORT (default 3001)
```

### 4c. Start Vite Dev Server Only

```bash
npx vite
# Starts on port 3000 with hot module replacement
```

---

## 5. Build for Production

```bash
npm run build
```

Produces a static build in `dist/`:
- Vite bundles with code splitting (vendor, motion, icons, three, crypto, utils chunks)
- Brotli compression via `vite-plugin-compression`
- PWA service worker with auto-update
- Image optimization (PNG, JPEG, WebP, SVG)
- WASM support for cryptographic workers

---

## 6. Production Deployment

### 6a. Full Production (build + serve API)

```bash
npm run production
```

This runs:
1. `cross-env NODE_ENV=production vite build` — production build
2. `cross-env NODE_ENV=production node server/index.js` — serves API + static files

### 6b. PM2 Cluster Mode (recommended for production)

```bash
npm run start:pm2
```

PM2 runs `server/index.js` in cluster mode (max instances):
- Env: `NODE_ENV=production`, `PORT=3001`
- Max memory: 1GB per instance
- Logs: `logs/err.log`, `logs/out.log`
- Graceful shutdown (5s kill timeout)

### 6c. Docker Compose (containerized)

```bash
docker-compose up -d
```

Services:
- **app** (port 3001): Satohash application (Node 20-alpine, PM2-runtime)
- **redis** (port 6379): Redis 7-alpine with append-only persistence

Health check at `http://localhost:3001/health`

### 6d. Cloudflare Pages (frontend only)

```bash
bash deploy.sh
```

Builds with `npm run build`, deploys `dist/` to Cloudflare Pages via `wrangler pages deploy`.

---

## 7. Running Tests

### Unit Tests (Vitest + jsdom)

```bash
npm run test
# Runs tests matching src/**/*.{test,spec}.{js,jsx}
```

Watch mode:

```bash
npm run test:watch
```

### E2E Tests (Playwright + Chromium)

```bash
npm run test:e2e
```

Playwright auto-starts the production server (`npm run production`) as webServer.
Base URL: `http://localhost:3001`

### Test Locations

- Unit tests: Colocated in `src/` next to source files (e.g., `src/config/constants.test.js`)
- E2E tests: `tests/e2e/smoke.spec.js`

---

## 8. Linting & Formatting

```bash
npm run lint          # ESLint on src/
npm run lint:fix      # Auto-fix ESLint issues
npm run format        # Prettier on src/ files
```

Pre-commit hooks via husky + lint-staged.

---

## 9. Database

**Engine:** better-sqlite3 (SQLite via file `data/satohash.db`)  
**Migrations:** `server/migrations.js` with SQL files in `server/migrations/`  
**Schema tables:** `timestamps`, `git_stamps`, plus migration tables

Migrations run automatically on server startup.

---

## 10. CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/`):
1. `npm ci`
2. `npm audit`
3. `npm run lint`
4. `npm run test`
5. `npm run build`
6. `npx playwright install --with-deps`
7. `npx playwright test`

Triggered on push to `main`/`develop` and PRs to `main`.

---

## 11. Key Ports Summary

| Port | Service | Container |
|---|---|---|
| 3000 | Vite dev server (frontend) | — |
| 3001 | Express API server | app |
| 6379 | Redis | redis |
