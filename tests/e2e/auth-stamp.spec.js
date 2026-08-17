import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Auth & Stamp access', () => {
  test('access page loads for unauthenticated users', async ({ page }) => {
    await page.goto('/access')
    await expect(page.getByText('New Identity')).toBeVisible()
    await expect(page.getByText('Import nsec')).toBeVisible()
    await expect(page.getByText('Admin Access')).toBeVisible()
  })

  test('stamp page is public — no access redirect', async ({ page }) => {
    await page.goto('/stamp')
    await expect(page).toHaveURL(/\/stamp/)
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 20000 })
  })

  test('access page has no critical a11y violations', async ({ page }) => {
    await page.goto('/access')
    await page.locator('#nprogress').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {})
    const results = await new AxeBuilder({ page })
      .exclude('#nprogress')
      .disableRules(['color-contrast'])
      .analyze()
    expect(results.violations.filter((v) => v.impact === 'critical')).toEqual([])
  })
})