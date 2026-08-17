#!/usr/bin/env node
/** Fail if landing index chunk exceeds the budget (kB). */
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

const MAX_KB = Number(process.env.BUNDLE_MAX_KB || 420)
const dir = join(process.cwd(), 'dist', 'b')
let files
try {
  files = readdirSync(dir).filter((f) => /^index-.*\.js$/.test(f))
} catch {
  console.error('No dist/b — run npm run build first')
  process.exit(1)
}
if (!files.length) {
  console.error('No index-*.js in dist/b')
  process.exit(1)
}
let failed = false
for (const f of files) {
  const kb = statSync(join(dir, f)).size / 1024
  console.log(`${f}: ${kb.toFixed(1)} kB (max ${MAX_KB})`)
  if (kb > MAX_KB) failed = true
}
process.exit(failed ? 1 : 0)
