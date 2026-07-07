#!/usr/bin/env node
/**
 * Verifies i18n key parity across locale JSON files and inline translations.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function flattenKeys(obj, prefix = '') {
  const keys = []
  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, full))
    } else {
      keys.push(full)
    }
  }
  return keys
}

function loadJsonKeys(relPath) {
  const full = path.join(root, relPath)
  if (!fs.existsSync(full)) return { path: relPath, keys: new Set() }
  const data = JSON.parse(fs.readFileSync(full, 'utf-8'))
  return { path: relPath, keys: new Set(flattenKeys(data)) }
}

function loadInlineLocale(relPath) {
  const full = path.join(root, relPath)
  if (!fs.existsSync(full)) return new Set()
  const source = fs.readFileSync(full, 'utf-8')
  const match = source.match(/export default (\{[\s\S]*\})\s*$/)
  if (!match) return new Set()
  // eslint-disable-next-line no-new-func
  const tree = Function(`"use strict"; return (${match[1]})`)()
  return new Set(flattenKeys(tree))
}

function extractInlineTranslations() {
  const indexPath = path.join(root, 'src/i18n/index.jsx')
  const source = fs.readFileSync(indexPath, 'utf-8')
  // Only eval inline locale blocks (en, es, fr, zh, ar) — imported locales checked separately
  const match = source.match(/export const translations = \{([\s\S]*?)\n  de,/)
  const inlineBlock = match ? `{${match[1].trim().replace(/,\s*$/, '')}}` : null
  const result = {}
  if (inlineBlock) {
    // eslint-disable-next-line no-new-func
    const translations = Function(`"use strict"; return (${inlineBlock})`)()
    for (const [lang, tree] of Object.entries(translations)) {
      result[lang] = new Set(flattenKeys(tree))
    }
  }
  for (const lang of ['de', 'pt', 'sw']) {
    result[lang] = loadInlineLocale(`src/i18n/inline/${lang}.js`)
  }
  return result
}

const jsonLocales = [
  'src/i18n/translations/en.json',
  'src/i18n/translations/es.json',
  'src/i18n/translations/fr.json',
  'src/i18n/translations/de.json',
  'src/i18n/translations/pt.json',
  'src/i18n/translations/sw.json',
  'src/i18n/translations/zh.json'
]

const loaded = jsonLocales.map(loadJsonKeys)
const reference = loaded.find((l) => l.path.includes('en.json'))
const inline = extractInlineTranslations()

let failed = false

console.log('🌐 i18n key presence check\n')

for (const locale of loaded) {
  if (locale.path === reference.path) continue
  const missing = [...reference.keys].filter((k) => !locale.keys.has(k))
  const extra = [...locale.keys].filter((k) => !reference.keys.has(k))
  if (missing.length) {
    failed = true
    console.error(`❌ ${locale.path}`)
    console.error(`   Missing (${missing.length}): ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? '…' : ''}`)
  } else if (extra.length) {
    console.log(`✅ ${locale.path} — ${locale.keys.size} keys (${extra.length} extra vs en, OK)`)
  } else {
    console.log(`✅ ${locale.path} — ${locale.keys.size} keys`)
  }
}

const enInline = inline.en
const requiredNav = ['nav.stamp', 'nav.vault', 'stamp.title', 'stamp.dropzone', 'common.loading']
const requiredShell = [
  'vault.serverUnreachable',
  'vault.loadMoreFailed',
  'forum.npubRequired',
  'common.retry'
]
if (enInline) {
  const missingInline = [...requiredNav, ...requiredShell].filter((k) => !enInline.has(k))
  if (missingInline.length) {
    failed = true
    console.error(`❌ src/i18n/index.jsx (en) missing keys: ${missingInline.join(', ')}`)
  } else {
    console.log(`✅ src/i18n/index.jsx inline en — core + vault/forum keys present`)
  }
}
for (const lang of ['es', 'fr', 'zh', 'ar']) {
  const keys = inline[lang]
  if (!keys?.size) continue
  const missing = requiredShell.filter((k) => !keys.has(k))
  if (missing.length) {
    failed = true
    console.error(`❌ src/i18n/index.jsx (${lang}) missing: ${missing.join(', ')}`)
  } else {
    console.log(`✅ src/i18n/index.jsx (${lang}) — vault/forum keys present`)
  }
}
for (const lang of ['de', 'pt', 'sw']) {
  const keys = inline[lang]
  if (!keys?.size) {
    failed = true
    console.error(`❌ src/i18n/inline/${lang}.js — empty or missing`)
    continue
  }
  const missing = [...requiredNav, ...requiredShell].filter((k) => !keys.has(k))
  if (missing.length) {
    failed = true
    console.error(`❌ src/i18n/inline/${lang}.js missing: ${missing.join(', ')}`)
  } else {
    console.log(`✅ src/i18n/inline/${lang}.js — core + vault/forum keys present`)
  }
}

// Marketing pages JSON parity (pages.en.json reference)
const marketingLocales = [
  'src/i18n/marketing/pages.en.json',
  'src/i18n/marketing/pages.es.json',
  'src/i18n/marketing/pages.fr.json',
  'src/i18n/marketing/pages.de.json',
  'src/i18n/marketing/pages.pt.json',
  'src/i18n/marketing/pages.sw.json',
  'src/i18n/marketing/pages.zh.json'
]

const marketingLoaded = marketingLocales.map(loadJsonKeys)
const marketingRef = marketingLoaded.find((l) => l.path.includes('pages.en.json'))

if (marketingRef) {
  console.log('\n📄 Marketing pages key check\n')
  for (const locale of marketingLoaded) {
    if (locale.path === marketingRef.path) continue
    const missing = [...marketingRef.keys].filter((k) => !locale.keys.has(k))
    if (missing.length) {
      failed = true
      console.error(`❌ ${locale.path}`)
      console.error(
        `   Missing (${missing.length}): ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? '…' : ''}`
      )
    } else {
      console.log(`✅ ${locale.path} — ${locale.keys.size} keys`)
    }
  }
}

// Landing JSON parity
const landingLocales = [
  'src/i18n/marketing/landing.en.json',
  'src/i18n/marketing/landing.es.json',
  'src/i18n/marketing/landing.fr.json',
  'src/i18n/marketing/landing.de.json',
  'src/i18n/marketing/landing.pt.json',
  'src/i18n/marketing/landing.sw.json',
  'src/i18n/marketing/landing.zh.json'
]
const landingLoaded = landingLocales.map(loadJsonKeys)
const landingRef = landingLoaded.find((l) => l.path.includes('landing.en.json'))
if (landingRef) {
  console.log('\n🏠 Landing pages key check\n')
  for (const locale of landingLoaded) {
    if (locale.path === landingRef.path) continue
    if (!fs.existsSync(path.join(root, locale.path))) continue
    const missing = [...landingRef.keys].filter((k) => !locale.keys.has(k))
    if (missing.length) {
      failed = true
      console.error(`❌ ${locale.path} — missing ${missing.length} keys`)
    } else {
      console.log(`✅ ${locale.path} — ${locale.keys.size} keys`)
    }
  }
}

// FAQ JSON parity
const faqLocales = [
  'src/i18n/marketing/faq.en.json',
  'src/i18n/marketing/faq.es.json',
  'src/i18n/marketing/faq.fr.json',
  'src/i18n/marketing/faq.de.json',
  'src/i18n/marketing/faq.pt.json',
  'src/i18n/marketing/faq.sw.json',
  'src/i18n/marketing/faq.zh.json'
]
const faqLoaded = faqLocales.map(loadJsonKeys)
const faqRef = faqLoaded.find((l) => l.path.includes('faq.en.json'))
if (faqRef) {
  console.log('\n❓ FAQ key check\n')
  for (const locale of faqLoaded) {
    if (locale.path === faqRef.path) continue
    if (!fs.existsSync(path.join(root, locale.path))) continue
    const missing = [...faqRef.keys].filter((k) => !locale.keys.has(k))
    if (missing.length) {
      failed = true
      console.error(`❌ ${locale.path} — missing ${missing.length} keys`)
    } else {
      console.log(`✅ ${locale.path} — ${locale.keys.size} keys`)
    }
  }
}

if (failed) {
  console.error('\n❌ i18n check failed')
  process.exit(1)
}

console.log('\n✅ All i18n locales aligned')
process.exit(0)