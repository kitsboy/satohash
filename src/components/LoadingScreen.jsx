import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center"
      style={{ background: 'var(--bg-primary)' }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        className="relative h-16 w-16"
      >
        <div className="absolute inset-0 rounded-full border-t-4 border-[var(--accent-active)]" />
        <div className="absolute inset-0 rounded-full border-r-4 border-[var(--border)]" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-sm font-bold tracking-wide text-[var(--text-secondary)]"
      >
        LOADING SECURE MODULE...
      </motion.p>
    </div>
  )
}
