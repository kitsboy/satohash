import React, { useState, useEffect } from 'react'
import { useSocket } from '../hooks/useSocket'
import { generatePDF } from '../utils/pdfGenerator'
import { Download, Clock, CheckCircle2, AlertCircle, FileText, Search, Filter, ShieldCheck, Zap } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import ProofDNA from './ProofDNA'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const HistoryList = () => {
  const [history, setHistory] = useState([])
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { lastEvent } = useSocket()

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/api/history`)
      const data = await res.json()
      setHistory(data)
    } catch (error) {
      console.error('Failed to fetch history:', error)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  useEffect(() => {
    if (lastEvent) {
      fetchHistory() // Refresh on new stamped or confirmed events
    }
  }, [lastEvent])

  const getConversationalStatus = (status) => {
    switch (status) {
      case 'confirmed':
        return "Permanently Anchored";
      case 'pending':
        return "Propagating to Global Mesh...";
      default:
        return "Protocol Error";
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      case 'pending':
        return <Clock className="h-4 w-4 animate-pulse text-amber-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-rose-400" />
    }
  }

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(filter.toLowerCase()) || 
                          item.hash.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            Recent Stamping History
            <span className="rounded-full border border-[var(--accent-active)]/30 bg-[var(--accent-active)]/20 px-2 py-0.5 text-xs text-[var(--accent-active)]">
                {history.length}
            </span>
        </h2>
        
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2 ring-1 ring-white/5 focus-within:ring-indigo-500/50 transition-all">
                <Search size={16} className="text-white/20" />
                <input 
                    type="text" 
                    placeholder="Filter history..." 
                    className="bg-transparent text-xs font-medium text-white outline-none placeholder:text-white/20"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
            <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-xs font-bold text-white/60 outline-none hover:bg-white/10"
            >
                <option value="all">Any Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
            </select>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0f111a]/80 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/5 bg-white/[0.02]">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-white/40 uppercase">
                  File / Hash
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-white/40 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-white/40 uppercase">
                  Time
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-white/40 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredHistory.map((item) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item.id} 
                    className="group transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <ProofDNA hash={item.hash} size="sm" />
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-white transition-colors group-hover:text-[var(--accent-active)] uppercase italic tracking-tight">
                            {item.filename}
                            </span>
                            <span className="max-w-[150px] truncate font-mono text-[9px] text-white/20 uppercase">
                            DNA SIGNATURE: {item.hash.substring(0, 12)}...
                            </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-white/60 italic uppercase tracking-widest">
                        {item.status === 'confirmed' ? (
                            <Zap size={14} className="text-emerald-400 fill-emerald-400" />
                        ) : (
                            <Clock size={14} className="animate-spin text-amber-400" />
                        )}
                        {getConversationalStatus(item.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-white/40">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => generatePDF(item)}
                          className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent-active)]/30 bg-[var(--accent-active)]/10 px-3 py-1.5 text-xs text-[var(--accent-active)] transition-all hover:bg-[var(--accent-active)] hover:text-white"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Certificate
                        </button>
                        <a
                          href={`${API_URL}/api/stamps/${item.id}?download=true`}
                          className="inline-flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-white/60 transition-all hover:bg-white/10"
                        >
                          <Download className="h-3.5 w-3.5" />
                          OTS File
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-sm text-white/20">
                    No stamps found yet. Start by hashing a file!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default HistoryList
