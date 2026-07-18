# Satohash — Context Map

## Project Identity
Name: satohash
Version: 4.1.0-ELITE (Build 102)
License: MIT
Studio: Give A Bit (giveabit.io)
Node Requirement: >= 20.0.0
Updated: 2026-07-16

## Stack
Frontend: React 18 + Vite 6 + Tailwind CSS 4
Backend:  Express 5 + better-sqlite3 + Redis + WebSocket (Socket.IO)
Testing:  Vitest + Playwright

## Directory Structure
satohash/
server/                    # Express API backend
  index.js                Main entry
  db.js                   better-sqlite3 database
  cache.js                Redis client (graceful fallback)
  authMiddleware.js       JWT authentication
  nostr.js                Nostr integration
  templates-schema.js     Notary template schema
  collaboration.js        Multi-party co-signing
  mesh.js                 P2P mesh networking
  upgrade-daemon.js       OTS upgrade daemon
  webhooks.js             Outgoing webhooks
  pdf-injector.js         PDF metadata injection

src/
  pages/
    TemplatesShowcase.jsx  Template showcase
  components/
    DesktopAppNav.jsx      App shell nav (3-column grid, 4 tabs + More)
    MarketingDesktopNav.jsx Marketing nav with language switcher
    DesktopNavLayout.jsx   Grid layout container
    LanguageSwitcher.jsx   Compact language picker
    LeftRailNav.jsx        REMOVED in Build 98
  i18n/
    loadLocale.js          7-locale lazy loading
    en/, de/, es/, fr/, pt/, sw/, zh/, ar/
  widgets/
    WidgetV3.jsx           Embeddable timestamp widgets

public/
docs/
  KIMI-HANDOFF.md
  IMPROVEMENTS-LOG.md
  MVP-READINESS.md
  DEPLOY-SERVER.md

## Key Architecture
- Static-edge complete: stamp/verify flows work without API
- English eager-loaded; other 6 locales lazy on language switch
- Desktop nav: grid layout (left | center | right) replacing sidebar
- Four-Plane Architecture: Proof | Identity (Nostr) | Settlement (Lightning) | Atlas (chain)
- 73 unit tests, 22% coverage threshold

## Deployment
Frontend: Cloudflare Pages auto-deploy from GitHub main
API: Express server (deploy per DEPLOY-SERVER.md)
