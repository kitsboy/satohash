import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Zap,
  Shield,
  Network,
  Globe,
  Lock,
  Cpu,
  Box,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Binary,
  Database,
  Server,
  RefreshCw
} from 'lucide-react'

/**
 * Institutional Elite HUD
 * Houses L1 Health, Witness Quorum, and Quantum Readiness
 */
export default function InstitutionalHUD() {
  const [mempoolSize, setMempoolSize] = useState(48212)
  const [feeRates, setFeeRates] = useState({ low: 18, mid: 24, high: 62 })
  const [activeNodes, setActiveNodes] = useState(1422)

  useEffect(() => {
    let tick = 0
    const interval = setInterval(() => {
      tick += 1
      const wave = Math.sin(tick * 0.7)
      setMempoolSize((prev) => prev + Math.round(wave * 4))
      setFeeRates((prev) => ({
        low: Math.max(1, prev.low + Math.round(Math.sin(tick * 0.5) * 2)),
        mid: Math.max(1, prev.mid + Math.round(Math.cos(tick * 0.4) * 2)),
        high: Math.max(1, prev.high + Math.round(Math.sin(tick * 0.3) * 3))
      }))
      setActiveNodes((prev) => prev + Math.round(Math.cos(tick * 0.6)))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {/* 1. L1_HEALTH_PULSE */}
      <div className="glass-card group relative overflow-hidden border-indigo-50 bg-white p-10 shadow-2xl shadow-indigo-500/5">
        <div className="absolute top-0 right-0 p-8 opacity-5 transition-all duration-1000 group-hover:scale-110">
          <Activity size={120} />
        </div>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Activity size={24} />
            </div>
            <div>
              <h4 className="mb-1 text-[10px] font-black tracking-[0.4em] text-indigo-900/40 uppercase italic">
                L1_Protocol_Health
              </h4>
              <p className="text-xl font-black tracking-tighter text-indigo-900 uppercase italic">
                POW_PULSE_NOMINAL
              </p>
            </div>
          </div>
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
        </div>

        <div className="mb-8 space-y-6">
          <MetricLine
            label="Mempool Pressure"
            value={`${(mempoolSize / 1000).toFixed(1)}k tx`}
            progress={70}
            color="indigo"
          />
          <MetricLine label="Mean Block Time" value="9.8m" progress={90} color="emerald" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FeePill label="Economy" rate={feeRates.low} />
          <FeePill label="Standard" rate={feeRates.mid} />
          <FeePill label="Elite" rate={feeRates.high} active />
        </div>
      </div>

      {/* 2. WITNESS_QUORUM_MESH */}
      <div className="glass-card group relative overflow-hidden border-none bg-[#0c1220] p-10 text-white shadow-2xl">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            background: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />

        <h4 className="mb-10 text-[10px] font-black tracking-[0.4em] text-indigo-400 uppercase italic">
          Mesh_Quorum_v4
        </h4>

        <div className="mb-10 space-y-8">
          <QuorumNode label="ORACLE_ALPHA (Switzerland)" status="SIGNED" emerald />
          <QuorumNode label="RE-DECENTRAL_01 (Brazil)" status="SIGNED" emerald />
          <QuorumNode label="SATAHASH_GOVERNOR (US)" status="PENDING" amber />
          <QuorumNode label="RELAY_PEER_42 (Singapore)" status="SIGNED" emerald />
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-6">
          <div className="text-[9px] font-black tracking-widest text-indigo-300/40 uppercase italic">
            Global Nodes Active
          </div>
          <div className="text-xl font-black text-white italic">{activeNodes}</div>
        </div>
      </div>

      {/* 3. QUANTUM_READY_VAULT */}
      <div className="glass-card group flex flex-col justify-between border-indigo-50 bg-white p-10 shadow-2xl shadow-indigo-500/5">
        <div>
          <div className="mb-10 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-all group-hover:bg-indigo-900 group-hover:text-white">
              <Cpu size={24} />
            </div>
            <h4 className="text-xl font-black tracking-tighter text-indigo-900 uppercase italic">
              Quantum <br /> <span className="text-indigo-600">PREVIEW.</span>
            </h4>
          </div>
          <p className="mb-8 text-[11px] leading-relaxed font-bold text-slate-500 italic">
            Future-proof your attestation Mesh. Preview ML-DSA (Dilithium) and SLH-DSA (SPHINCS+)
            signature schemes for post-quantum hardening.
          </p>
        </div>

        <div className="space-y-4">
          <button className="group flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-50 py-4 text-[9px] font-black tracking-widest text-indigo-600 uppercase transition-all hover:bg-indigo-900 hover:text-white">
            <Binary size={14} className="group-hover:animate-bounce" /> ENABLE_PQ_PREVIEW
          </button>
          <div className="flex w-fit items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2">
            <Lock size={12} className="text-slate-400" />
            <span className="text-[8px] font-black tracking-widest text-slate-400 uppercase italic">
              NIST_READY_v2
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricLine({ label, value, progress, color }) {
  const barColor = color === 'indigo' ? 'bg-indigo-500' : 'bg-emerald-500'
  return (
    <div className="group">
      <div className="mb-2 flex items-end justify-between">
        <span className="text-[9px] font-black tracking-[0.2em] text-indigo-900/30 uppercase italic">
          {label}
        </span>
        <span className="text-xs font-black tracking-tight text-indigo-900 lowercase italic">
          {value}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={`h-full ${barColor}`}
        />
      </div>
    </div>
  )
}

function FeePill({ label, rate, active }) {
  return (
    <div
      className={`rounded-2xl border p-4 text-center transition-all ${active ? 'border-indigo-900 bg-indigo-900 text-white shadow-xl shadow-indigo-500/20' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
    >
      <div className="mb-1 text-[7px] font-black tracking-widest uppercase italic opacity-50">
        {label}
      </div>
      <div className="text-sm leading-none font-black italic">
        {rate}{' '}
        <span className="text-[7px] font-black tracking-widest uppercase opacity-30">sat/vB</span>
      </div>
    </div>
  )
}

function QuorumNode({ label, status, emerald, amber }) {
  return (
    <div className="group flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          className={`h-2 w-2 rounded-full ${emerald ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : amber ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-slate-500'} transition-all group-hover:scale-125`}
        />
        <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase italic transition-colors group-hover:text-white">
          {label}
        </span>
      </div>
      <span
        className={`text-[8px] font-black uppercase italic ${emerald ? 'text-emerald-400' : amber ? 'text-amber-400' : 'text-indigo-300'}`}
      >
        {status}
      </span>
    </div>
  )
}
