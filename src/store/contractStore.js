import { create } from 'zustand'

export const useContractStore = create((set) => ({
  contracts: (() => {
    try {
      return JSON.parse(localStorage.getItem('satohash_contracts') || '[]')
    } catch {
      return []
    }
  })(),

  addContract: (contract) =>
    set((state) => {
      const newContracts = [...state.contracts, contract]
      localStorage.setItem('satohash_contracts', JSON.stringify(newContracts))
      return { contracts: newContracts }
    }),

  updateContract: (contract) =>
    set((state) => {
      const newContracts = state.contracts.map((c) => (c.id === contract.id ? contract : c))
      localStorage.setItem('satohash_contracts', JSON.stringify(newContracts))
      return { contracts: newContracts }
    }),

  deleteContract: (id) =>
    set((state) => {
      const newContracts = state.contracts.filter((c) => c.id !== id)
      localStorage.setItem('satohash_contracts', JSON.stringify(newContracts))
      return { contracts: newContracts }
    })
}))
