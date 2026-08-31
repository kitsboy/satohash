<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.io · **Version:** 5.0.0-ELITE (Build 270) · **Updated:** 2026-08-31
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Satohash Design Context

## Brand: Institutional Noir

Satohash is a **Bitcoin-native sovereign notary**. The UI must feel like a premium financial terminal — severe, elegant, trustworthy — not a crypto casino.

## Design Principles

1. **Mobile-first** — 60%+ users stamp from phone. Touch targets ≥ 44px. Bottom nav on mobile, left rail on desktop.
2. **Zero-knowledge visible** — Always show that files hash locally. Never imply upload of document bytes.
3. **Proof lifecycle clarity** — pending → confirmed states must be unmistakable (gold pending, teal confirmed).
4. **Bitcoin as truth layer** — Block height, fee rate, and OTS status are hero signals, not footnotes.
5. **Accessible contrast** — WCAG AA minimum on all text; test both dark and elite themes.

## Layout Architecture

```
Mobile (< 1024px)          Desktop (≥ 1024px)
┌─────────────────┐        ┌────┬──────────────────┐
│ Top bar         │        │Rail│ TopSignalBar     │
├─────────────────┤        │    ├──────────────────┤
│                 │        │Nav │                  │
│   Page content  │        │    │   Page content   │
│                 │        │    │                  │
├─────────────────┤        └────┴──────────────────┘
│ MobileBottomNav │
└─────────────────┘
```

## Kimi Agent Presence

**Kimi** (THOR VPS orchestration agent, Give A Bit — vault on THOR Obsidian, not M4) appears in:
- Footer → Team & Agents section
- `/about` → Agent roster
- `/pitch` → Contact for partnerships

Avatar: `/kimi-avatar.svg` · Contact: `kimi@giveabit.io` · Nostr: `nostr:kimi@giveabit.io`

## Self-Evolving Docs

Business docs (`EXECUTIVE-SUMMARY`, `MARKETING`, `FINANCIALS`, `PITCH`) auto-stamp version/build/date via `npm run docs:sync`. The `/pitch` page reads live content from `/api/docs/:slug`.

## Four-Plane Model (UI Mapping)

| Plane | Primary Routes | Visual Cue |
|-------|----------------|------------|
| Proof | `/stamp`, `/verify`, `/vault` | Gold accents |
| Identity | `/identity`, `/access` | Purple/Nostr |
| Settlement | `/offers`, `/developer` | Teal/Lightning |
| Atlas | `/atlas`, `/nodes`, `/protocol-stats` | Mempool amber |

*Synced by `npm run docs:sync`*
