import { test, expect } from '@playwright/test'

const HASH = '9da88734e32d3d2f931c187016d18cfbb0f7404ca90479ed4d6718c49289ee1b'

test('proof card page shows hash and interactive verify', async ({ page }) => {
  await page.goto(`/p/${HASH}`)
  await expect(page.getByText(HASH.slice(0, 16))).toBeVisible({ timeout: 20000 })
  await expect(page.getByRole('link', { name: /interactive verify/i })).toBeVisible()
  await expect(page.getByText(/pending is not confirmed|confirmed on bitcoin/i)).toBeVisible()
})
