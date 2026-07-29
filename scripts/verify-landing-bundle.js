#!/usr/bin/env node
/**
 * Post-build guard: Landing code must not read fees.high without optional chaining.
 * Regression from mempool wrapper refactor (Build 79).
 *
 * Landing may be a separate Landing-*.js chunk (lazy) or inlined into the main
 * index-*.js bundle (eager). Strict scan only applies to Landing-* chunks;
 * eager mode confirms the main shell exists and is non-empty.
 */
import fs from 'fs'
import path from 'path'

const assetsDir = path.join(process.cwd(), 'dist', 'assets')

if (!fs.existsSync(assetsDir)) {
  console.error('verify-landing-bundle: dist/assets missing — run npm run build first')
  process.exit(1)
}

const allJs = fs.readdirSync(assetsDir).filter((name) => name.endsWith('.js'))
const landingFiles = allJs.filter((name) => name.startsWith('Landing-'))

const unsafeFeesHigh = /\.fees\.high\b/
const safeOptionalHigh =
  /\(\(_\w+\s*=\s*\w+\.fees\)\s*==\s*null\s*\?\s*void\s*0\s*:\s*_\w+\.high\)|fees\?\.high/

if (landingFiles.length > 0) {
  let failed = false
  for (const file of landingFiles) {
    const content = fs.readFileSync(path.join(assetsDir, file), 'utf8')
    if (unsafeFeesHigh.test(content)) {
      console.error(`verify-landing-bundle: unsafe .fees.high in ${file}`)
      failed = true
    }
    if (content.includes('fees') && !safeOptionalHigh.test(content)) {
      console.error(`verify-landing-bundle: missing optional fees?.high guard in ${file}`)
      failed = true
    }
  }
  if (failed) process.exit(1)
  console.log(`verify-landing-bundle: ok (chunk: ${landingFiles.join(', ')})`)
  process.exit(0)
}

// Eager Landing — no separate chunk. Confirm main app shell exists.
const indexFiles = allJs
  .filter((name) => name.startsWith('index-'))
  .sort(
    (a, b) =>
      fs.statSync(path.join(assetsDir, b)).size -
      fs.statSync(path.join(assetsDir, a)).size,
  )

if (indexFiles.length === 0) {
  console.error('verify-landing-bundle: no Landing-*.js or index-*.js in dist/assets')
  process.exit(1)
}

const main = indexFiles[0]
const size = fs.statSync(path.join(assetsDir, main)).size
if (size < 50_000) {
  console.error(`verify-landing-bundle: main shell ${main} too small (${size} bytes)`)
  process.exit(1)
}

console.log(`verify-landing-bundle: ok (eager-index: ${main}, ${size} bytes)`)
