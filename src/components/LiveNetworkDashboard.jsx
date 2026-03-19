import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Activity, Shield, Database, Globe } from 'lucide-react'
import { getFeeEstimates, getMempoolStats, getBlockHeight } from '../utils/mempool'

const Bubble = ({ color, size, delay }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
      y: [0, -20, 0]
    }}
    transition={{
      duration: 3 + Math.random() * 2,
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
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center p-8 bg-[#0f172a] rounded-3xl overflow-hidden shadow-2xl">
      {/* Animated Background Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{ top: '20%', left: '10%' }}>
          <Bubble color="rgba(99, 102, 241, 0.4)" size={100} delay={0} />
        </div>
        <div style={{ top: '60%', left: '80%' }}>
          <Bubble color="rgba(168, 85, 247, 0.4)" size={120} delay={1} />
        </div>
        <div style={{ top: '10%', left: '70%' }}>
          <Bubble color="rgba(244, 63, 94, 0.3)" size={80} delay={2} />
        </div>
        <div style={{ top: '80%', left: '20%' }}>
          <Bubble color="rgba(16, 185, 129, 0.3)" size={90} delay={0.5} />
        </div>
      </div>

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Fee Intensity */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold text-indigo-400 uppercase tracking-widest">
            <Activity size={12} className="animate-pulse" /> Live Protocol Pulse
          </div>

          <div>
            <h2 className="text-white text-5xl font-black mb-2 flex items-baseline gap-2 leading-none">
              {fees?.fastestFee || '24'}
              <span className="text-slate-500 text-lg font-bold uppercase tracking-widest">
                sat/vB
              </span>
            </h2>
            <p className="text-slate-400 font-medium">Current Priority Transaction Fee</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <Zap size={20} className="text-amber-400 mb-2" />
              <div className="text-white font-bold text-xl">{fees?.halfHourFee || '18'}</div>
              <div className="text-slate-500 text-xs font-bold uppercase tracking-tight">
                Standard
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <Database size={20} className="text-emerald-400 mb-2" />
              <div className="text-white font-bold text-xl">#{blockHeight || '831,442'}</div>
              <div className="text-slate-500 text-xs font-bold uppercase tracking-tight">
                Block Tip Height
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Network Health Visualization */}
        <div className="relative aspect-square md:aspect-auto h-full flex items-center justify-center">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 h-full">
            {/* Central Hub */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 border-2 border-dashed border-indigo-500/20 rounded-full"
            />
            <div className="absolute inset-4 border border-indigo-500/10 rounded-full" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 transform rotate-45 group-hover:rotate-0 transition-transform duration-500">
                <Database
                  size={32}
                  className="text-white -rotate-45 group-hover:rotate-0 transition-transform duration-500"
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
                <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] border-2 border-indigo-500" />
              </motion.div>
            ))}
          </div>

          <div className="absolute bottom-0 right-0 p-6 text-right">
            <div className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-1">
              Mempool Backlog
            </div>
            <div className="text-white font-black text-2xl">
              {stats?.count ? (stats.count / 1000).toFixed(1) : '85.4'}k
              <span className="text-indigo-400 ml-2">TX</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
    </div>
  )
}
