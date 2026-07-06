import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Auth & Stamp access', () => {
  test('access page loads for unauthenticated users', async ({ page }) => {
    await page.goto('/access')
    await expect(page.getByText('New Identity')).toBeVisible()
    await expect(page.getByText('Import nsec')).toBeVisible()
    await expect(page.getByText('Admin Access')).toBeVisible()
  })

  test('stamp page redirects to access when not authenticated', async ({ page }) => {
    await page.goto('/stamp')
    await expect(page).toHaveURL(/\/access/)
    await expect(page.getByText('Sovereign')).toBeVisible()
  })

  test('access page has no critical a11y violations', async ({ page }) => {
    await page.goto('/access')
    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze()
    expect(results.violations.filter((v) => v.impact === 'critical')).toEqual([])
  })
})