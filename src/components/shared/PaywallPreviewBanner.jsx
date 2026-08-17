/** Staging-only. Never set VITE_PAYWALL_PREVIEW on production Pages builds. */
export default function PaywallPreviewBanner() {
  if (import.meta.env.VITE_PAYWALL_PREVIEW !== '1') return null
  if (typeof window !== 'undefined') {
    const h = window.location.hostname.toLowerCase()
    if (h === 'satohash.io' || h === 'www.satohash.io') return null
  }
  return (
    <div
      role="status"
      className="px-3 py-2 text-center text-[11px] font-black tracking-widest uppercase"
      style={{ background: 'rgba(244,63,94,0.12)', color: 'var(--accent-danger)' }}
    >
      Staging paywall preview — live stamps stay free
    </div>
  )
}
