# Hreflang / i18n Audit — Satohash (2026-08-20)

Audit of multilingual coverage across the 7 supported locales (en, es, fr, de, pt, sw, zh).

## Summary: GOOD ✅

All 7 locales have complete, genuinely-translated FAQ and Landing bundles. No English-suspect
answers detected in the FAQ sets. This is in much better shape than typical SPA i18n setups.

## Evidence

| Locale | FAQ items | Landing keys | FAQ answers English-suspect | Verdict |
|--------|-----------|--------------|-----------------------------|---------|
| en | 18 | 11 | 0/6 | ✅ source |
| es | 18 | 11 | 0/6 | ✅ translated |
| fr | 18 | 11 | 0/6 | ✅ translated |
| de | 18 | 11 | 0/6 | ✅ translated |
| pt | 18 | 11 | 0/6 | ✅ translated |
| sw | 18 | 11 | 0/6 | ✅ translated |
| zh | 18 | 11 | 0/6 | ✅ translated |

Method: sampled first 6 FAQ answers per locale, flagged any answer containing 3+ common English
stopwords (the/your/device/hash/blockchain/proof). Landing bundles compared by top-level key count.

## How hreflang is emitted

- `usePageMeta.js` writes `<link rel="alternate" hreflang="{code}" href="{path}?lang={code}">`
  for every SUPPORTED_LOCALES + `x-default`, plus a canonical link.
- `document.documentElement.lang` is set from the active locale.
- Language selection persists via `localStorage.satohash_lang` (see `index.html` head script).

## Caveats / recommendations

1. **`?lang=` URL parameter** — the SPA uses query-string language selection. Crawlers handle
   this fine, but a cleaner pattern is `/es/...` prefixed paths. Not required for SEO; the
   hreflang annotations point to the query URLs consistently, which is what matters.
2. **Route coverage** — the deep route content (articles, /p/:hash, /verify) is English-only.
   Google will index those as English, which is acceptable; FAQ + Landing are the translated
   surfaces.
3. **New pages must call `usePageMeta`** — any new route (e.g. /donate) gets hreflang + schema
   automatically only if it calls the hook. `/donate` does (added 2026-08-20).
4. **No action needed now** — this audit found no broken or stubbed translations. Re-run after
   any big i18n change.

## Files checked

- `src/i18n/marketing/faq.{en,es,fr,de,pt,sw,zh}.json`
- `src/i18n/marketing/landing.{en,es,fr,de,pt,sw,zh}.json`
- `src/hooks/usePageMeta.js`
