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
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/40 hover:-translate-y-0.5',
    secondary: 'bg-slate-800 text-white hover:bg-slate-900 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-0.5',
    outline:
      'bg-transparent border-2 border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/50 hover:-translate-y-0.5',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-200/50 hover:shadow-xl hover:-translate-y-0.5'
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
