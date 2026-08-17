/**
 * One-thumb sticky primary action above mobile bottom chrome / safe area.
 */
export default function StampStickyBar({
  visible,
  label = 'Stamp on Bitcoin',
  disabled = false,
  onClick,
  secondaryLabel,
  onSecondary
}) {
  if (!visible) return null

  return (
    <div
      className="stamp-sticky-bar fixed inset-x-0 z-[60] border-t px-3 pt-3 md:hidden"
      style={{
        bottom: 0,
        paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
        background: 'color-mix(in srgb, var(--bg-primary) 92%, transparent)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >
      <div className="mx-auto flex max-w-lg gap-2">
        {secondaryLabel && onSecondary && (
          <button
            type="button"
            onClick={onSecondary}
            className="min-h-[52px] flex-1 rounded-xl border text-xs font-black tracking-widest uppercase"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            {secondaryLabel}
          </button>
        )}
        <button
          type="button"
          data-testid="stamp-sticky-cta"
          disabled={disabled}
          onClick={onClick}
          className="btn-sheen min-h-[52px] flex-[2] rounded-xl text-sm font-black tracking-widest uppercase shadow-lg disabled:opacity-50"
          style={{
            background: 'var(--accent-gold)',
            color: '#141b25',
            boxShadow: '0 8px 28px var(--accent-gold-glow)'
          }}
        >
          {label}
        </button>
      </div>
    </div>
  )
}
