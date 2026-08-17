import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const PUBLIC_ROUTES = [
  '/',
  '/faq',
  '/templates',
  '/pricing',
  '/access',
  '/government',
  '/stamp',
  '/security',
  '/trust',
  '/verify',
  '/widgets',
  '/comparison',
  '/chain-of-custody',
  '/legal/terms'
]

test.describe('axe-core a11y smoke', () => {
  for (const path of PUBLIC_ROUTES) {
    test(`no critical violations on ${path}`, async ({ page }) => {
      await page.goto(path)
      const results = await new AxeBuilder({ page })
        .exclude('#nprogress')
        .withTags(['wcag2a', 'wcag2aa'])
        .disableRules(['color-contrast'])
        .analyze()
      const critical = results.violations.filter((v) => v.impact === 'critical')
      expect(critical).toEqual([])
    })
  }
})