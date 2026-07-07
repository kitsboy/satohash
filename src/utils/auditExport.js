import { loadContracts, getContractActivity } from './contractStorage'

export function buildAuditLog() {
  const contracts = loadContracts()
  const activity = getContractActivity()
  const stamps = (() => {
    try {
      return JSON.parse(localStorage.getItem('satohash_stamps') || '[]')
    } catch {
      return []
    }
  })()

  return {
    exportedAt: new Date().toISOString(),
    npub: localStorage.getItem('satohash_npub') || null,
    contractCount: contracts.length,
    stampCount: stamps.length,
    contracts: contracts.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      createdAt: c.createdAt,
      signedAt: c.signedAt,
      timestampedAt: c.timestampedAt
    })),
    activity
  }
}

export function downloadAuditLog() {
  const payload = buildAuditLog()
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `satohash-audit-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}
