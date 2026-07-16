import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Menu, X } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import { ThemeToggle } from './ThemeProvider'

/**
 * Premium centered desktop nav for marketing / landing pages.
 */
export default function MarketingDesktopNav({ onDonate, extraActions }) {
  const { t } = useTranslation()
  const location = useLocation()
  const [navOpen, setNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navLinks = useMemo(
    () => [
      { label: t('landingPage.nav.features'), href: '#features', hash: true },
      { label: t('landingPage.nav.howItWorks'), href: '#how-it-works', hash: true },
      { label: t('nav.templates') || 'Templates', href: '/templates' },
      { label: t('nav.pricing') || 'Pricing', href: '/pricing' },
      { label: t('nav.comparison') || 'Compare', href: '/comparison' },
      { label: 'Government', href: '/government' },
      { label: t('landingPage.nav.legal'), href: '/trust' }
    ],
    [t]
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href) => !href.startsWith('#') && location.pathname === href

  return (
    <nav
      className="fixed inset-x-0 top-0 z-[100] transition-all duration-300"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        background: scrolled
          ? 'color-mix(in srgb, var(--bg-navbar) 94%, transparent)'
          : 'color-mix(in srgb, var(--bg-navbar) 72%, transparent)',
        backdropFilter: 'blur(24px)',
        boxShadow: scrolled ? '0 12px 40px rgba(0,0,0,0.18)' : 'none'
      }}
    >
      <div className="layout-container relative flex h-[4.25rem] items-center">
        {/* Left — logo */}
        <div className="flex flex-1 items-center">
          <Link to="/" className="group flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-[1.02] group-hover:border-[var(--border-gold)]"
              style={{
                borderColor: 'var(--border)',
                background: 'rgba(255,255,255,0.04)',
                boxShadow: scrolled ? '0 4px 16px rgba(0,0,0,0.12)' : 'none'
              }}
            >
              <img src="/logo.png" alt="Satohash" className="h-6 w-6 object-contain" />
            </div>
            <div className="flex flex-col">
              <span
                className="text-[15px] font-black tracking-[0.14em] uppercase"
                style={{ color: 'var(--accent-gold)' }}
              >
                Satohash
              </span>
              <span
                className="text-[8px] font-semibold tracking-[0.3em] uppercase"
                style={{ color: 'var(--text-secondary)', opacity: 0.5 }}
              >
                Bitcoin Proof
              </span>
            </div>
          </Link>
        </div>

        {/* Center — links (viewport-centered) */}
        <div
          className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
          style={{ width: 'max-content', maxWidth: 'min(72vw, 52rem)' }}
        >
          <div
            className="flex items-center gap-0.5 overflow-x-auto rounded-2xl border p-1"
            style={{
              borderColor: 'color-mix(in srgb, var(--border) 75%, transparent)',
              background: 'color-mix(in srgb, var(--bg-secondary) 85%, transparent)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 28px rgba(0,0,0,0.15)'
            }}
          >
            {navLinks.map((link) => {
              const active = isActive(link.href)
              const className = [
                'relative whitespace-nowrap rounded-xl px-3.5 py-2 text-[11px] font-bold tracking-[0.1em] uppercase transition-colors duration-200',
                active
                  ? 'text-[var(--accent-gold)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              ].join(' ')

              const inner = link.hash ? (
                <a href={link.href} className={className}>
                  {active && (
                    <motion.span
                      layoutId="marketing-nav-active"
                      className="absolute inset-0 rounded-xl border"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(240,180,41,0.12) 0%, rgba(240,180,41,0.03) 100%)',
                        borderColor: 'color-mix(in srgb, var(--accent-gold) 30%, transparent)'
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              ) : (
                <Link to={link.href} className={className}>
                  {active && (
                    <motion.span
                      layoutId="marketing-nav-active"
                      className="absolute inset-0 rounded-xl border"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(240,180,41,0.12) 0%, rgba(240,180,41,0.03) 100%)',
                        borderColor: 'color-mix(in srgb, var(--accent-gold) 30%, transparent)'
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              )
              return <span key={link.href}>{inner}</span>
            })}
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex flex-1 items-center justify-end gap-2.5">
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <LanguageSwitcher />
            {extraActions}
            <button
              type="button"
              onClick={onDonate}
              className="hidden h-10 items-center gap-2 rounded-xl border px-4 text-[11px] font-bold tracking-wide uppercase transition-all hover:border-[var(--border-gold)] lg:flex"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <img src="/Bitcoin120x120.png" alt="" className="h-4 w-4 object-contain" />
              {t('landingPage.nav.donate')}
            </button>
            <Link
              to="/stamp"
              className="flex h-10 items-center gap-2 rounded-xl px-5 text-[11px] font-black tracking-[0.12em] uppercase transition-all hover:scale-[1.02] hover:opacity-95"
              style={{
                background: 'var(--accent-gold)',
                color: '#141b25',
                boxShadow: '0 4px 20px rgba(240,180,41,0.25)'
              }}
            >
              {t('landingPage.nav.startFree')}
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              type="button"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border"
              style={{ borderColor: 'var(--border)' }}
              onClick={() => setNavOpen(!navOpen)}
              aria-expanded={navOpen}
              aria-label={navOpen ? 'Close menu' : 'Open menu'}
            >
              {navOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
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
              {navLinks.map((link) =>
                link.hash ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="min-h-[44px] rounded-lg px-3 py-3 text-sm font-semibold"
                    style={{ color: 'var(--text-secondary)' }}
                    onClick={() => setNavOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="min-h-[44px] rounded-lg px-3 py-3 text-sm font-semibold"
                    style={{ color: 'var(--text-secondary)' }}
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
                className="mt-2 flex min-h-[44px] items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold"
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
