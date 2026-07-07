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

  test('choose-template links to template library', async ({ page }) => {
    await page.goto('/onboarding/choose-template')
    await page.getByRole('button', { name: /browse full template library/i }).click()
    await expect(page).toHaveURL(/\/onboarding\/template-library/)
  })

  test('onboarding chain welcome through how-it-works', async ({ page }) => {
    await page.goto('/onboarding/welcome')
    await page.getByRole('button', { name: /start new agreement/i }).click()
    await expect(page).toHaveURL(/\/onboarding\/how-it-works/)
    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page).toHaveURL(/\/onboarding\/choose-template/)
  })

  test('forum npub gate shows toast when posting without identity', async ({ page }) => {
    await page.goto('/forum')
    await page.getByPlaceholder(/thread title/i).fill('Test thread')
    await page.getByRole('button', { name: /create/i }).click()
    await expect(page.getByText(/nostr identity/i)).toBeVisible({ timeout: 5000 })
  })
})