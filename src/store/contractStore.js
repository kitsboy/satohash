import { create } from 'zustand'
import { loadContracts, saveContracts } from '../utils/contractStorage'

/** Zustand store — delegates persistence to contractStorage helpers. */
export const useContractStore = create((set) => ({
  contracts: loadContracts(),

  addContract: (contract) =>
    set((state) => {
      const newContracts = [...state.contracts, contract]
      saveContracts(newContracts)
      return { contracts: newContracts }
    }),

  updateContract: (contract) =>
    set((state) => {
      const newContracts = state.contracts.map((c) => (c.id === contract.id ? contract : c))
      saveContracts(newContracts)
      return { contracts: newContracts }
    }),

  deleteContract: (id) =>
    set((state) => {
      const newContracts = state.contracts.filter((c) => c.id !== id)
      saveContracts(newContracts)
      return { contracts: newContracts }
    }),

  refresh: () => set({ contracts: loadContracts() })
}))
