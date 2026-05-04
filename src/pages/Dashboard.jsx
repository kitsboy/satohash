import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import GlobalDropzone from '../components/GlobalDropzone'
import HistoryList from '../components/HistoryList'
import Merkle3D from '../components/Merkle3D'
import VoiceStamp from '../components/VoiceStamp'
import {
  Download,
  FileCheck,
  ExternalLink,
  ShieldCheck,
  Zap,
  UserCheck,
  FileText,
  ChevronRight,
  Terminal,
  Network,
  Box,
  Lock,
  Cpu,
  Globe,
  CreditCard,
  AlertTriangle,
  Crown,
  Mic,
  Award
} from 'lucide-react'
import { generatePDF } from '../utils/pdfGenerator'
import { toast } from 'sonner'
import BlockchainPulse from '../components/BlockchainPulse'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Upsell Modal Component
function UpsellModal({ isOpen, onClose, onSubscribe }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <Crown className="h-8 w-8 text-amber-500" />
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <h3 className="mb-4 text-2xl font-bold text-indigo-900">Upgrade to Pro</h3>
            <p className="mb-6 text-slate-600">
              Unlock unlimited stamps, priority support, and advanced analytics. Only $9/month.
            </p>
            <div className="space-y-4">
              <button
                onClick={onSubscribe}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-700"
              >
                <CreditCard className="mr-2 inline h-5 w-5" />
                Subscribe Now
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-600 hover:bg-slate-50"
              >
                Maybe Later
              </button>
            </div>
            <p className="mt-6 text-center text-xs text-slate-500">
              Test with card: 4242 4242 4242 4242 (mock success)
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Dashboard() {
  const [file, setFile] = useState(null)
  const [showUpsell, setShowUpsell] = useState(false)
  const [userTier, setUserTier] = useState('free') // Mock: load from localStorage or API
  const [achievements, setAchievements] = useState({})
  const [showVoiceStamp, setShowVoiceStamp] = useState(false)
  const [stampCount, setStampCount] = useState(0)

  useEffect(() => {
    // Mock tier load
    const storedTier = localStorage.getItem('userTier') || 'free'
    setUserTier(storedTier)

    // Load achievements
    const storedAchievements = JSON.parse(localStorage.getItem('satohash_achievements') || '{}')
    const count = parseInt(localStorage.getItem('satohash_stamp_count') || '0')
    setAchievements(storedAchievements)
    setStampCount(count)

    // Check URL for success/cancel
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success')) {
      localStorage.setItem('userTier', 'pro')
      setUserTier('pro')
      toast.success('Subscription successful! Welcome to Pro tier.')
    } else if (urlParams.get('cancel')) {
      toast.info('Subscription cancelled.')
    }
  }, [])

  const handleFileProcessed = async (processedFile) => {
    // Simulate free limit (e.g., 5 stamps/day)
    if (userTier === 'free' && Math.random() < 0.8) {
      // 80% chance to trigger upsell for demo
      setShowUpsell(true)
      toast.warning('Free tier limit reached. Upgrade to continue unlimited stamping.')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/stamp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hash:
            processedFile.hash ||
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          filename: processedFile.name
        })
      })

      if (!response.ok) throw new Error('Stamping failed')

      const result = await response.json()
      setFile({ ...processedFile, ...result })
      toast.success('Successfully anchored to Bitcoin!')

      // Increment stamp count and check achievements
      const newCount = stampCount + 1
      localStorage.setItem('satohash_stamp_count', newCount.toString())
      setStampCount(newCount)

      // Check for achievements
      const newAchievements = { ...achievements }
      if (newCount === 10 && !newAchievements.firstDecade) {
        newAchievements.firstDecade = { unlocked: true, date: new Date().toISOString() }
        localStorage.setItem('satohash_achievements', JSON.stringify(newAchievements))
        setAchievements(newAchievements)
        toast.success('Achievement Unlocked: First Decade! 🎉')
      }

      if (newCount % 50 === 0 && !newAchievements[`milestone${newCount}`]) {
        newAchievements[`milestone${newCount}`] = { unlocked: true, date: new Date().toISOString() }
        localStorage.setItem('satohash_achievements', JSON.stringify(newAchievements))
        setAchievements(newAchievements)
        toast.success(`Achievement Unlocked: ${newCount} Anchors! 🏆`)
      }
    } catch (error) {
      toast.error('Failed to anchor file. Please try again.')
    } finally {
      // Cleanup
    }
  }

  const handleVoiceStamp = (voiceFile) => {
    // Reuse the same processing logic for voice stamps
    handleFileProcessed(voiceFile)
    setShowVoiceStamp(false) // Hide after stamping
  }

  const handleSubscribe = async () => {
    try {
      const response = await fetch(`${API_URL}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: 'price_1ABC123', // Mock price ID
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/dashboard?cancel=true`,
          email: 'user@example.com' // Mock
        })
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url // Redirect to checkout
      }
    } catch (err) {
      toast.error('Subscription failed')
    }
  }

  const downloadOTS = () => {
    if (!file?.id) return
    window.location.href = `${API_URL}/api/stamps/${file.id}?download=true`
  }

  return (
    <>
      <UpsellModal
        isOpen={showUpsell}
        onClose={() => setShowUpsell(false)}
        onSubscribe={handleSubscribe}
      />
      {showVoiceStamp && <VoiceStamp onStamp={handleVoiceStamp} isActive={showVoiceStamp} />}
      <div className="relative min-h-screen overflow-hidden bg-[#f7f8fc] pt-32 pb-32 selection:bg-indigo-500/30">
        {/* Tier Badge */}
        <div className="absolute top-4 right-4 z-40">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${userTier === 'pro' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}
          >
            <Crown className="mr-1 h-3 w-3" /> {userTier.toUpperCase()} Tier
          </span>
        </div>
        {/* Achievements Badge */}
        {Object.keys(achievements).length > 0 && (
          <div className="absolute top-4 left-4 z-40">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              <Award className="mr-1 h-3 w-3" /> {Object.keys(achievements).length} Badges
            </span>
          </div>
        )}
        {/* Voice Stamp Toggle */}
        <button
          onClick={() => setShowVoiceStamp(!showVoiceStamp)}
          className="absolute top-20 right-4 z-40 flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          <Mic size={16} />
          {showVoiceStamp ? 'Hide Voice' : 'Voice Stamp'}
        </button>

        <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.03]" />
        <div className="pointer-events-none absolute top-0 left-1/4 h-[600px] w-1/2 bg-indigo-50/30 blur-[120px]" />

        <div className="layout-container relative z-10 max-w-7xl">
          {/* Elite Hero Space */}
          <div className="mb-20 flex flex-col items-end justify-between gap-12 md:flex-row">
            <div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-900 text-white shadow-2xl shadow-indigo-500/20"
              >
                <Network size={24} />
              </motion.div>
              <h1 className="text-noir-primary mb-6 text-6xl leading-none font-black tracking-tighter uppercase italic md:text-8xl">
                Sovereign <br /> <span className="text-indigo-600">WORKSPACE.</span>
              </h1>
              <p className="max-w-xl font-sans text-lg leading-relaxed font-bold text-slate-500 italic">
                Universal cryptographic truth layer. Anchor artifacts to Bitcoin, verify forensic
                provenance, and manage your institutional witness mesh.
              </p>
            </div>

            <div className="hidden lg:block">
              <BlockchainPulse />
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-12">
            {/* Main Work-Area */}
            <div className="space-y-12 lg:col-span-8">
              {/* STAMPING TERMINAL */}
              <div className="glass-card border-noir group relative overflow-hidden rounded-[3.5rem] bg-white p-1 shadow-2xl">
                <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.02]" />
                <div className="relative z-10 flex min-h-[320px] flex-col justify-between rounded-[3.2rem] border border-slate-50 bg-white p-10">
                  {!file ? (
                    <>
                      <div className="flex flex-1 flex-col items-center justify-center text-center font-sans">
                        <motion.div
                          animate={{
                            boxShadow: [
                              '0 0 0px rgba(79,70,229,0)',
                              '0 0 40px rgba(79,70,229,0.1)',
                              '0 0 0px rgba(79,70,229,0)'
                            ]
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="mb-10 flex h-24 w-24 items-center justify-center rounded-[2.5rem] border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-xl"
                        >
                          <FileCheck size={40} />
                        </motion.div>
                        <h3 className="mb-4 font-sans text-3xl font-black tracking-tighter text-indigo-900 uppercase italic">
                          Ingest Protocol.
                        </h3>
                        <p className="mb-10 max-w-sm leading-relaxed font-bold text-slate-500 italic">
                          Drag any document, image, or forensic evidence to begin the cryptographic
                          anchoring process on the Bitcoin network.
                        </p>

                        {/* Technical Infill HUD */}
                        <div className="mt-4 grid grid-cols-2 gap-8 text-left opacity-0 transition-all delay-100 duration-700 group-hover:opacity-100">
                          <div className="space-y-1">
                            <p className="text-[8px] font-black text-indigo-300 uppercase italic">
                              Protocol_v4
                            </p>
                            <p className="text-[10px] font-black text-indigo-900 uppercase">
                              SATOHASH_CORE
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[8px] font-black text-indigo-300 uppercase italic">
                              Cipher_Suite
                            </p>
                            <p className="text-[10px] font-black text-indigo-900 uppercase">
                              AES_256_GCM
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[8px] font-black text-indigo-300 uppercase italic">
                              Mesh_Latency
                            </p>
                            <p className="text-[10px] font-black text-emerald-500 uppercase">
                              12ms_STABLE
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[8px] font-black text-indigo-300 uppercase italic">
                              Audit_Trail
                            </p>
                            <p className="text-[10px] font-black text-indigo-900 uppercase">
                              FULL_FORENSIC
                            </p>
                          </div>
                        </div>

                        {/* Protocol Sync Animation */}
                        <div className="mt-12 flex items-center gap-2">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{
                                height: [4, 12, 4],
                                opacity: [0.1, 0.5, 0.1]
                              }}
                              transition={{
                                duration: 1.5,
                                delay: i * 0.1,
                                repeat: Infinity,
                                ease: 'easeInOut'
                              }}
                              className="w-1 rounded-full bg-indigo-600"
                            />
                          ))}
                        </div>
                      </div>
                      <GlobalDropzone onFileProcessed={handleFileProcessed} />
                    </>
                  ) : (
                    <div className="flex flex-1 flex-col">
                      <div className="mb-12 flex items-center justify-between">
                        <span
                          className={
                            file.status === 'confirmed'
                              ? 'rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-[10px] font-black tracking-widest text-emerald-600 uppercase'
                              : 'animate-pulse rounded-xl border border-amber-100 bg-amber-50 px-4 py-2 text-[10px] font-black tracking-widest text-amber-600 uppercase'
                          }
                        >
                          {file.status === 'confirmed'
                            ? 'BITCOIN_FINALITY_CONFIRMED'
                            : 'MESH_PROPAGATION_PENDING'}
                        </span>
                        <button
                          onClick={() => setFile(null)}
                          className="text-[10px] font-black tracking-widest text-slate-300 uppercase italic underline decoration-2 underline-offset-4 transition-colors hover:text-indigo-900"
                        >
                          Reset Workbench
                        </button>
                      </div>

                      <div className="mb-12 flex items-start gap-8">
                        <div className="flex h-20 w-20 items-center justify-center rounded-[1.8rem] border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-xl shadow-indigo-500/5">
                          <FileCheck size={32} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h2 className="mb-2 truncate text-3xl font-black tracking-tighter text-indigo-900 uppercase italic">
                            {file.name}
                          </h2>
                          <div className="flex items-center gap-3">
                            <Hash size={12} className="text-indigo-300" />
                            <code className="truncate font-mono text-[10px] font-black text-indigo-900/30">
                              {file.hash}
                            </code>
                          </div>
                        </div>
                      </div>

                      <div className="group relative mb-12 cursor-pointer overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50 p-8">
                        <div className="absolute inset-0 bg-indigo-900 opacity-0 transition-opacity group-hover:opacity-5" />
                        <Merkle3D hash={file.hash} />
                      </div>

                      <div className="mt-auto grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <ActionBtn
                          icon={Download}
                          label="Proof_OTS"
                          onClick={downloadOTS}
                          secondary
                        />
                        <ActionBtn
                          icon={FileText}
                          label="Certificate"
                          onClick={() => generatePDF(file)}
                          secondary
                        />
                        <ActionBtn
                          icon={ExternalLink}
                          label="Mempool.space"
                          onClick={() => window.open('https://mempool.space', '_blank')}
                          amber
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* History Block */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Terminal size={22} className="text-indigo-900" />
                    <h3 className="text-2xl font-black tracking-tighter text-indigo-900 uppercase italic">
                      Protocol <span className="text-indigo-600">HISTORY.</span>
                    </h3>
                  </div>
                  <Link
                    to="/trust"
                    className="text-[10px] font-black tracking-widest text-indigo-600 uppercase italic hover:underline"
                  >
                    Full System Audit
                  </Link>
                </div>
                <HistoryList />
              </div>
            </div>

            {/* Sidebar Command Panel */}
            <div className="space-y-8 lg:col-span-4">
              {/* Institutional Hub Card */}
              <div className="glass-card group relative overflow-hidden bg-indigo-900 p-10 text-white shadow-2xl">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-950 to-indigo-900 opacity-100" />
                <div className="pointer-events-none absolute top-0 right-0 p-12 opacity-10 transition-transform duration-1000 group-hover:scale-110">
                  <ShieldCheck size={160} />
                </div>
                <h3 className="relative z-10 mb-8 text-2xl leading-none font-black tracking-tighter uppercase italic">
                  Command <br /> <span className="text-indigo-400">CONSOLE.</span>
                </h3>
                <div className="relative z-10 space-y-4">
                  <Link to="/developer" className="block w-full">
                    <SideBtn icon={Cpu} label="Developer Mesh" amber />
                  </Link>
                  <Link to="/access" className="block w-full">
                    <SideBtn icon={UserCheck} label="Identity Node" />
                  </Link>
                  <Link to="/templates" className="block w-full">
                    <SideBtn icon={FileText} label="Notary Vault" />
                  </Link>
                </div>
              </div>

              {/* Live Mesh Status */}
              <div className="glass-card border-none bg-white p-10 shadow-2xl shadow-indigo-500/5">
                <h4 className="mb-8 text-[10px] font-black tracking-[0.4em] text-indigo-900/30 uppercase italic">
                  Mesh_Telemetry
                </h4>
                <div className="space-y-6">
                  <TeleItem icon={Globe} label="Global Mirroring" status="NOMINAL_014" emerald />
                  <TeleItem icon={Zap} label="L2 Settlement" status="BOLT-12_ACTIVE" amber />
                  <TeleItem icon={Box} label="Genesis Block" status="#845922" />
                  <TeleItem icon={Lock} label="Privacy Shield" status="ZK_HARDENED" emerald />
                </div>
              </div>

              {/* High-Fidelity Education Card */}
              <div className="group relative overflow-hidden rounded-[2.5rem] border border-indigo-100 bg-indigo-50 p-10 italic transition-all hover:bg-white hover:shadow-2xl">
                <div className="absolute top-0 right-0 p-8 text-indigo-900 opacity-5">
                  <GraduationCap size={80} />
                </div>
                <h4 className="mb-4 text-sm font-black text-indigo-900 uppercase italic">
                  The Giving Machine.
                </h4>
                <p className="mb-8 text-[11px] leading-relaxed font-bold text-slate-500 italic">
                  Every anchor you generate funds global truth preservation. Learn about the
                  Satohash non-profit mission.
                </p>
                <Link
                  to="/about"
                  className="flex items-center gap-2 text-[10px] font-black tracking-widest text-indigo-600 uppercase italic transition-all group-hover:gap-4"
                >
                  Read Whitepaper <ChevronRight size={14} />
                </Link>
              </div>

              {/* Compliance Badges */}
              <div className="flex flex-wrap justify-center gap-6 rounded-3xl border border-emerald-100 bg-emerald-50/50 p-8">
                <ComplianceBadge label="eIDAS Ready" />
                <ComplianceBadge label="ESIGN Act" />
                <ComplianceBadge label="UETA Laws" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Hash(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="9" y2="9" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="10" x2="8" y1="3" y2="21" />
      <line x1="16" x2="14" y1="3" y2="21" />
    </svg>
  )
}

function ActionBtn({ icon: Icon, label, onClick, secondary, amber }) {
  const style = amber
    ? 'bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-500 hover:text-white'
    : secondary
      ? 'bg-slate-50 text-indigo-600 border border-slate-100 hover:bg-indigo-900 hover:text-white'
      : 'bg-indigo-900 text-white shadow-xl shadow-indigo-500/20'

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-3 rounded-2xl px-8 py-5 text-[10px] font-black tracking-widest uppercase transition-all ${style}`}
    >
      <Icon size={16} /> {label}
    </button>
  )
}

function SideBtn({ icon: Icon, label, amber }) {
  return (
    <div
      className={`group flex cursor-pointer items-center justify-between rounded-2xl p-6 transition-all ${amber ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white/10 text-indigo-900 hover:bg-white hover:text-indigo-900'}`}
    >
      <div className="flex items-center gap-4">
        <Icon
          size={20}
          className={amber ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-900'}
        />
        <span className="text-[10px] font-black tracking-widest uppercase">{label}</span>
      </div>
      <ChevronRight
        size={14}
        className={amber ? 'text-white opacity-50' : 'text-indigo-100 group-hover:text-indigo-300'}
      />
    </div>
  )
}

function TeleItem({ icon: Icon, label, status, emerald, amber }) {
  return (
    <div className="group flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Icon size={16} className="text-indigo-200 transition-colors group-hover:text-indigo-600" />
        <span className="text-xs leading-none font-bold text-slate-500 uppercase italic">
          {label}
        </span>
      </div>
      <span
        className={`text-[9px] font-black uppercase italic ${emerald ? 'text-emerald-500' : amber ? 'text-amber-500' : 'text-indigo-300'}`}
      >
        {status}
      </span>
    </div>
  )
}

function ComplianceBadge({ label }) {
  return (
    <div className="flex items-center gap-2">
      <ShieldCheck size={12} className="text-emerald-500" />
      <span className="text-[9px] font-black tracking-tighter text-indigo-900/40 uppercase italic">
        {label}
      </span>
    </div>
  )
}

function GraduationCap(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}
