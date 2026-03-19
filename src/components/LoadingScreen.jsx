import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        className="relative h-16 w-16"
      >
        <div className="border-opacity-80 absolute inset-0 rounded-full border-t-4 border-indigo-600" />
        <div className="absolute inset-0 rounded-full border-r-4 border-slate-200" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-sm font-bold tracking-wide text-slate-500"
      >
        LOADING SECURE MODULE...
      </motion.p>
    </div>
  )
}
