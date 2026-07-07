#!/usr/bin/env node
/**
 * Post-build guard: Landing chunk must not read fees.high without optional chaining.
 * Regression from mempool wrapper refactor (Build 79).
 */
import fs from 'fs'
import path from 'path'

const assetsDir = path.join(process.cwd(), 'dist', 'assets')

if (!fs.existsSync(assetsDir)) {
  console.error('verify-landing-bundle: dist/assets missing — run npm run build first')
  process.exit(1)
}

const landingFiles = fs
  .readdirSync(assetsDir)
  .filter((name) => name.startsWith('Landing-') && name.endsWith('.js'))

if (landingFiles.length === 0) {
  console.error('verify-landing-bundle: no Landing-*.js chunk in dist/assets')
  process.exit(1)
}

const unsafeFeesHigh = /\.fees\.high\b/
const safeOptionalHigh = /\(\(_\w+\s*=\s*\w+\.fees\)\s*==\s*null\s*\?\s*void\s*0\s*:\s*_\w+\.high\)/

let failed = false

for (const file of landingFiles) {
  const content = fs.readFileSync(path.join(assetsDir, file), 'utf8')

  if (unsafeFeesHigh.test(content)) {
    console.error(`verify-landing-bundle: unsafe .fees.high in ${file}`)
    failed = true
  }

  if (!safeOptionalHigh.test(content)) {
    console.error(`verify-landing-bundle: missing optional fees?.high guard in ${file}`)
    failed = true
  }
}

if (failed) {
  process.exit(1)
}

console.log(`verify-landing-bundle: ok (${landingFiles.join(', ')})`)