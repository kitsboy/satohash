import { test, expect } from '@playwright/test'

const PRENUP_DEMO_NAME = 'Jonathan Alexander Mercer'

test.describe('Template demo', () => {
  test('templates page loads', async ({ page }) => {
    await page.goto('/templates')
    await expect(page).toHaveTitle(/Templates|Satohash/i)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('Try with Demo Data opens prenup with filled fields', async ({ page }) => {
    await page.goto('/templates')
    await page.waitForLoadState('networkidle')

    const prenupHeading = page.getByRole('heading', { name: 'Prenuptial Agreement', level: 3 })
    await expect(prenupHeading).toBeVisible()
    const prenupCard = prenupHeading.locator('xpath=ancestor::div[contains(@class,"rounded-2xl")][1]')
    await prenupCard.getByRole('button', { name: /Try with Demo Data/i }).click()

    await expect(page.locator('#party1_name')).toHaveValue(PRENUP_DEMO_NAME, { timeout: 30000 })
  })

  test('direct /templates/:id route loads demo editor', async ({ page }) => {
    await page.goto('/templates/prenuptial-agreement')
    await expect(page.locator('#party1_name')).toHaveValue(PRENUP_DEMO_NAME, { timeout: 30000 })
  })
})