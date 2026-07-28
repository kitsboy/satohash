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
    if (!response.ok) return offlineResult(880000, `http_${response.status}`)
    const height = await response.json()
    return liveResult(height)
  } catch (e) {
    return offlineResult(880000, e?.name === 'TimeoutError' ? 'timeout' : 'offline')
  }
}

export const getBlockHeight = async () => {
  const result = await getBlockHeightResult()
  return result.data
}

const NETWORK_STATS_FALLBACK = {
  blockHeight: 880000,
  difficultyChange: 0.12,
  difficultyProgress: 52.4,
  remainingBlocks: 980,
  fees: { high: 25, medium: 18, low: 12, minimum: 2 },
  timestamp: Date.now()
}

function normalizeNetworkFees(fees = {}) {
  return {
    high: fees.high ?? fees.fastestFee ?? NETWORK_STATS_FALLBACK.fees.high,
    medium: fees.medium ?? fees.halfHourFee ?? NETWORK_STATS_FALLBACK.fees.medium,
    low: fees.low ?? fees.hourFee ?? NETWORK_STATS_FALLBACK.fees.low,
    minimum: fees.minimum ?? fees.minimumFee ?? NETWORK_STATS_FALLBACK.fees.minimum
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

    const height = heightRes.ok ? await heightRes.json() : NETWORK_STATS_FALLBACK.blockHeight
    const diff = diffRes.ok
      ? await diffRes.json()
      : {
          progressPercent: NETWORK_STATS_FALLBACK.difficultyProgress,
          difficultyChange: NETWORK_STATS_FALLBACK.difficultyChange,
          remainingBlocks: NETWORK_STATS_FALLBACK.remainingBlocks
        }
    const fees = feesRes.ok
      ? await feesRes.json()
      : { fastestFee: 25, halfHourFee: 18, hourFee: 12, minimumFee: 2 }

    const allOk = heightRes.ok && diffRes.ok && feesRes.ok
    return {
      ok: allOk,
      source: allOk ? 'live' : 'partial',
      error: allOk ? null : 'partial_fetch',
      data: {
        blockHeight: height,
        // Round for UI pills (raw mempool floats overflow cards)
        difficultyChange: Number(
          (diff.difficultyChange ?? NETWORK_STATS_FALLBACK.difficultyChange).toFixed(4)
        ),
        difficultyProgress: Number(
          (diff.progressPercent ?? NETWORK_STATS_FALLBACK.difficultyProgress).toFixed(2)
        ),
        remainingBlocks: diff.remainingBlocks ?? NETWORK_STATS_FALLBACK.remainingBlocks,
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

/** Flat stats for Landing and legacy callers — always includes fees.high */
export const getBitcoinNetworkStats = async () => {
  const result = await getBitcoinNetworkStatsResult()
  const data = result?.data ?? {}
  return {
    ...NETWORK_STATS_FALLBACK,
    ...data,
    fees: normalizeNetworkFees(data.fees)
  }
}
