// Fail fast when the E2E web server or the GITHUB RUNNER itself is unusable.
// Without this, one stalled runner makes all 80 tests (x3 retries) hit their
// 30s page.goto timeout — ~74 minutes burned before the job goes red.
// Real cases 2026-10-19: runs 39268288955 and 39330179691.
//
// Two gates (Playwright's own webServer url-check passes on ANY http response,
// even a squatting or crawling process, so it proves nothing on its own):
//   1. HOME: the served page must be the BUILT SPA (hashed /b/ bundle ref —
//      the dev template index.html with src="/src/main.jsx" must not pass).
//   2. BUNDLE: the runner must stream the main bundle at test speed. A runner
//      that cannot fetch ~1 MB in 20 s will not run 80 Chromium tests in a
//      reasonable time — abort now instead of burning an hour of timeouts.
//   3. CHROMIUM: an HTTP answer is not a page load. Run 39334533474 showed a
//      runner whose HTTP probes were fine while every browser navigation
//      stalled (23+ min of 30s goto timeouts). So load the homepage in a real
//      headless Chromium with a 45 s budget before the 80 tests even start.
const BUILT_BUNDLE_RE = /src="(\/b\/[A-Za-z0-9._-]+\.js)"/

export default async function globalSetup() {
  const base = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001'

  // Gate 1 — home page, up to 60 s.
  const deadline = Date.now() + 60_000
  let lastErr = 'no probe ran'
  let home = ''
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${base}/`, { signal: AbortSignal.timeout(10_000) })
      const body = await res.text()
      if (res.ok && BUILT_BUNDLE_RE.test(body)) { home = body; break }
      lastErr = `status=${res.status} but no built /b/ bundle ref (wrong process or dev template on the port?)`
    } catch (e) {
      lastErr = `${e.constructor.name}: ${e.message}`
    }
    await new Promise((r) => setTimeout(r, 2_000))
  }
  if (!home) {
    throw new Error(
      `E2E web server unresponsive after 60 s — aborting the whole suite. ` +
      `Last probe: ${lastErr}. (Runner stall or port squatter — without this ` +
      `gate every one of the 80 tests would time out and burn ~70 minutes.)`
    )
  }

  // Gate 2 — runner throughput: the main bundle must arrive fast enough.
  const bundleRef = home.match(BUILT_BUNDLE_RE)[1]
  const t0 = Date.now()
  try {
    const res = await fetch(`${base}${bundleRef}`, { signal: AbortSignal.timeout(20_000) })
    const buf = new Uint8Array(await res.arrayBuffer())
    const secs = (Date.now() - t0) / 1000
    if (!res.ok || buf.byteLength < 50_000) {
      throw new Error(`status=${res.status} bytes=${buf.byteLength}`)
    }
    if (secs > 20) throw new Error(`bundle took ${secs.toFixed(1)} s`)
  } catch (e) {
    throw new Error(
      `E2E runner cannot stream the main bundle at test speed — aborting the ` +
      `suite on this runner instead of burning an hour of page-load timeouts. ` +
      `Detail: ${e.message} (${bundleRef}). Re-running on a fresh runner should clear it.`
    )
  }

  // Gate 3 — the browser layer itself must load a page on this runner.
  // Budget is 15 s, not 45: a healthy runner loads this SPA in 2–5 s. A runner
  // that needs 30–45 s (usually an external script like analytics.giveabit.io
  // being slow from GitHub's network, stalling the 'load' event) WILL then
  // spend 80 tests × 3 retries × 30 s stalling on every goto — reject it here
  // instead and re-run on a fresh machine.
  const { chromium } = await import('@playwright/test')
  let browser
  try {
    browser = await chromium.launch()
    const page = await browser.newPage()
    // Same external-host block as the test fixture: this raw page doesn't use
    // the fixture, so stop the stalling analytics/video subresources here too,
    // otherwise the gate would measure the flaky external script, not the SPA.
    await page.route('**/*', (r) =>
      /analytics\.giveabit\.io|videos\.giveabit\.io/.test(r.request().url())
        ? r.abort()
        : r.continue())
    const t1 = Date.now()
    await page.goto(base, { timeout: 15_000, waitUntil: 'load' })
    const loadSecs = (Date.now() - t1) / 1000
    if (loadSecs > 15) throw new Error(`page load took ${loadSecs.toFixed(1)} s`)
  } catch (e) {
    throw new Error(
      `E2E runner cannot load the SPA fast enough in headless Chromium (15 s ` +
      `budget) — aborting instead of 80 tests x 3 retries of page-load ` +
      `timeouts. Detail: ${e.message.split('\n')[0]}. Re-run on a fresh runner.`
    )
  } finally {
    if (browser) await browser.close().catch(() => {})
  }
}
