// Transport integration tests for the vendored OpenTimestamps fork
// (vendor/opentimestamps). Runs entirely against a LOCAL http server — no
// outbound network and no docker required.
//
//   node tests/ots-vendor/transport.test.mjs        (npm run test:ots-vendor)
//
// Exits non-zero on any failure, so it is safe to wire into CI.
import http from 'node:http'
import assert from 'node:assert'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const PKG_DIR = process.env.OTS_PKG_DIR || path.dirname(require.resolve('opentimestamps/package.json'))
const OTS = require(PKG_DIR)
const Timestamp = require(path.join(PKG_DIR, 'src/timestamp.js'))
const Context = require(path.join(PKG_DIR, 'src/context.js'))
const Notary = require(path.join(PKG_DIR, 'src/notary.js'))
const Esplora = require(path.join(PKG_DIR, 'src/esplora.js'))
const Bitcoin = require(path.join(PKG_DIR, 'src/bitcoin.js'))
const shim = require(path.join(PKG_DIR, 'src/request-shim.js'))
const pkg = require(path.join(PKG_DIR, 'package.json'))

const results = []
const check = (name, fn) => { results.push([name, fn]) }

const digest = Buffer.alloc(32, 7)
let lastSubmit = null
const rpcCalls = []

const server = http.createServer((req, res) => {
  const url = req.url || ''
  if (url === '/digest' && req.method === 'POST') {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => {
      const raw = Buffer.concat(chunks)
      lastSubmit = { ct: req.headers['content-type'], accept: req.headers['accept'], len: raw.length }
      const t = new Timestamp([...digest])
      t.attestations.push(new Notary.PendingAttestation('http://127.0.0.1:' + port))
      const ctx = new Context.StreamSerialization()
      t.serialize(ctx)
      res.writeHead(200, { 'Content-Type': 'application/vnd.opentimestamps.v1' })
      res.end(Buffer.from(ctx.getOutput()))
    })
    return
  }
  if (url.startsWith('/timestamp/')) {
    if (url.includes('deadbeef')) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Commitment not found')
      return
    }
    const t = new Timestamp([...digest])
    t.attestations.push(new Notary.BitcoinBlockHeaderAttestation(800000))
    const ctx = new Context.StreamSerialization()
    t.serialize(ctx)
    res.writeHead(200, { 'Content-Type': 'application/vnd.opentimestamps.v1' })
    res.end(Buffer.from(ctx.getOutput()))
    return
  }
  if (url.startsWith('/block-height/')) {
    res.writeHead(200, { 'Content-Type': 'plain/text' })
    res.end('00000000000000000001abcdef')
    return
  }
  if (url.startsWith('/block/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ merkle_root: 'aa'.repeat(32), timestamp: 1700000000 }))
    return
  }
  if (url === '/rpc' && req.method === 'POST') {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => {
      rpcCalls.push({
        auth: req.headers.authorization,
        ct: req.headers['content-type'],
        raw: Buffer.concat(chunks).toString()
      })
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ result: { merkleroot: 'bb'.repeat(32), hash: 'cc'.repeat(32), time: 1700000001 } }))
    })
    return
  }
  res.writeHead(500)
  res.end('unknown route ' + url)
})

await new Promise((r) => server.listen(0, '127.0.0.1', r))
const port = server.address().port
const base = 'http://127.0.0.1:' + port

check('vendored fork is the installed opentimestamps', async () => {
  assert.match(PKG_DIR, /vendor[/\\]opentimestamps$/, 'opentimestamps must resolve to vendor/opentimestamps')
  assert.match(String(pkg.version), /satohash/, 'fork version marker missing: ' + pkg.version)
  assert.deepStrictEqual(
    Object.keys(pkg.dependencies).filter((d) => d === 'request' || d === 'request-promise'),
    [],
    'fork still declares the deprecated request stack'
  )
})

check('calendar.submit: binary POST round-trips through fetch', async () => {
  const cal = new OTS.Calendar.RemoteCalendar(base)
  const ts = await cal.submit([...digest])
  assert.ok(ts, 'no timestamp returned')
  assert.strictEqual(ts.msg.length, 32)
  assert.strictEqual([...ts.getAttestations()].length, 1)
  assert.strictEqual([...ts.getAttestations()][0].uri, base)
  assert.strictEqual(lastSubmit.ct, 'application/x-www-form-urlencoded')
  assert.strictEqual(lastSubmit.accept, 'application/vnd.opentimestamps.v1')
  assert.strictEqual(lastSubmit.len, 32, 'digest body length must be exactly 32 bytes')
})

check('shim: non-2xx rejects with .statusCode and .error', async () => {
  let err = null
  try { await shim({ url: base + '/nope', method: 'GET' }) } catch (e) { err = e }
  assert.ok(err, 'expected a rejection')
  assert.strictEqual(err.statusCode, 500)
  assert.match(String(err.error), /unknown route/)
})

check('calendar.getTimestamp: 200 returns a Bitcoin attestation', async () => {
  const cal = new OTS.Calendar.RemoteCalendar(base)
  const ts = await cal.getTimestamp([...digest])
  const atts = [...ts.getAttestations()]
  assert.strictEqual(atts.length, 1)
  assert.strictEqual(atts[0].height, 800000)
})

check('calendar.getTimestamp: 404 maps to CommitmentNotFoundError', async () => {
  const cal = new OTS.Calendar.RemoteCalendar(base)
  let err = null
  try {
    await cal.getTimestamp([...Buffer.from('deadbeef'.repeat(8), 'hex')])
  } catch (e) { err = e }
  assert.ok(err, 'expected a rejection')
  assert.strictEqual(err.name, 'CommitmentNotFoundError')
  assert.match(String(err.message), /Commitment not found/)
})

check('calendar timeout: honours RemoteCalendar.prototype.timeout (ms, soft-fails)', async () => {
  // RemoteCalendar.submit always POSTs to <host>/digest, so point it at a host
  // that never answers and rely on the prototype timeout ots-helpers.js sets.
  const slowServer = http.createServer((_req, _res) => { /* never respond */ })
  await new Promise((r) => slowServer.listen(0, '127.0.0.1', r))
  const cal = new OTS.Calendar.RemoteCalendar('http://127.0.0.1:' + slowServer.address().port)
  cal.timeout = 400
  const t0 = Date.now()
  let err = null
  try { await cal.submit([...digest]) } catch (e) { err = e }
  const dt = Date.now() - t0
  slowServer.closeAllConnections()
  slowServer.close()
  assert.ok(err, 'expected a rejection')
  assert.ok(dt < 3000, 'timeout was not honoured, took ' + dt + 'ms')
  assert.strictEqual(err.name, 'URLError')
})

check('esplora: text blockhash + json block', async () => {
  const esp = new Esplora({ url: base, timeout: 3000 })
  const hash = await esp.blockhash(1)
  assert.strictEqual(hash, '00000000000000000001abcdef')
  const blk = await esp.block(hash)
  assert.strictEqual(blk.merkleroot, 'aa'.repeat(32))
  assert.strictEqual(blk.time, 1700000000)
})

check('bitcoin RPC: POST json + Authorization header', async () => {
  const node = new Bitcoin.BitcoinNode({ rpcuser: 'u', rpcpassword: 'p', rpcconnect: '127.0.0.1', rpcport: String(port) })
  node.urlString = base + '/rpc'
  const header = await node.getBlockHeader(800000)
  assert.strictEqual(header.merkleroot, 'bb'.repeat(32))
  assert.strictEqual(rpcCalls.length, 2)
  assert.strictEqual(rpcCalls[0].auth, 'Basic ' + Buffer.from('u:p').toString('base64'))
  assert.strictEqual(rpcCalls[0].ct, 'application/x-www-form-urlencoded')
  assert.match(rpcCalls[0].raw, /"method":"getblockhash"/)
  assert.match(rpcCalls[1].raw, /"method":"getblockheader"/)
})

check('require graph: no request / request-promise / uuid subpath', async () => {
  const loaded = Object.keys(require.cache)
  const leaked = loaded.filter((p) => /node_modules[/\\](request|request-promise|request-promise-core)[/\\]/.test(p))
  assert.deepStrictEqual(leaked, [], 'deprecated stack leaked into the module graph: ' + leaked.join(', '))
  assert.ok(loaded.some((p) => p.endsWith('request-shim.js')), 'request-shim.js was not loaded')
})

let failed = 0
for (const [name, fn] of results) {
  try {
    await fn()
    console.log('PASS  ' + name)
  } catch (e) {
    failed++
    console.log('FAIL  ' + name + '\n      ' + (e.message || e))
  }
}
server.close()
console.log(failed === 0 ? '\nALL OTS TRANSPORT TESTS PASSED (' + results.length + ')' : '\n' + failed + ' FAILED')
process.exit(failed === 0 ? 0 : 1)
