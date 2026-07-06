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

function extractInlineTranslations() {
  const indexPath = path.join(root, 'src/i18n/index.jsx')
  const source = fs.readFileSync(indexPath, 'utf-8')
  const match = source.match(/export const translations = (\{[\s\S]*?\n\})\s*\n/)
  if (!match) return {}

  // eslint-disable-next-line no-new-func
  const translations = Function(`"use strict"; return (${match[1]})`)()
  const result = {}
  for (const [lang, tree] of Object.entries(translations)) {
    result[lang] = new Set(flattenKeys(tree))
  }
  return result
}

const jsonLocales = [
  'src/i18n/translations/en.json',
  'src/i18n/translations/es.json',
  'src/i18n/translations/fr.json',
  'src/i18n/translations/de.json',
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
if (enInline) {
  const requiredNav = ['nav.stamp', 'nav.vault', 'stamp.title', 'stamp.dropzone', 'common.loading']
  const missingInline = requiredNav.filter((k) => !enInline.has(k))
  if (missingInline.length) {
    failed = true
    console.error(`❌ src/i18n/index.jsx (en) missing keys: ${missingInline.join(', ')}`)
  } else {
    console.log(`✅ src/i18n/index.jsx inline en — core keys present`)
  }
}

if (failed) {
  console.error('\n❌ i18n check failed')
  process.exit(1)
}

console.log('\n✅ All i18n locales aligned')
process.exit(0)