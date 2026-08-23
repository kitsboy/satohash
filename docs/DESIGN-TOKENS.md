<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.io · **Version:** 5.0.0-ELITE (Build 273) · **Updated:** 2026-08-23
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Satohash Design Tokens

Canonical reference for the **Glacier Jewel** design system (2026-08-23 redesign). Source of truth: `src/index.css`.

## Identity

- **Satohash identity accent = sky `#38bdf8`** (family design-tokens.json). Sky is used for interactive/info/"pipes" (links, focus, calendar info, QR). Bitcoin gold `#f0b429` stays the primary CTA colour.
- Family rules enforced: **no pure black / pure white / neutral grey**, every surface carries a **tinted gradient + tinted border** (never flat), mid-tone **jewel** surfaces, **RICH + ALIVE** (aurora mesh, glow on hover).

## Mobile-First Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| `--bp-sm` | 640px | Phone landscape |
| `--bp-md` | 768px | Tablet |
| `--bp-lg` | 1024px | Desktop shell |
| `--bp-xl` | 1280px | Wide desktop |

**Rule:** Style for 320px first. Add complexity at `md:` and `lg:` only.

## Backgrounds (glacier jewel — never flat)

| Token | Dark | Elite (Light — warm parchment) |
|-------|------|---------------|
| `--bg-primary` | `#0e1c2a` deep glacier teal-navy | `#f6f1e8` |
| `--bg-secondary` | `#12273a` | `#efe9dd` |
| `--surface-raised` | `#16304a` | `#fdfbf5` |
| `--surface-overlay` | `#1c3a57` | `#fdfbf5` |

A fixed **aurora mesh** (`body::before`, slow drift, disabled under `prefers-reduced-motion`) layers sky/cyan/violet/gold radial tints behind content.

## Jewels

| Token | Value | Use |
|-------|-------|-----|
| `--jewel-sky` | `#38bdf8` | Satohash identity · info · pipes |
| `--jewel-cyan` | `#22d3ee` | electric secondary |
| `--jewel-violet` | `#8b5cf6` | Nostr / comms |
| `--jewel-ice` | `#d4f0f8` | glacier ink tint |
| `--jewel-gold` | `#f0b429` | Bitcoin CTA |

## Typography

| Token | Value |
|-------|-------|
| `--text-primary` | `#e8f4fb` (dark) / `#2b2118` (elite) |
| `--text-secondary` | `#93a9bb` / `#5b4f3d` |
| `--text-muted` | `#5d7287` / `#8a7c66` |

Fonts: **Plus Jakarta Sans** (UI), **Space Grotesk** (headings), **JetBrains Mono** (code/hashes).

## Accents

| Token | Purpose |
|-------|---------|
| `--accent-gold` | Bitcoin gold — primary CTA, block height |
| `--accent-teal` / `--accent-active` | Sky `#38bdf8` — active links, focus, identity (dark) |
| `--accent-success` | `#34d399` confirmed proofs |
| `--accent-pending` | `#f0b429` pending OTS upgrade |
| `--accent-danger` | `#fb7185` revoked, errors |
| `--accent-purple` | `#8b5cf6` Nostr / communications |

## Borders & Shadows

| Token | Usage |
|-------|-------|
| `--border` | Tinted sky `rgba(148,197,255,0.10)` — never pure white-alpha |
| `--border-bright` | Hover states |
| `--border-gold` | Institutional highlights |
| `--shadow-noir` | Deep card elevation |
| `--shadow-glow` | Active element glow |
| `--shadow-sky` | Sky jewel glow (`--jewel-sky-glow`) |

## Radii

| Token | Value |
|-------|-------|
| `--radius-pill` | `9999px` |
| `--radius-card` | `1.25rem` |
| `--radius-button` | `0.875rem` |

## Component Classes (index.css @layer components)

- `.glass-card` — jewel surface: sky→surface→gold gradient, electric 2px top hairline, sky glow on hover
- `.btn-holographic` / `.btn-sheen` — gold CTA shine on hover
- `.vault-ring` — dual gold ring + inset highlight
- `.hud-glass` — theme-aware telemetry glass
- `.live-chip` — own-node / free-stamp jewelry
- `.jewel-edge` — electric top hairline (sky→gold) on proof steps, banners
- `.surface-card` / `.step-card` — jewel gradient surfaces (never flat)
- `.glow-sky` / `.sky-border` — sky jewel glow utilities
- `.text-gradient` / `.text-gradient-sky` — gold→sky / sky→cyan text gradients
- `.animate-jewel-pulse` — sky glow pulse (confirmed proof)
- `.pill-success` / `.pill-pending` / `.pill-danger` — status badges

## Theme Toggle

Light mode: `data-theme="elite"` on `<html>` — warm parchment, not white. Stored as `satohash_theme=elite` in localStorage.

*Synced by `npm run docs:sync`*
