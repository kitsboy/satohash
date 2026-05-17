export default function Button({
  children,
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const variants = {
    primary:
      'bg-[var(--accent-active)] text-white hover:opacity-90 shadow-lg shadow-[var(--accent-active)]/20 hover:shadow-xl hover:-translate-y-0.5',
    secondary:
      'bg-[var(--surface-raised)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    outline:
      'bg-transparent border-2 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-active)] hover:text-[var(--accent-active)] hover:bg-[var(--accent-active)]/5 hover:-translate-y-0.5',
    ghost:
      'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]',
    danger:
      'bg-[var(--accent-danger)] text-white hover:opacity-90 shadow-lg shadow-[var(--accent-danger)]/20 hover:shadow-xl hover:-translate-y-0.5'
  }

  const sizes = {
    default: 'px-6 py-3 text-sm',
    large: 'px-8 py-4 text-base',
    small: 'px-4 py-2.5 text-xs'
  }

  const baseClasses =
    'inline-flex items-center justify-center gap-2.5 font-bold rounded-[14px] transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none'

  const classes = [baseClasses, variants[variant], sizes[size], fullWidth && 'w-full', className]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  )
}
