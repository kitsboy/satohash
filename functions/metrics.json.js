/**
 * Cloudflare Pages Function — live proxy for /metrics.json
 *
 * Static public/metrics.json is stripped from dist at build time so this
 * handler wins. HQ and browsers get live gab.product-metrics.v1 from the API.
 * Canonical SoT remains https://api.satohash.io/metrics.json
 */
const SOURCE = 'https://api.satohash.io/metrics.json'

export async function onRequestGet(context) {
  try {
    const res = await fetch(SOURCE, {
      headers: { accept: 'application/json' },
      cf: { cacheTtl: 30, cacheEverything: true }
    })
    if (!res.ok) {
      return json(
        {
          schema: 'gab.product-metrics.v1',
          productId: 'satohash',
          error: `upstream ${res.status}`,
          _proxy: { source: SOURCE, ok: false }
        },
        502
      )
    }
    const data = await res.json()
    const body = {
      ...data,
      _proxy: {
        source: SOURCE,
        proxiedAt: new Date().toISOString(),
        note: 'Live proxy via CF Pages Function; HQ should prefer api.satohash.io directly'
      }
    }
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=30, must-revalidate',
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, OPTIONS',
        'x-satohash-metrics': 'proxy'
      }
    })
  } catch (err) {
    return json(
      {
        schema: 'gab.product-metrics.v1',
        productId: 'satohash',
        error: err.message || 'proxy failed',
        _proxy: { source: SOURCE, ok: false }
      },
      502
    )
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-allow-headers': 'Content-Type, Accept',
      'access-control-max-age': '86400'
    }
  })
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'no-store'
    }
  })
}
