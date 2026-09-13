// CF Pages middleware — serve prerendered SEO HTML to search & AI crawlers.
// Humans + normal browsers keep the SPA (fast, no JS needed for crawlers).
// Prerendered files live at /prerender/*.html (built by scripts/prerender-seo.js).

const CRAWLER_RE =
  /(googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|gptbot|claude|anthropic|perplexity|chatgpt|google-inspectiontool|applebot|semrushbot|ahrefsbot|dotbot|mj12bot|petalbot|bytespider|ccbot|facebookexternalhit|twitterbot|linkedinbot|embedly|quora|pinterest|whatsapp|telegrambot|slackbot|discordbot|viber|skypeuripreview|vkshare|tumblr|snapchat)/i

const PRERENDER_MAP = [
  { route: /^\/docs\/learn-([a-z0-9-]+)\/?$/, file: (m) => `/prerender/docs/learn-${m[1]}.html` },
  { route: /^\/docs\/how-satohash-works\/?$/, file: () => '/prerender/docs/how-satohash-works.html' },
  { route: /^\/docs\/support-and-guidance\/?$/, file: () => '/prerender/docs/support-and-guidance.html' },
  { route: /^\/faq\/?$/, file: () => '/prerender/faq.html' },
  { route: /^\/watch\/?$/, file: () => '/prerender/watch.html' },
  { route: /^\/pitch\/?$/, file: () => '/prerender/pitch.html' },
  { route: /^\/(stamp|pricing|templates|verify|donate|network|proof-pack)\/?$/, file: (m) => `/prerender/${m[1]}.html` },
  { route: /^\/(identity|status|counsel)\/?$/, file: (m) => `/prerender/${m[1]}.html` }
]

const PLAYER_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex,nofollow" />
<title>Satohash explainer · 84 seconds</title>
<style>html,body{margin:0;height:100%;background:#0e1c2a;color:#e8f4fb;font-family:"Plus Jakarta Sans",system-ui,sans-serif}.player{display:flex;flex-direction:column;height:100%}h1{margin:0;flex:0 0 auto;padding:.45rem .75rem;font-size:13px;font-weight:700;letter-spacing:.04em}video{display:block;width:100%;flex:1 1 auto;min-height:0;object-fit:contain;background:#0e1c2a}</style>
</head>
<body>
<div class="player">
<h1>Satohash explainer · 84 seconds</h1>
<video controls playsinline preload="metadata" poster="https://satohash.io/og/watch.jpg" src="https://videos.giveabit.io/media/video/satohash-explainer-with-vo2.mp4?v=kimi-noir-20260819" aria-label="Satohash explainer · 84 seconds">
<a href="https://satohash.io/watch">Watch the Satohash explainer</a>
</video>
</div>
</body>
</html>`

const PLAYER_CSP =
  "default-src 'none'; media-src https://videos.giveabit.io; img-src 'self' https://satohash.io; style-src 'unsafe-inline'; frame-ancestors https://twitter.com https://x.com https://platform.twitter.com https://tweetdeck.twitter.com https://cards-dev.twitter.com; base-uri 'none'; form-action 'none'"

const GSC_VERIFY_PATHS = new Set(['/googlef508c6fb64de60ff.html', '/googlef508c6fb64de60ff'])
const GSC_VERIFY_BODY = 'google-site-verification: googlef508c6fb64de60ff.html'

// Known client routes (BrowserRouter). A GET matching none of these is a real
// 404 — never the SPA shell (soft-404 close). Keep in sync with src/App.jsx.
const KNOWN_ROUTES = [
  /^\/$/,
  /^\/access\/?$/, /^\/about\/?$/, /^\/pitch\/?$/, /^\/trust\/?$/, /^\/trust-center\/?$/,
  /^\/verify\/[^/]+\/?$/, /^\/verify\/?$/, /^\/verify\/batch\/?$/, /^\/verify\/cross-chain\/?$/,
  /^\/verify\/social\/?$/, /^\/verify-shield\/[^/]+\/?$/,
  /^\/contribute\/?$/, /^\/donate\/?$/,
  /^\/thank-you\/?$/, /^\/thanks\/?$/, /^\/thankyou\/?$/, /^\/success\/?$/,
  /^\/donate\/thank-you\/?$/,
  /^\/legal\/(crypto-notice|privacy|terms)\/?$/,
  /^\/vault\/?$/, /^\/stamp\/?$/, /^\/stamp\/done\/?$/, /^\/stamp\/live-feed\/?$/,
  /^\/stamp\/[^/]+\/report\/?$/, /^\/stamp\/wizard-pro\/?$/, /^\/stamp\/drag-and-drop\/?$/,
  /^\/contracts\/?$/, /^\/contracts\/[^/]+\/?$/, /^\/contracts\/new\/[^/]+\/?$/,
  /^\/contracts\/edit\/[^/]+\/?$/,
  /^\/contracts\/[^/]+\/timestamp\/(review|explanation|progress|result)\/?$/,
  /^\/snapper\/?$/, /^\/certificates\/?$/, /^\/developer\/?$/, /^\/developers\/?$/,
  /^\/developer-portal\/?$/, /^\/developer\/playground\/?$/, /^\/documentation\/?$/,
  /^\/atlas\/?$/, /^\/nodes\/?$/, /^\/explorer\/?$/,
  /^\/templates\/?$/, /^\/templates\/new\/?$/, /^\/templates\/[^/]+\/?$/,
  /^\/faq\/?$/, /^\/pricing\/?$/, /^\/proof-pack\/?$/, /^\/comparison\/?$/, /^\/compare\/?$/,
  /^\/guides\/?$/, /^\/glossary\/?$/, /^\/docs\/?$/, /^\/docs\/executive-summary\/?$/,
  /^\/docs\/[^/]+\/?$/, /^\/watch\/?$/, /^\/explainer\/?$/, /^\/watch-player\/?$/,
  /^\/security\/?$/, /^\/integrations\/?$/, /^\/government\/?$/, /^\/motopass-verify\/?$/,
  /^\/batch-hash\/?$/, /^\/chain-of-custody\/?$/, /^\/evidence-admissibility\/?$/,
  /^\/distressed-asset\/?$/, /^\/widgets\/?$/, /^\/identity\/?$/, /^\/proof-of-existence\/?$/,
  /^\/network\/?$/, /^\/status\/?$/, /^\/counsel\/?$/, /^\/p\/[^/]+\/?$/,
  /^\/bitcoin\/?$/, /^\/block\/[^/]+\/?$/, /^\/ai\/?$/, /^\/ai-notary\/?$/,
  /^\/community\/(proof-wall|leaderboard|feed)\/?$/,
  /^\/widget\/proof\/[^/]+\/?$/, /^\/mobile-scanner\/?$/, /^\/history\/timeline\/?$/,
  /^\/dashboard\/?$/, /^\/dashboard\/metrics\/?$/, /^\/settings\/?$/, /^\/image-vault\/?$/,
  /^\/protocol-stats\/?$/, /^\/offers\/?$/, /^\/forum\/?$/, /^\/forum\/[^/]+\/?$/,
  /^\/mobile-signer\/?$/, /^\/batch\/?$/, /^\/admin\/?$/, /^\/admin\/throttle\/?$/,
  /^\/signatures\/[^/]+\/?$/, /^\/onboarding\/(welcome|how-it-works|choose-template|account-creation|value-confirmation|batch-proof|template-library)\/?$/,
  /^\/timestamp\/verification-help\/?$/, /^\/nostr-health\/?$/, /^\/choose-template\/?$/,
  /^\/account-creation\/?$/, /^\/web-capture\/?$/, /^\/audit-log\/?$/, /^\/changelog\/?$/,
]

const NOT_FOUND_HTML = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>404 — Page not found · Satohash</title>
<style>html,body{margin:0;height:100%;background:#0e1c2a;color:#e8f4fb;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
.wrap{min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5rem;text-align:center;padding:2rem}
.code{font-size:5rem;font-weight:800;color:#f0a030;line-height:1}h1{font-size:1.4rem;margin:0}
p{color:#9fc0d4;margin:0}a{color:#f0a030}</style></head><body>
<div class="wrap"><div class="code">404</div><h1>Page not found</h1>
<p>That address doesn't exist on Satohash.</p>
<p><a href="/">← Back to satohash.io</a></p></div></body></html>`

function isKnownRoute(pathname) {
  return KNOWN_ROUTES.some((re) => re.test(pathname))
}

function isPageRequest(pathname) {
  if (pathname.startsWith('/api/') || pathname.startsWith('/assets/') || pathname.startsWith('/b/')) return false
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return false
  return true
}

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url)
  const ua = request.headers.get('user-agent') || ''

  // ── Unmatched /api/* must not be answered with the SPA shell ────────────────
  // public/_redirects ends with `/* /index.html 200`, so a path like /api/keys on
  // this host used to come back as HTTP 200 text/html. Any "does this endpoint
  // exist?" probe therefore read as a false positive — that is how a dead
  // /api/keys call shipped unnoticed. Real API routes live on api.satohash.io;
  // the only /api route served here is /api/metrics (a JSON proxy).
  if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
    const res = await next()
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('text/html')) {
      return new Response(
        JSON.stringify({
          error: 'Not Found',
          message: `No API route at ${url.pathname} on this host.`,
          hint: 'The Satohash API is served from https://api.satohash.io. This host only answers /api/metrics.',
          api: 'https://api.satohash.io'
        }),
        {
          status: 404,
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'no-store',
            'access-control-allow-origin': '*',
            'x-robots-tag': 'noindex'
          }
        }
      )
    }
    return res
  }

  // GSC HTML file must be 200 at the exact .html URL. Cloudflare Pages Pretty URLs
  // otherwise 308 → /googlef508c6fb64de60ff, which fails ownership verification.
  if (
    (request.method === 'GET' || request.method === 'HEAD') &&
    GSC_VERIFY_PATHS.has(url.pathname)
  ) {
    return new Response(request.method === 'HEAD' ? null : GSC_VERIFY_BODY, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=0, must-revalidate',
        'x-robots-tag': 'noindex'
      }
    })
  }

  // Embeddable player for X/Twitter cards — must NOT inherit X-Frame-Options: DENY
  if (
    request.method === 'GET' &&
    (url.pathname === '/watch-player.html' || url.pathname === '/watch-player')
  ) {
    return new Response(PLAYER_HTML, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=3600',
        'x-robots-tag': 'noindex, nofollow',
        'x-frame-options': 'ALLOWALL',
        'content-security-policy': PLAYER_CSP
      }
    })
  }

  // Real 404 for unknown client routes (soft-404 close) — before SPA fallback.
  // Crawlers still get prerender for KNOWN routes below; junk URLs must not
  // return the SPA shell. Skip /api, /assets, /b/* (handled above / static).
  if (request.method === 'GET' && isPageRequest(url.pathname) && !isKnownRoute(url.pathname)) {
    return new Response(NOT_FOUND_HTML, {
      status: 404,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'x-robots-tag': 'noindex',
        'cache-control': 'public, max-age=300'
      }
    })
  }

  // Only intercept GET page requests from crawlers
  if (request.method !== 'GET' || url.pathname.includes('.')) {
    return next()
  }

  const isCrawler = CRAWLER_RE.test(ua)

  if (isCrawler) {
    // Landing
    if (url.pathname === '/' || url.pathname === '') {
      const html = await env.ASSETS.fetch(`${url.origin}/prerender/landing.html`)
      if (html.ok) {
        return new Response(html.body, {
          headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'index, follow', 'cache-control': 'public, max-age=3600' }
        })
      }
    }
    // Mapped routes
    for (const { route, file } of PRERENDER_MAP) {
      const m = url.pathname.match(route)
      if (m) {
        const html = await env.ASSETS.fetch(`${url.origin}${file(m)}`)
        if (html.ok) {
          return new Response(html.body, {
            headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'index, follow', 'cache-control': 'public, max-age=3600' }
          })
        }
      }
    }
  }

  return next()
}
