import React, { useState, useEffect } from 'react'
import { useSocket } from '../hooks/useSocket'
import { generatePDF } from '../utils/pdfGenerator'
import { Download, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const HistoryList = () => {
  const [history, setHistory] = useState([])
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

  return (
    <div className="mt-8 space-y-4">
      <h2 className="flex items-center gap-2 text-xl font-bold text-white">
        Recent Stamping History
        <span className="rounded-full border border-indigo-500/30 bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-400">
          Auto-updating
        </span>
      </h2>
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
              {history.map((item) => (
                <tr key={item.id} className="group transition-colors hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white transition-colors group-hover:text-indigo-400">
                        {item.filename}
                      </span>
                      <span className="max-w-[200px] truncate font-mono text-[10px] text-white/30">
                        {item.hash}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-white/60 capitalize">
                      {getStatusIcon(item.status)}
                      {item.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-white/40">
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => generatePDF(item)}
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-400 transition-all hover:bg-indigo-500 hover:text-white"
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
                </tr>
              ))}
              {history.length === 0 && (
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
