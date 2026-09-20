import { test, expect } from '@playwright/test'

const HASH = '9da88734e32d3d2f931c187016d18cfbb0f7404ca90479ed4d6718c49289ee1b'

// The /p/:hash card fetches the live API cross-origin (api.satohash.io), whose
// CORS allow-list has no localhost origin — so in CI/e2e the fetch is always
// blocked and the card renders the unstamped branch. Stub the two API calls the
// card makes with a recorded confirmed-stamp fixture: deterministic, offline,
// and it still exercises the real render path (hash + interactive verify link +
// confirmed status). Live behavior is covered separately by the live_loop jobs.
const CONFIRMED_STAMP = {
  id: '95706b22-9e5f-4381-8ab1-a950f546098f',
  hash: HASH,
  status: 'confirmed',
  filename: 'sherpacarta-smoke',
  created_at: '2026-07-27 02:33:06',
  confirmed_at: '2026-07-27 05:03:01',
  bitcoin_block_height: 959779,
  verify_method: 'bitcoind:self-sovereign'
}

test('proof card page shows hash and interactive verify', async ({ page }) => {
  await page.route('**/api/stamps/**/by-hash', (route) =>
    route.fulfill({ json: { hash: HASH, stamps: [CONFIRMED_STAMP] } })
  )
  await page.route('**/api/stamps/**/chains', (route) => route.fulfill({ json: { chains: {} } }))
  await page.route('**/api/verify', (route) => {
    if (route.request().method() !== 'POST') return route.continue()
    return route.fulfill({
      json: {
        verified: true,
        verified_method: 'bitcoind',
        trust: 'self-sovereign',
        bitcoin_block_height: 959779,
        status: 'confirmed',
        ots_download_url: `https://api.satohash.io/api/stamps/${CONFIRMED_STAMP.id}?download=true`,
        explainer: "Verified against Satohash's own Bitcoin node — block 959779."
      }
    })
  })
  await page.goto(`/p/${HASH}`)
  // The card renders the hash twice (mono block + "Satohash recorded SHA-256 …" line),
  // so the bare text locator is strict-mode ambiguous — pin to the first match.
  await expect(page.getByText(HASH.slice(0, 16)).first()).toBeVisible({ timeout: 20000 })
  await expect(page.getByRole('link', { name: /interactive verify/i })).toBeVisible()
  await expect(page.getByText(/pending is not confirmed|confirmed on bitcoin/i)).toBeVisible()
  await expect(page.getByTestId('how-proof-works')).toBeVisible()
  await expect(page.getByTestId('proof-state-badge')).toHaveText(/anchored to bitcoin/i)
})
