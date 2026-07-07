import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exportEncryptedVault } from './vaultExport'

describe('vaultExport', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('crypto', {
      getRandomValues: (arr) => {
        arr.fill(1)
        return arr
      },
      subtle: {
        importKey: vi.fn().mockResolvedValue({}),
        deriveKey: vi.fn().mockResolvedValue({}),
        encrypt: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]).buffer)
      }
    })
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:test'),
      revokeObjectURL: vi.fn()
    })
    document.body.innerHTML = ''
  })

  it('rejects short passphrase', async () => {
    await expect(exportEncryptedVault('short')).rejects.toThrow(/8 characters/)
  })
})
