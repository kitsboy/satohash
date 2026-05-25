import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dna,
  Shield,
  CheckCircle,
  Clock,
  Copy,
  Code2,
  ExternalLink,
  Search,
  Download,
  Loader2,
  Bitcoin,
  Fingerprint,
  Link2,
  Share2,
  Palette,
  Eye,
  Zap,
  ChevronDown,
  Globe,
  Lock,
  XCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { motion as m } from 'framer-motion'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// ─── Badge themes ──────────────────────────────────────────────────────────────
const THEMES = {
  noir: {
    name: 'Noir',
    bg: '#0a0a0a',
    surface: '#141414',
    border: '#2a2a2a',
    text: '#f0f0f0',
    sub: '#888',
    accent: '#f0b429',
    badge: '#f0b429',
    badgeText: '#0a0a0a'
  },
  indigo: {
    name: 'Indigo',
    bg: '#0f0f1a',
    surface: '#1a1a2e',
    border: '#2d2d4a',
    text: '#e8e8f5',
    sub: '#7878a8',
    accent: '#6366f1',
    badge: '#6366f1',
    badgeText: '#ffffff'
  },
  emerald: {
    name: 'Emerald',
    bg: '#050f0a',
    surface: '#0a1f14',
    border: '#1a3d28',
    text: '#e8f5ef',
    sub: '#66a880',
    accent: '#10b981',
    badge: '#10b981',
    badgeText: '#ffffff'
  },
  slate: {
    name: 'Slate',
    bg: '#f8fafc',
    surface: '#f1f5f9',
    border: '#cbd5e1',
    text: '#0f172a',
    sub: '#64748b',
    accent: '#334155',
    badge: '#0f172a',
    badgeText: '#f8fafc'
  }
}

// ─── Badge sizes ──────────────────────────────────────────────────────────────
const SIZES = {
  compact: { name: 'Compact', w: 320, h: 80, label: '320×80' },
  standard: { name: 'Standard', w: 420, h: 110, label: '420×110' },
  wide: { name: 'Wide', w: 560, h: 96, label: '560×96' },
  card: { name: 'Card', w: 360, h: 200, label: '360×200' }
}

// ─── SVG Badge Generator ──────────────────────────────────────────────────────
function buildBadgeSVG(stamp, theme, size, verifyUrl) {
  const t = THEMES[theme]
  const s = SIZES[size]
  const statusColor =
    stamp.status === 'confirmed' || stamp.status === 'anchored'
      ? '#10b981'
      : stamp.status === 'pending'
        ? '#f59e0b'
        : '#6b7280'
  const statusLabel =
    stamp.status === 'confirmed' || stamp.status === 'anchored'
      ? '✓ Bitcoin Anchored'
      : stamp.status === 'pending'
        ? '⏳ Pending'
        : stamp.status?.toUpperCase() || 'UNKNOWN'

  const hashDisplay = stamp.hash ? stamp.hash.substring(0, 8) + '…' + stamp.hash.slice(-6) : '—'
  const dateDisplay = stamp.created_at
    ? new Date(stamp.created_at).toISOString().split('T')[0]
    : '—'
  const blockDisplay = stamp.bitcoin_block_height
    ? `Block #${stamp.bitcoin_block_height.toLocaleString()}`
    : 'Awaiting block'

  if (size === 'card') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${s.w}" height="${s.h}" viewBox="0 0 ${s.w} ${s.h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.bg}"/>
      <stop offset="100%" stop-color="${t.surface}"/>
    </linearGradient>
    <clipPath id="r"><rect width="${s.w}" height="${s.h}" rx="12"/></clipPath>
  </defs>
  <rect width="${s.w}" height="${s.h}" fill="url(#bg)" clip-path="url(#r)"/>
  <rect width="${s.w}" height="${s.h}" fill="none" stroke="${t.border}" stroke-width="1" rx="12"/>
  <!-- Top stripe -->
  <rect width="${s.w}" height="4" fill="${t.accent}" rx="12"/>
  <!-- Status badge -->
  <rect x="16" y="20" width="140" height="22" rx="11" fill="${statusColor}22"/>
  <circle cx="30" cy="31" r="4" fill="${statusColor}"/>
  <text x="40" y="35.5" font-family="monospace" font-size="9" font-weight="700" fill="${statusColor}" letter-spacing="0.05em">${statusLabel}</text>
  <!-- Title -->
  <text x="16" y="70" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="15" font-weight="800" fill="${t.text}" clip-path="url(#r)">${(stamp.filename || 'Untitled').substring(0, 30)}</text>
  <!-- Divider -->
  <line x1="16" y1="84" x2="${s.w - 16}" y2="84" stroke="${t.border}" stroke-width="1"/>
  <!-- Hash row -->
  <text x="16" y="104" font-family="monospace" font-size="9" fill="${t.sub}" letter-spacing="0.03em">SHA-256</text>
  <text x="75" y="104" font-family="monospace" font-size="9" font-weight="700" fill="${t.text}" letter-spacing="0.05em">${hashDisplay}</text>
  <!-- Block row -->
  <text x="16" y="122" font-family="monospace" font-size="9" fill="${t.sub}" letter-spacing="0.03em">BLOCK</text>
  <text x="75" y="122" font-family="monospace" font-size="9" font-weight="700" fill="${t.accent}" letter-spacing="0.05em">${blockDisplay}</text>
  <!-- Date row -->
  <text x="16" y="140" font-family="monospace" font-size="9" fill="${t.sub}" letter-spacing="0.03em">DATE</text>
  <text x="75" y="140" font-family="monospace" font-size="9" font-weight="700" fill="${t.text}" letter-spacing="0.05em">${dateDisplay}</text>
  <!-- Footer -->
  <rect x="0" y="${s.h - 36}" width="${s.w}" height="36" fill="${t.surface}" clip-path="url(#r)"/>
  <text x="16" y="${s.h - 16}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" font-weight="700" fill="${t.accent}" letter-spacing="0.12em">SATOHASH</text>
  <text x="${s.w - 16}" y="${s.h - 16}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="${t.sub}" text-anchor="end" letter-spacing="0.06em">satohash.io</text>
</svg>`
  }

  // Horizontal layouts
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s.w}" height="${s.h}" viewBox="0 0 ${s.w} ${s.h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${t.bg}"/>
      <stop offset="100%" stop-color="${t.surface}"/>
    </linearGradient>
    <clipPath id="r"><rect width="${s.w}" height="${s.h}" rx="10"/></clipPath>
  </defs>
  <rect width="${s.w}" height="${s.h}" fill="url(#bg)" clip-path="url(#r)"/>
  <rect width="${s.w}" height="${s.h}" fill="none" stroke="${t.border}" stroke-width="1" rx="10"/>
  <!-- Left accent bar -->
  <rect width="4" height="${s.h}" fill="${t.accent}" rx="10"/>
  <!-- Bitcoin icon pill -->
  <rect x="16" y="${s.h / 2 - 18}" width="36" height="36" rx="10" fill="${t.accent}18"/>
  <text x="34" y="${s.h / 2 + 7}" font-size="18" text-anchor="middle">₿</text>
  <!-- Name -->
  <text x="64" y="${s.h / 2 - 6}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="800" fill="${t.text}">${(stamp.filename || 'Untitled').substring(0, 28)}</text>
  <!-- Hash -->
  <text x="64" y="${s.h / 2 + 10}" font-family="monospace" font-size="9" fill="${t.sub}">${hashDisplay}</text>
  <!-- Status pill on right -->
  <rect x="${s.w - 120}" y="${s.h / 2 - 13}" width="104" height="26" rx="13" fill="${statusColor}1a"/>
  <circle cx="${s.w - 108}" cy="${s.h / 2}" r="4" fill="${statusColor}"/>
  <text x="${s.w - 100}" y="${s.h / 2 + 4}" font-family="monospace" font-size="9" font-weight="700" fill="${statusColor}">${stamp.status === 'confirmed' || stamp.status === 'anchored' ? 'ANCHORED' : 'PENDING'}</text>
  <!-- Satohash watermark -->
  <text x="${s.w - 16}" y="${s.h - 10}" font-family="monospace" font-size="8" fill="${t.sub}" text-anchor="end" opacity="0.5">SATOHASH</text>
</svg>`
}

// ─── Stamp search result card ─────────────────────────────────────────────────
function StampCard({ stamp, selected, onSelect }) {
  const isAnchored = stamp.status === 'confirmed' || stamp.status === 'anchored'
  return (
    <motion.button
      onClick={() => onSelect(stamp)}
      whileHover={{ x: 4 }}
      className="group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all"
      style={{
        borderColor: selected ? 'var(--accent-active)' : 'var(--border)',
        background: selected ? 'rgba(99,102,241,0.06)' : 'var(--bg-secondary)'
      }}
    >
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
        style={{
          background: isAnchored ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
          color: isAnchored ? '#10b981' : '#f59e0b'
        }}
      >
        {isAnchored ? <CheckCircle size={18} /> : <Clock size={18} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          {stamp.filename || 'Untitled'}
        </p>
        <p className="font-mono text-[10px]" style={{ color: 'var(--text-secondary)' }}>
          {stamp.hash?.substring(0, 16)}…
        </p>
      </div>
      <span
        className="flex-shrink-0 rounded-full px-3 py-1 text-[9px] font-black tracking-wider uppercase"
        style={{
          background: isAnchored ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
          color: isAnchored ? '#10b981' : '#f59e0b'
        }}
      >
        {isAnchored ? 'Anchored' : 'Pending'}
      </span>
    </motion.button>
  )
}

// ─── Live preview badge (React-rendered matching the SVG design) ──────────────
function BadgePreview({ stamp, theme, size }) {
  const t = THEMES[theme]
  const s = SIZES[size]
  const isAnchored = stamp?.status === 'confirmed' || stamp?.status === 'anchored'
  const statusColor = isAnchored ? '#10b981' : stamp?.status === 'pending' ? '#f59e0b' : '#6b7280'

  const scale = size === 'card' ? 1 : Math.min(1, 480 / s.w)

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{
        width: s.w * scale,
        height: s.h * scale,
        background: `linear-gradient(${size === 'card' ? '180deg' : '90deg'}, ${t.bg}, ${t.surface})`,
        border: `1px solid ${t.border}`,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      }}
    >
      {/* Left/top accent bar */}
      {size === 'card' ? (
        <div style={{ height: 4, background: t.accent, borderRadius: '12px 12px 0 0' }} />
      ) : (
        <div
          style={{
            width: 4,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            background: t.accent,
            borderRadius: '10px 0 0 10px'
          }}
        />
      )}

      {size === 'card' ? (
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: statusColor, boxShadow: `0 0 8px ${statusColor}` }}
            />
            <span
              className="text-[9px] font-black tracking-wider uppercase"
              style={{ color: statusColor }}
            >
              {isAnchored ? 'Bitcoin Anchored' : 'Pending'}
            </span>
          </div>
          <p className="truncate text-sm font-black" style={{ color: t.text }}>
            {stamp?.filename || 'Untitled document'}
          </p>
          <div style={{ height: 1, background: t.border }} />
          <div className="grid grid-cols-2 gap-y-1 text-[9px]">
            <span style={{ color: t.sub }}>SHA-256</span>
            <span className="truncate font-mono font-bold" style={{ color: t.text }}>
              {stamp?.hash ? stamp.hash.substring(0, 10) + '…' : '—'}
            </span>
            <span style={{ color: t.sub }}>BLOCK</span>
            <span className="font-mono font-bold" style={{ color: t.accent }}>
              {stamp?.bitcoin_block_height
                ? `#${stamp.bitcoin_block_height.toLocaleString()}`
                : 'Awaiting'}
            </span>
            <span style={{ color: t.sub }}>DATE</span>
            <span className="font-mono font-bold" style={{ color: t.text }}>
              {stamp?.created_at ? new Date(stamp.created_at).toISOString().split('T')[0] : '—'}
            </span>
          </div>
          <div
            className="flex items-center justify-between rounded-lg px-3 py-1.5"
            style={{ background: t.surface, marginTop: 'auto' }}
          >
            <span className="text-[9px] font-black tracking-widest" style={{ color: t.accent }}>
              SATOHASH
            </span>
            <span className="text-[8px]" style={{ color: t.sub }}>
              satohash.io
            </span>
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center gap-3 pr-4 pl-6">
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-xl font-black"
            style={{ background: `${t.accent}18`, color: t.accent }}
          >
            ₿
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-black" style={{ color: t.text }}>
              {stamp?.filename || 'Untitled document'}
            </p>
            <p className="truncate font-mono text-[9px]" style={{ color: t.sub }}>
              {stamp?.hash ? stamp.hash.substring(0, 18) + '…' : '—'}
            </p>
          </div>
          <div
            className="flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1"
            style={{ background: `${statusColor}1a` }}
          >
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: statusColor }} />
            <span className="text-[9px] font-black uppercase" style={{ color: statusColor }}>
              {isAnchored ? 'Anchored' : 'Pending'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProofDNA() {
  const [stamps, setStamps] = useState([])
  const [loadingStamps, setLoadingStamps] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStamp, setSelectedStamp] = useState(null)
  const [activeTheme, setActiveTheme] = useState('noir')
  const [activeSize, setActiveSize] = useState('standard')
  const [activeTab, setActiveTab] = useState('embed') // embed | svg | link
  const [showSizeMenu, setShowSizeMenu] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [hashInput, setHashInput] = useState('')
  const [inputMode, setInputMode] = useState('vault') // vault | manual

  const sizeMenuRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (sizeMenuRef.current && !sizeMenuRef.current.contains(e.target)) {
        setShowSizeMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Fetch vault stamps
  useEffect(() => {
    const fetchStamps = async () => {
      try {
        const npub = localStorage.getItem('satohash_npub') || ''
        const res = await fetch(`${API}/api/history?limit=100`, {
          headers: npub ? { 'X-Npub': npub } : {}
        })
        if (res.ok) {
          const data = await res.json()
          const rows = Array.isArray(data) ? data : (data.stamps ?? [])
          setStamps(rows)
          if (rows.length > 0) setSelectedStamp(rows[0])
        }
      } catch {
        // Fall back to localStorage
        const local = JSON.parse(localStorage.getItem('satohash_stamps') || '[]')
        setStamps(local)
        if (local.length > 0) setSelectedStamp(local[0])
      } finally {
        setLoadingStamps(false)
      }
    }
    fetchStamps()
  }, [])

  const filteredStamps = stamps.filter((s) => {
    const q = searchQuery.toLowerCase()
    return (s.filename || '').toLowerCase().includes(q) || (s.hash || '').toLowerCase().includes(q)
  })

  const manualStamp = hashInput
    ? {
        hash: hashInput,
        filename: 'Custom Proof',
        status: 'pending',
        created_at: new Date().toISOString(),
        bitcoin_block_height: null
      }
    : null

  const activeStamp = inputMode === 'manual' ? manualStamp : selectedStamp

  const verifyUrl = activeStamp?.id
    ? `${window.location.origin}/verify/${activeStamp.id}`
    : `${window.location.origin}/verify`

  const svgCode = activeStamp ? buildBadgeSVG(activeStamp, activeTheme, activeSize, verifyUrl) : ''
  const iframeCode = activeStamp
    ? `<a href="${verifyUrl}" target="_blank" rel="noopener noreferrer" title="Verified by Satohash — Bitcoin-anchored proof of existence">
  <img
    src="data:image/svg+xml;base64,${btoa(svgCode)}"
    alt="Satohash Proof DNA Badge — ${activeStamp.filename || 'Document'}"
    width="${SIZES[activeSize].w}"
    height="${SIZES[activeSize].h}"
    style="display:block;border-radius:10px"
  />
</a>`
    : ''
  const markdownCode = activeStamp
    ? `[![Satohash Proof DNA](data:image/svg+xml;base64,${btoa(svgCode)})](${verifyUrl})`
    : ''

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied!`, { description: 'Ready to paste anywhere.' })
    } catch {
      toast.error('Copy failed — try selecting manually.')
    }
  }

  const downloadSVG = () => {
    if (!svgCode) return
    setDownloading(true)
    const blob = new Blob([svgCode], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `satohash-proof-badge-${activeStamp?.id?.substring(0, 8) || 'custom'}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setTimeout(() => setDownloading(false), 800)
    toast.success('SVG badge downloaded!')
  }

  return (
    <div className="mx-auto max-w-[90rem] space-y-12 p-8 pb-24">
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <header className="flex flex-col justify-between gap-8 border-b border-[var(--border)] pb-10 lg:flex-row lg:items-end">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-active)]/30 bg-[var(--accent-active)]/10 px-4 py-1.5">
            <Dna size={14} className="text-[var(--accent-active)]" />
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[var(--accent-active)] uppercase">
              Proof DNA // Widget Studio v1.0
            </span>
          </div>
          <h1 className="text-5xl leading-[0.9] font-black tracking-tighter uppercase md:text-7xl">
            Proof DNA <span className="text-[var(--accent-active)]">Widgets.</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed font-medium text-[var(--text-secondary)]">
            Generate cryptographically-linked embeddable badges for any Bitcoin-anchored proof. Drop
            them anywhere — websites, GitHub READMEs, legal documents, email signatures.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { icon: Globe, label: 'Website Ready', desc: 'HTML embed code' },
            { icon: Code2, label: 'GitHub Ready', desc: 'Markdown badges' },
            { icon: Lock, label: 'Cryptographic', desc: 'Links to live proof' }
          ].map((feat) => (
            <div
              key={feat.label}
              className="flex items-center gap-3 rounded-2xl border px-5 py-3"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            >
              <feat.icon size={16} className="text-[var(--accent-active)]" />
              <div>
                <p
                  className="text-[10px] font-black uppercase"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {feat.label}
                </p>
                <p className="text-[9px] font-bold" style={{ color: 'var(--text-secondary)' }}>
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </header>

      <div className="grid gap-10 xl:grid-cols-12">
        {/* ── Left: Stamp Selector ─────────────────────────────────────────── */}
        <div className="space-y-6 xl:col-span-4">
          {/* Input mode toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1.5">
            {[
              { id: 'vault', label: 'From Vault' },
              { id: 'manual', label: 'Manual Hash' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setInputMode(m.id)}
                className="rounded-xl py-2 text-[10px] font-black tracking-widest uppercase transition-all"
                style={{
                  background: inputMode === m.id ? 'var(--accent-active)' : 'transparent',
                  color: inputMode === m.id ? '#fff' : 'var(--text-secondary)'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {inputMode === 'vault' ? (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search
                  size={15}
                  className="absolute top-1/2 left-4 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }}
                />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stamps…"
                  className="h-11 w-full rounded-xl border pr-4 pl-10 text-sm font-medium transition-all outline-none"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Stamp list */}
              <div className="scrollbar-hide max-h-[480px] space-y-2 overflow-y-auto pr-1">
                {loadingStamps ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[72px] animate-pulse rounded-2xl"
                      style={{ background: 'var(--surface-raised)' }}
                    />
                  ))
                ) : filteredStamps.length === 0 ? (
                  <div
                    className="rounded-2xl border p-8 text-center"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
                  >
                    <Fingerprint
                      size={32}
                      className="mx-auto mb-3 opacity-30"
                      style={{ color: 'var(--text-secondary)' }}
                    />
                    <p className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
                      {searchQuery ? 'No stamps match your search' : 'No stamps in vault yet'}
                    </p>
                    <p
                      className="mt-1 text-[10px]"
                      style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
                    >
                      Stamp a document first to generate badges
                    </p>
                  </div>
                ) : (
                  filteredStamps.map((stamp) => (
                    <StampCard
                      key={stamp.id || stamp.hash}
                      stamp={stamp}
                      selected={selectedStamp?.id === stamp.id}
                      onSelect={setSelectedStamp}
                    />
                  ))
                )}
              </div>
            </div>
          ) : (
            <div
              className="space-y-4 rounded-2xl border p-6"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            >
              <div>
                <label
                  className="mb-2 block text-[10px] font-black tracking-widest uppercase"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  SHA-256 Hash
                </label>
                <input
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value.toLowerCase().trim())}
                  placeholder="Enter 64-char hex hash…"
                  className="h-12 w-full rounded-xl border px-4 font-mono text-xs transition-all outline-none"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--surface-raised)',
                    color: 'var(--accent-active)'
                  }}
                  maxLength={64}
                />
                <p className="mt-2 text-[9px]" style={{ color: 'var(--text-secondary)' }}>
                  {hashInput.length}/64 characters
                </p>
              </div>
              <p
                className="text-[10px] leading-relaxed"
                style={{ color: 'var(--text-secondary)', opacity: 0.7 }}
              >
                Enter any SHA-256 hash to generate a verifiable badge without needing a vault entry.
              </p>
            </div>
          )}
        </div>

        {/* ── Right: Badge Studio ──────────────────────────────────────────── */}
        <div className="space-y-8 xl:col-span-8">
          {/* Theme + Size controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Theme picker */}
            <div className="flex items-center gap-2">
              <Palette size={14} style={{ color: 'var(--text-secondary)' }} />
              <span
                className="text-[10px] font-black tracking-widest uppercase"
                style={{ color: 'var(--text-secondary)' }}
              >
                Theme
              </span>
            </div>
            <div className="flex gap-2">
              {Object.entries(THEMES).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setActiveTheme(key)}
                  title={t.name}
                  className="h-7 w-7 rounded-full border-2 transition-all hover:scale-110"
                  style={{
                    background: t.bg,
                    borderColor: activeTheme === key ? t.accent : 'transparent',
                    boxShadow: activeTheme === key ? `0 0 0 3px ${t.accent}40` : 'none'
                  }}
                />
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2" ref={sizeMenuRef}>
              <span
                className="text-[10px] font-black tracking-widest uppercase"
                style={{ color: 'var(--text-secondary)' }}
              >
                Size
              </span>
              <button
                onClick={() => setShowSizeMenu((o) => !o)}
                className="relative flex items-center gap-2 rounded-xl border px-4 py-2 text-[11px] font-bold transition-all hover:border-[var(--accent-active)]"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)'
                }}
              >
                {SIZES[activeSize].name} — {SIZES[activeSize].label}
                <ChevronDown size={12} style={{ color: 'var(--text-secondary)' }} />
                <AnimatePresence>
                  {showSizeMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      className="absolute top-full right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border shadow-2xl"
                      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
                    >
                      {Object.entries(SIZES).map(([key, s]) => (
                        <button
                          key={key}
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveSize(key)
                            setShowSizeMenu(false)
                          }}
                          className="flex w-full items-center justify-between px-4 py-3 text-left text-[11px] font-bold transition-colors hover:bg-white/5"
                          style={{
                            color:
                              activeSize === key ? 'var(--accent-active)' : 'var(--text-primary)'
                          }}
                        >
                          <span>{s.name}</span>
                          <span
                            className="font-mono text-[9px]"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {s.label}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Live Preview */}
          <div
            className="relative overflow-hidden rounded-[2rem] border p-10"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
          >
            <div className="absolute top-4 left-6 flex items-center gap-2">
              <Eye size={12} style={{ color: 'var(--text-secondary)' }} />
              <span
                className="text-[9px] font-black tracking-widest uppercase"
                style={{ color: 'var(--text-secondary)' }}
              >
                Live Preview
              </span>
            </div>

            {/* Checkerboard bg for transparency */}
            <div className="flex items-center justify-center py-6">
              {activeStamp ? (
                <BadgePreview stamp={activeStamp} theme={activeTheme} size={activeSize} />
              ) : (
                <div
                  className="flex h-24 w-full max-w-md items-center justify-center rounded-2xl border-2 border-dashed"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  <div className="text-center">
                    <Dna size={24} className="mx-auto mb-2 opacity-30" />
                    <p className="text-[11px] font-bold opacity-50">
                      Select a stamp to preview badge
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action bar */}
            {activeStamp && (
              <div className="flex flex-wrap justify-center gap-3 border-t border-[var(--border)] pt-6">
                <button
                  onClick={downloadSVG}
                  disabled={downloading}
                  className="flex items-center gap-2 rounded-xl border px-5 py-2.5 text-[10px] font-black tracking-wider uppercase transition-all hover:bg-white/5"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                >
                  {downloading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Download size={13} />
                  )}
                  Download SVG
                </button>
                <button
                  onClick={() => copyToClipboard(svgCode, 'SVG code')}
                  className="flex items-center gap-2 rounded-xl border px-5 py-2.5 text-[10px] font-black tracking-wider uppercase transition-all hover:bg-white/5"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                >
                  <Copy size={13} />
                  Copy SVG
                </button>
                <a
                  href={verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[10px] font-black tracking-wider uppercase transition-all hover:opacity-90"
                  style={{ background: 'var(--accent-active)', color: '#fff' }}
                >
                  <ExternalLink size={13} />
                  View Proof
                </a>
              </div>
            )}
          </div>

          {/* Code output tabs */}
          {activeStamp && (
            <div
              className="overflow-hidden rounded-[2rem] border"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            >
              {/* Tab bar */}
              <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
                {[
                  { id: 'embed', label: 'HTML Embed', icon: Code2 },
                  { id: 'markdown', label: 'Markdown', icon: Share2 },
                  { id: 'link', label: 'Direct Link', icon: Link2 }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-2 px-6 py-4 text-[10px] font-black tracking-widest uppercase transition-all"
                    style={{
                      color:
                        activeTab === tab.id ? 'var(--accent-active)' : 'var(--text-secondary)',
                      borderBottom:
                        activeTab === tab.id
                          ? '2px solid var(--accent-active)'
                          : '2px solid transparent'
                    }}
                  >
                    <tab.icon size={12} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Code block */}
              <div className="relative p-6">
                <button
                  onClick={() => {
                    const code =
                      activeTab === 'embed'
                        ? iframeCode
                        : activeTab === 'markdown'
                          ? markdownCode
                          : verifyUrl
                    copyToClipboard(
                      code,
                      activeTab === 'embed'
                        ? 'Embed code'
                        : activeTab === 'markdown'
                          ? 'Markdown'
                          : 'Link'
                    )
                  }}
                  className="absolute top-4 right-4 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[9px] font-black tracking-widest uppercase transition-all hover:bg-white/10"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  <Copy size={11} />
                  Copy
                </button>
                <pre
                  className="scrollbar-hide overflow-x-auto rounded-xl p-4 font-mono text-[10px] leading-relaxed"
                  style={{ background: 'var(--surface-raised)', color: 'var(--text-primary)' }}
                >
                  <code>
                    {activeTab === 'embed'
                      ? iframeCode
                      : activeTab === 'markdown'
                        ? markdownCode
                        : verifyUrl}
                  </code>
                </pre>
              </div>
            </div>
          )}

          {/* Usage guide */}
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Globe,
                title: 'Websites',
                desc: 'Paste the HTML embed code into any webpage. The badge links directly to the live proof verification page.',
                accent: 'var(--accent-active)'
              },
              {
                icon: Code2,
                title: 'GitHub & Docs',
                desc: 'Use the Markdown code in any README.md or documentation. Auto-renders as a clickable badge on GitHub.',
                accent: 'var(--accent-success)'
              },
              {
                icon: Zap,
                title: 'Email & PDFs',
                desc: 'Download the SVG and embed it directly into email signatures, legal documents, or presentation decks.',
                accent: 'var(--accent-pending)'
              }
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border p-6"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
              >
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${item.accent}15`, color: item.accent }}
                >
                  <item.icon size={18} />
                </div>
                <h3 className="mb-2 text-sm font-black" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p
                  className="text-[11px] leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
