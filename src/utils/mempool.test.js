import { describe, it, expect } from 'vitest'
import { getTieredFeeEstimatesResult, getBlockHeightResult } from './mempool'

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
})
