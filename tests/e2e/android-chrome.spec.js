import { test, expect } from '@playwright/test'
import { writeFileSync } from 'fs'

/**
 * Pixel / Android Chrome: Cam's device class (Pixel 10 Pro).
 * Friends on iPhone are covered by webkit + /p/:hash Function.
 */
test.use({
  viewport: { width: 412, height: 915 },
  isMobile: true,
  hasTouch: true
})

async function noPageOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)
}

test.describe('Android Chrome / Pixel', () => {
  test('stamp loop chrome stays on a 412×915 Pixel viewport', async ({ page }) => {
    await page.goto('/stamp')
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 20000 })
    expect(await noPageOverflow(page)).toBe(true)
    await expect(page.getByTestId('hash-only-card')).toBeVisible()
    await expect(page.getByTestId('choose-file-input')).toBeAttached()
    await expect(page.getByTestId('camera-input')).toBeAttached()
  })

  test('language menu stays on-screen', async ({ page }) => {
    await page.goto('/docs')
    const lang = page.getByRole('button', { name: /language/i }).first()
    await lang.click()
    const listbox = page.getByRole('listbox', { name: /select language/i })
    await expect(listbox).toBeVisible()
    const box = await listbox.boundingBox()
    expect(box.x).toBeGreaterThanOrEqual(-2)
    expect(box.x + box.width).toBeLessThanOrEqual(412 + 4)
  })

  test('sticky stamp CTA after file pick', async ({ page }) => {
    await page.goto('/stamp')
    const file = test.info().outputPath('pixel-stamp.txt')
    writeFileSync(file, `pixel-${Date.now()}`)
    await page.getByTestId('choose-file-input').setInputFiles(file)
    await expect(page.locator('.stamp-sticky-bar')).toBeVisible({ timeout: 10000 })
  })
})
