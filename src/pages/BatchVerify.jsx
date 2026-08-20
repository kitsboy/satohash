import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ClipboardPaste, Search, CheckCircle2, XCircle, Loader2, ArrowLeft } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'
import Footer from '../components/layout/Footer'
import { getApiUrl } from '../config/constants'
import { isSha256Hex, normalizeSha256 } from '../utils/hashUtils'

const BATCH_LIMIT = 50

export default function BatchVerify() {
  usePageMeta({
    page: 'verify',
    title: 'Batch Verify — Check 50 hashes at once',
    description:
      'Paste up to 50 SHA-256 hashes and check them all against the Satohash registry in one click.'
  })
  const [input, setInput] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const parseHashes = () =>
    input
      .split(/[\s,;]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
      .filter((h) => isSha256Hex(h))

  const onVerify = async () => {
    const hashes = parseHashes()
    if (!hashes.length) {
      setError('No valid SHA-256 hashes found. Paste one per line (or comma/space separated).')
      setResults(null)
      return
    }
    if (hashes.length > BATCH_LIMIT) {
      setError(`Too many hashes — max ${BATCH_LIMIT}. You pasted ${hashes.length}.`)
      return
    }
    setLoading(true)
    setError(null)
    const API = getApiUrl()
    const out = await Promise.all(
      hashes.map(async (h) => {
        try {
          const r = await fetch(`${API}/api/stamps/${encodeURIComponent(h)}/by-hash`, {
            signal: AbortSignal.timeout(10000)
          })
          if (r.status === 404) return { hash: h, found: false }
          if (!r.ok) return { hash: h, found: false, error: `HTTP ${r.status}` }
          const body = await r.json()
          const row = Array.isArray(body?.stamps) ? body.stamps[0] : body
          return {
            hash: h,
            found: true,
            status: row?.status || 'unknown',
            block: row?.bitcoin_block_height || null,
            filename: row?.original_filename || row?.filename || null
          }
        } catch (e) {
          return { hash: h, found: false, error: e.message }
        }
      })
    )
    setResults(out)
    setLoading(false)
  }

  const confirmed = (results || []).filter(
    (r) => r.found && (r.status === 'confirmed' || r.status === 'verified')
  )
  const pending = (results || []).filter(
    (r) => r.found && !(r.status === 'confirmed' || r.status === 'verified')
  )
  const missing = (results || []).filter((r) => !r.found)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] pb-24">
      <div className="mx-auto max-w-3xl space-y-6 p-4 pt-10">
        <Link
          to="/verify"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
        >
          <ArrowLeft size={15} /> Back to Verify
        </Link>

        <div>
          <h1 className="text-3xl font-bold">Batch Verify</h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Paste up to {BATCH_LIMIT} SHA-256 hashes (one per line) and check them all against the
            Satohash registry at once.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              'Paste hashes here…\n9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08\n2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae'
            }
            rows={8}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-3 font-mono text-sm"
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onVerify}
              disabled={loading}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 text-sm font-bold text-[#141b25] transition-opacity disabled:opacity-50"
              style={{ background: 'var(--accent-gold)' }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              {loading
                ? 'Checking…'
                : `Verify ${parseHashes().length ? parseHashes().length : ''} hashes`}
            </button>
            {input && (
              <button
                type="button"
                onClick={() => setInput('')}
                className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)]"
              >
                Clear
              </button>
            )}
            <span className="text-xs text-[var(--text-muted)]">
              {parseHashes().length} valid hash(es) parsed
            </span>
          </div>
          {error && (
            <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-300">
              {error}
            </p>
          )}
        </motion.div>

        {results && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 font-bold text-emerald-400">
                <CheckCircle2 size={14} /> {confirmed.length} confirmed
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 font-bold text-amber-400">
                <Loader2 size={14} /> {pending.length} pending
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-3 py-1 font-bold text-rose-400">
                <XCircle size={14} /> {missing.length} not found
              </span>
            </div>
            <div className="space-y-2">
              {results.map((r) => (
                <div
                  key={r.hash}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-3"
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${r.found ? (r.status === 'confirmed' || r.status === 'verified' ? 'bg-emerald-400' : 'bg-amber-400') : 'bg-rose-400'}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-mono text-xs">
                      {r.hash.slice(0, 24)}…{r.hash.slice(-8)}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {r.found
                        ? `${r.status}${r.block ? ` · block ${r.block}` : ''}${r.filename ? ` · ${r.filename}` : ''}`
                        : r.error
                          ? `error: ${r.error}`
                          : 'not in registry'}
                    </div>
                  </div>
                  {r.found && (
                    <Link
                      to={`/verify/${r.hash}`}
                      className="shrink-0 text-xs text-[var(--accent-gold)] hover:underline"
                    >
                      Details →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  )
}
