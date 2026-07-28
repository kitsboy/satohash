/**
 * Shared Bitcoin Core RPC client — ready when BITCOIN_RPC_URL (+ optional AUTH) set.
 * During IBD (initial block download) status is "syncing", not unhealthy —
 * OTS calendars + mempool still serve public verify.
 */
import logger from '../logger.js'

export function isBitcoinRpcConfigured() {
  return Boolean(process.env.BITCOIN_RPC_URL?.trim())
}

export async function bitcoinRpc(method, params = [], { timeoutMs = 8000 } = {}) {
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
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
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
    const chain = await bitcoinRpc('getblockchaininfo', [], { timeoutMs: 10000 })
    const net = await bitcoinRpc('getnetworkinfo').catch(() => null)
    const mem = await bitcoinRpc('getmempoolinfo').catch(() => null)
    const height = chain?.blocks ?? (await bitcoinRpc('getblockcount').catch(() => null))
    const headers = chain?.headers ?? null
    const ibd = Boolean(chain?.initialblockdownload)
    const progress =
      typeof chain?.verificationprogress === 'number'
        ? Math.round(chain.verificationprogress * 1000) / 10
        : headers && height
          ? Math.round((height / headers) * 1000) / 10
          : null

    if (ibd) {
      return {
        configured: true,
        status: 'syncing',
        source: 'bitcoind',
        block_height: height,
        headers,
        ibd: true,
        progress_pct: progress,
        peers: net?.connections ?? null,
        chain: chain?.chain ?? 'main',
        pruned: chain?.pruned ?? null,
        mempool_count: mem?.size ?? null,
        ready_to_verify: false,
        note: 'Own node Initial Block Download in progress — not an outage. Public OTS calendars + mempool.space still used for stamps/verify until IBD completes.'
      }
    }

    return {
      configured: true,
      status: 'healthy',
      source: 'bitcoind',
      block_height: height,
      headers,
      ibd: false,
      progress_pct: 100,
      peers: net?.connections ?? null,
      chain: chain?.chain ?? 'main',
      pruned: chain?.pruned ?? null,
      mempool_count: mem?.size ?? null,
      ready_to_verify: true,
      note: 'Own pruned bitcoind ready for independent verify'
    }
  } catch (e) {
    logger.warn('bitcoin rpc health: %s', e.message)
    return {
      configured: true,
      status: 'unhealthy',
      error: e.message,
      ready_to_verify: false,
      note: 'RPC configured but unreachable — check bitcoind process and BITCOIN_RPC_* env'
    }
  }
}
