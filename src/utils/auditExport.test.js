import { describe, it, expect, beforeEach } from 'vitest'
import { buildAuditLog } from './auditExport'

describe('auditExport', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('buildAuditLog returns export shape', () => {
    localStorage.setItem(
      'satohash_contracts',
      JSON.stringify([{ id: 'c1', name: 'Test', status: 'draft' }])
    )
    const log = buildAuditLog()
    expect(log.contractCount).toBe(1)
    expect(log.exportedAt).toBeTruthy()
    expect(log.contracts[0].id).toBe('c1')
  })
})
