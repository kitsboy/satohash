#!/usr/bin/env node
/** Do not ship .map files to CF Pages — smaller deploy, no source leak. */
import { readdirSync, unlinkSync, statSync } from 'fs'
import { join } from 'path'

function walk(dir) {
  let n = 0
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) n += walk(p)
    else if (name.endsWith('.map')) {
      unlinkSync(p)
      n++
    }
  }
  return n
}

const root = join(process.cwd(), 'dist')
try {
  const n = walk(root)
  console.log(`strip-dist-sourcemaps: removed ${n} map file(s)`)
} catch {
  console.log('strip-dist-sourcemaps: no dist (ok)')
}
