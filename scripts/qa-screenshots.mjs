#!/usr/bin/env node
/** Dark-theme screenshot set for pitch + exec summary (desktop + mobile). */
import { chromium } from '@playwright/test'
import { mkdirSync } from 'fs'
import { join } from 'path'

const BASE = (process.env.BASE_URL || 'https://satohash.io').replace(/\/$/, '')
const out = join(process.cwd(), 'tmp', 'qa-shots')
mkdirSync(out, { recursive: true })

const browser = await chromium.launch()
const pages = ['/pitch', '/docs/executive-summary', '/', '/stamp', '/verify']
const sizes = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 }
]
for (const size of sizes) {
  for (const path of pages) {
    const page = await browser.newPage({
      viewport: { width: size.width, height: size.height },
      isMobile: size.width < 500,
      hasTouch: size.width < 500
    })
    await page.addInitScript(() => localStorage.setItem('satohash_theme', 'dark'))
    await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForTimeout(900)
    const slug = path === '/' ? 'home' : path.replace(/\//g, '_').replace(/^_/, '')
    await page.screenshot({ path: join(out, `${slug}-${size.name}.png`) })
    await page.close()
    console.log(slug, size.name)
  }
}
await browser.close()
