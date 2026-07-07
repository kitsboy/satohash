import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Activity, Shield, Database, Globe } from 'lucide-react'
import { getFeeEstimates, getMempoolStats, getBlockHeight } from '../utils/mempool'

const Bubble = ({ color, size, delay, duration = 4 }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
      y: [0, -20, 0]
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay: delay
    }}
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      filter: 'blur(8px)',
      position: 'absolute'
    }}
  />
)

export default function LiveNetworkDashboard() {
  const [fees, setFees] = useState(null)
  const [stats, setStats] = useState(null)
  const [blockHeight, setBlockHeight] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feeData, mempoolData, height] = await Promise.all([
          getFeeEstimates(),
          getMempoolStats(),
          getBlockHeight()
        ])
        setFees(feeData)
        setStats(mempoolData)
        setBlockHeight(height)
      } catch (err) {
        console.error('Failed to fetch network data', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex h-full min-h-[400px] w-full items-center justify-center overflow-hidden rounded-3xl bg-[#0f172a] p-8 shadow-2xl">
      {/* Animated Background Bubbles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{ top: '20%', left: '10%' }}>
          <Bubble color="rgba(99, 102, 241, 0.4)" size={100} delay={0} duration={3.5} />
        </div>
        <div style={{ top: '60%', left: '80%' }}>
          <Bubble color="rgba(168, 85, 247, 0.4)" size={120} delay={1} duration={4.2} />
        </div>
        <div style={{ top: '10%', left: '70%' }}>
          <Bubble color="rgba(244, 63, 94, 0.3)" size={80} delay={2} duration={5} />
        </div>
        <div style={{ top: '80%', left: '20%' }}>
          <Bubble color="rgba(16, 185, 129, 0.3)" size={90} delay={0.5} duration={4.8} />
        </div>
      </div>

      {/* Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 grid w-full items-center gap-8 md:grid-cols-2">
        {/* Left Side: Fee Intensity */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold tracking-widest text-indigo-400 uppercase backdrop-blur-md">
            <Activity size={12} className="animate-pulse" /> Live Protocol Pulse
          </div>

          <div>
            <h2 className="mb-2 flex items-baseline gap-2 text-5xl leading-none font-black text-white">
              {fees?.fastestFee || '24'}
              <span className="text-lg font-bold tracking-widest text-slate-500 uppercase">
                sat/vB
              </span>
            </h2>
            <p className="font-medium text-slate-400">Current Priority Transaction Fee</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <Zap size={20} className="mb-2 text-amber-400" />
              <div className="text-xl font-bold text-white">{fees?.halfHourFee || '18'}</div>
              <div className="text-xs font-bold tracking-tight text-slate-500 uppercase">
                Standard
              </div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <Database size={20} className="mb-2 text-emerald-400" />
              <div className="text-xl font-bold text-white">#{blockHeight || '831,442'}</div>
              <div className="text-xs font-bold tracking-tight text-slate-500 uppercase">
                Block Tip Height
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Network Health Visualization */}
        <div className="relative flex aspect-square h-full items-center justify-center md:aspect-auto">
          <div className="relative h-48 h-full w-48 sm:h-64 sm:w-64">
            {/* Central Hub */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/20"
            />
            <div className="absolute inset-4 rounded-full border border-indigo-500/10" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 rotate-45 transform items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/40 transition-transform duration-500 group-hover:rotate-0">
                <Database
                  size={32}
                  className="-rotate-45 text-white transition-transform duration-500 group-hover:rotate-0"
                />
              </div>
            </div>

            {/* Orbiting Satellites (Bubbles) */}
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.2 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${angle}deg) translate(80px, -50%)`,
                  transformOrigin: '0 0'
                }}
              >
                <div className="h-4 w-4 rounded-full border-2 border-indigo-500 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
              </motion.div>
            ))}
          </div>

          <div className="absolute right-0 bottom-0 p-6 text-right">
            <div className="mb-1 text-xs font-black tracking-[0.2em] text-slate-500 uppercase">
              Mempool Backlog
            </div>
            <div className="text-2xl font-black text-white">
              {stats?.count ? (stats.count / 1000).toFixed(1) : '85.4'}k
              <span className="ml-2 text-indigo-400">TX</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
    </div>
  )
}
