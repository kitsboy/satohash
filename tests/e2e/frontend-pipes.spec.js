import { test, expect } from '@playwright/test'

test.describe('Frontend pipes', () => {
  test('onboarding welcome routes to how-it-works', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('satohash_authed', 'true')
      localStorage.setItem('satohash-onboarded', 'true')
    })
    await page.goto('/onboarding/welcome')
    await page.getByRole('button', { name: /start new agreement/i }).click()
    await expect(page).toHaveURL(/\/onboarding\/how-it-works/)
  })

  test('templates showcase search is accessible', async ({ page }) => {
    await page.goto('/templates')
    await expect(page.getByRole('searchbox')).toBeVisible()
  })

  test('image-vault is frozen in MVP and sends home', async ({ page }) => {
    await page.goto('/image-vault')
    await expect(page).toHaveURL(/\/$/)
  })

  test('choose-template links to template library', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('satohash_authed', 'true')
      localStorage.setItem('satohash-onboarded', 'true')
    })
    await page.goto('/onboarding/choose-template')
    await page.getByRole('button', { name: /browse full template library/i }).click()
    await expect(page).toHaveURL(/\/onboarding\/template-library/)
  })

  test('onboarding chain welcome through how-it-works', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('satohash_authed', 'true')
      localStorage.setItem('satohash-onboarded', 'true')
    })
    await page.goto('/onboarding/welcome')
    await page.getByRole('button', { name: /start new agreement/i }).click()
    await expect(page).toHaveURL(/\/onboarding\/how-it-works/)
    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page).toHaveURL(/\/onboarding\/choose-template/)
  })

  test('forum is frozen in MVP and sends home', async ({ page }) => {
    await page.goto('/forum')
    await expect(page).toHaveURL(/\/$/)
  })

  test('contracts are frozen in MVP and send home', async ({ page }) => {
    await page.goto('/contracts/new/nda')
    await expect(page).toHaveURL(/\/$/)
  })

  test('vault shows cached banner when history API fails', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('satohash_authed', 'true')
      localStorage.setItem('satohash-onboarded', 'true')
      localStorage.setItem(
        'satohash_stamps',
        JSON.stringify([
          {
            id: 'stamp_test',
            filename: 'cached.pdf',
            hash: 'a'.repeat(64),
            status: 'pending',
            created_at: Date.now()
          }
        ])
      )
    })
    await page.route('**/api/history**', (route) => route.abort('failed'))
    await page.goto('/vault')
    // Scope to the cached-banner text (avoid matching "cached.pdf" filename elements)
    await expect(page.getByText(/server unreachable/i).first()).toBeVisible({ timeout: 8000 })
  })
})