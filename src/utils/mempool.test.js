import { describe, it, expect } from 'vitest'
import {
  getTieredFeeEstimatesResult,
  getBlockHeightResult,
  getBitcoinNetworkStats,
  getBitcoinNetworkStatsResult
} from './mempool'

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
})
