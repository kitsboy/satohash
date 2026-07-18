# Project Summary — Satohash

**What:** Institutional-grade digital notary and Bitcoin timestamping platform using OpenTimestamps.
**Domain:** satohash.giveabit.io
**Version:** Build 102 (v4.1.0-ELITE)
**Last Updated:** 2026-07-16

## One-Liner
Satohash lets anyone prove a document existed at a specific time by locking a cryptographic fingerprint into the Bitcoin blockchain — files never leave your device, proofs are permanent and free, verifiable even if Satohash disappears.

## Core Features
- OpenTimestamps anchoring: SHA-256 hash -> Bitcoin block
- Zero-knowledge: documents never leave browser (Web Crypto API)
- Four-Plane Architecture: Proof, Identity (Nostr), Settlement (Lightning), Atlas (chain intelligence)
- Multi-party contracts with co-signing
- Notary templates for government, legal, and enterprise use cases
- Static-edge complete: 200/200 items, 7-locale i18n, PWA
- Widgets v3 embed for third-party sites
- Satohash Snapper browser extension for web evidence capture
- Government template suite with institutional features
- eIDAS + ESIGN compliant for court admissibility

## Target Audience
- Legal professionals and notaries
- Government agencies needing verifiable records
- Developers wanting blockchain timestamping APIs
- Bitcoin sovereignty advocates

## Tech Stack
React 18 + Vite 6 + Tailwind CSS 4 (frontend) | Express 5 + better-sqlite3 + Redis (backend/API)

## Integration With Other Projects
Satohash timestamping is designed to be consumed by ALL Give A Bit projects:
- Katoa: planned timestamping for map/exploration data
- MotoPass: planned timestamping for vault seals and compare reports
- Sherpacarta: planned timestamping for navigation/route data
- Stranded: planned timestamping for site data reports

