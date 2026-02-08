# Satohash v1.0.0 (The Base Case)

A mobile-first digital notary and contract platform that creates cryptographic proof of document existence using Bitcoin timestamping.

## 🏆 Version 1 (V1) Overview
This release establishes the **V1 Baseline** for the Satohash protocol. It features a high-fidelity, high-contrast user experience, authentic Satahash branding, and a localized multi-party signing flow.

## 🚀 Key Features

*   **Bitcoin Anchoring**: Uses SHA-256 hashing and the OpenTimestamps protocol for immutable proof of existence.
*   **High-Contrast Branding**: Authentic Satahash orange identity with maximum-accessibility typography for dark/light mode compatibility.
*   **Privacy Shield**: Zero-knowledge document handling. Only cryptographic fingerprints (hashes) are handled; original content stays on your device.
*   **Multi-Party Signing**: Integrated digital signature flow for both typed and drawn signatures.
*   **Global Reach**: Fully localized in English, Spanish, French, German, and Chinese.

## 🛠 Technology Stack

*   **Core**: React + Vite
*   **Routing**: React Router
*   **Localization**: i18next
*   **Cryptography**: OpenTimestamps + Web Crypto API
*   **PDF Engine**: jsPDF
*   **Network Intelligence**: mempool.space API

## 📂 Architecture (Base Case)

*   **Local-First Data**: Uses browser `LocalStorage` for high-speed, offline-ready document management.
*   **Client-Side Verification**: Direct integration with timestamping servers without intermediary databases.
*   **Responsive UX**: Custom premium CSS design system optimized for both mobile and desktop.

## 🏗 Setup & Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📜 Legal & Compliance

Satohash provides cryptographic evidence and tooling, **not legal advice**. Our implementation is designed to support frameworks like the ESIGN Act (US), UETA (US), and eIDAS (EU) by providing verifiable electronic time-stamps.

---
© 2026 Satahash Open Protocol
