import { motion } from 'framer-motion'

/**
 * Reusable empty state for list views (Forum, Vault, etc.)
 */
export default function EmptyState({
  icon = '💬',
  title = 'Nothing here yet',
  description,
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center space-y-4 py-16 text-center ${className}`}
    >
      <span className="text-4xl" role="img" aria-hidden="true">
        {icon}
      </span>
      <h3 className="text-lg font-black uppercase" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      {description && (
        <p className="max-w-sm text-sm" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 min-h-[44px] rounded-xl px-6 py-3 text-xs font-black tracking-widest uppercase transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--accent-gold)', color: '#141b25' }}
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  )
}
