import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadContracts,
  saveContracts,
  getContractStats,
  getContractActivity
} from './contractStorage'

describe('contractStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads empty array by default', () => {
    expect(loadContracts()).toEqual([])
  })

  it('computes stats from contracts', () => {
    saveContracts([
      { id: '1', name: 'A', status: 'draft', createdAt: '2026-01-01' },
      { id: '2', name: 'B', status: 'signed', createdAt: '2026-01-02' },
      { id: '3', name: 'C', status: 'timestamped', createdAt: '2026-01-03' }
    ])
    const stats = getContractStats()
    expect(stats.total).toBe(3)
    expect(stats.secured).toBe(2)
    expect(stats.avgHealth).toBeGreaterThan(0)
  })

  it('returns recent activity', () => {
    saveContracts([
      { id: '1', name: 'Old', status: 'draft', createdAt: '2026-01-01' },
      { id: '2', name: 'New', status: 'signed', createdAt: '2026-01-10', updatedAt: '2026-01-11' }
    ])
    const activity = getContractActivity()
    expect(activity[0].name).toBe('New')
  })
})
