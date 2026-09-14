#!/usr/bin/env node
/**
 * Deprecated shim. Canonical CLI: packages/satohash-cli/bin/satohash.js
 */
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const realCli = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../packages/satohash-cli/bin/satohash.js'
)

console.error('Deprecated: use packages/satohash-cli — forwarding to the canonical CLI.')

const child = spawn(process.execPath, [realCli, ...process.argv.slice(2)], {
  stdio: 'inherit'
})

child.on('error', (err) => {
  const rest = process.argv.slice(2).join(' ')
  console.error(
    `Failed to start canonical CLI. Run: node packages/satohash-cli/bin/satohash.js${rest ? ` ${rest}` : ''}`
  )
  console.error(err.message)
  process.exit(1)
})

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  else process.exit(code ?? 1)
})
