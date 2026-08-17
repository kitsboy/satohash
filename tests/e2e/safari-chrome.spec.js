import { test, expect } from '@playwright/test'

/**
 * WebKit / iPhone chrome QA — language menu + tooltips stay on-screen.
 * Mirrors real Safari mobile constraints (viewport + WebKit engine).
 */
test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true
})

async function noPageOverflow(page) {
  return page.evaluate(() => {
    const d = document.documentElement
    return d.scrollWidth <= d.clientWidth + 2
  })
}

test.describe('Safari / WebKit chrome', () => {
  test('language menu stays inside the 390×844 viewport', async ({ page }) => {
    await page.goto('/docs')
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 20_000 })

    const lang = page.getByRole('button', { name: /language/i }).first()
    await expect(lang).toBeVisible()
    await lang.click()

    const listbox = page.getByRole('listbox', { name: /select language/i })
    await expect(listbox).toBeVisible()
    const box = await listbox.boundingBox()
    expect(box).toBeTruthy()
    expect(box.x).toBeGreaterThanOrEqual(-2)
    expect(box.y).toBeGreaterThanOrEqual(-2)
    expect(box.x + box.width).toBeLessThanOrEqual(390 + 4)
    expect(box.y + box.height).toBeLessThanOrEqual(844 + 4)

    await page.getByRole('option', { name: /español|spanish/i }).click()
    await expect(page.getByRole('listbox')).toHaveCount(0)
    expect(await noPageOverflow(page)).toBe(true)
  })

  test('stamp tooltips stay on-screen and do not overflow the page', async ({ page }) => {
    await page.goto('/stamp')
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 20_000 })
    expect(await noPageOverflow(page)).toBe(true)

    const info = page.getByRole('button', { name: /info:/i }).first()
    await expect(info).toBeVisible()
    await info.scrollIntoViewIfNeeded()
    await info.click()
    const tip = page.getByRole('tooltip')
    await expect(tip).toBeVisible({ timeout: 8000 })
    const tbox = await tip.boundingBox()
    expect(tbox).toBeTruthy()
    expect(tbox.x).toBeGreaterThanOrEqual(-2)
    expect(tbox.x + tbox.width).toBeLessThanOrEqual(390 + 4)
    expect(tbox.y).toBeGreaterThanOrEqual(-2)
    expect(tbox.y + tbox.height).toBeLessThanOrEqual(844 + 4)
    await page.keyboard.press('Escape')
  })

  test('/verify ELI-5 and language control do not overflow', async ({ page }) => {
    await page.goto('/verify')
    await expect(page.getByTestId('verify-eli5')).toBeVisible({ timeout: 20_000 })
    expect(await noPageOverflow(page)).toBe(true)

    const lang = page.getByRole('button', { name: /language/i }).first()
    await lang.click()
    const listbox = page.getByRole('listbox', { name: /select language/i })
    await expect(listbox).toBeVisible()
    const box = await listbox.boundingBox()
    expect(box.x + box.width).toBeLessThanOrEqual(390 + 4)
    await page.keyboard.press('Escape')
  })
})
