import { test, expect } from '@playwright/test'

/**
 * Verifies a *confirmed* stamp from the live API when one exists.
 */
test('verify a confirmed live proof when available', async ({ page, request }) => {
  test.setTimeout(60000)
  const res = await request.get('https://api.satohash.io/api/stamps/recent')
  if (!res.ok()) test.skip(true, 'recent stamps unavailable')
  const body = await res.json()
  const stamps = body.stamps || body.results || []
  const confirmed = stamps.find((s) => s.status === 'confirmed' && (s.hash || s.id))
  if (!confirmed) test.skip(true, 'no confirmed public stamp yet')

  const id = confirmed.hash || confirmed.id
  await page.goto(`/verify/${id}`)
  await expect(
    page.getByText(/Verified|Confirmed|Bitcoin|receipt|fingerprint|SHA-256/i).first()
  ).toBeVisible({ timeout: 25000 })
})
