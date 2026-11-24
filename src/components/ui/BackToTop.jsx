import { useState, useEffect } from 'react'

function installBarOpen() {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--satohash-pwa-bar')
    .trim()
  return value !== '' && value !== '0' && value !== '0px'
}

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [barOpen, setBarOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const root = document.documentElement
    const readBar = () => setBarOpen(installBarOpen())
    readBar()
    const obs = new MutationObserver(readBar)
    obs.observe(root, { attributes: true, attributeFilter: ['style'] })
    return () => {
      window.removeEventListener('scroll', onScroll)
      obs.disconnect()
    }
  }, [])

  if (!visible || barOpen) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-overlay)] shadow-lg transition-all hover:border-[var(--accent-gold)] hover:shadow-[0_0_20px_var(--accent-gold-glow)] sm:right-8"
      style={{ bottom: 'calc(2rem + var(--satohash-pwa-bar, 0px))' }}
      aria-label="Back to top"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--text-secondary)"
        strokeWidth="2"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  )
}
