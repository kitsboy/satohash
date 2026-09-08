// Mempool.space API client for fee estimates
// mempool.space supports CORS natively — no proxy needed

const MEMPOOL_API_URL = import.meta.env.VITE_MEMPOOL_API_URL || 'https://mempool.space/api'

const FALLBACK_FEES = {
  high: 25,
  medium: 18,
  low: 12,
  economy: 6,
  minimum: 2,
  unit: 'sat/vB',
  timestamp: Date.now(),
  source: 'fallback'
}

const FALLBACK_MEMPOOL = {
  mempoolSize: 145200,
  blockCount: 881234,
  averageFee: 8.5,
  source: 'fallback'
}

function offlineResult(fallback, reason = 'network') {
  return { ok: false, data: fallback, source: 'fallback', error: reason }
}

function liveResult(data) {
  return { ok: true, data, source: 'live', error: null }
}

export const getTieredFeeEstimatesResult = async () => {
  try {
    const response = await fetch(`${MEMPOOL_API_URL}/v1/fees/recommended`, {
      signal: AbortSignal.timeout(5000)
    })
    if (!response.ok) return offlineResult(FALLBACK_FEES, `http_${response.status}`)
    const data = await response.json()
    return liveResult({
      high: data.fastestFee || 25,
      medium: data.halfHourFee || 18,
      low: data.hourFee || 12,
      economy: data.economyFee || 6,
      minimum: data.minimumFee || 2,
      unit: 'sat/vB',
      timestamp: Date.now()
    })
  } catch (e) {
    return offlineResult(FALLBACK_FEES, e?.name === 'TimeoutError' ? 'timeout' : 'offline')
  }
}

export const getTieredFeeEstimates = async () => {
  const result = await getTieredFeeEstimatesResult()
  return { ...result.data, source: result.source, error: result.error, ok: result.ok }
}

/** @deprecated Use getTieredFeeEstimates — returns data only for backward compat */
export const getFeeEstimates = getTieredFeeEstimates

export const convertSatsToFiat = (sats, fiatRate = 50000) => {
  const btc = sats / 100000000
  const fiat = btc * fiatRate
  return fiat.toFixed(2)
}

export const getMempoolStatsResult = async () => {
  try {
    const response = await fetch(`${MEMPOOL_API_URL}/mempool`, {
      signal: AbortSignal.timeout(5000)
    })
    if (!response.ok) return offlineResult(FALLBACK_MEMPOOL, `http_${response.status}`)
    const data = await response.json()
    return liveResult(data)
  } catch (e) {
    return offlineResult(FALLBACK_MEMPOOL, e?.name === 'TimeoutError' ? 'timeout' : 'offline')
  }
}

export const getMempoolStats = async () => {
  const result = await getMempoolStatsResult()
  return { ...result.data, source: result.source, error: result.error }
}

export const getBlockHeightResult = async () => {
  try {
    const response = await fetch(`${MEMPOOL_API_URL}/blocks/tip/height`, {
      signal: AbortSignal.timeout(5000)
    })
    if (!response.ok) return offlineResult(null, `http_${response.status}`)
    const height = await response.json()
    return liveResult(height)
  } catch (e) {
    return offlineResult(null, e?.name === 'TimeoutError' ? 'timeout' : 'offline')
  }
}

export const getBlockHeight = async () => {
  const result = await getBlockHeightResult()
  return result.data
}

const NETWORK_STATS_FALLBACK = {
  blockHeight: null,
  difficultyChange: null,
  difficultyProgress: null,
  remainingBlocks: null,
  fees: { high: null, medium: null, low: null, minimum: null },
  timestamp: Date.now()
}

function normalizeNetworkFees(fees = {}) {
  return {
    high: fees.high ?? fees.fastestFee ?? null,
    medium: fees.medium ?? fees.halfHourFee ?? null,
    low: fees.low ?? fees.hourFee ?? null,
    minimum: fees.minimum ?? fees.minimumFee ?? null
  }
}

/** Returns { ok, source, error, data } — use getBitcoinNetworkStats() for flat stats in UI */
export const getBitcoinNetworkStatsResult = async () => {
  try {
    const [heightRes, diffRes, feesRes] = await Promise.all([
      fetch(`${MEMPOOL_API_URL}/blocks/tip/height`, { signal: AbortSignal.timeout(5000) }),
      fetch(`${MEMPOOL_API_URL}/v1/difficulty-adjustment`, { signal: AbortSignal.timeout(5000) }),
      fetch(`${MEMPOOL_API_URL}/v1/fees/recommended`, { signal: AbortSignal.timeout(5000) })
    ])

    const height = heightRes.ok ? await heightRes.json() : null
    const diff = diffRes.ok
      ? await diffRes.json()
      : {
          progressPercent: null,
          difficultyChange: null,
          remainingBlocks: null
        }
    const fees = feesRes.ok ? await feesRes.json() : {}

    const allOk = heightRes.ok && diffRes.ok && feesRes.ok
    return {
      ok: allOk,
      source: allOk ? 'live' : 'partial',
      error: allOk ? null : 'partial_fetch',
      data: {
        blockHeight: height,
        // Round for UI pills (raw mempool floats overflow cards)
        difficultyChange:
          diff.difficultyChange == null ? null : Number(Number(diff.difficultyChange).toFixed(4)),
        difficultyProgress:
          diff.progressPercent == null ? null : Number(Number(diff.progressPercent).toFixed(2)),
        remainingBlocks: diff.remainingBlocks ?? null,
        fees: normalizeNetworkFees({
          high: fees?.fastestFee,
          medium: fees?.halfHourFee,
          low: fees?.hourFee,
          minimum: fees?.minimumFee
        }),
        timestamp: Date.now()
      }
    }
  } catch (e) {
    return {
      ok: false,
      source: 'fallback',
      error: e?.message || 'offline',
      data: { ...NETWORK_STATS_FALLBACK, timestamp: Date.now() }
    }
  }
}

/** Flat stats for Landing and legacy callers — missing fields stay null, never invented */
export const getBitcoinNetworkStats = async () => {
  const result = await getBitcoinNetworkStatsResult()
  const data = result?.data ?? {}
  return {
    ...NETWORK_STATS_FALLBACK,
    ...data,
    fees: normalizeNetworkFees(data.fees),
    timestamp: data.timestamp ?? Date.now()
  }
}
