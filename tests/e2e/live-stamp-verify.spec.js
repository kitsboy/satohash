import { test, expect } from '@playwright/test'
import path from 'path'
import os from 'os'
import { writeFileSync } from 'fs'

/**
 * Full product loop: landing → stamp → API → /stamp/done → verify.
 * Works against local production or PLAYWRIGHT_BASE_URL=https://satohash.io
 */
test.setTimeout(120_000)

const fixtureFile = path.join(os.tmpdir(), `satohash-live-loop-${Date.now()}.txt`)

test.beforeAll(() => {
  writeFileSync(
    fixtureFile,
    `satohash-live-loop-${Date.now()}-${Math.random().toString(16).slice(2)}\n`
  )
})

test.describe('Landing → stamp → API → verify', () => {
  test('stamps a unique file and verifies the fingerprint', async ({ page }) => {
    const errors = []
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto('/')
    await expect(page).toHaveTitle(/Satohash/i)

    const stampCta = page.getByTestId('landing-cta-stamp')
    if (await stampCta.count()) {
      await stampCta.click()
    } else {
      await page.getByRole('link', { name: /stamp/i }).first().click()
    }
    await expect(page).toHaveURL(/\/stamp/, { timeout: 20_000 })
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 20_000 })

    await page.getByTestId('choose-file-input').setInputFiles(fixtureFile)
    await expect(page.getByText(/Target Asset|Capsule Manifest/i).first()).toBeVisible({
      timeout: 10_000
    })

    const desktopBtn = page.getByTestId('stamp-file-button')
    if (await desktopBtn.isVisible()) {
      await desktopBtn.click()
    } else {
      await page.locator('.stamp-sticky-bar button').last().click()
    }

    await expect(page).toHaveURL(/\/stamp\/done/, { timeout: 90_000 })

    const hashEl = page.getByTestId('done-hash')
    const hashLocator = (await hashEl.count()) ? hashEl : page.locator('p.font-mono').first()
    await expect(hashLocator).toBeVisible({ timeout: 20_000 })
    const hash = (await hashLocator.innerText()).trim().toLowerCase()
    expect(hash).toMatch(/^[0-9a-f]{64}$/)

    const verifyLink = page.getByTestId('done-verify')
    if (await verifyLink.count()) {
      await verifyLink.click()
    } else {
      await page.goto(`/verify?hash=${hash}`)
    }

    await expect(page).toHaveURL(/\/verify/, { timeout: 20_000 })
    await expect(
      page.getByText(/Verified Successfully|Found in Satohash|Found in local vault|SHA-256/i).first()
    ).toBeVisible({ timeout: 30_000 })

    expect(errors).toEqual([])
  })
})
