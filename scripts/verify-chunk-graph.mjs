#!/usr/bin/env node
/**
 * Fail the build if Stamp/Verify page chunks statically import the HTML entry.
 * That cycle hung /stamp + /verify on LoadingScreen (lazy import of a chunk
 * that imports index-*.js while the entry is still evaluating).
 */
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

const dist = join(process.cwd(), 'dist')
const htmlPath = join(dist, 'index.html')
const assetsDir = join(dist, 'b')

if (!existsSync(htmlPath) || !existsSync(assetsDir)) {
  console.error('verify-chunk-graph: dist/index.html or dist/b missing — run npm run build first')
  process.exit(1)
}

const html = readFileSync(htmlPath, 'utf8')
const entryRefs = [...html.matchAll(/src="(\/?b\/index-[^"]+\.js)"/g)].map((m) =>
  m[1].replace(/^\//, '').replace(/^b\//, '')
)
if (!entryRefs.length) {
  console.error('verify-chunk-graph: no /b/index-*.js script in dist/index.html')
  process.exit(1)
}

const pageRe = /^(Stamp|StampDone|VerificationTool|stamp-page|verify-page)-.+\.js$/
const pages = readdirSync(assetsDir).filter((n) => pageRe.test(n))
let failed = false

for (const entry of entryRefs) {
  for (const page of pages) {
    const src = readFileSync(join(assetsDir, page), 'utf8')
    if (src.includes(`./${entry}`) || src.includes(`/b/${entry}`)) {
      console.error(`verify-chunk-graph: ${page} imports HTML entry ${entry} (circular)`)
      failed = true
    }
  }
}

if (failed) process.exit(1)
if (pages.length) {
  console.log(
    `verify-chunk-graph: ok (${pages.join(', ')} do not import ${entryRefs.join(', ')})`
  )
} else {
  console.log(
    `verify-chunk-graph: ok (no separate Stamp/Verify chunks; entry ${entryRefs.join(', ')})`
  )
}
