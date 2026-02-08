# Satohash

A mobile-first digital notary and contract platform that creates cryptographic proof of document existence using Bitcoin timestamping.

## Features

- **Multi-language support** (EN, ES, FR, DE, ZH)
- **Contract templates** (Prenup, Property, Power of Attorney)
- **Digital signatures** (typed and drawn)
- **Bitcoin timestamping** via OpenTimestamps
- **Real-time Bitcoin fee estimates** from mempool.space
- **Proof package generation** (PDF + .ots files)
- **Mobile-first responsive design**

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Architecture

- **Frontend**: React + Vite
- **Routing**: React Router
- **Localization**: i18next
- **Styling**: CSS with custom design system
- **Icons**: Lucide React
- **PDF Generation**: jsPDF
- **QR Codes**: qrcode.react
- **Timestamping**: OpenTimestamps
- **Fee Data**: mempool.space API

## Current Implementation

This version uses:
- **LocalStorage** for data persistence
- **Client-side** cryptography and timestamping
- **Mock** implementations for some advanced features

## Flows

### Onboarding
1. Welcome Screen language picker)
2. How It Works (3-card carousel)
3. Choose Template
4. Account Creation
5. Value Confirmation

### Contract Creation
1. Select template or upload custom
2. Edit contract content
3. Collect signatures
4. Timestamp the document
5. Download proof package

### Timestamping
1. Final Review
2. Explanation + Fee Estimates
3. Progress (hash → submit → anchor)
4. Result (download PDF + .ots)
5. Verification Help

## Proof Package

Each timestamp generates:
- **PDF** with contract content and timestamp details
- **.ots file** for independent verification
- Verification instructions

## Legal

Satohash provides tools and cryptographic evidence, **not legal advice**. Consult qualified legal counsel for your jurisdiction.

## License

MIT
