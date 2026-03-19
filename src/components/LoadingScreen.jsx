import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        className="relative w-16 h-16"
      >
        <div className="absolute inset-0 rounded-full border-t-4 border-indigo-600 border-opacity-80" />
        <div className="absolute inset-0 rounded-full border-r-4 border-slate-200" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 font-bold text-slate-500 tracking-wide text-sm"
      >
        LOADING SECURE MODULE...
      </motion.p>
    </div>
  )
}
