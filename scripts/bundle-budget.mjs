#!/usr/bin/env node
/** Fail if the HTML-referenced app entry exceeds the budget (kB). */
import { readFileSync, statSync } from 'fs'
import { join } from 'path'

// Core loop (Stamp + Verify) is eager so those routes cannot hang on a
// lazy chunk that imports the HTML entry. Budget is the HTML entry only.
const MAX_KB = Number(process.env.BUNDLE_MAX_KB || 1400)
const htmlPath = join(process.cwd(), 'dist', 'index.html')
let html
try {
  html = readFileSync(htmlPath, 'utf8')
} catch {
  console.error('No dist/index.html — run npm run build first')
  process.exit(1)
}
const refs = [...html.matchAll(/src="(\/?b\/index-[^"]+\.js)"/g)].map((m) =>
  m[1].replace(/^\//, '')
)
if (!refs.length) {
  console.error('No /b/index-*.js script in dist/index.html')
  process.exit(1)
}
let failed = false
for (const rel of refs) {
  const file = join(process.cwd(), 'dist', rel)
  const kb = statSync(file).size / 1024
  console.log(`${rel}: ${kb.toFixed(1)} kB (max ${MAX_KB})`)
  if (kb > MAX_KB) failed = true
}
process.exit(failed ? 1 : 0)
