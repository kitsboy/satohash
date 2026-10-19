import { test as base, expect } from '@playwright/test'

// Hermetic E2E.
//
// The built SPA embeds external subresources: a <script defer> pointing at
// https://analytics.giveabit.io/script.js and <video> sources under
// https://videos.giveabit.io. `page.goto` waits for the 'load' event, which
// only fires after every subresource finishes. From CI / VPS networks that
// external script intermittently stalls — reproduced locally as 0.3s -> 19s ->
// a >30s hang — which used to freeze the whole 80-test suite on slow runners.
//
// Aborting those two hosts makes 'load' deterministic and fast. No assertion
// depends on the analytics pixel or on the explainer video actually streaming,
// so dropping them is safe. API XHR (api.satohash.io, mempool.space,
// opentimestamps.org, ...) is async and does NOT gate the 'load' event, so it
// is left untouched to preserve the real-data assertions the tests make.
const BLOCK = /analytics\.giveabit\.io|videos\.giveabit\.io/

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/*', (route) =>
      BLOCK.test(route.request().url()) ? route.abort() : route.continue())
    await use(page)
  },
})

export { expect }
