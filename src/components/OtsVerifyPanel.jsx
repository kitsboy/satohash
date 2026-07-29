import { useCallback, useMemo, useState } from 'react'
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
  BookOpen,
  Clock,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react'
import { getApiUrl } from '../config/constants'
import { normalizeSha256, isSha256Hex } from '../utils/hashUtils'
import { verifyOtsStructurally } from '../utils/otsBrowser'
import { interpretOtsResult } from '../utils/otsInterpret'

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
  const [copied, setCopied] = useState(false)

  const onOts = useCallback((e) => {
    const f = e.target.files?.[0]
    if (f) setOtsFile(f)
  }, [])

  const onDoc = useCallback((e) => {
    const f = e.target.files?.[0]
    if (f) setDocFile(f)
  }, [])

  const interpretation = useMemo(() => {
    if (!result) return null
    return interpretOtsResult(result)
  }, [result])

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
        if (!res.ok && !api.details && !api.error) {
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
        hadOtsFile: Boolean(otsFile),
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
      // Keep last verify result; attach upgrade note
      setResult((prev) => ({
        ...(prev || { hadOtsFile: true, hash: hashInput || null }),
        upgrade: upgraded
          ? 'New .ots downloaded — calendars had fresher data. Run Verify again.'
          : 'Upgrade returned a file, but calendars may still be waiting on a Bitcoin block. Try again later.'
      }))
    } catch (e) {
      setErr(e.message || String(e))
    } finally {
      setBusy(false)
    }
  }

  const copyCode = async () => {
    const text = interpretation?.code || ''
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const recovery = [
    {
      icon: ShieldCheck,
      title: '1. Satohash API (this panel)',
      body: 'Upload .ots (+ optional file/hash). Success = Bitcoin block. Pending = calendars still waiting.'
    },
    {
      icon: RefreshCw,
      title: '2. Upgrade the .ots',
      body: 'If Pending, click Upgrade to pull newer calendar attestations, then Verify again.'
    },
    {
      icon: Hash,
      title: '3. Hash-only lookup',
      body: 'Paste 64-char SHA-256 to search the Satohash registry (/verify/{hash}).'
    },
    {
      icon: ExternalLink,
      title: '4. Independent web',
      body: 'opentimestamps.org → Verify with the same .ots (and original file if asked).'
    },
    {
      icon: Terminal,
      title: '5. CLI',
      body: 'ots upgrade proof.ots && ots verify proof.ots -f original.pdf'
    },
    {
      icon: BookOpen,
      title: '6. Local vault',
      body: 'Stamp page / Vault may still hold the proof and certificate on this browser.'
    }
  ]

  const levelStyles = {
    success: {
      border: 'color-mix(in srgb, #22c55e 45%, transparent)',
      bg: 'color-mix(in srgb, #22c55e 12%, transparent)',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      Icon: CheckCircle2,
      iconColor: '#34d399'
    },
    pending: {
      border: 'color-mix(in srgb, var(--accent-gold) 45%, transparent)',
      bg: 'color-mix(in srgb, var(--accent-gold) 10%, transparent)',
      badge: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
      Icon: Clock,
      iconColor: 'var(--accent-gold)'
    },
    failed: {
      border: 'color-mix(in srgb, #f43f5e 45%, transparent)',
      bg: 'color-mix(in srgb, #f43f5e 10%, transparent)',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      Icon: XCircle,
      iconColor: '#fb7185'
    }
  }

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
          Drop your OpenTimestamps proof. We’ll say clearly whether it’s on Bitcoin yet, still
          waiting, or invalid — with a plain-language explanation.
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2">
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
              Hashed only in your browser — file contents are not uploaded for hashing.
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
        </div>

        <div>
          <p
            className="mb-3 text-[10px] font-bold tracking-widest uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            Recovery methods
          </p>
          <ul className="space-y-2.5">
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

      {/* Full-width result: status + tall code + ELI-16 under it */}
      {interpretation && (
        <div
          className="border-t px-5 py-5 sm:px-6"
          style={{
            borderColor: 'var(--border)',
            background: levelStyles[interpretation.level]?.bg || 'var(--bg-primary)'
          }}
        >
          {(() => {
            const st = levelStyles[interpretation.level] || levelStyles.pending
            const StatusIcon = st.Icon
            return (
              <>
                <div
                  className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-3"
                  style={{ borderColor: st.border, background: 'var(--bg-primary)' }}
                >
                  <StatusIcon size={28} style={{ color: st.iconColor }} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-black tracking-wide uppercase ${st.badge}`}
                      >
                        {interpretation.title}
                      </span>
                      {result?.hash && (
                        <span className="font-mono text-[10px] break-all opacity-60">
                          {result.hash.slice(0, 16)}…{result.hash.slice(-8)}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {interpretation.headline}
                    </p>
                  </div>
                </div>

                <div
                  className="overflow-hidden rounded-xl border"
                  style={{ borderColor: 'var(--border)', background: '#0a0c10' }}
                >
                  <div
                    className="flex items-center justify-between border-b px-3 py-2"
                    style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                  >
                    <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                      OpenTimestamps technical log
                    </span>
                    <button
                      type="button"
                      onClick={copyCode}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold text-white/50 hover:bg-white/5 hover:text-white/80"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="max-h-[min(28rem,55vh)] min-h-[16rem] overflow-auto p-4 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-emerald-100/90 sm:text-xs">
                    {interpretation.code}
                  </pre>
                </div>

                <div
                  className="mt-4 rounded-xl border px-4 py-3"
                  style={{
                    borderColor: st.border,
                    background: 'var(--bg-primary)'
                  }}
                >
                  <p
                    className="mb-1 flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <AlertTriangle size={12} style={{ color: st.iconColor }} />
                    Plain-language result
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {interpretation.eli16}
                  </p>
                  {result?.upgrade && (
                    <p
                      className="mt-2 text-xs font-semibold"
                      style={{ color: 'var(--accent-gold)' }}
                    >
                      {result.upgrade}
                    </p>
                  )}
                  {interpretation.level === 'pending' && (
                    <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                      Tip: click <strong>Upgrade .ots</strong>, save the new file, then{' '}
                      <strong>Verify</strong> again in a few hours or after the next Bitcoin blocks.
                    </p>
                  )}
                </div>
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}
