import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Sun, Moon, Heart, X, Copy, Check } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import LanguageSwitcher from '../forms/LanguageSwitcher'
import { useTheme } from '../shared/ThemeProvider'
import { useTranslation } from 'react-i18next'
import { useI18n } from '../../i18n'
import { BTC_ADDRESS } from '../../config/constants'
import { MVP_MODE, MVP_DEFERRED_PATHS } from '../../config/mvp'
import DesktopNavLayout, { NavTab, NavMoreMenu, NavMenuLink } from './nav/DesktopNavLayout'

export default function DesktopAppNav({ onOpenSearch }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useI18n()
  const { t: ti } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [moreOpen, setMoreOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [showTip, setShowTip] = useState(false)
  const [copied, setCopied] = useState(false)

  const filterMvp = (paths) =>
    MVP_MODE ? paths.filter((p) => !MVP_DEFERRED_PATHS.includes(p.path)) : paths

  const primary = [
    { name: t('nav', 'stamp'), path: '/stamp' },
    { name: t('nav', 'vault'), path: '/vault' },
    { name: t('nav', 'verify'), path: '/verify' },
    { name: t('nav', 'templates'), path: '/templates' }
  ]

  const more = filterMvp([
    { name: ti('nav.government') || 'Government', path: '/government' },
    { name: t('nav', 'developer'), path: '/developer' },
    { name: t('nav', 'trust'), path: '/trust' },
    { name: t('nav', 'atlas'), path: '/atlas' },
    { name: t('nav', 'contracts'), path: '/contracts' },
    { name: 'Forum', path: '/forum' },
    { name: t('nav', 'settings'), path: '/settings' },
    { name: 'Explorer', path: '/explorer' }
  ])

  const isActive = (path) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path))

  const moreActive = more.some((item) => isActive(item.path))

  const npub = localStorage.getItem('satohash_npub') || ''
  const initials = npub ? npub.substring(4, 6).toUpperCase() : 'SH'

  const copyAddress = () => {
    navigator.clipboard.writeText(BTC_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const closeMenus = () => {
    setMoreOpen(false)
    setUserOpen(false)
  }

  return (
    <header
      className="hidden border-b md:block"
      style={{
        borderColor: 'color-mix(in srgb, var(--border) 85%, transparent)',
        background: 'color-mix(in srgb, var(--bg-navbar) 94%, transparent)',
        backdropFilter: 'blur(22px) saturate(1.15)',
        boxShadow: '0 1px 0 rgba(240,180,41,0.04), 0 8px 32px rgba(0,0,0,0.12)'
      }}
    >
      <DesktopNavLayout
        left={
          <Link
            to="/"
            className="group flex min-w-0 items-center gap-2.5 rounded-lg py-1 pr-2 transition-colors hover:bg-white/[0.04]"
          >
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center">
              <span
                aria-hidden
                className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  boxShadow: '0 0 0 1px rgba(240,180,41,0.35), 0 0 16px rgba(240,180,41,0.15)'
                }}
              />
              <img
                src="/logo.png"
                alt=""
                className="relative h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </span>
            <span className="flex min-w-0 flex-col leading-none">
              <span
                className="truncate text-sm font-black tracking-[0.16em] uppercase transition-colors duration-200 group-hover:text-[var(--accent-gold)]"
                style={{ color: 'var(--accent-gold)' }}
              >
                Satohash
              </span>
              <span
                className="mt-0.5 hidden text-[9px] font-semibold tracking-[0.14em] uppercase opacity-60 sm:inline"
                style={{ color: 'var(--text-muted)' }}
              >
                v5.0.0-ELITE
              </span>
            </span>
          </Link>
        }
        center={
          <nav
            aria-label="Primary"
            className="flex items-center"
            style={{ borderBottom: '1px solid transparent' }}
          >
            {primary.map((item) => (
              <NavTab key={item.path} to={item.path} active={isActive(item.path)}>
                {item.name}
              </NavTab>
            ))}
            <NavMoreMenu
              label="More"
              open={moreOpen}
              onToggle={() => {
                setUserOpen(false)
                setMoreOpen((o) => !o)
              }}
              onClose={() => setMoreOpen(false)}
              active={moreActive}
            >
              {more.map((item) => (
                <NavMenuLink
                  key={item.path}
                  to={item.path}
                  active={isActive(item.path)}
                  onClick={() => setMoreOpen(false)}
                >
                  {item.name}
                </NavMenuLink>
              ))}
            </NavMoreMenu>
          </nav>
        }
        right={
          <>
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 hover:-translate-y-px hover:border-[var(--border-gold)] hover:bg-[rgba(240,180,41,0.08)] hover:text-[var(--accent-gold)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.2)] active:translate-y-0"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <Search size={15} />
            </button>

            <LanguageSwitcher compact showAllFlags />

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setMoreOpen(false)
                  setUserOpen((o) => !o)
                }}
                aria-expanded={userOpen}
                aria-haspopup="menu"
                aria-label="Account menu"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-black transition-all duration-200 hover:-translate-y-px hover:scale-105 hover:shadow-[0_0_0_3px_rgba(240,180,41,0.15),0_6px_16px_rgba(0,0,0,0.25)] active:translate-y-0 active:scale-100"
                style={{
                  borderColor: 'var(--border-gold)',
                  background: 'rgba(240,180,41,0.08)',
                  color: 'var(--accent-gold)'
                }}
              >
                {initials}
              </button>
              <AnimatePresence>
                {userOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close"
                      className="fixed inset-0 z-40"
                      onClick={closeMenus}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute top-full right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border py-1 shadow-xl"
                      style={{
                        borderColor: 'var(--border-bright)',
                        background: 'var(--bg-secondary)'
                      }}
                    >
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[12px] font-semibold text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]"
                        onClick={() => {
                          toggleTheme()
                          closeMenus()
                        }}
                      >
                        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[12px] font-semibold text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]"
                        onClick={() => {
                          setShowTip(true)
                          closeMenus()
                        }}
                      >
                        <Heart size={14} />
                        Tip with Bitcoin
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[12px] font-semibold text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]"
                        onClick={() => {
                          navigate('/settings')
                          closeMenus()
                        }}
                      >
                        Settings
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showTip && (
                <>
                  <button
                    type="button"
                    aria-label="Close"
                    className="fixed inset-0 z-[60] bg-black/50"
                    onClick={() => setShowTip(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="fixed top-20 right-6 z-[70] w-72 rounded-2xl border p-5 shadow-2xl"
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
                </>
              )}
            </AnimatePresence>
          </>
        }
      />
    </header>
  )
}
