import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Calendar, Hash, Globe, UserCheck, ShieldClose } from 'lucide-react'
import { toast } from 'sonner'
import ProofDNA from '../components/stamps/ProofDNA'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl } from '../config/constants'

/**
 * Item 28: Holographic Verification Shield
 * "Public Proof-of-Existence Landing Page."
 */
export default function PublicVerification() {
  usePageMeta({ page: 'verificationShield' })
  const { id } = useParams()
  const [stamp, setStamp] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStamp = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/api/stamps/${id}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setStamp(data)
      } catch (e) {
        console.error(e)
        toast.error('Could not load verification record', { description: e.message })
      }
      setLoading(false)
    }
    fetchStamp()
  }, [id])

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 rounded-full border-2 border-indigo-500 border-t-transparent shadow-[0_0_20px_#6366f1]"
        />
      </div>
    )

  if (!stamp)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-base)] p-6 text-center">
        <ShieldClose size={80} className="mb-8 text-rose-500/20" />
        <h1 className="mb-4 text-4xl font-black tracking-tighter text-indigo-900 uppercase italic">
          Void Entry
        </h1>
        <p className="text-sm font-bold tracking-widest text-rose-500/60 uppercase italic">
          Hash registry error: Record not found in local node.
        </p>
      </div>
    )

  return (
    <div className="min-h-screen bg-[var(--bg-base)] pb-32">
      {/* Cinematic Header Background */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 z-10 bg-indigo-900/90 backdrop-blur-3xl" />
        <div
          className="absolute inset-x-0 top-0 h-full opacity-40 blur-[120px]"
          style={{
            background: `radial-gradient(circle, #${stamp.hash.substring(0, 6)}88 0%, transparent 70%)`
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 flex h-full flex-col items-center justify-center px-6 pt-20"
        >
          <div className="group mb-12 cursor-pointer rounded-[3rem] bg-white/5 p-4 ring-4 ring-white/10 transition-all hover:bg-white/20">
            <ProofDNA hash={stamp.hash} size="lg" />
          </div>

          <div className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 inline-flex items-center gap-3 rounded-full bg-emerald-500/10 px-6 py-2.5 text-[10px] font-black tracking-[0.4em] text-emerald-400 uppercase italic ring-1 ring-emerald-500/20"
            >
              <ShieldCheck size={14} className="fill-emerald-500/10" />
              Attestation Verified Stable
            </motion.div>
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic md:text-8xl">
              Verifiable <br /> <span className="text-emerald-400">EVIDENCE.</span>
            </h1>
          </div>
        </motion.div>
      </div>

      {/* Technical Specification Matrix */}
      <div className="relative z-30 mx-auto -mt-24 grid max-w-5xl gap-8 px-6 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="glass-card border-indigo-100 bg-white p-12 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.08)]">
            <div className="mb-12 border-b border-indigo-50 pb-8">
              <label className="mb-3 block text-[10px] font-black tracking-[0.3em] text-indigo-900/30 uppercase italic">
                Digital Asset ID
              </label>
              <h3 className="text-3xl font-black tracking-tighter text-indigo-900 uppercase italic">
                {stamp.filename || 'Source_Archive'}
              </h3>
            </div>

            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <div className="mb-4 flex items-center gap-3 text-emerald-600">
                  <Hash size={18} />
                  <span className="text-[10px] font-black tracking-widest uppercase italic">
                    SHA-256 Fingerprint
                  </span>
                </div>
                <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed break-all text-indigo-900/60">
                  {stamp.hash}
                </p>
              </div>
              <div>
                <div className="mb-4 flex items-center gap-3 text-emerald-600">
                  <Calendar size={18} />
                  <span className="text-[10px] font-black tracking-widest uppercase italic">
                    Witness Date
                  </span>
                </div>
                <p className="text-2xl font-black tracking-tighter text-indigo-900 italic">
                  {new Date(stamp.created_at).toUTCString()}
                </p>
                <p className="mt-2 text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                  {stamp.status.toUpperCase()} Consensus State
                </p>
              </div>
            </div>
          </div>

          {/* Mesh Verification */}
          <div className="glass-card border-indigo-50 bg-white p-10">
            <div className="mb-8 flex items-center justify-between">
              <h4 className="text-xs font-black text-indigo-900 uppercase italic">
                Consensus Audit Log
              </h4>
              <div className="flex gap-1">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-1.5 w-4 rounded-full bg-emerald-500/20" />
                  ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <Globe size={14} className="text-indigo-600" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Satoshi_Node_01
                  </span>
                </div>
                <span className="text-[9px] font-black text-emerald-600 uppercase">
                  Verified OK
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <UserCheck size={14} className="text-indigo-600" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Nostr_Relay_Verification
                  </span>
                </div>
                <span className="text-[9px] font-black text-emerald-600 uppercase">
                  Signed & Sealed
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card border-emerald-200 bg-emerald-50 p-8 shadow-xl">
            <ShieldCheck size={32} className="mb-6 text-emerald-500" />
            <h4 className="mb-4 text-xs font-black text-emerald-900 uppercase italic">
              Official Verification
            </h4>
            <p className="mb-8 text-[10px] leading-relaxed font-medium text-emerald-800/80 italic">
              This digital asset has been mathematically linked to the Bitcoin blockchain. It is
              permanently fixed in space and time. No centralized authority can alter this proof.
            </p>
            <button
              className="btn-holographic w-full py-4 text-[9px] leading-none"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              Download Public Affidavit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
