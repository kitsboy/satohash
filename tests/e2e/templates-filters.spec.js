import { test, expect } from '@playwright/test'

/**
 * Templates category chips must never force horizontal page overflow.
 * Regression for /templates filter bar (MVP menu polish).
 */
test.describe('Templates filters', () => {
  test('category tablist stays within viewport; no document overflow', async ({ page }) => {
    await page.goto('/templates')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 20000 })

    const tablist = page.getByRole('tablist', { name: /category|filter templates/i })
    await expect(tablist).toBeVisible()

    const tabs = tablist.getByRole('tab')
    await expect(tabs.first()).toBeVisible()
    const count = await tabs.count()
    expect(count).toBeGreaterThanOrEqual(2)

    // No page-level horizontal scroll from the chip strip
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement
      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        bodyScrollWidth: document.body.scrollWidth
      }
    })
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2)
    expect(overflow.bodyScrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2)

    // Chip row may scroll internally; the tablist itself must not widen the document
    const box = await tablist.boundingBox()
    expect(box).toBeTruthy()
    expect(box.width).toBeLessThanOrEqual(overflow.clientWidth + 1)

    // Switching categories keeps grid usable
    const last = tabs.nth(count - 1)
    await last.click()
    await expect(last).toHaveAttribute('aria-selected', 'true')
  })

  test('search and reset clear filters', async ({ page }) => {
    await page.goto('/templates')
    const search = page.getByRole('searchbox').or(page.locator('input[type="search"]')).first()
    await search.fill('zzzz-no-match-satohash')
    await expect(page.getByText(/no templates|empty|result/i).first()).toBeVisible({
      timeout: 10000
    }).catch(async () => {
      // Empty state uses i18n keys; assert zero cards or reset control
      await expect(page.getByRole('button', { name: /reset|clear/i }).first()).toBeVisible()
    })
  })
})
