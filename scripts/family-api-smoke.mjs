#!/usr/bin/env node
/**
 * Live family-plane smoke: health, metrics, public status.
 * Usage: node scripts/family-api-smoke.mjs
 * Env: API_URL (default https://api.satohash.io)
 *
 * Asserts requireLightning is false (raw) and gitSha is present. Exit 1 on failure.
 */
const API = (process.env.API_URL || 'https://api.satohash.io').replace(/\/$/, '')
const CLIENT = 'cli'
const TIMEOUT_MS = 12_000

const failures = []

function fail(msg) {
  failures.push(msg)
  console.error('FAIL:', msg)
}

async function readJson(res) {
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { raw: text.slice(0, 400) }
  }
}

async function get(path) {
  const res = await fetch(`${API}${path}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-Satohash-Client': CLIENT
    },
    signal: AbortSignal.timeout(TIMEOUT_MS)
  })
  const body = await readJson(res)
  return { res, body }
}

async function main() {
  console.log(`family-api-smoke: ${API}`)

  const health = await get('/health')
  if (!health.res.ok) {
    fail(`GET /health ${health.res.status}`)
  } else {
    console.log('OK  GET /health', health.res.status)
  }
  const gitSha = health.body?.gitSha
  if (!gitSha || typeof gitSha !== 'string' || !gitSha.trim()) {
    fail('gitSha missing on GET /health')
  } else {
    console.log('OK  gitSha', gitSha)
  }

  const metrics = await get('/metrics.json')
  if (!metrics.res.ok) {
    fail(`GET /metrics.json ${metrics.res.status}`)
  } else {
    console.log('OK  GET /metrics.json', metrics.res.status)
  }
  const requireLightning = metrics.body?.raw?.requireLightning
  if (requireLightning !== false) {
    fail(`raw.requireLightning expected false, got ${JSON.stringify(requireLightning)}`)
  } else {
    console.log('OK  raw.requireLightning=false')
  }

  const status = await get('/api/public/status')
  if (!status.res.ok) {
    fail(`GET /api/public/status ${status.res.status}`)
  } else {
    console.log('OK  GET /api/public/status', status.res.status)
  }

  try {
    const cors = await fetch(`${API}/health`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://satohash.io',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'X-Satohash-Client'
      },
      signal: AbortSignal.timeout(TIMEOUT_MS)
    })
    const allowOrigin =
      cors.headers.get('Access-Control-Allow-Origin') || cors.headers.get('access-control-allow-origin')
    console.log(
      'OPT GET CORS /health',
      cors.status,
      allowOrigin ? `Allow-Origin=${allowOrigin}` : '(no ACAO — optional)'
    )
  } catch (err) {
    console.log('OPT CORS skipped:', err.message || err)
  }

  if (failures.length) {
    console.error(`family-api-smoke: ${failures.length} failure(s)`)
    process.exit(1)
  }

  const out = {
    ok: true,
    api: API,
    gitSha,
    requireLightning: false,
    health: health.body?.status || health.body?.ok || 'ok',
    publicStatus: status.body?.status || status.body?.ok || status.res.status
  }
  console.log(JSON.stringify(out, null, 2))
}

main().catch((err) => {
  console.error('FAMILY_API_SMOKE_FAIL:', err.message)
  process.exit(1)
})
