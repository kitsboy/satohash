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

export const getBitcoinNetworkStats = async () => {
  try {
    const [heightRes, diffRes, feesRes] = await Promise.all([
      fetch(`${MEMPOOL_API_URL}/blocks/tip/height`, { signal: AbortSignal.timeout(5000) }),
      fetch(`${MEMPOOL_API_URL}/v1/difficulty-adjustment`, { signal: AbortSignal.timeout(5000) }),
      fetch(`${MEMPOOL_API_URL}/v1/fees/recommended`, { signal: AbortSignal.timeout(5000) })
    ])

    const height = heightRes.ok ? await heightRes.json() : 880000
    const diff = diffRes.ok
      ? await diffRes.json()
      : { progressPercent: 50, difficultyChange: 0, remainingBlocks: 1016 }
    const fees = feesRes.ok
      ? await feesRes.json()
      : { fastestFee: 25, halfHourFee: 18, hourFee: 12, minimumFee: 2 }

    return {
      blockHeight: height,
      difficultyChange: diff.difficultyChange,
      difficultyProgress: diff.progressPercent,
      remainingBlocks: diff.remainingBlocks,
      fees: {
        high: fees.fastestFee,
        medium: fees.halfHourFee,
        low: fees.hourFee,
        minimum: fees.minimumFee
      },
      timestamp: Date.now()
    }
  } catch {
    return {
      blockHeight: 880000,
      difficultyChange: 0.12,
      difficultyProgress: 52.4,
      remainingBlocks: 980,
      fees: { high: 25, medium: 18, low: 12, minimum: 2 },
      timestamp: Date.now()
    }
  }
}
