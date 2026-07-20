/** Item 93 — minimal HTML health UI */
export function renderHealthDashboardHtml(snapshot) {
  const s = snapshot || {}
  return `<!doctype html><html><head><meta charset="utf-8"/><title>Satohash Health</title>
  <style>body{font-family:system-ui;background:#0a0c10;color:#e8e6e1;padding:2rem}pre{background:#111;padding:1rem;border-radius:8px}</style>
  </head><body><h1>Satohash Health</h1><pre>${JSON.stringify(s, null, 2)}</pre></body></html>`
}
