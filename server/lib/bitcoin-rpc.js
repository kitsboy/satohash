/**
 * Shared Bitcoin Core RPC client — ready when BITCOIN_RPC_URL (+ optional AUTH) set.
 */
import logger from '../logger.js'

export function isBitcoinRpcConfigured() {
  return Boolean(process.env.BITCOIN_RPC_URL?.trim())
}

export async function bitcoinRpc(method, params = [], { timeoutMs = 5000 } = {}) {
  const url = process.env.BITCOIN_RPC_URL
  if (!url) throw new Error('BITCOIN_RPC_URL not set')

  const headers = { 'Content-Type': 'application/json' }
  if (process.env.BITCOIN_RPC_AUTH) {
    headers.Authorization = `Basic ${process.env.BITCOIN_RPC_AUTH}`
  } else if (process.env.BITCOIN_RPC_USER && process.env.BITCOIN_RPC_PASSWORD) {
    const token = Buffer.from(
      `${process.env.BITCOIN_RPC_USER}:${process.env.BITCOIN_RPC_PASSWORD}`
    ).toString('base64')
    headers.Authorization = `Basic ${token}`
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ jsonrpc: '1.0', id: 'satohash', method, params }),
    signal: AbortSignal.timeout(timeoutMs)
  })
  const json = await res.json().catch(() => ({}))
  if (json.error) {
    throw new Error(json.error.message || JSON.stringify(json.error))
  }
  return json.result
}

export async function bitcoinRpcHealth() {
  if (!isBitcoinRpcConfigured()) {
    return {
      configured: false,
      status: 'not_configured',
      note: 'Set BITCOIN_RPC_URL (+ BITCOIN_RPC_AUTH or USER/PASSWORD) on THOR to enable own-node verify'
    }
  }
  try {
    const [height, net, chain, mem] = await Promise.all([
      bitcoinRpc('getblockcount'),
      bitcoinRpc('getnetworkinfo').catch(() => null),
      bitcoinRpc('getblockchaininfo').catch(() => null),
      bitcoinRpc('getmempoolinfo').catch(() => null)
    ])
    return {
      configured: true,
      status: 'healthy',
      source: 'bitcoind',
      block_height: height,
      peers: net?.connections ?? null,
      chain: chain?.chain ?? 'main',
      pruned: chain?.pruned ?? null,
      mempool_count: mem?.size ?? null,
      ready_to_verify: true
    }
  } catch (e) {
    logger.warn('bitcoin rpc health: %s', e.message)
    return {
      configured: true,
      status: 'unhealthy',
      error: e.message,
      ready_to_verify: false
    }
  }
}
