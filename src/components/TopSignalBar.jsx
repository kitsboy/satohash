import { useLocation, useNavigate } from 'react-router-dom'
import { Settings, Zap, Boxes, Heart, X, Copy, Check, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from './ThemeProvider'
import { getFeeEstimates, getBlockHeight } from '../utils/mempool'
import { QRCodeSVG } from 'qrcode.react'
import { motion, AnimatePresence } from 'framer-motion'
import { BTC_ADDRESS } from '../config/constants'

// ─── Route → human-readable breadcrumb ────────────────────────────────────
const ROUTE_LABELS = {
  '/vault': 'Vault',
  '/stamp': 'Stamp',
  '/verify': 'Verify',
  '/certificates': 'Certificates',
  '/atlas': 'Chain Explorer',
  '/nodes': 'Node Mesh',
  '/explorer': 'Block Explorer',
  '/developer': 'Developer API',
  '/contracts': 'Contracts',
  '/snapper': 'Web Capture',
  '/templates': 'Templates',
  '/settings': 'Settings',
  '/trust': 'Trust Center'
}

function getPageLabel(pathname) {
  // Exact match first
  if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname]
  // Prefix match (e.g. /vault/abc)
  const prefix = Object.keys(ROUTE_LABELS).find((k) => k !== '/' && pathname.startsWith(k))
  return prefix ? ROUTE_LABELS[prefix] : 'Dashboard'
}

// ─── Status pill ──────────────────────────────────────────────────────────
function StatusPill({ children, dotColor }) {
  return (
    <div
      className="flex items-center gap-2 rounded-full border px-3 py-1"
      style={{
        borderColor: 'var(--border)',
        background: 'rgba(255,255,255,0.03)'
      }}
    >
      {dotColor && (
        <span
          className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
          style={{ background: dotColor, boxShadow: `0 0 5px ${dotColor}` }}
        />
      )}
      <span
        className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase"
        style={{ color: 'var(--text-secondary)' }}
      >
        {children}
      </span>
    </div>
  )
}

// ─── TopSignalBar ─────────────────────────────────────────────────────────
export default function TopSignalBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const pageLabel = getPageLabel(location.pathname)

  const [blockHeight, setBlockHeight] = useState(null)
  const [feeRate, setFeeRate] = useState(null)
  const [showTip, setShowTip] = useState(false)
  const [copied, setCopied] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const fetchData = async () => {
      const [height, fees] = await Promise.all([getBlockHeight(), getFeeEstimates()])
      setBlockHeight(height)
      setFeeRate(fees.halfHourFee ?? fees.fastestFee ?? 18)
    }
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const copyAddress = () => {
    navigator.clipboard.writeText(BTC_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const npub = localStorage.getItem('satohash_npub') || ''
  const initials = npub ? npub.substring(4, 6).toUpperCase() : 'SH'

  return (
    <div className="flex h-full w-full items-center justify-between gap-4">
      {/* Left: breadcrumb -------------------------------------------------- */}
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="text-[11px] font-semibold tracking-widest uppercase opacity-30"
          style={{ color: 'var(--text-secondary)' }}
        >
          Satohash
        </span>
        <span className="text-[11px] opacity-20" style={{ color: 'var(--text-secondary)' }}>
          /
        </span>
        <span
          className="truncate text-[12px] font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {pageLabel}
        </span>
      </div>

      {/* Center: status pills ---------------------------------------------- */}
      <div className="hidden items-center gap-2 lg:flex">
        {/* Bitcoin Mainnet */}
        <StatusPill dotColor="var(--accent-success)">Bitcoin Mainnet</StatusPill>

        {/* Block height */}
        <div
          className="flex items-center gap-2 rounded-full border px-3 py-1"
          style={{
            borderColor: 'var(--border-gold)',
            background: 'rgba(240,180,41,0.05)'
          }}
        >
          <Boxes size={10} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
          <span
            className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            Block #{blockHeight ? blockHeight.toLocaleString() : '—'}
          </span>
        </div>

        {/* Fee rate */}
        <div
          className="flex items-center gap-2 rounded-full border px-3 py-1"
          style={{
            borderColor: 'var(--border)',
            background: 'rgba(255,255,255,0.03)'
          }}
        >
          <Zap size={10} style={{ color: 'var(--accent-pending)', flexShrink: 0 }} />
          <span
            className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase"
            style={{ color: 'var(--text-secondary)' }}
          >
            ~{feeRate ?? '—'} sat/vB
          </span>
        </div>
      </div>

      {/* Right: avatar + settings ------------------------------------------ */}
      <div className="relative flex flex-shrink-0 items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:opacity-80"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Tip button */}
        <button
          onClick={() => setShowTip((prev) => !prev)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border transition-all hover:border-[var(--accent-active)] hover:bg-[var(--accent-active)/5]"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          title="Support Satohash"
        >
          <Heart size={14} className="transition-colors hover:text-[var(--accent-active)]" />
        </button>

        {/* Settings icon */}
        <button
          onClick={() => navigate('/settings')}
          className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:border-[var(--border-gold)] hover:bg-[var(--accent-gold-subtle)]"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          <Settings size={14} />
        </button>

        {/* Avatar initials */}
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 text-[10px] font-black tracking-wider"
          style={{
            borderColor: 'var(--border-gold)',
            background: 'rgba(240,180,41,0.12)',
            color: 'var(--accent-gold)'
          }}
        >
          {initials}
        </div>

        {/* Tip popup -------------------------------------------------------- */}
        <AnimatePresence>
          {showTip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute top-full right-0 z-50 mt-2 w-72 rounded-2xl border border-[var(--border-bright)] bg-[var(--bg-secondary)] p-6 shadow-[0_25px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2">
                  <Heart size={14} className="text-[var(--accent-active)]" />
                  <span className="text-[10px] font-bold tracking-widest text-white uppercase">
                    Tip Satohash
                  </span>
                </div>
                <button
                  onClick={() => setShowTip(false)}
                  className="text-[var(--text-secondary)] hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="my-4 flex aspect-square items-center justify-center rounded-xl bg-white p-2">
                <QRCodeSVG
                  value={`bitcoin:${BTC_ADDRESS}`}
                  size={140}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div className="space-y-2 text-center">
                <p className="text-[10px] font-bold tracking-widest text-[var(--accent-active)] uppercase">
                  Bitcoin Address
                </p>
                <div
                  className="cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-2 font-mono text-[9px] break-all transition-colors select-all hover:border-[var(--accent-active)]"
                  onClick={copyAddress}
                  title="Click to copy"
                >
                  {BTC_ADDRESS}
                </div>
                <button
                  onClick={copyAddress}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] py-2 text-[10px] font-bold tracking-widest uppercase transition-all hover:border-[var(--accent-active)] hover:text-[var(--accent-active)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy Address'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
