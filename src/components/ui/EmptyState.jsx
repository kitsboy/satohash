import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function ActionBtn({ children, onClick, to, primary }) {
  const cls =
    'mt-1 inline-flex min-h-[48px] items-center justify-center rounded-xl px-6 py-3 text-xs font-black tracking-widest uppercase transition-all hover:opacity-90'
  const style = primary
    ? { backgroundColor: 'var(--accent-gold)', color: '#141b25' }
    : {
        backgroundColor: 'transparent',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border)'
      }
  if (to) {
    return (
      <Link to={to} className={cls} style={style}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} className={cls} style={style}>
      {children}
    </button>
  )
}

/**
 * Reusable empty / error state — mobile-friendly touch targets.
 */
export default function EmptyState({
  icon = '💬',
  imageSrc,
  title = 'Nothing here yet',
  description,
  actionLabel,
  onAction,
  actionTo,
  secondaryLabel,
  onSecondary,
  secondaryTo,
  className = ''
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center space-y-4 py-12 text-center sm:py-16 ${className}`}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          width={160}
          height={160}
          className="h-36 w-36 rounded-2xl object-cover shadow-lg sm:h-40 sm:w-40"
          style={{ border: '1px solid var(--border)' }}
          loading="lazy"
        />
      ) : (
        <span className="text-4xl" role="img" aria-hidden="true">
          {icon}
        </span>
      )}
      <h3 className="text-lg font-black uppercase" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      {description && (
        <p className="max-w-sm text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        {actionLabel && (onAction || actionTo) && (
          <ActionBtn onClick={onAction} to={actionTo} primary>
            {actionLabel}
          </ActionBtn>
        )}
        {secondaryLabel && (onSecondary || secondaryTo) && (
          <ActionBtn onClick={onSecondary} to={secondaryTo}>
            {secondaryLabel}
          </ActionBtn>
        )}
      </div>
    </motion.div>
  )
}
