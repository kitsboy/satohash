import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileCheck2,
  Upload,
  Hash,
  ExternalLink,
  Terminal,
  RefreshCw,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  BookOpen
} from 'lucide-react'
import { getApiUrl } from '../config/constants'
import { normalizeSha256, isSha256Hex } from '../utils/hashUtils'
import { verifyOtsStructurally } from '../utils/otsBrowser'

async function sha256File(file) {
  const buf = await file.arrayBuffer()
  const dig = await crypto.subtle.digest('SHA-256', buf)
  return [...new Uint8Array(dig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Landing / public panel: confirm .ots proofs + recovery playbook.
 */
export default function OtsVerifyPanel() {
  const [otsFile, setOtsFile] = useState(null)
  const [docFile, setDocFile] = useState(null)
  const [hashInput, setHashInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [err, setErr] = useState(null)

  const onOts = useCallback((e) => {
    const f = e.target.files?.[0]
    if (f) setOtsFile(f)
  }, [])

  const onDoc = useCallback((e) => {
    const f = e.target.files?.[0]
    if (f) setDocFile(f)
  }, [])

  const runVerify = async () => {
    setBusy(true)
    setErr(null)
    setResult(null)
    try {
      let hash = normalizeSha256(hashInput) || ''
      if (docFile) {
        hash = await sha256File(docFile)
        setHashInput(hash)
      }

      if (!otsFile && !hash) {
        throw new Error('Upload a .ots proof and/or provide a document / SHA-256 hash')
      }

      // Structural client check when .ots present
      let structural = null
      if (otsFile) {
        structural = await verifyOtsStructurally(otsFile, hash || undefined)
      }

      const API = getApiUrl()
      let api = null

      if (otsFile) {
        const fd = new FormData()
        fd.append('otsFile', otsFile, otsFile.name || 'proof.ots')
        if (hash) fd.append('hash', hash)
        const res = await fetch(`${API}/api/verify`, { method: 'POST', body: fd })
        api = await res.json().catch(() => ({}))
        if (!res.ok && !api.details) {
          throw new Error(api.error || `Verify failed (${res.status})`)
        }
      } else if (hash) {
        const res = await fetch(`${API}/api/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hash })
        })
        api = await res.json().catch(() => ({}))
        if (!res.ok && res.status !== 404) {
          throw new Error(api.error || `Lookup failed (${res.status})`)
        }
      }

      setResult({
        hash: hash || structural?.hash || null,
        structural,
        api,
        verified: Boolean(api?.verified),
        pending: api && api.verified === false && !api.error
      })
    } catch (e) {
      setErr(e.message || String(e))
    } finally {
      setBusy(false)
    }
  }

  const runUpgrade = async () => {
    if (!otsFile) {
      setErr('Upload a .ots file first to upgrade')
      return
    }
    setBusy(true)
    setErr(null)
    try {
      const API = getApiUrl()
      const fd = new FormData()
      fd.append('otsFile', otsFile, otsFile.name || 'proof.ots')
      const res = await fetch(`${API}/api/upgrade`, { method: 'POST', body: fd })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || `Upgrade failed (${res.status})`)
      }
      const blob = await res.blob()
      const upgraded = res.headers.get('X-Ots-Upgraded') === 'true'
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `upgraded-${otsFile.name || 'proof.ots'}`
      a.click()
      URL.revokeObjectURL(url)
      setResult((prev) => ({
        ...(prev || {}),
        upgrade: upgraded
          ? 'Upgraded .ots downloaded (may still await Bitcoin block).'
          : 'Upgrade attempted — calendars had no new attestation yet; saved file returned.'
      }))
    } catch (e) {
      setErr(e.message || String(e))
    } finally {
      setBusy(false)
    }
  }

  const recovery = [
    {
      icon: ShieldCheck,
      title: '1. Satohash API (this panel)',
      body: 'Upload your .ots here. Optionally add the original file or paste its SHA-256 so we can pair fingerprint + proof. Confirmed = Bitcoin attestation found; Pending = calendars still waiting for a block.'
    },
    {
      icon: RefreshCw,
      title: '2. Upgrade the .ots',
      body: 'If status is pending, click “Upgrade .ots” to fetch newer calendar attestations. Re-verify after. Same as: POST /api/upgrade with your proof file.'
    },
    {
      icon: Hash,
      title: '3. Hash-only lookup',
      body: 'Paste the 64-char SHA-256 (no file). We look up stamps already in the Satohash registry. Also works on /verify/{hash} or /verify/{proof-id}.'
    },
    {
      icon: ExternalLink,
      title: '4. Independent web verify',
      body: 'Go to opentimestamps.org → Verify. Upload the same .ots (and original file if asked). Does not depend on Satohash servers.'
    },
    {
      icon: Terminal,
      title: '5. CLI (offline-capable)',
      body: 'Install OpenTimestamps client, then: ots verify proof.ots -f original.pdf  (or ots upgrade proof.ots first). Use your own Bitcoin node when fully synced for maximum independence.'
    },
    {
      icon: BookOpen,
      title: '6. Local vault / certificate',
      body: 'If you stamped in this browser, open Vault — proofs may still be cached. Download the PDF certificate and .ots from the stamp page; re-import encrypted vault backup if you changed devices.'
    }
  ]

  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
    >
      <div
        className="border-b px-5 py-4 sm:px-6"
        style={{
          borderColor: 'var(--border)',
          background: 'color-mix(in srgb, var(--accent-gold) 6%, transparent)'
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <FileCheck2 size={18} style={{ color: 'var(--accent-gold)' }} />
          <h3 className="font-display text-lg font-black tracking-tight">Confirm an .ots proof</h3>
        </div>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Drop your OpenTimestamps proof here. Cover every recovery path — Satohash API, upgrade,
          hash lookup, independent web, CLI, and local vault.
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2">
        {/* Left: actions */}
        <div className="space-y-4">
          <label className="block">
            <span
              className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              <Upload size={12} /> .ots proof file
            </span>
            <input
              type="file"
              accept=".ots,application/octet-stream"
              onChange={onOts}
              className="w-full rounded-xl border px-3 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--accent-gold)] file:px-3 file:py-1 file:text-xs file:font-bold file:text-[#141b25]"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
            />
            {otsFile && (
              <span className="mt-1 block text-xs" style={{ color: 'var(--text-secondary)' }}>
                {otsFile.name} · {(otsFile.size / 1024).toFixed(1)} KB
              </span>
            )}
          </label>

          <label className="block">
            <span
              className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              Optional original document
            </span>
            <input
              type="file"
              onChange={onDoc}
              className="w-full rounded-xl border px-3 py-2.5 text-sm"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
            />
            <span className="mt-1 block text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Hashed only in your browser (SHA-256 never uploads the file contents for hashing).
            </span>
          </label>

          <label className="block">
            <span
              className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              <Hash size={12} /> Or paste SHA-256
            </span>
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value.trim())}
              placeholder="64 hex characters"
              spellCheck={false}
              className="w-full rounded-xl border px-3 py-2.5 font-mono text-xs"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
            />
            {hashInput && !isSha256Hex(hashInput) && (
              <span className="mt-1 block text-xs text-red-400">Need exactly 64 hex chars</span>
            )}
          </label>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              disabled={busy}
              onClick={runVerify}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-black disabled:opacity-50"
              style={{ background: 'var(--accent-gold)', color: '#141b25' }}
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              Verify proof
            </button>
            <button
              type="button"
              disabled={busy || !otsFile}
              onClick={runUpgrade}
              className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold disabled:opacity-50"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              <RefreshCw size={16} />
              Upgrade .ots
            </button>
            <Link
              to="/verify"
              className="inline-flex items-center gap-1 rounded-xl px-3 py-2.5 text-sm font-semibold"
              style={{ color: 'var(--accent-gold)' }}
            >
              Full verify page <ExternalLink size={14} />
            </Link>
          </div>

          {err && (
            <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              <XCircle size={16} className="mt-0.5 shrink-0" />
              {err}
            </div>
          )}

          {result && (
            <div
              className="rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: result.verified
                  ? 'color-mix(in srgb, var(--accent-success, #22c55e) 40%, transparent)'
                  : 'var(--border)',
                background: result.verified
                  ? 'color-mix(in srgb, var(--accent-success, #22c55e) 8%, transparent)'
                  : 'var(--bg-primary)'
              }}
            >
              <div className="mb-2 flex items-center gap-2 font-bold">
                {result.verified ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-400" /> Bitcoin-attested
                  </>
                ) : (
                  <>
                    <Hash size={16} style={{ color: 'var(--accent-pending)' }} />{' '}
                    {result.pending ? 'Pending calendar / block' : 'Result'}
                  </>
                )}
              </div>
              {result.hash && (
                <p className="mb-1 font-mono text-[11px] break-all opacity-80">
                  SHA-256: {result.hash}
                </p>
              )}
              {result.structural?.message && (
                <p className="mb-1 text-xs opacity-80">{result.structural.message}</p>
              )}
              {result.api?.status && (
                <p className="text-xs">
                  Registry status: <strong>{String(result.api.status).toUpperCase()}</strong>
                  {result.api.bitcoin_block_height != null &&
                    ` · block ${result.api.bitcoin_block_height}`}
                </p>
              )}
              {result.api?.details && (
                <pre className="mt-2 max-h-32 overflow-auto rounded-lg bg-black/30 p-2 font-mono text-[10px] opacity-80">
                  {typeof result.api.details === 'string'
                    ? result.api.details.slice(0, 1200)
                    : JSON.stringify(result.api.details, null, 2).slice(0, 1200)}
                </pre>
              )}
              {result.api?.error && (
                <p className="mt-1 text-xs text-amber-400">{result.api.error}</p>
              )}
              {result.upgrade && (
                <p className="mt-2 text-xs" style={{ color: 'var(--accent-gold)' }}>
                  {result.upgrade}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: recovery playbook */}
        <div>
          <p
            className="mb-3 text-[10px] font-bold tracking-widest uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            Recovery methods
          </p>
          <ul className="space-y-3">
            {recovery.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="rounded-xl border px-3 py-2.5"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
              >
                <div className="mb-1 flex items-center gap-2 text-xs font-bold">
                  <Icon size={14} style={{ color: 'var(--accent-gold)' }} />
                  {title}
                </div>
                <p
                  className="text-[11px] leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
