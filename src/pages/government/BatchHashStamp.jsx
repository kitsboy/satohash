import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import Footer from '../../components/Footer'
import usePageMeta from '../../hooks/usePageMeta'
import { parseHashLines } from '../../utils/hashUtils'
import { clientId } from '../../utils/id'
import StaticModeBanner from '../../components/StaticModeBanner'

export default function BatchHashStamp() {
  usePageMeta({ page: 'batchHash' })
  const [input, setInput] = useState('')
  const [rows, setRows] = useState([])

  const process = () => {
    const hashes = parseHashLines(input)
    if (!hashes.length) {
      toast.error('No valid hashes found')
      return
    }
    const stamped = hashes.map((hash) => ({
      id: clientId('batch'),
      hash,
      filename: `batch-${hash.slice(0, 8)}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      source: 'batch-hash'
    }))
    const existing = JSON.parse(localStorage.getItem('satohash_stamps') || '[]')
    localStorage.setItem('satohash_stamps', JSON.stringify([...stamped, ...existing].slice(0, 500)))
    setRows(stamped)
    toast.success(`${stamped.length} hashes saved to vault`)
  }

  const exportCsv = () => {
    const csv = [
      'hash,id,verify_url',
      ...rows.map((r) => `${r.hash},${r.id},${window.location.origin}/verify/${r.hash}`)
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'satohash-batch-hashes.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <header className="border-b px-6 py-4" style={{ borderColor: 'var(--border)' }}>
        <Link
          to="/government"
          className="text-sm font-bold"
          style={{ color: 'var(--text-secondary)' }}
        >
          ← Government use
        </Link>
      </header>
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-12">
        <StaticModeBanner compact />
        <h1 className="text-3xl font-black">Batch hash registry</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Register hundreds of passport or asset fingerprints locally. Export CSV for agency audit;
          stamp individually from vault when ready.
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          className="w-full rounded-2xl border p-4 font-mono text-xs"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
          placeholder="One SHA-256 per line…"
        />
        <div className="flex gap-3">
          <button
            type="button"
            onClick={process}
            className="rounded-xl px-6 py-3 text-xs font-black uppercase"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            Save to vault
          </button>
          {rows.length > 0 && (
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-xl border px-6 py-3 text-xs font-black uppercase"
              style={{ borderColor: 'var(--border)' }}
            >
              Export CSV
            </button>
          )}
        </div>
        {rows.length > 0 && (
          <p className="text-xs" style={{ color: 'var(--accent-success)' }}>
            {rows.length} hashes in vault —{' '}
            <Link to="/vault" className="underline">
              open vault
            </Link>
          </p>
        )}
      </div>
      <Footer />
    </div>
  )
}
