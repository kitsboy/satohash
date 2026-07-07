import { test, expect } from '@playwright/test'

test.describe('Frontend pipes', () => {
  test('onboarding welcome routes to how-it-works', async ({ page }) => {
    await page.goto('/onboarding/welcome')
    await page.getByRole('button', { name: /start new agreement/i }).click()
    await expect(page).toHaveURL(/\/onboarding\/how-it-works/)
  })

  test('templates showcase search is accessible', async ({ page }) => {
    await page.goto('/templates')
    await expect(page.getByRole('searchbox')).toBeVisible()
  })

  test('image-vault requires auth', async ({ page }) => {
    await page.goto('/image-vault')
    await expect(page).toHaveURL(/\/access/)
  })
})