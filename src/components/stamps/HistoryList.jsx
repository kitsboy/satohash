import { useState, useEffect, useCallback } from 'react'
import { useSocket } from '../../hooks/useSocket'
import { generatePDF } from '../../utils/pdfGenerator'
import { Download, Clock, FileText, Search, Zap, RefreshCw, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import ProofDNA from './ProofDNA'
import { useI18n } from '../../i18n'
import { SkeletonList } from '../ui/Skeletons'
import { getApiUrl } from '../../config/constants'

const API_URL = getApiUrl()

const HistoryList = () => {
  const { t } = useI18n()
  const [history, setHistory] = useState([])
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { lastEvent } = useSocket()

  const fetchHistory = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const npub = localStorage.getItem('satohash_npub') || ''
      const token = localStorage.getItem('satohash_token') || ''
      const headers = {}
      if (npub) headers['x-npub'] = npub
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch(`${API_URL}/api/history`, { headers })
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()
      setHistory(Array.isArray(data) ? data : (data.stamps ?? []))
    } catch (err) {
      console.error('Failed to fetch history:', err)
      setError(t('errors', 'loadFailed') || 'Failed to load history')
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  useEffect(() => {
    if (lastEvent) {
      fetchHistory()
    }
  }, [lastEvent, fetchHistory])

  const getConversationalStatus = (status) => {
    switch (status) {
      case 'confirmed':
        return t('vault', 'confirmed') || 'Confirmed on Bitcoin'
      case 'pending':
        return t('vault', 'pending') || 'Waiting for Bitcoin'
      default:
        return status
    }
  }

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.filename?.toLowerCase().includes(filter.toLowerCase()) ||
      item.hash?.toLowerCase().includes(filter.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading && history.length === 0) {
    return (
      <div className="mt-8 space-y-4" role="status" aria-live="polite" aria-busy="true">
        <SkeletonList count={4} />
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-6">
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-4 rounded-xl border border-[var(--accent-danger)]/30 bg-[var(--accent-danger)]/10 px-4 py-3"
        >
          <div className="flex items-center gap-2 text-sm text-[var(--accent-danger)]">
            <AlertCircle size={16} />
            {error}
          </div>
          <button
            type="button"
            onClick={fetchHistory}
            className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 text-xs font-bold uppercase"
          >
            <RefreshCw size={14} />
            {t('common', 'retry') || 'Retry'}
          </button>
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          {t('dashboard', 'recentHistory') || 'Recent Stamping History'}
          <span className="rounded-full border border-[var(--accent-active)]/30 bg-[var(--accent-active)]/20 px-2 py-0.5 text-xs text-[var(--accent-active)]">
            {history.length}
          </span>
        </h2>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2 ring-1 ring-white/5 transition-all focus-within:ring-indigo-500/50">
            <Search size={16} className="text-white/20" aria-hidden="true" />
            <input
              type="search"
              aria-label={t('dashboard', 'filterHistory') || 'Filter history'}
              placeholder={t('dashboard', 'filterHistory') || 'Filter history...'}
              className="bg-transparent text-xs font-medium text-white outline-none placeholder:text-white/20"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label={t('dashboard', 'statusFilter') || 'Filter by status'}
            className="rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-xs font-bold text-white/60 outline-none hover:bg-white/10"
          >
            <option value="all">{t('vault', 'all') || 'Any Status'}</option>
            <option value="confirmed">{t('vault', 'confirmed') || 'Confirmed'}</option>
            <option value="pending">{t('vault', 'pending') || 'Pending'}</option>
          </select>
        </div>
      </div>
      <div className="space-y-3 md:hidden">
        {filteredHistory.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-white/10 bg-[#0f111a]/80 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-white">{item.filename}</p>
                <p className="mt-1 font-mono text-[10px] text-white/40">
                  {t('dashboard', 'fingerprint')}: {item.hash.substring(0, 12)}...
                </p>
              </div>
              <p className="shrink-0 text-[11px] font-bold text-white/60">
                {getConversationalStatus(item.status)}
              </p>
            </div>
            <p className="mt-2 text-xs text-white/40">
              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
            </p>
            <a
              href={`${API_URL}/api/stamps/${item.id}?download=true`}
              className="btn-sheen mt-3 flex min-h-[48px] items-center justify-center rounded-xl text-sm font-black"
              style={{ background: 'var(--accent-gold)', color: '#141b25' }}
            >
              {t('dashboard', 'otsFile')}
            </a>
            <button
              type="button"
              onClick={() => generatePDF(item)}
              className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-xl border text-xs font-bold"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              {t('dashboard', 'certificate')}
            </button>
          </article>
        ))}
        {filteredHistory.length === 0 && !loading && (
          <p className="py-8 text-center text-sm text-white/40">{t('dashboard', 'noStamps')}</p>
        )}
      </div>
      <div className="hidden overflow-hidden rounded-2xl border border-white/5 bg-[#0f111a]/80 backdrop-blur-xl md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/5 bg-white/[0.02]">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-white/40 uppercase">
                  {t('dashboard', 'colFile')}
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-white/40 uppercase">
                  {t('dashboard', 'colStatus')}
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-white/40 uppercase">
                  {t('dashboard', 'colTime')}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-white/40 uppercase">
                  {t('dashboard', 'colAction')}
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
                          <span className="text-sm font-black tracking-tight text-white uppercase italic transition-colors group-hover:text-[var(--accent-active)]">
                            {item.filename}
                          </span>
                          <span className="max-w-[150px] truncate font-mono text-[9px] text-white/20 uppercase">
                            {t('dashboard', 'fingerprint')}: {item.hash.substring(0, 12)}...
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-white/60 uppercase italic">
                        {item.status === 'confirmed' ? (
                          <Zap size={14} className="fill-emerald-400 text-emerald-400" />
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
                          type="button"
                          aria-label={`${t('dashboard', 'certificate')} ${item.filename}`}
                          onClick={() => generatePDF(item)}
                          className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent-active)]/30 bg-[var(--accent-active)]/10 px-3 py-1.5 text-xs text-[var(--accent-active)] transition-all hover:bg-[var(--accent-active)] hover:text-white"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          {t('dashboard', 'certificate')}
                        </button>
                        <a
                          href={`${API_URL}/api/stamps/${item.id}?download=true`}
                          aria-label={`${t('dashboard', 'otsFile')} ${item.filename}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-white/60 transition-all hover:bg-white/10"
                        >
                          <Download className="h-3.5 w-3.5" />
                          {t('dashboard', 'otsFile')}
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredHistory.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-sm text-white/20">
                    {t('dashboard', 'noStamps')}
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
