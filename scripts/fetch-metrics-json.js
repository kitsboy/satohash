#!/usr/bin/env node
/**
 * Fetch live product metrics from the API origin into public/metrics.json
 * so Cloudflare Pages serves real JSON at /metrics.json (not SPA HTML).
 *
 * CF Pages does not proxy external domains with _redirects 200 rewrites.
 * Static assets take precedence over the SPA /* → index.html fallback.
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

const TIMEOUT_MS = Number(process.env.METRICS_FETCH_TIMEOUT_MS || 15000)

async function main() {
  mkdirSync(dirname(outPath), { recursive: true })

  try {
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
    // Stamp that this copy was materialised for the static SPA origin
    const payload = {
      ...data,
      _staticMirror: {
        source: sourceUrl,
        mirroredAt: new Date().toISOString(),
        note: 'Build-time mirror for satohash.io/metrics.json; live source is api.satohash.io'
      }
    }
    writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8')
    console.log(
      `fetch-metrics-json: wrote ${outPath} (productId=${data.productId}, health=${data.health?.status})`
    )
  } catch (err) {
    if (existsSync(outPath)) {
      try {
        const existing = JSON.parse(readFileSync(outPath, 'utf8'))
        console.warn(
          `fetch-metrics-json: fetch failed (${err.message}); keeping existing public/metrics.json (schema=${existing?.schema})`
        )
        process.exit(0)
      } catch {
        /* fall through */
      }
    }
    console.error(`fetch-metrics-json: failed and no usable cache: ${err.message}`)
    process.exit(1)
  }
}

main()
