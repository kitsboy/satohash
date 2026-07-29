---
title: SEO Strategy & Audit
project: satohash
version: 4.1.0-ELITE
last_updated: 2026-07-07
owner: Kimi / Grok (M3)
update_frequency: Weekly (Monday)
build: 37
---

# SEO — Satohash (satohash.io)

## Live URL
https://satohash.io

## Languages (hreflang)
| Code | Locale | SEO Doc |
|------|--------|---------|
| en | en_US | SEO.md (this file) |
| es | es_ES | SEO-es.md |
| fr | fr_FR | SEO-fr.md |
| de | de_DE | SEO-de.md |
| pt | pt_BR | SEO-pt.md |
| sw | sw_KE | SEO-sw.md |
| zh | zh_CN | SEO-zh.md |

Dynamic meta via `usePageMeta` + `src/seo/pageMeta.js` — titles and descriptions switch per `?lang=` and LanguageSwitcher.

## Target Keywords
| Primary Keyword | Search Intent | Page |
|----------------|--------------|------|
| bitcoin document notarization | Transactional | / |
| free OpenTimestamps | Informational | /faq, /guides |
| proof of existence blockchain | Commercial | /comparison |
| eIDAS compliant timestamp | Commercial | /security |
| NIP-05 nostr identity | Informational | /identity |
| embed bitcoin proof badge | Commercial | /widgets |

## Indexed Pages (Build 37)
| Path | Priority |
|------|----------|
| / | 1.0 |
| /templates | 0.8 |
| /docs | 0.8 |
| /faq, /pricing, /comparison, /guides, /glossary | 0.7 |
| /integrations, /widgets, /identity, /security | 0.7 |
| /developer, /trust, /about, /pitch | 0.7–0.8 |

## Current Meta Tags (English)
| Tag | Value | Status |
|-----|-------|--------|
| Title | Stamp Documents on Bitcoin — Free Proof of Existence \| Satohash | ✅ |
| Description | Drop any file. Bitcoin-anchored proof in 60s. Free, private, zero-knowledge. | ✅ |
| og:locale | en_US (+ alternates per lang) | ✅ |
| twitter:site | @give_bit | ✅ |
| canonical | https://satohash.io | ✅ |

## Structured Data
- [x] Organization Schema (index.html)
- [x] WebSite Schema
- [x] BreadcrumbList (DocViewer, public pages)
- [x] FAQPage (FAQ.jsx)

## NIP-05 / Social
- Static `/.well-known/nostr.json` on satohash.io
- Cross-verify `kimi@giveabit.io` via giveabit.io nostr.json
- OG/Twitter tags on 14+ pages via usePageMeta

## Weekly Audit Log
| Date | Auditor | Findings | Recommendations |
|------|---------|----------|-----------------|
| 2026-06-24 | Kimi | Baseline created | Full Qwen audit pending |
| 2026-07-07 | Grok | Build 37: 7-lang SEO, hreflang, widgets, identity | Monitor Search Console after deploy |

---

*Safe Harbour · Part of the [Give A Bit](https://giveabit.io) family.*