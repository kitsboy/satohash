import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exportEncryptedVault, importEncryptedVault, isEncryptedVaultBundle } from './vaultExport'

describe('vaultExport', () => {
  beforeEach(() => {
    localStorage.clear()
    document.body.innerHTML = ''
  })

  it('rejects short passphrase on export', async () => {
    await expect(exportEncryptedVault('short')).rejects.toThrow(/8 characters/)
  })

  it('rejects short passphrase on import', async () => {
    await expect(importEncryptedVault({ alg: 'AES-GCM-PBKDF2' }, 'short')).rejects.toThrow(
      /8 characters/
    )
  })

  it('detects modern and legacy bundle shapes', () => {
    expect(
      isEncryptedVaultBundle({
        alg: 'AES-GCM-PBKDF2',
        salt: 'YQ==',
        iv: 'YQ==',
        data: 'YQ=='
      })
    ).toBe(true)
    expect(isEncryptedVaultBundle({ version: '4.1.0-ELITE', payload: 'x' })).toBe(true)
    expect(isEncryptedVaultBundle({ version: '5.0.0-ELITE', payload: 'x' })).toBe(true)
    expect(isEncryptedVaultBundle({ version: 1, stamps: [] })).toBe(false)
    expect(isEncryptedVaultBundle(null)).toBe(false)
  })

  it('round-trips AES-GCM vault when Web Crypto is available', async () => {
    if (!globalThis.crypto?.subtle) {
      return // skip in environments without subtle
    }
    localStorage.setItem('satohash_stamps', JSON.stringify([{ id: 'a', hash: 'abc' }]))
    localStorage.setItem('satohash_contracts', JSON.stringify([{ id: 'c1' }]))
    localStorage.setItem('satohash_offline_queue', JSON.stringify([{ id: 'q1' }]))

    // Capture download blob via Blob + click intercept is heavy; call encrypt path by
    // reimplementing through export then reading last created object URL is flaky.
    // Instead exercise import with a hand-built encrypt using the same primitives.
    const passphrase = 'test-pass-12'
    const payload = {
      version: 2,
      stamps: [{ id: 'a', hash: 'abc' }],
      contracts: [{ id: 'c1' }],
      queue: [{ id: 'q1' }]
    }
    const enc = new TextEncoder()
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      'PBKDF2',
      false,
      ['deriveKey']
    )
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    )
    const cipher = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(JSON.stringify(payload))
    )
    const bytesToB64 = (bytes) => {
      let s = ''
      const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
      for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i])
      return btoa(s)
    }
    const bundle = {
      alg: 'AES-GCM-PBKDF2',
      salt: bytesToB64(salt),
      iv: bytesToB64(iv),
      data: bytesToB64(new Uint8Array(cipher))
    }

    localStorage.clear()
    const result = await importEncryptedVault(bundle, passphrase)
    expect(result.stamps).toBe(1)
    expect(result.contracts).toBe(1)
    expect(result.queue).toBe(1)
    expect(JSON.parse(localStorage.getItem('satohash_stamps'))).toHaveLength(1)
  })

  it('export still rejects short passphrase with stubbed crypto', async () => {
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
    await expect(exportEncryptedVault('short')).rejects.toThrow(/8 characters/)
    vi.unstubAllGlobals()
  })
})
