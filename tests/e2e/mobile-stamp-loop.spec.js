import { test, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync, mkdirSync } from 'fs'

/**
 * Mobile core loop chrome: stamp UI, deep-link banner, done route, verify ELI-5.
 * Does not require live API for UI structure assertions.
 */
test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fixtureDir = path.join(__dirname, 'fixtures')
const fixtureFile = path.join(fixtureDir, 'stamp-sample.txt')

test.beforeAll(() => {
  mkdirSync(fixtureDir, { recursive: true })
  writeFileSync(fixtureFile, `satohash-mobile-e2e-${Date.now()}\n`)
})

test.describe('Mobile stamp loop chrome', () => {
  test('stamp page: modes collapse, camera/gallery, sticky CTA after file', async ({ page }) => {
    await page.goto('/stamp')
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 20000 })

    // Advanced modes hidden by default on mobile single path
    await expect(page.getByTestId('more-options')).toBeVisible()
    await expect(page.getByTestId('camera-input')).toBeAttached()
    await expect(page.getByTestId('gallery-input')).toBeAttached()
    await expect(page.getByTestId('choose-file-input')).toBeAttached()

    await page.getByTestId('more-options').click()
    await expect(page.getByLabel(/capsule|redact|deposition/i).first()).toBeVisible({
      timeout: 5000
    })

    // Choose file → sticky stamp bar
    await page.getByTestId('choose-file-input').setInputFiles(fixtureFile)
    await expect(page.locator('.stamp-sticky-bar')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('.stamp-sticky-bar button').last()).toContainText(/stamp/i)

    // No horizontal page overflow
    const overflow = await page.evaluate(() => {
      const d = document.documentElement
      return d.scrollWidth <= d.clientWidth + 2
    })
    expect(overflow).toBe(true)
  })

  test('deep-link hash shows family handoff banner', async ({ page }) => {
    const hash = '9da88734e32d3d2f931c187016d18cfbb0f7404ca90479ed4d6718c49289ee1b'
    await page.goto(`/stamp?hash=${hash}&ref=sherpacarta&label=Mobile%20E2E`)
    await expect(page.getByTestId('deep-link-banner')).toBeVisible({ timeout: 20000 })
    await expect(page.getByTestId('deep-link-banner')).toContainText(/Stamp|hash|fingerprint|Sherpa|handoff/i)
    await expect(page.getByText(hash.slice(0, 16))).toBeVisible()
  })

  test('stamp/done empty state when no session proof', async ({ page }) => {
    await page.goto('/stamp/done')
    await expect(page.getByText(/No stamp|Go to Stamp|stamp a file/i).first()).toBeVisible({
      timeout: 15000
    })
  })

  test('verify page has ELI-5 toggle', async ({ page }) => {
    await page.goto('/verify')
    await expect(page.getByTestId('verify-eli5')).toBeVisible({ timeout: 20000 })
    await page.getByRole('button', { name: /^Expert$/i }).click()
    await expect(page.getByText(/OpenTimestamps|Merkle|ots-cli/i).first()).toBeVisible()
    await page.getByRole('button', { name: /^Simple$/i }).click()
    await expect(page.getByText(/fingerprint|Pending|Confirmed/i).first()).toBeVisible()
  })
})
