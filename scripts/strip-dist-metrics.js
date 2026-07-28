#!/usr/bin/env node
/**
 * Remove dist/metrics.json so Cloudflare Pages Function (functions/metrics.json.js)
 * serves /metrics.json as a live proxy to api.satohash.io.
 *
 * public/metrics.json remains for local vite preview as a build-time fallback.
 */
import { existsSync, unlinkSync } from 'fs'
import { join } from 'path'

const target = join(process.cwd(), 'dist', 'metrics.json')
if (existsSync(target)) {
  unlinkSync(target)
  console.log('strip-dist-metrics: removed dist/metrics.json (CF Function will proxy)')
} else {
  console.log('strip-dist-metrics: no dist/metrics.json (ok)')
}
