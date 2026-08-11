<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.giveabit.io · **Version:** 5.0.0-ELITE (Build 213) · **Updated:** 2026-08-11
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Satohash Design Tokens

Canonical reference for the Institutional Noir design system. Source of truth: `src/index.css`.

## Mobile-First Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| `--bp-sm` | 640px | Phone landscape |
| `--bp-md` | 768px | Tablet |
| `--bp-lg` | 1024px | Desktop shell |
| `--bp-xl` | 1280px | Wide desktop |

**Rule:** Style for 320px first. Add complexity at `md:` and `lg:` only.

## Backgrounds

| Token | Dark | Elite (Light) |
|-------|------|---------------|
| `--bg-primary` | `#141b25` | `#fcfcfc` |
| `--bg-secondary` | `#1a2233` | `#f3f4f6` |
| `--surface-raised` | `#1e2a3a` | `#ffffff` |
| `--surface-overlay` | `#223044` | `#ffffff` |

## Typography

| Token | Value |
|-------|-------|
| `--text-primary` | `#f1f5f9` (dark) / `#050505` (elite) |
| `--text-secondary` | `#8892a4` / `#4b5563` |
| `--text-muted` | `#4a5568` / `#9ca3af` |

Fonts: **Plus Jakarta Sans** (UI), **Space Grotesk** (headings), **JetBrains Mono** (code/hashes).

## Accents

| Token | Purpose |
|-------|---------|
| `--accent-gold` | Bitcoin gold — primary CTA, block height |
| `--accent-teal` | Active links, success paths |
| `--accent-active` | Interactive focus (maps to teal in dark) |
| `--accent-success` | Confirmed proofs |
| `--accent-pending` | Pending OTS upgrade |
| `--accent-danger` | Revoked, errors |
| `--accent-purple` | Nostr / communications |

## Borders & Shadows

| Token | Usage |
|-------|-------|
| `--border` | Default card borders |
| `--border-bright` | Hover states |
| `--border-gold` | Institutional highlights |
| `--shadow-noir` | Deep card elevation |
| `--shadow-glow` | Active element glow |

## Radii

| Token | Value |
|-------|-------|
| `--radius-pill` | `9999px` |
| `--radius-card` | `1.25rem` |
| `--radius-button` | `0.875rem` |

## Component Classes (index.css @layer components)

- `.glass-card` — frosted panel
- `.btn-holographic` — primary CTA
- `.pill-success` / `.pill-pending` / `.pill-danger` — status badges

## Theme Toggle

Light mode: `data-theme="elite"` on `<html>`. Stored as `satohash_theme=elite` in localStorage.

*Synced by `npm run docs:sync`*
