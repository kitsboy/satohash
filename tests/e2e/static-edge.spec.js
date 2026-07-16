import { test, expect } from '@playwright/test'

test.describe('Static edge — MotoPass integration', () => {
  test('stamp accepts hash query param', async ({ page }) => {
    const hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    await page.goto(`/stamp?hash=${hash}&source=motopass`)
    await expect(page.locator('body')).toContainText(/stamp|hash|fingerprint/i)
  })

  test('public verify shows valid fingerprint for hash id', async ({ page }) => {
    const hash = 'a'.repeat(64)
    await page.goto(`/verify/${hash}`)
    await expect(page.getByText(/valid fingerprint|fingerprint/i)).toBeVisible({ timeout: 15000 })
  })

  test('verify tool accepts hash query param', async ({ page }) => {
    const hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    await page.goto(`/verify?hash=${hash}`)
    await expect(page.locator('body')).toContainText(/verify|hash|fingerprint/i)
  })

  test('stamp autostamp query accepted', async ({ page }) => {
    const hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    await page.goto(`/stamp?hash=${hash}&autostamp=1&source=motopass`)
    await expect(page.locator('body')).toContainText(/stamp|calendar|OpenTimestamps|anchoring/i, {
      timeout: 20000
    })
  })

  test('government page loads', async ({ page }) => {
    await page.goto('/government')
    await expect(page.getByRole('heading', { name: /government/i })).toBeVisible()
  })
})