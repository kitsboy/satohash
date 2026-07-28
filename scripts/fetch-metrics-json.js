#!/usr/bin/env node
/**
 * Fetch live product metrics from the API origin into public/metrics.json
 * for local preview / offline fallback.
 *
 * Production CF Pages: dist/metrics.json is stripped after build so
 * functions/metrics.json.js proxies live to api.satohash.io.
 *
 * Usage: node scripts/fetch-metrics-json.js
 * Fail-soft: keeps existing public/metrics.json if the API is unreachable.
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outPath = join(root, 'public', 'metrics.json')
const sourceUrl =
  process.env.METRICS_SOURCE_URL || 'https://api.satohash.io/metrics.json'

const TIMEOUT_MS = Number(process.env.METRICS_FETCH_TIMEOUT_MS || 20000)
const RETRIES = Number(process.env.METRICS_FETCH_RETRIES || 3)

async function fetchOnce() {
  const res = await fetch(sourceUrl, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { accept: 'application/json' }
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`)
  }
  const text = await res.text()
  const data = JSON.parse(text)
  if (data?.schema !== 'gab.product-metrics.v1') {
    throw new Error(
      `Unexpected schema: ${data?.schema ?? '(missing)'} (want gab.product-metrics.v1)`
    )
  }
  return data
}

async function main() {
  mkdirSync(dirname(outPath), { recursive: true })

  let lastErr
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    try {
      const data = await fetchOnce()
      const payload = {
        ...data,
        _staticMirror: {
          source: sourceUrl,
          mirroredAt: new Date().toISOString(),
          attempt,
          note:
            'Local/preview fallback only. Production satohash.io/metrics.json is proxied by CF Pages Function → api.satohash.io. HQ SoT: https://api.satohash.io/metrics.json',
          canonical: 'https://api.satohash.io/metrics.json'
        }
      }
      writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8')
      console.log(
        `fetch-metrics-json: wrote ${outPath} (productId=${data.productId}, health=${data.health?.status}, attempt=${attempt})`
      )
      return
    } catch (err) {
      lastErr = err
      console.warn(
        `fetch-metrics-json: attempt ${attempt}/${RETRIES} failed (${err.message})`
      )
      if (attempt < RETRIES) {
        await new Promise((r) => setTimeout(r, 800 * attempt))
      }
    }
  }

  if (existsSync(outPath)) {
    try {
      const existing = JSON.parse(readFileSync(outPath, 'utf8'))
      console.warn(
        `fetch-metrics-json: fetch failed (${lastErr?.message}); keeping existing public/metrics.json (schema=${existing?.schema})`
      )
      process.exit(0)
    } catch {
      /* fall through */
    }
  }
  console.error(
    `fetch-metrics-json: failed and no usable cache: ${lastErr?.message}`
  )
  process.exit(1)
}

main()
