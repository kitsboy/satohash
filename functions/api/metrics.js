/**
 * Alternate path: /api/metrics → live proxy (if /metrics.json Function lags).
 * HQ should still prefer https://api.satohash.io/metrics.json
 */
const SOURCE = 'https://api.satohash.io/metrics.json'

export async function onRequestGet() {
  try {
    const res = await fetch(SOURCE, { headers: { accept: 'application/json' } })
    const data = await res.json()
    return new Response(
      JSON.stringify({
        ...data,
        _proxy: { source: SOURCE, path: '/api/metrics', proxiedAt: new Date().toISOString() }
      }),
      {
        status: res.ok ? 200 : 502,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'public, max-age=30',
          'access-control-allow-origin': '*'
        }
      }
    )
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 502,
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }
    })
  }
}
