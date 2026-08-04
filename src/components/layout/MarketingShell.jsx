import MarketingDesktopNav from './MarketingDesktopNav'

/**
 * Mobile/desktop chrome for marketing public routes that do not embed their own nav.
 * Fixed MarketingDesktopNav + content offset so heroes are not under the bar.
 */
export default function MarketingShell({ children, onDonate }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <MarketingDesktopNav onDonate={onDonate} />
      {/* Fixed header (h-14 / h-16) + optional DeepHealthBanner height CSS var */}
      <div className="pt-[calc(3.5rem+env(safe-area-inset-top,0px)+var(--satohash-health-banner-h,0px))] md:pt-[calc(4rem+var(--satohash-health-banner-h,0px))]">
        {children}
      </div>
    </div>
  )
}
