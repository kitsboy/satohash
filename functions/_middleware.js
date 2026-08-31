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
  { route: /^\/(stamp|pricing|templates|verify|donate|network)\/?$/, file: (m) => `/prerender/${m[1]}.html` },
  { route: /^\/(identity|status|counsel)\/?$/, file: (m) => `/prerender/${m[1]}.html` }
]

const PLAYER_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex,nofollow" />
<title>Satohash explainer</title>
<style>html,body{margin:0;height:100%;background:#0e1c2a}video{display:block;width:100%;height:100%;object-fit:contain;background:#0e1c2a}</style>
</head>
<body>
<video controls playsinline preload="metadata" poster="https://satohash.io/og/watch.png" src="https://videos.giveabit.io/media/video/satohash-explainer-with-vo2.mp4?v=kimi-noir-20260819">
<a href="https://satohash.io/watch">Watch the Satohash explainer</a>
</video>
</body>
</html>`

const PLAYER_CSP =
  "default-src 'none'; media-src https://videos.giveabit.io; img-src 'self' https://satohash.io; style-src 'unsafe-inline'; frame-ancestors https://twitter.com https://x.com https://platform.twitter.com https://tweetdeck.twitter.com https://cards-dev.twitter.com; base-uri 'none'; form-action 'none'"

const GSC_VERIFY_PATHS = new Set(['/googlef508c6fb64de60ff.html', '/googlef508c6fb64de60ff'])
const GSC_VERIFY_BODY = 'google-site-verification: googlef508c6fb64de60ff.html'

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url)
  const ua = request.headers.get('user-agent') || ''

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
        'content-security-policy': PLAYER_CSP
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
