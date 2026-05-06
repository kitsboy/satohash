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

export const getTieredFeeEstimates = async () => {
  try {
    const response = await fetch(`${MEMPOOL_API_URL}/v1/fees/recommended`, {
      signal: AbortSignal.timeout(5000)
    })
    if (!response.ok) return FALLBACK_FEES
    const data = await response.json()
    return {
      high: data.fastestFee || 25,
      medium: data.halfHourFee || 18,
      low: data.hourFee || 12,
      economy: data.economyFee || 6,
      minimum: data.minimumFee || 2,
      unit: 'sat/vB',
      timestamp: Date.now()
    }
  } catch {
    return FALLBACK_FEES
  }
}

export const getFeeEstimates = getTieredFeeEstimates // Backward compatibility

export const convertSatsToFiat = (sats, fiatRate = 50000) => {
  // Simple conversion - in production, fetch live rates
  const btc = sats / 100000000
  const fiat = btc * fiatRate
  return fiat.toFixed(2)
}

export const getMempoolStats = async () => {
  try {
    const response = await fetch(`${MEMPOOL_API_URL}/mempool`, {
      signal: AbortSignal.timeout(5000)
    })
    if (!response.ok) throw new Error()
    return await response.json()
  } catch {
    return { mempoolSize: 145200, blockCount: 881234, averageFee: 8.5 }
  }
}

export const getBlockHeight = async () => {
  try {
    const response = await fetch(`${MEMPOOL_API_URL}/blocks/tip/height`, {
      signal: AbortSignal.timeout(5000)
    })
    if (!response.ok) throw new Error()
    return await response.json()
  } catch {
    return 880000
  }
}
