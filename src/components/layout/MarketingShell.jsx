import MarketingDesktopNav from './MarketingDesktopNav'

/**
 * Mobile/desktop chrome for marketing public routes that do not embed their own nav.
 * Fixed MarketingDesktopNav + content offset so heroes are not under the bar.
 */
export default function MarketingShell({ children, onDonate }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <MarketingDesktopNav onDonate={onDonate} />
      {/* Fixed header is h-14 + safe-area on mobile; desktop bar is h-16 */}
      <div className="pt-[calc(3.5rem+env(safe-area-inset-top,0px))] md:pt-16">{children}</div>
    </div>
  )
}
