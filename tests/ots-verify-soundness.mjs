#!/usr/bin/env node
/**
 * OTS verify soundness suite — the regression guard for F1 + F3 (t_da054829).
 *
 * Replaces tests/regression-verify-confirmed.mjs, which pinned the BUG: it
 * asserted that a proof "confirms" because the rendered info() text contains
 * the substring "Bitcoin block", and that `/Bitcoin block (\d+)/` failing to
 * parse a height was acceptable. Both were symptoms of the same defect — the
 * API reported `verified: true` for a proof it had never checked.
 *
 * What this suite proves, against a RUNNING api (local or live):
 *   1. A forged proof claiming a block that does not exist is NOT verified.
 *   2. A forged proof claiming a real block whose merkle root never committed
 *      to its digest is NOT verified.
 *   3. A genuine, block-anchored proof IS verified — and says how (own bitcoind
 *      first, explorer only as a labelled fallback).
 *   4. `verified: true` always carries a resolved block height + method. There
 *      is no path that asserts verification without an anchor.
 *   5. A hash-only lookup is answered as a REGISTRY check that still resolves
 *      the stored proof against the chain, and hands back the .ots so the
 *      caller can reach the same answer without trusting Satohash.
 *
 * Usage:
 *   node tests/ots-verify-soundness.mjs                      # http://localhost:3001
 *   API_URL=https://api.satohash.io node tests/ots-verify-soundness.mjs
 */
import fs from 'node:fs'
import crypto from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import OpenTimestamps from 'opentimestamps'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const API = (process.env.API_URL || 'http://localhost:3001').replace(/\/$/, '')
const FIXTURE = process.env.OTS_FIXTURE || path.join(__dirname, 'e2e/fixtures/confirmed-0.ots')

let failures = 0
function check (name, cond, detail = '') {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
  if (!cond) failures++
}

/** A proof that CLAIMS a Bitcoin block, with no chain contact at all. */
function forgeProof (height, label = 'forged') {
  const digest = crypto.createHash('sha256').update(label + Date.now()).digest()
  const ts = new OpenTimestamps.Timestamp(Array.from(digest))
  ts.attestations.push(new OpenTimestamps.Notary.BitcoinBlockHeaderAttestation(height))
  return new OpenTimestamps.DetachedTimestampFile(new OpenTimestamps.Ops.OpSHA256(), ts)
}

async function postOts (buf, filename = 'proof.ots', hash = null) {
  const fd = new FormData()
  fd.append('otsFile', new Blob([buf], { type: 'application/octet-stream' }), filename)
  if (hash) fd.append('hash', hash)
  const res = await fetch(`${API}/api/verify`, { method: 'POST', body: fd })
  let body = null
  try {
    body = await res.json()
  } catch {
    body = { raw: '<non-JSON>' }
  }
  return { status: res.status, body }
}

async function postHash (hash) {
  const res = await fetch(`${API}/api/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hash })
  })
  let body = null
  try {
    body = await res.json()
  } catch {
    body = { raw: '<non-JSON>' }
  }
  return { status: res.status, body }
}

function assertVerdictInvariant (label, body) {
  if (body?.verified === true) {
    check(`${label}: verified:true carries a block height`, Number.isFinite(body.bitcoin_block_height),
      `-> height=${body.bitcoin_block_height}`)
    check(`${label}: verified:true names its verification method`, typeof body.verified_method === 'string' && body.verified_method.length > 0,
      `-> method=${body.verified_method} trust=${body.trust}`)
  } else {
    check(`${label}: not verified -> a reason is given`, typeof body?.reason === 'string' && body.reason.length > 0,
      `-> reason=${body?.reason}`)
  }
}

async function main () {
  console.log(`\nOTS verify soundness suite\n  API: ${API}\n  fixture: ${FIXTURE}\n`)

  console.log('=== 1. forged proof: block height that does not exist ===')
  const forgedMissing = await postOts(forgeProof(999999).serializeToBytes())
  console.log('       ' + JSON.stringify({ verified: forgedMissing.body?.verified, reason: forgedMissing.body?.reason }))
  check('forged height 999999 is NOT verified (pre-fix: verified:true)', forgedMissing.body?.verified !== true)
  check('reason is block_does_not_exist', forgedMissing.body?.reason === 'block_does_not_exist',
    `-> ${forgedMissing.body?.reason}`)
  assertVerdictInvariant('forged-999999', forgedMissing.body)

  console.log('\n=== 2. forged proof: real height, digest in no merkle root ===')
  const forgedReal = await postOts(forgeProof(963600).serializeToBytes())
  console.log('       ' + JSON.stringify({ verified: forgedReal.body?.verified, reason: forgedReal.body?.reason }))
  check('forged height 963600 is NOT verified', forgedReal.body?.verified !== true)
  check('reason is merkle_root_mismatch', forgedReal.body?.reason === 'merkle_root_mismatch',
    `-> ${forgedReal.body?.reason}`)

  console.log('\n=== 3. genuine block-anchored proof IS verified ===')
  if (!fs.existsSync(FIXTURE)) {
    check(`fixture exists at ${FIXTURE}`, false)
  } else {
    const buf = fs.readFileSync(FIXTURE)
    const genuine = await postOts(buf, 'confirmed.ots')
    console.log(`       ${JSON.stringify({ verified: genuine.body?.verified, method: genuine.body?.verified_method, block: genuine.body?.bitcoin_block_height, reason: genuine.body?.reason })}`)
    check('genuine confirmed proof verifies', genuine.body?.verified === true)
    check('verdict names the verification method', typeof genuine.body?.verified_method === 'string',
      `-> ${genuine.body?.verified_method} / ${genuine.body?.trust}`)
    check('verdict carries the resolved block height', Number.isFinite(genuine.body?.bitcoin_block_height))
    check('verdict carries the resolved block hash', typeof genuine.body?.block_hash === 'string' && genuine.body.block_hash.length === 64)
    check('independent verification instructions are present', Boolean(genuine.body?.independent_verification?.command))
    assertVerdictInvariant('genuine-proof', genuine.body)

    console.log('\n=== 4. .ots upload bound to the wrong hash is rejected ===')
    const mismatched = await postOts(buf, 'confirmed.ots', 'f'.repeat(64))
    check('proof for a different hash is NOT verified', mismatched.body?.verified !== true)
    check('reason is digest_mismatch', mismatched.body?.reason === 'digest_mismatch',
      `-> ${mismatched.body?.reason}`)

    console.log('\n=== 5. hash-only lookup is a labelled REGISTRY check + a real verdict ===')
    const digest = OpenTimestamps.DetachedTimestampFile.deserialize(buf).fileDigest()
    const hex = Buffer.from(digest).toString('hex')
    const byHash = await postHash(hex)
    console.log('       ' + JSON.stringify({
      status: byHash.status,
      verified: byHash.body?.verified,
      registry_check: byHash.body?.registry_check,
      registry_status: byHash.body?.registry_status,
      method: byHash.body?.verified_method,
      has_ots_url: Boolean(byHash.body?.ots_download_url)
    }))
    if (byHash.status === 404) {
      check('fixture hash is not in the live registry — lookup answered 404 with registry.found=false (not a bare flag)',
        byHash.body?.registry?.found === false)
    } else {
      check('hash lookup is labelled as a registry check', byHash.body?.registry_check === true)
      check('hash lookup still resolves the proof against the chain', byHash.body?.verified === true,
        `-> verified=${byHash.body?.verified} reason=${byHash.body?.reason}`)
      check('hash lookup exposes the stored registry status separately', 'registry_status' in (byHash.body || {}))
      check('hash lookup hands back the .ots for independent verification',
        typeof byHash.body?.ots_download_url === 'string' && byHash.body.ots_download_url.includes('?download=true'))
      assertVerdictInvariant('hash-lookup', byHash.body)
    }
  }

  console.log('\n=== 6. unknown hash ===')
  const unknown = await postHash(crypto.createHash('sha256').update('never-stamped-' + Date.now()).digest('hex'))
  check('unknown hash -> 404', unknown.status === 404, `-> ${unknown.status}`)
  check('unknown hash response is labelled registry.found=false', unknown.body?.registry?.found === false)

  console.log('\n' + (failures === 0 ? 'ALL SOUNDNESS CHECKS PASSED' : `${failures} SOUNDNESS CHECK(S) FAILED`) + '\n')
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error('FATAL', err)
  process.exit(1)
})
