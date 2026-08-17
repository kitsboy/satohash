import { test, expect } from '@playwright/test'

const HASH = '9da88734e32d3d2f931c187016d18cfbb0f7404ca90479ed4d6718c49289ee1b'

const FAMILY = [
  { ref: 'sherpacarta', expect: /Sherpa/i },
  { ref: 'motopass', expect: /MotoPass|Moto/i },
  { ref: 'katoa', expect: /Katoa/i }
]

test.describe('Family deep-link matrix', () => {
  for (const row of FAMILY) {
    test(`${row.ref} hash handoff banner`, async ({ page }) => {
      await page.goto(`/stamp?hash=${HASH}&ref=${row.ref}&label=Matrix%20E2E`)
      await expect(page.getByTestId('deep-link-banner')).toBeVisible({ timeout: 20000 })
      await expect(page.getByTestId('deep-link-banner')).toContainText(row.expect)
      await expect(page.getByText(HASH.slice(0, 16))).toBeVisible()
    })
  }
})
