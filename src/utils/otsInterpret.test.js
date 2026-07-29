import { describe, it, expect } from 'vitest'
import { interpretOtsResult } from './otsInterpret'

describe('interpretOtsResult', () => {
  it('marks PendingAttestation as pending not success', () => {
    const r = interpretOtsResult({
      hadOtsFile: true,
      structural: { verified: true, mode: 'structural' },
      hash: 'ba304f194b7136ccfa9100ab43295a88546a8750ca2e5f72ac04b86655f0c5f3',
      api: {
        verified: false,
        details: `verify PendingAttestation('https://alice.btc.calendar.opentimestamps.org')
verify PendingAttestation('https://bob.btc.calendar.opentimestamps.org')`
      }
    })
    expect(r.level).toBe('pending')
    expect(r.title).toBe('Pending')
    expect(r.eli16.toLowerCase()).toMatch(/not on the bitcoin|pending receipt|calendars/)
  })

  it('marks bitcoin block as success', () => {
    const r = interpretOtsResult({
      hadOtsFile: true,
      api: { verified: true, bitcoin_block_height: 900001, details: 'Bitcoin block 900001' },
      hash: 'aa'.repeat(32)
    })
    expect(r.level).toBe('success')
    expect(r.title).toBe('Success')
  })

  it('marks bad structural as failed', () => {
    const r = interpretOtsResult({
      hadOtsFile: true,
      structural: { verified: false, mode: 'failed', message: 'corrupt' }
    })
    expect(r.level).toBe('failed')
  })
})
