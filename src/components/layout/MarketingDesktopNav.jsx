import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  Menu,
  X,
  Fingerprint,
  LayoutGrid,
  BadgeDollarSign,
  Scale,
  BookOpen,
  Building2,
  GitCompare,
  HelpCircle,
  FileText,
  ShieldCheck
} from 'lucide-react'
import LanguageSwitcher from '../forms/LanguageSwitcher'
import { ThemeToggle } from '../shared/ThemeProvider'
import DesktopNavLayout, { NavTab, NavMoreMenu, NavMenuLink } from './nav/DesktopNavLayout'

export default function MarketingDesktopNav({ onDonate }) {
  const { t } = useTranslation()
  const location = useLocation()
  const [navOpen, setNavOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const primary = useMemo(
    () => [
      { label: t('nav.stamp', { defaultValue: 'Stamp' }), href: '/stamp' },
      { label: t('nav.verify', { defaultValue: 'Verify' }), href: '/verify' },
      { label: t('nav.templates', { defaultValue: 'Templates' }), href: '/templates' },
      { label: t('nav.pricing', { defaultValue: 'Pricing' }), href: '/pricing' }
    ],
    [t]
  )

  const more = useMemo(
    () => [
      {
        label: t('landingPage.nav.howItWorks', { defaultValue: 'How it works' }),
        href: '/#how-it-works',
        hash: true,
        icon: HelpCircle
      },
      { label: t('landingPage.nav.features', { defaultValue: 'Features' }), href: '/#features', hash: true, icon: LayoutGrid },
      { label: 'Explainer', href: '/watch', icon: Fingerprint },
      { label: t('nav.comparison', { defaultValue: 'Compare' }), href: '/comparison', icon: GitCompare },
      { label: 'Government', href: '/government', icon: Building2 },
      { label: t('landingPage.nav.legal', { defaultValue: 'Trust' }), href: '/trust', icon: Scale },
      { label: 'Docs', href: '/docs', icon: BookOpen },
      { label: 'Exec summary', href: '/docs/executive-summary', icon: FileText }
    ],
    [t]
  )

  const allLinks = useMemo(
    () => [
      ...primary.map((l) => ({ ...l, icon: l.href === '/stamp' ? Fingerprint : l.href === '/verify' ? ShieldCheck : l.href === '/templates' ? FileText : BadgeDollarSign })),
      ...more
    ],
    [primary, more]
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setNavOpen(false)
    setMoreOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!navOpen) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [navOpen])

  const isActive = (href) => {
    if (href.startsWith('#')) return false
    if (href.startsWith('/#')) return location.pathname === '/' && location.hash === href.slice(1)
    return location.pathname === href || (href !== '/' && location.pathname.startsWith(href + '/'))
  }
  const moreActive = more.some((l) => isActive(l.href))

  return (
    <nav
      className="fixed inset-x-0 top-0 z-[100] transition-[background,box-shadow,border-color] duration-300"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        borderBottom: scrolled
          ? '1px solid color-mix(in srgb, var(--border) 100%, transparent)'
          : '1px solid color-mix(in srgb, var(--border) 50%, transparent)',
        background: scrolled
          ? 'color-mix(in srgb, var(--bg-navbar) 98%, transparent)'
          : 'color-mix(in srgb, var(--bg-navbar) 92%, transparent)',
        backdropFilter: 'blur(20px) saturate(1.15)',
        boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.18)' : 'none'
      }}
    >
      {/* ── Desktop ───────────────────────────────────────── */}
      <div className="mx-auto hidden max-w-6xl md:block">
        <DesktopNavLayout
          left={
            <Link
              to="/"
              className="group flex min-w-0 items-center gap-2.5 rounded-xl py-1 pr-2 transition-opacity hover:opacity-90"
            >
              <img
                src="/logo.png"
                alt=""
                className="h-8 w-8 shrink-0 object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <span className="flex min-w-0 flex-col leading-none">
                <span
                  className="truncate text-[13px] font-black tracking-[0.14em] uppercase"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  Satohash
                </span>
                <span
                  className="mt-0.5 text-[9px] font-medium tracking-[0.12em] uppercase"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Bitcoin notary
                </span>
              </span>
            </Link>
          }
          center={
            <nav aria-label="Primary" className="flex items-center">
              {primary.map((link) => (
                <NavTab key={link.href} to={link.href} active={isActive(link.href)}>
                  {link.label}
                </NavTab>
              ))}
              <NavMoreMenu
                label={t('nav.more', { defaultValue: 'More' })}
                open={moreOpen}
                onToggle={() => setMoreOpen((o) => !o)}
                onClose={() => setMoreOpen(false)}
                active={moreActive}
              >
                {more.map((link) =>
                  link.hash || link.href.startsWith('/#') ? (
                    <NavMenuLink
                      key={link.href}
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                    >
                      {link.label}
                    </NavMenuLink>
                  ) : (
                    <NavMenuLink
                      key={link.href}
                      to={link.href}
                      active={isActive(link.href)}
                      onClick={() => setMoreOpen(false)}
                    >
                      {link.label}
                    </NavMenuLink>
                  )
                )}
              </NavMoreMenu>
            </nav>
          }
          right={
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle className="!h-10 !min-h-[40px] !w-10 !min-w-[40px] !rounded-xl" />
              {onDonate && (
                <button
                  type="button"
                  onClick={onDonate}
                  className="hidden h-10 items-center rounded-xl border px-3 text-[11px] font-bold uppercase transition-colors hover:border-[var(--accent-gold)]/50 hover:text-[var(--accent-gold)] xl:flex"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  {t('landingPage.nav.donate', { defaultValue: 'Donate' })}
                </button>
              )}
              <Link
                to="/stamp"
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-4 text-[11px] font-black tracking-wide uppercase transition-opacity hover:opacity-90"
                style={{ background: 'var(--accent-gold)', color: '#141b25' }}
              >
                {t('landingPage.nav.startFree', { defaultValue: 'Stamp free' })}
                <ArrowRight size={13} />
              </Link>
            </div>
          }
        />
      </div>

      {/* ── Mobile ────────────────────────────────────────── */}
      <div className="flex h-14 items-center justify-between gap-2 px-3 sm:px-4 md:hidden">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <img src="/logo.png" alt="" className="h-8 w-8 shrink-0 object-contain" />
          <span
            className="truncate text-[13px] font-black tracking-[0.12em] uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            Satohash
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5">
          <LanguageSwitcher compact />
          <Link
            to="/stamp"
            className="inline-flex h-10 min-h-[40px] items-center rounded-xl px-3 text-[11px] font-black uppercase"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
            onClick={() => setNavOpen(false)}
          >
            Stamp
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border"
            style={{
              borderColor: navOpen ? 'var(--accent-gold)' : 'var(--border)',
              background: navOpen ? 'rgba(240,180,41,0.1)' : 'var(--bg-primary)',
              color: navOpen ? 'var(--accent-gold)' : 'var(--text-primary)'
            }}
            onClick={() => setNavOpen((o) => !o)}
            aria-expanded={navOpen}
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
          >
            {navOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-[99] md:hidden"
            style={{ top: 'calc(3.5rem + env(safe-area-inset-top, 0px) + var(--satohash-health-banner-h, 0px))' }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/60"
              aria-label="Close menu"
              onClick={() => setNavOpen(false)}
            />
            <motion.div
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 34 }}
              className="relative mx-3 mt-2 max-h-[min(80dvh,680px)] overflow-y-auto rounded-2xl border shadow-2xl sm:mx-4"
              style={{
                borderColor: 'var(--border-bright)',
                background: 'var(--bg-secondary)',
                paddingBottom: 'env(safe-area-inset-bottom)'
              }}
            >
              <div className="border-b px-4 py-3.5" style={{ borderColor: 'var(--border)' }}>
                <p
                  className="text-[10px] font-black tracking-[0.18em] uppercase"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  Menu
                </p>
              </div>

              <div className="flex flex-col gap-0.5 p-2">
                {allLinks.map((link) => {
                  const Icon = link.icon || FileText
                  const active = isActive(link.href)
                  const row = (
                    <>
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{
                          background: active ? 'rgba(240,180,41,0.16)' : 'var(--bg-primary)',
                          color: active ? 'var(--accent-gold)' : 'var(--text-secondary)'
                        }}
                      >
                        <Icon size={17} />
                      </span>
                      <span className="flex-1 text-left text-[15px] font-semibold">{link.label}</span>
                    </>
                  )
                  const cls =
                    'flex min-h-[48px] items-center gap-3 rounded-xl px-3 py-2.5 transition-colors'
                  const style = {
                    color: active ? 'var(--accent-gold)' : 'var(--text-primary)',
                    background: active ? 'rgba(240,180,41,0.08)' : 'transparent'
                  }
                  if (link.hash || link.href.startsWith('/#')) {
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        className={cls}
                        style={style}
                        onClick={() => setNavOpen(false)}
                      >
                        {row}
                      </a>
                    )
                  }
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={cls}
                      style={style}
                      onClick={() => setNavOpen(false)}
                    >
                      {row}
                    </Link>
                  )
                })}
              </div>

              <div className="space-y-3 border-t p-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between gap-3 px-1">
                  <span
                    className="text-[10px] font-black tracking-[0.16em] uppercase"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Language
                  </span>
                  <LanguageSwitcher />
                </div>
                <div className="flex items-center justify-between gap-3 px-1">
                  <span
                    className="text-[10px] font-black tracking-[0.16em] uppercase"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Theme
                  </span>
                  <ThemeToggle />
                </div>
                {onDonate && (
                  <button
                    type="button"
                    onClick={() => {
                      onDonate()
                      setNavOpen(false)
                    }}
                    className="flex min-h-[48px] w-full items-center justify-center rounded-xl border text-sm font-bold"
                    style={{ borderColor: 'rgba(240,180,41,0.35)', color: 'var(--accent-gold)' }}
                  >
                    {t('landingPage.nav.donate', { defaultValue: 'Donate' })}
                  </button>
                )}
                <Link
                  to="/stamp"
                  onClick={() => setNavOpen(false)}
                  className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl text-sm font-black uppercase"
                  style={{ background: 'var(--accent-gold)', color: '#141b25' }}
                >
                  <Fingerprint size={18} />
                  {t('landingPage.nav.startFree', { defaultValue: 'Stamp free' })}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
