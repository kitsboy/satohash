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
  { route: /^\/(stamp|pricing|templates|verify|donate|network)\/?$/, file: (m) => `/prerender/${m[1]}.html` }
]

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url)
  const ua = request.headers.get('user-agent') || ''

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
