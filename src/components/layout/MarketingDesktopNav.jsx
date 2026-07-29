import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Menu, X } from 'lucide-react'
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
      { label: t('landingPage.nav.features'), href: '#features', hash: true },
      { label: t('nav.templates') || 'Templates', href: '/templates' },
      { label: t('nav.pricing') || 'Pricing', href: '/pricing' },
      { label: t('landingPage.nav.legal'), href: '/trust' }
    ],
    [t]
  )

  const more = useMemo(
    () => [
      { label: t('landingPage.nav.howItWorks'), href: '#how-it-works', hash: true },
      { label: t('nav.comparison') || 'Compare', href: '/comparison' },
      { label: 'Government', href: '/government' }
    ],
    [t]
  )

  const allLinks = useMemo(() => [...primary, ...more], [primary, more])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href) => !href.startsWith('#') && location.pathname === href
  const moreActive = more.some((l) => isActive(l.href))

  return (
    <nav
      className="fixed inset-x-0 top-0 z-[100] transition-all duration-300"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        borderBottom: scrolled
          ? '1px solid color-mix(in srgb, var(--border) 90%, transparent)'
          : '1px solid transparent',
        background: scrolled
          ? 'color-mix(in srgb, var(--bg-navbar) 96%, transparent)'
          : 'color-mix(in srgb, var(--bg-navbar) 78%, transparent)',
        backdropFilter: scrolled ? 'blur(22px) saturate(1.15)' : 'blur(16px)',
        boxShadow: scrolled ? '0 1px 0 rgba(240,180,41,0.05), 0 10px 36px rgba(0,0,0,0.18)' : 'none'
      }}
    >
      <div className="layout-container hidden md:block">
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
                  alt="Satohash"
                  className="relative h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </span>
              <span className="flex min-w-0 flex-col leading-none">
                <span
                  className="truncate text-sm font-black tracking-[0.16em] uppercase"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  Satohash
                </span>
                <span
                  className="mt-0.5 text-[9px] font-semibold tracking-[0.12em] uppercase opacity-55"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Bitcoin notary
                </span>
              </span>
            </Link>
          }
          center={
            <nav aria-label="Marketing" className="flex items-center">
              {primary.map((link) =>
                link.hash ? (
                  <NavTab key={link.href} href={link.href}>
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
                  link.hash ? (
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
              <ThemeToggle className="!h-9 !min-h-9 !w-9 !min-w-9 !rounded-lg" />
              <LanguageSwitcher compact />
              <button
                type="button"
                onClick={onDonate}
                className="hidden h-9 items-center rounded-lg border px-3 text-[11px] font-bold uppercase transition-all duration-200 hover:-translate-y-px hover:border-[var(--border-gold)] hover:bg-[rgba(240,180,41,0.08)] hover:text-[var(--accent-gold)] lg:flex"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                {t('landingPage.nav.donate')}
              </button>
              <Link
                to="/stamp"
                className="group/cta flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-4 text-[11px] font-black tracking-wide uppercase transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(240,180,41,0.35)] active:translate-y-0"
                style={{ background: 'var(--accent-gold)', color: '#141b25' }}
              >
                {t('landingPage.nav.startFree')}
                <ArrowRight
                  size={13}
                  className="transition-transform duration-200 group-hover/cta:translate-x-0.5"
                />
              </Link>
            </>
          }
        />
      </div>

      {/* Mobile header */}
      <div className="layout-container flex h-14 items-center justify-between md:hidden">
        <Link to="/" className="group flex items-center gap-2 rounded-lg py-1 pr-1">
          <img
            src="/logo.png"
            alt=""
            className="h-7 w-7 object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <span
            className="text-sm font-black tracking-widest uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            Satohash
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            type="button"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border transition-all duration-200 hover:border-[var(--border-gold)] hover:bg-white/[0.04]"
            style={{ borderColor: 'var(--border)' }}
            onClick={() => setNavOpen(!navOpen)}
            aria-expanded={navOpen}
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
          >
            {navOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t md:hidden"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
          >
            <div className="layout-container flex flex-col gap-1 py-4">
              {allLinks.map((link) =>
                link.hash ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="min-h-[44px] rounded-lg px-3 py-3 text-sm font-semibold transition-colors duration-150 hover:bg-white/[0.05] hover:text-[var(--text-primary)]"
                    style={{ color: 'var(--text-secondary)' }}
                    onClick={() => setNavOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="min-h-[44px] rounded-lg px-3 py-3 text-sm font-semibold transition-colors duration-150 hover:bg-white/[0.05] hover:text-[var(--text-primary)]"
                    style={{
                      color: isActive(link.href) ? 'var(--accent-gold)' : 'var(--text-secondary)'
                    }}
                    onClick={() => setNavOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <button
                type="button"
                onClick={() => {
                  onDonate?.()
                  setNavOpen(false)
                }}
                className="mt-2 flex min-h-[44px] items-center justify-center rounded-xl border py-3 text-sm font-bold"
                style={{ borderColor: 'var(--border-gold)', color: 'var(--accent-gold)' }}
              >
                {t('landingPage.nav.donate')}
              </button>
              <Link
                to="/stamp"
                onClick={() => setNavOpen(false)}
                className="flex min-h-[48px] items-center justify-center rounded-xl text-sm font-black uppercase"
                style={{ background: 'var(--accent-gold)', color: '#141b25' }}
              >
                {t('landingPage.nav.startFree')} →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
