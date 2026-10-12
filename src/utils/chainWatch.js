/**
 * Watch state from POST /api/verify.
 * Registry status is bookkeeping. Only verified === true is Bitcoin-confirmed.
 */
export function chainWatchState(body) {
  const verified = body?.verified === true
  const height = body?.bitcoin_block_height
  return {
    verified,
    status: verified ? 'confirmed' : 'pending',
    block: verified && height != null && height !== '' ? height : null
  }
}
