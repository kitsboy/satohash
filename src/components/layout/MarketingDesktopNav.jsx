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
  FileText
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
      {
        label: t('landingPage.nav.features') || 'Features',
        href: '/#features',
        hash: true,
        icon: LayoutGrid
      },
      { label: t('nav.templates') || 'Templates', href: '/templates', icon: FileText },
      { label: t('nav.pricing') || 'Pricing', href: '/pricing', icon: BadgeDollarSign },
      { label: t('landingPage.nav.legal') || 'Trust', href: '/trust', icon: Scale }
    ],
    [t]
  )

  const more = useMemo(
    () => [
      {
        label: t('landingPage.nav.howItWorks') || 'How it works',
        href: '/#how-it-works',
        hash: true,
        icon: HelpCircle
      },
      { label: t('nav.comparison') || 'Compare', href: '/comparison', icon: GitCompare },
      { label: 'Government', href: '/government', icon: Building2 },
      { label: 'Exec summary', href: '/docs/executive-summary', icon: BookOpen },
      { label: '60s explainer', href: '/watch', icon: Fingerprint },
      { label: 'Docs', href: '/docs', icon: BookOpen }
    ],
    [t]
  )

  const allLinks = useMemo(() => [...primary, ...more], [primary, more])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer on route change
  useEffect(() => {
    setNavOpen(false)
    setMoreOpen(false)
  }, [location.pathname, location.hash])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (!navOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [navOpen])

  const isActive = (href) => {
    if (href.startsWith('#')) return false
    if (href.startsWith('/#')) return location.pathname === '/' && location.hash === href.slice(1)
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }
  const moreActive = more.some((l) => isActive(l.href))

  return (
    <nav
      className="fixed inset-x-0 top-0 z-[100] transition-all duration-300"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        borderBottom: scrolled
          ? '1px solid color-mix(in srgb, var(--border) 95%, transparent)'
          : '1px solid color-mix(in srgb, var(--border) 40%, transparent)',
        background: scrolled
          ? 'color-mix(in srgb, var(--bg-navbar) 97%, transparent)'
          : 'color-mix(in srgb, var(--bg-navbar) 88%, transparent)',
        backdropFilter: scrolled ? 'blur(24px) saturate(1.2)' : 'blur(18px) saturate(1.1)',
        boxShadow: scrolled
          ? '0 1px 0 rgba(240,180,41,0.07), 0 12px 40px rgba(0,0,0,0.22)'
          : '0 1px 0 rgba(240,180,41,0.04)'
      }}
    >
      {/* Desktop */}
      <div className="layout-container hidden md:block">
        <DesktopNavLayout
          left={
            <Link
              to="/"
              className="group flex min-w-0 items-center gap-2.5 rounded-xl py-1 pr-2 transition-colors hover:bg-white/[0.04]"
            >
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    boxShadow: '0 0 0 1px rgba(240,180,41,0.4), 0 0 18px rgba(240,180,41,0.2)'
                  }}
                />
                <img
                  src="/logo.png"
                  alt="Satohash"
                  className="relative h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </span>
              <span className="flex min-w-0 flex-col leading-none">
                <span
                  className="truncate text-[13px] font-black tracking-[0.18em] uppercase"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  Satohash
                </span>
                <span
                  className="mt-0.5 text-[9px] font-semibold tracking-[0.14em] uppercase opacity-60"
                  style={{ color: 'var(--text-muted, var(--text-secondary))' }}
                >
                  Bitcoin notary
                </span>
              </span>
            </Link>
          }
          center={
            <nav aria-label="Marketing" className="flex items-center gap-0.5">
              {primary.map((link) =>
                link.hash || link.href.startsWith('/#') ? (
                  <NavTab key={link.href} href={link.href.startsWith('/#') ? link.href : link.href}>
                    {link.label}
                  </NavTab>
                ) : (
                  <NavTab key={link.href} to={link.href} active={isActive(link.href)}>
                    {link.label}
                  </NavTab>
                )
              )}
              <NavMoreMenu
                label="More"
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
            <>
              <ThemeToggle className="!h-10 !min-h-10 !w-10 !min-w-10 !rounded-xl" />
              <LanguageSwitcher compact />
              <button
                type="button"
                onClick={onDonate}
                className="hidden h-10 items-center rounded-xl border px-3.5 text-[11px] font-bold uppercase transition-all duration-200 hover:-translate-y-px hover:border-[var(--border-gold)] hover:bg-[rgba(240,180,41,0.08)] hover:text-[var(--accent-gold)] lg:flex"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                {t('landingPage.nav.donate') || 'Donate'}
              </button>
              <Link
                to="/stamp"
                className="group/cta flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-4 text-[11px] font-black tracking-wide uppercase transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(240,180,41,0.4)] active:translate-y-0"
                style={{ background: 'var(--accent-gold)', color: '#141b25' }}
              >
                <Fingerprint size={14} className="opacity-80" />
                {t('landingPage.nav.startFree') || 'Start free'}
                <ArrowRight
                  size={13}
                  className="transition-transform duration-200 group-hover/cta:translate-x-0.5"
                />
              </Link>
            </>
          }
        />
      </div>

      {/* Mobile header — Pixel-friendly 56px + safe area */}
      <div className="layout-container flex h-14 items-center justify-between gap-2 px-3 sm:px-4 md:hidden">
        <Link to="/" className="group flex min-w-0 items-center gap-2 rounded-xl py-1 pr-1">
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
              className="mt-0.5 text-[8px] font-semibold tracking-[0.1em] uppercase opacity-55"
              style={{ color: 'var(--text-secondary)' }}
            >
              Free Bitcoin stamps
            </span>
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            to="/stamp"
            className="flex h-9 items-center rounded-lg px-2.5 text-[10px] font-black tracking-wide uppercase sm:px-3 sm:text-[11px]"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            Stamp
          </Link>
          <ThemeToggle className="!h-10 !min-h-10 !w-10 !min-w-10 !rounded-xl" />
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 active:scale-95"
            style={{
              borderColor: navOpen ? 'var(--accent-gold)' : 'var(--border)',
              background: navOpen ? 'rgba(240,180,41,0.1)' : 'transparent',
              color: navOpen ? 'var(--accent-gold)' : 'var(--text-primary)'
            }}
            onClick={() => setNavOpen(!navOpen)}
            aria-expanded={navOpen}
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
          >
            {navOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Full-screen mobile drawer */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[99] md:hidden"
            style={{ top: 'calc(3.5rem + env(safe-area-inset-top))' }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
              aria-label="Close menu backdrop"
              onClick={() => setNavOpen(false)}
            />
            <motion.div
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="relative mx-3 mt-2 max-h-[min(78dvh,640px)] overflow-y-auto rounded-2xl border shadow-2xl sm:mx-4"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--bg-secondary)',
                paddingBottom: 'env(safe-area-inset-bottom)'
              }}
            >
              <div className="border-b px-4 py-3" style={{ borderColor: 'var(--border)' }}>
                <p
                  className="text-[10px] font-black tracking-[0.2em] uppercase"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  Navigate
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Stamp free · verify forever
                </p>
              </div>
              <div className="flex flex-col gap-0.5 p-2">
                {allLinks.map((link) => {
                  const Icon = link.icon || FileText
                  const active = isActive(link.href)
                  const className =
                    'flex min-h-[48px] items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold transition-colors active:scale-[0.99]'
                  const style = {
                    color: active ? 'var(--accent-gold)' : 'var(--text-primary)',
                    background: active ? 'rgba(240,180,41,0.1)' : 'transparent'
                  }
                  const inner = (
                    <>
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{
                          background: active ? 'rgba(240,180,41,0.18)' : 'var(--bg-primary)',
                          color: active ? 'var(--accent-gold)' : 'var(--text-secondary)'
                        }}
                      >
                        <Icon size={18} />
                      </span>
                      <span className="flex-1 text-left">{link.label}</span>
                      {active && (
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: 'var(--accent-gold)' }}
                        />
                      )}
                    </>
                  )
                  if (link.hash || link.href.startsWith('/#')) {
                    return (
                      <a
                        key={link.href}
                        href={link.href.startsWith('/#') ? link.href : link.href}
                        className={className}
                        style={style}
                        onClick={() => setNavOpen(false)}
                      >
                        {inner}
                      </a>
                    )
                  }
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={className}
                      style={style}
                      onClick={() => setNavOpen(false)}
                    >
                      {inner}
                    </Link>
                  )
                })}
              </div>
              <div className="space-y-2 border-t p-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between gap-2 px-1 pb-1">
                  <LanguageSwitcher />
                </div>
                {onDonate && (
                  <button
                    type="button"
                    onClick={() => {
                      onDonate()
                      setNavOpen(false)
                    }}
                    className="flex min-h-[48px] w-full items-center justify-center rounded-xl border text-sm font-bold"
                    style={{ borderColor: 'rgba(240,180,41,0.4)', color: 'var(--accent-gold)' }}
                  >
                    {t('landingPage.nav.donate') || 'Donate'}
                  </button>
                )}
                <Link
                  to="/stamp"
                  onClick={() => setNavOpen(false)}
                  className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl text-sm font-black uppercase"
                  style={{ background: 'var(--accent-gold)', color: '#141b25' }}
                >
                  <Fingerprint size={18} />
                  {t('landingPage.nav.startFree') || 'Stamp free'} →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
