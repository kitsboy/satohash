import React from 'react'

export function isStaleChunk(err) {
  const msg = String(err?.message || err || '')
  return (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes('error loading dynamically imported module') ||
    msg.includes("Unexpected token '<'") ||
    /Loading chunk [\d]+ failed/i.test(msg)
  )
}

/** Retry a stale lazy import once. Never location.replace — that flashed System Desync. */
export function lazyWithReload(factory) {
  return React.lazy(() =>
    factory().catch((err) => {
      if (!isStaleChunk(err)) throw err
      return factory()
    })
  )
}
