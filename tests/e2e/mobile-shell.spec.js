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

const MARKETING = [
  '/templates',
  '/pricing',
  '/faq',
  '/stamp',
  '/verify',
  '/government',
  '/watch',
  '/docs',
  '/docs/quickstart',
  '/guides',
  '/glossary'
]

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
        await expect(page.getByText(/^Menu$/).first()).toBeVisible({
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

  test('docs article and language menu stay on screen', async ({ page }) => {
    await page.goto('/docs/quickstart')
    await expect(page.getByRole('heading', { name: /quick start/i }).first()).toBeVisible({
      timeout: 20000
    })
    const noPageOverflow = await page.evaluate(() => {
      const d = document.documentElement
      return d.scrollWidth <= d.clientWidth + 2
    })
    expect(noPageOverflow).toBe(true)

    const lang = page.getByRole('button', { name: /language/i }).first()
    await lang.click()
    const listbox = page.getByRole('listbox', { name: /select language/i })
    await expect(listbox).toBeVisible()
    const box = await listbox.boundingBox()
    expect(box).toBeTruthy()
    expect(box.x).toBeGreaterThanOrEqual(-1)
    expect(box.y).toBeGreaterThanOrEqual(-1)
    expect(box.x + box.width).toBeLessThanOrEqual(390 + 2)
    expect(box.y + box.height).toBeLessThanOrEqual(844 + 2)
    await page.keyboard.press('Escape')

    const info = page.getByRole('button', { name: /info:/i }).first()
    if (await info.count()) {
      await info.click()
      const tip = page.getByRole('tooltip')
      await expect(tip).toBeVisible()
      const tbox = await tip.boundingBox()
      expect(tbox.x).toBeGreaterThanOrEqual(-1)
      expect(tbox.x + tbox.width).toBeLessThanOrEqual(390 + 2)
    }
  })

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
