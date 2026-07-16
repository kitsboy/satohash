import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Menu, X } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import { ThemeToggle } from './ThemeProvider'
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
      className="fixed inset-x-0 top-0 z-[100] transition-shadow duration-300"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        background: scrolled
          ? 'color-mix(in srgb, var(--bg-navbar) 96%, transparent)'
          : 'color-mix(in srgb, var(--bg-navbar) 80%, transparent)',
        backdropFilter: 'blur(20px)',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.12)' : 'none'
      }}
    >
      <div className="layout-container hidden md:block">
        <DesktopNavLayout
          left={
            <Link to="/" className="group flex min-w-0 items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Satohash"
                className="h-8 w-8 shrink-0 object-contain transition-transform group-hover:scale-105"
              />
              <span
                className="truncate text-sm font-black tracking-[0.16em] uppercase"
                style={{ color: 'var(--accent-gold)' }}
              >
                Satohash
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
                className="hidden h-9 items-center rounded-lg border px-3 text-[11px] font-bold uppercase transition-colors hover:border-[var(--border-gold)] lg:flex"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                {t('landingPage.nav.donate')}
              </button>
              <Link
                to="/stamp"
                className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-4 text-[11px] font-black tracking-wide uppercase transition-opacity hover:opacity-90"
                style={{ background: 'var(--accent-gold)', color: '#141b25' }}
              >
                {t('landingPage.nav.startFree')}
                <ArrowRight size={13} />
              </Link>
            </>
          }
        />
      </div>

      {/* Mobile header */}
      <div className="layout-container flex h-14 items-center justify-between md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="" className="h-7 w-7 object-contain" />
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
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border"
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
