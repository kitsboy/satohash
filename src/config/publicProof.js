/**
 * One Bitcoin-confirmed stamp visitors can open.
 * Checked 2026-10-12 with POST /api/verify: verified true, bitcoind, block 969627.
 * The registry row is not the proof. The block height is.
 */
export const PUBLIC_PROOF = {
  hash: '515b2a393bbffcfe9c3511d04a4349e199dbff1959cc0ac1f76817cd92f53abd',
  blockHeight: 969627,
  id: '74397a78-3404-4e8c-a667-185d3def845b'
}

export const PUBLIC_PROOF_PATH = `/p/${PUBLIC_PROOF.hash}`
