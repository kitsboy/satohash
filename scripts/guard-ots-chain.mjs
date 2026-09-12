#!/usr/bin/env node
/**
 * GUARD: the OpenTimestamps proof chain must keep booting without the
 * deprecated request/request-promise stack.
 *
 * Why this exists (2026-09-12 incident):
 *   opentimestamps@0.4.9 -> request@2.88.2 -> require('uuid/v4')
 *   A security-override commit pinned request.uuid to ^9.0.1 (1bef960).
 *   uuid >=9 dropped the './v4' subpath from its exports map, so the API
 *   image crash-looped at boot with ERR_PACKAGE_PATH_NOT_EXPORTED and was
 *   down ~5 minutes before bfef38a dropped the override.
 *
 * The permanent fix (t_61803c78) removed the dependency instead of fencing it:
 * opentimestamps now resolves to ./vendor/opentimestamps, a fork of upstream
 * 0.4.9 whose calendar/esplora/RPC transport is src/request-shim.js over the
 * built-in global fetch. `request` and `request-promise` must never appear in
 * the install tree again — with them gone, that entire failure mode is
 * unreachable.
 *
 * This guard fails loudly if either package comes back, if the fork is not the
 * resolved opentimestamps, or if the OTS module stops loading. Run it after any
 * dependency, override or audit change (CI runs it on every push).
 */
import { createRequire } from 'node:module'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const require = createRequire(import.meta.url)

let failures = 0
const fail = (msg) => {
  failures++
  console.error(`  ✗ ${msg}`)
}
const ok = (msg) => console.log(`  ✓ ${msg}`)

console.log('ots-chain-guard — verifying the opentimestamps boot chain\n')

// (a) The OTS proof module must load (this is the require site that crashed).
let otsEntry = null
try {
  require('opentimestamps')
  otsEntry = require.resolve('opentimestamps')
  ok('require("opentimestamps") — the OTS proof module loads')
} catch (e) {
  fail(`require("opentimestamps") failed: ${e.message}`)
}

// (b) ... and it must be the vendored fork, not the upstream package.
if (otsEntry) {
  const pkgPath = require.resolve('opentimestamps/package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  const realDir = path.dirname(pkgPath)
  if (realDir.includes(`vendor${path.sep}opentimestamps`) || realDir.includes('vendor/opentimestamps')) {
    ok(`opentimestamps resolves to the vendored fork (${path.relative(process.cwd(), realDir) || realDir})`)
  } else {
    fail(`opentimestamps resolved to ${realDir} — expected the vendored fork at vendor/opentimestamps`)
  }
  if (String(pkg.version).includes('satohash')) {
    ok(`vendored fork version is ${pkg.version}`)
  } else {
    fail(`vendored fork version is ${pkg.version} — expected a *-satohash.N marker`)
  }
  const declared = Object.keys(pkg.dependencies || {})
  const banned = declared.filter((d) => d === 'request' || d === 'request-promise')
  if (banned.length === 0) {
    ok('the fork declares no request/request-promise dependency')
  } else {
    fail(`the fork declares the deprecated stack again: ${banned.join(', ')}`)
  }
  // the fork's transport must be the fetch shim, in every file that talks HTTP
  for (const f of ['calendar.js', 'esplora.js', 'bitcoin.js', 'request-shim.js']) {
    const p = path.join(realDir, 'src', f)
    if (!existsSync(p)) {
      fail(`missing ${path.relative(process.cwd(), p)}`)
      continue
    }
    const src = readFileSync(p, 'utf8')
    if (f !== 'request-shim.js' && /require\(['"]request(-promise)?['"]\)/.test(src)) {
      fail(`src/${f} still requires the deprecated request stack`)
    }
  }
  if (existsSync(path.join(realDir, 'src', 'request-shim.js'))) {
    ok('src/request-shim.js (fetch transport) is present')
  }
}

// (c) The deprecated stack must be absent from the tree entirely.
//     Checked against THIS repo's node_modules directly — require.resolve()
//     would walk up into parent directories and report unrelated installs.
const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
for (const dep of ['request', 'request-promise', 'request-promise-core']) {
  const installedAt = path.join(repoRoot, 'node_modules', dep)
  if (existsSync(installedAt)) {
    fail(`${dep} is installed again (${installedAt}) — the 2026-09-12 502 failure mode can return. Do not re-add it; do not add an overrides.${dep} block.`)
  } else {
    ok(`${dep} is not installed`)
  }
}

// (d) No package.json override may target the removed stack.
const rootPkg = JSON.parse(
  readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'package.json'), 'utf8')
)
const overrideKeys = Object.keys(rootPkg.overrides || {})
const staleOverrides = overrideKeys.filter((k) => k === 'request' || k === 'request-promise')
if (staleOverrides.length === 0) {
  ok('no stale overrides for the removed request stack')
} else {
  fail(`package.json overrides still target ${staleOverrides.join(', ')} — delete them (they have no target now)`)
}
const declaredOts = String((rootPkg.dependencies || {}).opentimestamps || '')
if (declaredOts.startsWith('file:vendor/opentimestamps')) {
  ok(`package.json pins opentimestamps to "${declaredOts}"`)
} else {
  fail(`package.json declares opentimestamps "${declaredOts}" — expected "file:vendor/opentimestamps"`)
}

if (failures > 0) {
  console.error(`\nots-chain-guard FAILED with ${failures} error(s). Do not ship this tree.`)
  process.exit(1)
}
console.log('\nots-chain-guard PASSED — opentimestamps runs on the vendored fetch transport.')
