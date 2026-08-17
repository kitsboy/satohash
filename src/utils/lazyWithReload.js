import React from 'react'

function isStaleChunk(err) {
  const msg = String(err?.message || err || '')
  return (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes('error loading dynamically imported module') ||
    msg.includes("Unexpected token '<'") ||
    /Loading chunk [\d]+ failed/i.test(msg)
  )
}

/** One reload per 15s when a deploy invalidated a lazy chunk. */
export function lazyWithReload(factory) {
  return React.lazy(() =>
    factory().catch((err) => {
      if (!isStaleChunk(err)) throw err
      try {
        const last = Number(sessionStorage.getItem('satohash_chunk_reset_at') || 0)
        if (Date.now() - last > 15000) {
          sessionStorage.setItem('satohash_chunk_reset_at', String(Date.now()))
          const u = new URL(window.location.href)
          u.searchParams.set('_chunk', String(Date.now()))
          window.location.replace(u.pathname + u.search + u.hash)
          return new Promise(() => {})
        }
      } catch {
        /* ignore */
      }
      throw err
    })
  )
}
