// Fail fast when the E2E web server is stalled or the port is squatted by
// another process. Without this, one hung GitHub runner makes all 80 tests
// (x3 retries) hit their 30s page.goto timeout — ~74 minutes burned before
// the job goes red. Real case 2026-10-19, run 39268288955: vite preview was
// up but unresponsive; the suite redlined after 74 min of goto timeouts.
// Playwright's own webServer url-check passes on ANY http response (even a
// squatting process), so we assert the BUILT SPA here. The marker is the
// hashed bundle ref under assetsDir /b/ — the dev template index.html
// (src="/src/main.jsx") must NOT satisfy it.
const BUILT_BUNDLE_RE = /src="\/b\/[A-Za-z0-9._-]+\.js"/
export default async function globalSetup() {
  const base = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001'
  const deadline = Date.now() + 60_000
  let lastErr = 'no probe ran'
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${base}/`, { signal: AbortSignal.timeout(10_000) })
      const body = await res.text()
      if (res.ok && BUILT_BUNDLE_RE.test(body)) return; // built SPA healthy
      lastErr = `status=${res.status} but no built /b/ bundle ref (wrong process or dev template on the port?)`
    } catch (e) {
      lastErr = `${e.constructor.name}: ${e.message}`
    }
    await new Promise((r) => setTimeout(r, 2_000))
  }
  throw new Error(
    `E2E web server unresponsive after 60s — aborting the whole suite. ` +
    `Last probe: ${lastErr}. (Runner stall or port squatter — without this gate ` +
    `every one of the 80 tests would time out and burn ~70 minutes.)`
  )
}
