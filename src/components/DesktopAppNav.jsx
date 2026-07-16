import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database,
  Fingerprint,
  ShieldCheck,
  LayoutTemplate,
  Terminal,
  Scale,
  Search,
  Settings,
  ChevronDown,
  Boxes,
  Zap,
  Sun,
  Moon,
  Heart,
  X,
  Copy,
  Check,
  Globe,
  FileText,
  MessageSquare,
  Camera,
  MoreHorizontal
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import LanguageSwitcher from './LanguageSwitcher'
import { useTheme } from './ThemeProvider'
import { useTranslation } from 'react-i18next'
import { useI18n } from '../i18n'
import { getBlockHeight, getFeeEstimates } from '../utils/mempool'
import { BTC_ADDRESS } from '../config/constants'
import { MVP_MODE, MVP_DEFERRED_PATHS } from '../config/mvp'

const ICONS = {
  Database,
  Fingerprint,
  ShieldCheck,
  LayoutTemplate,
  Terminal,
  Scale,
  Globe,
  FileText,
  MessageSquare,
  Camera
}

function NavPill({ item, isActive }) {
  const Icon = ICONS[item.icon] || Globe
  return (
    <Link
      to={item.path}
      aria-current={isActive ? 'page' : undefined}
      className={[
        'relative flex min-h-[40px] items-center gap-2 rounded-xl px-4 py-2 text-[11px] font-bold tracking-[0.08em] uppercase transition-all duration-200',
        isActive
          ? 'text-[var(--accent-gold)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
      ].join(' ')}
    >
      {isActive && (
        <motion.span
          layoutId="desktop-app-nav-active"
          className="absolute inset-0 rounded-xl border"
          style={{
            background:
              'linear-gradient(180deg, rgba(240,180,41,0.14) 0%, rgba(240,180,41,0.04) 100%)',
            borderColor: 'color-mix(in srgb, var(--accent-gold) 35%, transparent)',
            boxShadow: '0 4px 20px rgba(240,180,41,0.08)'
          }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        />
      )}
      <Icon size={14} className="relative z-10 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
      <span className="relative z-10 hidden whitespace-nowrap xl:inline">{item.name}</span>
      {item.path === '/stamp' && (
        <span className="relative z-10 ml-0.5 h-1.5 w-1.5 rounded-full bg-[var(--accent-gold)] shadow-[0_0_6px_var(--accent-gold)]" />
      )}
    </Link>
  )
}

export default function DesktopAppNav({ onOpenSearch }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useI18n()
  const { t: ti } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [moreOpen, setMoreOpen] = useState(false)
  const [showTip, setShowTip] = useState(false)
  const [copied, setCopied] = useState(false)
  const [blockHeight, setBlockHeight] = useState(null)
  const [feeRate, setFeeRate] = useState(null)

  const filterMvp = (items) =>
    MVP_MODE ? items.filter((item) => !MVP_DEFERRED_PATHS.includes(item.path)) : items

  const primary = filterMvp([
    { name: t('nav', 'vault'), path: '/vault', icon: 'Database' },
    { name: t('nav', 'stamp'), path: '/stamp', icon: 'Fingerprint' },
    { name: t('nav', 'verify'), path: '/verify', icon: 'ShieldCheck' },
    { name: t('nav', 'templates'), path: '/templates', icon: 'LayoutTemplate' },
    { name: ti('nav.government') || 'Government', path: '/government', icon: 'Globe' },
    { name: t('nav', 'developer'), path: '/developer', icon: 'Terminal' },
    { name: t('nav', 'trust'), path: '/trust', icon: 'Scale' }
  ])

  const moreLinks = filterMvp([
    { name: t('nav', 'atlas'), path: '/atlas', icon: 'Globe' },
    { name: t('nav', 'contracts'), path: '/contracts', icon: 'FileText' },
    { name: 'Forum', path: '/forum', icon: 'MessageSquare' },
    { name: t('nav', 'settings'), path: '/settings', icon: 'Settings' },
    { name: 'Explorer', path: '/explorer', icon: 'Globe' },
    { name: 'Web Capture', path: '/snapper', icon: 'Camera' }
  ])

  const isActive = (path) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path))

  const moreActive = moreLinks.some((item) => isActive(item.path))

  useEffect(() => {
    const load = async () => {
      const [height, fees] = await Promise.all([getBlockHeight(), getFeeEstimates()])
      setBlockHeight(height)
      setFeeRate(fees.halfHourFee ?? fees.fastestFee ?? null)
    }
    load()
    const id = setInterval(load, 60000)
    return () => clearInterval(id)
  }, [])

  const npub = localStorage.getItem('satohash_npub') || ''
  const initials = npub ? npub.substring(4, 6).toUpperCase() : 'SH'

  const copyAddress = () => {
    navigator.clipboard.writeText(BTC_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header
      className="relative hidden border-b border-[var(--border)] md:block"
      style={{
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--bg-navbar) 96%, transparent) 0%, var(--bg-primary) 100%)',
        backdropFilter: 'blur(24px)'
      }}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-[90rem] items-center px-6 lg:px-8">
        {/* Left — brand */}
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Link to="/" className="group flex shrink-0 items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl border transition-all group-hover:border-[var(--border-gold)]"
              style={{
                borderColor: 'var(--border)',
                background: 'rgba(255,255,255,0.03)'
              }}
            >
              <img src="/logo.png" alt="" className="h-6 w-6 object-contain" />
            </div>
            <div className="hidden flex-col sm:flex">
              <span
                className="text-[13px] font-black tracking-[0.2em] uppercase"
                style={{ color: 'var(--accent-gold)' }}
              >
                Satohash
              </span>
              <span
                className="text-[8px] font-semibold tracking-[0.28em] uppercase"
                style={{ color: 'var(--text-secondary)', opacity: 0.55 }}
              >
                Sovereign Notary
              </span>
            </div>
          </Link>

          <div
            className="hidden items-center gap-2 rounded-full border px-3 py-1 xl:flex"
            style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.02)' }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-50"
                style={{ background: 'var(--accent-success)' }}
              />
              <span
                className="relative h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--accent-success)' }}
              />
            </span>
            <Boxes size={10} style={{ color: 'var(--accent-gold)' }} />
            <span
              className="font-mono text-[9px] font-bold tracking-wider uppercase"
              style={{ color: 'var(--text-secondary)' }}
            >
              {blockHeight ? `#${blockHeight.toLocaleString()}` : 'Mainnet'}
            </span>
            {feeRate != null && (
              <>
                <span className="opacity-20">·</span>
                <Zap size={9} style={{ color: 'var(--accent-pending)' }} />
                <span
                  className="font-mono text-[9px] font-bold"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {feeRate} sat/vB
                </span>
              </>
            )}
          </div>
        </div>

        {/* Center — primary navigation (true viewport center) */}
        <nav
          aria-label="Primary"
          className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 rounded-2xl border p-1 md:flex"
          style={{
            borderColor: 'color-mix(in srgb, var(--border) 80%, transparent)',
            background: 'color-mix(in srgb, var(--bg-secondary) 88%, transparent)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)'
          }}
        >
          {primary.map((item) => (
            <NavPill key={item.path} item={item} isActive={isActive(item.path)} />
          ))}

          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((o) => !o)}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              className={[
                'relative flex min-h-[40px] items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold tracking-[0.08em] uppercase transition-colors',
                moreActive || moreOpen
                  ? 'text-[var(--accent-gold)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              ].join(' ')}
            >
              <MoreHorizontal size={14} />
              <span>More</span>
              <ChevronDown
                size={12}
                style={{
                  transform: moreOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s'
                }}
              />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <>
                  <motion.button
                    type="button"
                    aria-label="Close menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setMoreOpen(false)}
                  />
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className="absolute top-full left-1/2 z-50 mt-2 w-52 -translate-x-1/2 overflow-hidden rounded-2xl border shadow-2xl"
                    style={{
                      borderColor: 'var(--border-bright)',
                      background: 'var(--bg-secondary)'
                    }}
                  >
                    {moreLinks.map((item) => {
                      const Icon = ICONS[item.icon] || Globe
                      const active = isActive(item.path)
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          role="menuitem"
                          onClick={() => setMoreOpen(false)}
                          className={[
                            'flex items-center gap-3 px-4 py-3 text-[11px] font-bold tracking-wide uppercase transition-colors',
                            active
                              ? 'text-[var(--accent-gold)]'
                              : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
                          ].join(' ')}
                        >
                          <Icon size={14} />
                          {item.name}
                        </Link>
                      )
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right — utilities */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="group flex h-10 items-center gap-2.5 rounded-xl border px-4 transition-all hover:border-[var(--border-gold)]"
            style={{
              borderColor: 'var(--border)',
              background: 'rgba(255,255,255,0.02)'
            }}
          >
            <Search
              size={14}
              className="transition-colors group-hover:text-[var(--accent-gold)]"
              style={{ color: 'var(--text-secondary)' }}
            />
            <span
              className="hidden text-[10px] font-black tracking-widest uppercase lg:inline"
              style={{ color: 'var(--text-secondary)', opacity: 0.7 }}
            >
              ⌘K
            </span>
          </button>

          <LanguageSwitcher />

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-xl border transition-all hover:border-[var(--border-bright)]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTip((p) => !p)}
              aria-label="Tip with Bitcoin"
              aria-expanded={showTip}
              className="flex h-10 w-10 items-center justify-center rounded-xl border transition-all hover:border-[var(--accent-active)]"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <Heart size={15} />
            </button>
            <AnimatePresence>
              {showTip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  className="absolute top-full right-0 z-50 mt-2 w-72 rounded-2xl border p-5 shadow-2xl"
                  style={{
                    borderColor: 'var(--border-bright)',
                    background: 'var(--bg-secondary)'
                  }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-widest uppercase">
                      Tip Satohash
                    </span>
                    <button type="button" onClick={() => setShowTip(false)} aria-label="Close">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="mb-3 flex justify-center rounded-xl bg-white p-2">
                    <QRCodeSVG value={`bitcoin:${BTC_ADDRESS}`} size={120} level="H" />
                  </div>
                  <button
                    type="button"
                    onClick={copyAddress}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-[10px] font-bold uppercase"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy address'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => navigate('/settings')}
            aria-label="Settings"
            className="flex h-10 w-10 items-center justify-center rounded-xl border transition-all hover:border-[var(--border-gold)]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            <Settings size={15} />
          </button>

          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 text-[10px] font-black"
            style={{
              borderColor: 'var(--border-gold)',
              background: 'rgba(240,180,41,0.1)',
              color: 'var(--accent-gold)'
            }}
            aria-label="Account"
          >
            {initials}
          </button>
        </div>
      </div>
    </header>
  )
}
