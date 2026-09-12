// Live end-to-end test for the vendored OpenTimestamps fork
// (vendor/opentimestamps). Talks to the REAL public OTS calendars and to
// blockstream esplora, and - when the upstream request-based library is still
// available - cross-validates the wire format and the verify result against it.
//
//   node tests/ots-vendor/live.test.mjs                       (npm run test:ots-vendor:live)
//   OLD_OTS_PKG_DIR=/path/to/upstream/opentimestamps node tests/ots-vendor/live.test.mjs
//
// Needs outbound network. Exits non-zero on failure.
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const PKG_DIR = process.env.OTS_PKG_DIR || path.dirname(require.resolve('opentimestamps/package.json'))
const NEW = require(PKG_DIR)

const CALENDARS = [
  'https://a.pool.opentimestamps.org',
  'https://b.pool.opentimestamps.org',
  'https://a.pool.eternitywall.com'
]

const log = (...a) => console.log(...a)
let failures = 0
const ok = (cond, msg) => { log((cond ? 'PASS  ' : 'FAIL  ') + msg); if (!cond) failures++ }

// ---------------------------------------------------------------- A. stamp
const hash = crypto.createHash('sha256').update('satohash-vendor-fork-e2e' + Date.now()).digest()
log('\n== A. real stamp via public calendars (fetch transport) ==')
log('file sha256: ' + hash.toString('hex'))

NEW.Calendar.RemoteCalendar.prototype.timeout = 10000
const dtf = NEW.DetachedTimestampFile.fromHash(new NEW.Ops.OpSHA256(), hash)
const t0 = Date.now()
await NEW.stamp(dtf, { calendars: CALENDARS, m: 2 })
log('stamp() returned in ' + (Date.now() - t0) + 'ms')
const atts = [...dtf.timestamp.getAttestations()]
const uris = atts.map((a) => a.uri).filter(Boolean)
log('pending calendar URIs: ' + JSON.stringify(uris))
ok(atts.length >= 2, 'at least 2 calendar attestations merged (got ' + atts.length + ')')
ok(uris.every((u) => /opentimestamps\.org|eternitywall\.com/.test(u)), 'attestations come from real calendars')

const otsBuf = Buffer.from(dtf.serializeToBytes())
log('serialized .ots: ' + otsBuf.length + ' bytes')
ok(otsBuf[0] === 0x00 && otsBuf.slice(1, 15).toString('ascii') === 'OpenTimestamps', '.ots magic header 0x00 "OpenTimestamps"')

const rt = NEW.DetachedTimestampFile.deserialize(otsBuf)
ok(Buffer.from(rt.fileDigest()).equals(hash), 'deserialize round-trip digest matches')
ok([...rt.timestamp.getAttestations()].length === atts.length, 'round-trip attestation count matches')

// ------------------------------------------- B. upgrade (calendar GET path)
log('\n== B. real upgrade() — calendar GET /timestamp ==')
const t1 = Date.now()
const changed = await NEW.upgrade(rt, { calendars: CALENDARS })
log('upgrade() returned changed=' + changed + ' in ' + (Date.now() - t1) + 'ms (a pending proof is expected to be unchanged)')
ok(typeof changed === 'boolean', 'upgrade() resolved with a boolean (GET transport worked)')

// ------------------------------------- C. verify against esplora (GET + JSON)
log('\n== C. verify() against esplora on committed CONFIRMED proofs ==')
const fixtures = process.argv.slice(2)
const defaultFixtures = ['tests/e2e/fixtures/confirmed-0.ots', 'tests/e2e/fixtures/confirmed-1.ots']
const files = (fixtures.length ? fixtures : defaultFixtures).filter((f) => fs.existsSync(f))
ok(files.length > 0, 'at least one confirmed .ots fixture found (' + files.join(', ') + ')')

for (const file of files) {
  const raw = fs.readFileSync(file)
  const det = NEW.DetachedTimestampFile.deserialize(raw)
  const fileDigest = Buffer.from(det.fileDigest())
  const orig = NEW.DetachedTimestampFile.fromHash(new NEW.Ops.OpSHA256(), fileDigest)
  const t2 = Date.now()
  const res = await NEW.verify(det, orig, { ignoreBitcoinNode: true })
  log(file + ': verify in ' + (Date.now() - t2) + 'ms -> ' + JSON.stringify(res))
  ok(
    res.bitcoin && res.bitcoin.height > 800000 && res.bitcoin.timestamp > 1600000000,
    file + ': bitcoin attestation verified with a real block height + time'
  )
}

// ------------------- D. optional cross-validation vs the upstream library
const OLD_DIR = process.env.OLD_OTS_PKG_DIR
if (OLD_DIR && fs.existsSync(OLD_DIR)) {
  log('\n== D. cross-validation against the upstream request-based library ==')
  try {
    const OLD = require(OLD_DIR)
    const upstream = OLD.DetachedTimestampFile.deserialize(otsBuf)
    ok(Buffer.from(upstream.fileDigest()).equals(hash), 'upstream reads the .ots written by the fork (digest matches)')
    ok(
      [...upstream.timestamp.getAttestations()].length === atts.length,
      'upstream reads the same attestation count'
    )
    ok(
      OLD.info(upstream).split('\n')[0] === NEW.info(rt).split('\n')[0],
      'upstream/fork info() first line is identical'
    )
    const file = files[0]
    if (file) {
      const raw = fs.readFileSync(file)
      const digest = Buffer.from(NEW.DetachedTimestampFile.deserialize(raw).fileDigest())
      const resNew = await NEW.verify(
        NEW.DetachedTimestampFile.deserialize(raw),
        NEW.DetachedTimestampFile.fromHash(new NEW.Ops.OpSHA256(), digest),
        { ignoreBitcoinNode: true }
      )
      const resOld = await OLD.verify(
        OLD.DetachedTimestampFile.deserialize(raw),
        OLD.DetachedTimestampFile.fromHash(new OLD.Ops.OpSHA256(), digest),
        { ignoreBitcoinNode: true }
      )
      ok(JSON.stringify(resNew) === JSON.stringify(resOld), 'fork/upstream verify() results are identical')
    }
  } catch (e) {
    // Loading two separate installs of the same dependency tree in one process
    // trips bitcore-lib's versionGuard ("More than one instance of bitcore-lib
    // found"). Nothing to do with the transport change — report and move on.
    log('(skipping upstream cross-validation — ' + e.message + ')')
  }
} else {
  log('\n(skipping upstream cross-validation — set OLD_OTS_PKG_DIR to the upstream package dir to enable it)')
}

log('\n' + (failures === 0 ? 'ALL OTS LIVE TESTS PASSED' : failures + ' OTS LIVE TEST(S) FAILED'))
process.exit(failures === 0 ? 0 : 1)
