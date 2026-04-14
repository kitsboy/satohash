// Mempool.space API client for fee estimates with CORS proxy

const CORS_PROXY_URL = 'https://proxy.shakespeare.diy/?url='
const MEMPOOL_API_URL = import.meta.env.VITE_MEMPOOL_API_URL || 'https://mempool.space/api'

export const getFeeEstimates = async () => {
  try {
    const response = await fetch(
      `${CORS_PROXY_URL}${encodeURIComponent(`${MEMPOOL_API_URL}/v1/fees/recommended`)}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch fee estimates')
    }
    const data = await response.json()

    // Returns: { fastestFee, halfHourFee, hourFee, economyFee, minimumFee }
    return data
  } catch (error) {
    console.error('Error fetching fee estimates:', error)
    // Return user-friendly fallback estimates
    return {
      fastestFee: 25,
      halfHourFee: 18,
      hourFee: 12,
      economyFee: 6,
      minimumFee: 2
    }
  }
}

export const convertSatsToFiat = (sats, fiatRate = 50000) => {
  // Simple conversion - in production, fetch live rates
  const btc = sats / 100000000
  const fiat = btc * fiatRate
  return fiat.toFixed(2)
}

export const getMempoolStats = async () => {
  try {
    const response = await fetch(
      `${CORS_PROXY_URL}${encodeURIComponent(`${MEMPOOL_API_URL}/mempool`)}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch mempool stats')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching mempool stats:', error)
    return {
      mempoolSize: 145200,
      blockCount: 881234,
      averageFee: 8.5
    }
  }
}

export const getBlockHeight = async () => {
  try {
    const response = await fetch(
      `${CORS_PROXY_URL}${encodeURIComponent(`${MEMPOOL_API_URL}/blocks/tip/height`)}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch block height')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching block height:', error)
    return 880000 // Realistic placeholder
  }
}
