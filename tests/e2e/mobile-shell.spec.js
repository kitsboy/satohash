import { test, expect } from '@playwright/test'

/**
 * Mobile chrome: marketing shell hamburger + no AppShell bottom bar on public routes.
 * App routes still get bottom nav.
 */
test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true
})

const MARKETING = ['/templates', '/pricing', '/faq', '/stamp', '/verify', '/government', '/watch']

test.describe('Mobile shell', () => {
  for (const path of MARKETING) {
    test(`${path} has fixed top nav and no bottom app dock`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('nav').first()).toBeVisible({ timeout: 20000 })

      // Marketing hamburger (md:hidden menu button) or app shell — not bottom dock on these
      const bottomNav = page.getByRole('navigation', { name: /Mobile navigation/i })
      await expect(bottomNav).toHaveCount(0)

      // Open menu on marketing chrome
      const menuBtn = page.getByRole('button', { name: /open menu|close menu/i })
      if (await menuBtn.count()) {
        await menuBtn.first().click()
        await expect(page.getByText(/Navigate|Stamp free/i).first()).toBeVisible({
          timeout: 5000
        })
      }

      const overflow = await page.evaluate(() => {
        const d = document.documentElement
        return d.scrollWidth <= d.clientWidth + 2
      })
      expect(overflow).toBe(true)
    })
  }

  test('vault app shell shows mobile bottom nav when authed', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('satohash_authed', 'true')
      localStorage.setItem('satohash-onboarded', 'true')
    })
    await page.goto('/vault')
    await expect(page.getByRole('navigation', { name: /Mobile navigation/i })).toBeVisible({
      timeout: 15000
    })
  })
})
