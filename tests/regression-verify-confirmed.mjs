// Regression: a known-confirmed .ots fixture must verify `verified:true` and its
// confirmation must be detectable. Guards F3 (brittle confirmation detection):
// the daemon/route detect confirmation via OpenTimestamps.info() text.
//
//  F3 finding (2026-08-22, Ziggy): the daemon regex /Bitcoin block (\d+)/ returns
//  NULL on the current info() format ("verify BitcoinBlockHeaderAttestation(963545)"
//  and "# Bitcoin block merkle root <hash>"). Confirmation STILL resolves because
//  info().includes('Bitcoin block') matches the merkle-root line — so verified:true
//  holds — but the block HEIGHT is never parsed, leaving bitcoin_block_height=null
//  on every confirmed stamp. This test pins the F3 surface so a format change that
//  breaks either (a) confirmation detection or (b) height extraction fails loudly.
//
//  Fix to route to Grok/M3 (needs Cam go per family precedent):
//    const m = info.match(/BlockHeaderAttestation\((\d+)\)/)  // matches 963545
//    blockHeight = m ? parseInt(m[1], 10) : null
import fs from 'node:fs'
import OpenTimestamps from 'opentimestamps'

const FIXTURE = process.env.OTS_FIXTURE || 'tests/e2e/fixtures/confirmed-0.ots'
const API = process.env.OTS_API || 'http://localhost:3001'

function loadOtsFile(buf) {
  return OpenTimestamps.DetachedTimestampFile.deserialize(buf)
}

let failures = 0
function check(name, cond, detail = '') {
  if (cond) {
    console.log(`  PASS  ${name}`)
  } else {
    failures++
    console.log(`  FAIL  ${name} ${detail}`)
  }
}

async function main() {
  const buf = fs.readFileSync(FIXTURE)
  console.log(`\nFixture: ${FIXTURE} (${buf.length} bytes)`)
  const detached = loadOtsFile(buf)
  const info = OpenTimestamps.info(detached)

  // 1. F3 guard A — confirmation is still detectable (the gate that sets verified:true)
  check('F3: info() confirms the proof (includes "Bitcoin block")', info.includes('Bitcoin block'))

  // 2. F3 guard B — the current info() format carries the block height as
  //    BitcoinBlockHeaderAttestation(<H>). This is what the fix must parse.
  const m = info.match(/BlockHeaderAttestation\((\d+)\)/)
  check('F3: block height present in info() (BitcoinBlockHeaderAttestation)', !!m,
    `-> parsed block ${m ? m[1] : '(none)'}`)
  if (m) console.log(`       confirmed@block ${m[1]}`)

  // 3. Known regression symptom: the OLD /Bitcoin block (\d+)/ regex is broken on
  //    this format. Assert the F3 gap so the test documents the live behaviour.
  const oldM = info.match(/Bitcoin block (\d+)/)
  check('F3-gap: /Bitcoin block (\\d+)/ regex FAILS to parse height (known, flagged)',
    oldM === null, oldM ? `-> UNEXPECTEDLY parsed ${oldM[1]}` : '(regex correctly returns null — gap confirmed)')

  // 4. Sovereign verify path — replicate the production verdict logic exactly:
  //    try verify(own node); on any error fall back to info() text confirmation.
  //    This is what /api/verify does today. The final truth is verified:true.
  let verified = false
  try {
    const vr = await OpenTimestamps.verify(detached)
    verified = !!(vr && Object.keys(vr).length > 0)
  } catch (_ve) {
    /* verification pending / hash-based proof — fall through */
  }
  if (info.includes('Bitcoin block')) verified = true
  check('sovereign verify path resolves verified:true', verified === true)

  // 5. Live API .ots-upload path returns verified:true (the acceptance contract)
  try {
    const form = new FormData()
    form.append('otsFile', new Blob([buf]), 'confirmed.ots')
    const res = await fetch(`${API}/api/verify`, { method: 'POST', body: form })
    const body = await res.json()
    check('live /api/verify(.ots) returns verified:true', body.verified === true,
      `-> verified=${body.verified}`)
  } catch (e) {
    check('live /api/verify(.ots) returns verified:true', false, `-> threw: ${e.message}`)
  }

  console.log(failures === 0 ? '\nALL REGRESSION CHECKS PASSED\n' : `\n${failures} REGRESSION CHECK(S) FAILED\n`)
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((e) => {
  console.error('FATAL', e)
  process.exit(1)
})
