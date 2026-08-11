#!/usr/bin/env node
/**
 * Soft mobile Lighthouse gate for core routes.
 * Usage:
 *   BASE_URL=https://satohash.io node scripts/lighthouse-mobile-gate.mjs
 *   BASE_URL=http://127.0.0.1:4173 node scripts/lighthouse-mobile-gate.mjs
 *
 * Requires: npx lighthouse (devDependency optional — uses npx).
 * Exit 0 always with report summary unless FAIL_HARD=1 and scores miss thresholds.
 */

import { spawnSync } from 'child_process'
import { mkdirSync, writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

const BASE = (process.env.BASE_URL || 'https://satohash.io').replace(/\/$/, '')
const FAIL_HARD = process.env.FAIL_HARD === '1'
const ROUTES = ['/', '/stamp', '/verify']
const THRESHOLDS = {
  performance: Number(process.env.LH_PERF || 0.35),
  accessibility: Number(process.env.LH_A11Y || 0.9),
  'best-practices': Number(process.env.LH_BP || 0.8),
  seo: Number(process.env.LH_SEO || 0.8)
}

const outDir = join(process.cwd(), 'tmp', 'lighthouse-mobile')
mkdirSync(outDir, { recursive: true })

const results = []
let failed = false

for (const route of ROUTES) {
  const url = `${BASE}${route}`
  const outJson = join(outDir, `${route === '/' ? 'home' : route.slice(1)}.json`)
  console.log(`\n→ Lighthouse mobile ${url}`)
  const args = [
    'lighthouse',
    url,
    '--only-categories=performance,accessibility,best-practices,seo',
    '--form-factor=mobile',
    '--screenEmulation.mobile',
    '--chrome-flags=--headless --no-sandbox --disable-gpu',
    '--quiet',
    '--output=json',
    `--output-path=${outJson}`
  ]
  const r = spawnSync('npx', args, { encoding: 'utf8', timeout: 180000, shell: false })
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout || 'lighthouse failed')
    results.push({ route, error: true })
    failed = true
    continue
  }
  try {
    const report = JSON.parse(readFileSync(outJson, 'utf8'))
    const cats = report.categories || {}
    const scores = {}
    for (const [key, min] of Object.entries(THRESHOLDS)) {
      const score = cats[key]?.score
      scores[key] = score
      if (typeof score === 'number' && score < min) {
        failed = true
        console.warn(`  ✗ ${key}: ${(score * 100).toFixed(0)} < ${(min * 100).toFixed(0)}`)
      } else if (typeof score === 'number') {
        console.log(`  ✓ ${key}: ${(score * 100).toFixed(0)}`)
      }
    }
    results.push({ route, scores })
  } catch (e) {
    console.error('parse failed', e.message)
    results.push({ route, error: true })
    failed = true
  }
}

const summaryPath = join(outDir, 'summary.json')
writeFileSync(summaryPath, JSON.stringify({ base: BASE, thresholds: THRESHOLDS, results }, null, 2))
console.log(`\nWrote ${summaryPath}`)

if (FAIL_HARD && failed) {
  process.exit(1)
}
process.exit(0)
