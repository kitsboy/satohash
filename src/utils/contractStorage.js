const CONTRACTS_KEY = 'satohash_contracts'

export function loadContracts() {
  try {
    const raw = localStorage.getItem(CONTRACTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveContracts(contracts) {
  localStorage.setItem(CONTRACTS_KEY, JSON.stringify(contracts))
}

export function updateContract(id, patch) {
  const contracts = loadContracts()
  const idx = contracts.findIndex((c) => c.id === id)
  if (idx < 0) return null
  contracts[idx] = { ...contracts[idx], ...patch }
  saveContracts(contracts)
  return contracts[idx]
}

export function getContractStats(contracts = loadContracts()) {
  const total = contracts.length
  const signed = contracts.filter((c) => c.status === 'signed').length
  const timestamped = contracts.filter((c) => c.status === 'timestamped').length
  const secured = contracts.filter(
    (c) => c.status === 'timestamped' || c.status === 'signed'
  ).length
  const avgHealth = total ? Math.round(((secured + timestamped) / (total * 2)) * 1000) / 10 : 100
  return { total, signed, timestamped, secured, avgHealth }
}

export function getContractActivity(contracts = loadContracts(), limit = 8) {
  return [...contracts]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, limit)
    .map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      at: c.updatedAt || c.createdAt
    }))
}
