import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getTieredFeeEstimatesResult,
  getBlockHeightResult,
  getBitcoinNetworkStats,
  getBitcoinNetworkStatsResult
} from './mempool'

const LIVE = Boolean(process.env.MEMPOOL_LIVE)

const MOCK_FEES = {
  fastestFee: 30,
  halfHourFee: 20,
  hourFee: 12,
  economyFee: 6,
  minimumFee: 2
}
const MOCK_HEIGHT = 900001
const MOCK_DIFFICULTY = {
  progressPercent: 52.4,
  difficultyChange: 0.12,
  remainingBlocks: 980
}

function mockMempoolFetch(url) {
  const path = String(url)
  if (path.includes('/v1/fees/recommended')) {
    return Promise.resolve({ ok: true, json: async () => MOCK_FEES })
  }
  if (path.includes('/blocks/tip/height')) {
    return Promise.resolve({ ok: true, json: async () => MOCK_HEIGHT })
  }
  if (path.includes('/v1/difficulty-adjustment')) {
    return Promise.resolve({ ok: true, json: async () => MOCK_DIFFICULTY })
  }
  return Promise.resolve({ ok: false, status: 404, json: async () => ({}) })
}

beforeEach(() => {
  if (LIVE) return
  vi.stubGlobal('fetch', vi.fn(mockMempoolFetch))
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('mempool client', () => {
  it('getTieredFeeEstimatesResult returns shape with ok/source', async () => {
    const result = await getTieredFeeEstimatesResult()
    expect(result).toHaveProperty('ok')
    expect(result).toHaveProperty('source')
    expect(result.data).toHaveProperty('high')
  })

  it('getBlockHeightResult returns numeric data', async () => {
    const result = await getBlockHeightResult()
    expect(typeof result.data).toBe('number')
  })

  it('getBitcoinNetworkStats returns flat stats with fees.high', async () => {
    const stats = await getBitcoinNetworkStats()
    expect(stats.fees).toBeDefined()
    expect(typeof stats.fees.high).toBe('number')
  })

  it('getBitcoinNetworkStatsResult wraps data with metadata', async () => {
    const result = await getBitcoinNetworkStatsResult()
    expect(result).toHaveProperty('ok')
    expect(result.data?.fees?.high).toBeDefined()
  })

  it.skipIf(!LIVE)('live mempool.space still returns shape', async () => {
    const result = await getTieredFeeEstimatesResult()
    expect(result).toHaveProperty('ok')
    expect(result).toHaveProperty('source')
    expect(result.data).toHaveProperty('high')
  })
})
