export default function Card({
  children,
  interactive = false,
  onClick,
  className = '',
  variant = 'elevated', // 'elevated', 'glass', 'flat'
  padding = 'large', // 'small', 'medium', 'large', 'none'
  ...props
}) {
  const paddingMap = {
    none: 'p-0',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  }

  const variantClasses = {
    elevated: 'bg-white border-2 border-indigo-100 shadow-lg shadow-indigo-500/10',
    glass: 'glass-card',
    flat: 'bg-indigo-50/50 border-2 border-indigo-200 text-indigo-950'
  }

  const classes = [
    'rounded-2xl transition-all duration-300',
    variantClasses[variant] || variantClasses.elevated,
    paddingMap[padding],
    interactive &&
      variant !== 'glass' &&
      'cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-400 hover:-translate-y-1 active:scale-[0.98]',
    interactive && variant === 'glass' && 'cursor-pointer active:scale-[0.98]',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} onClick={interactive ? onClick : undefined} {...props}>
      {children}
    </div>
  )
}
