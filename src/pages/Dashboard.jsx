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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-bright)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <Crown className="h-8 w-8" style={{ color: 'var(--accent-gold)' }} />
              <button
                onClick={onClose}
                style={{ color: 'var(--text-secondary)' }}
                className="transition-colors hover:opacity-100"
              >
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
            <h3 className="mb-4 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Upgrade to Pro
            </h3>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Unlock unlimited stamps, priority support, and advanced analytics. Only $9/month.
            </p>
            <div className="space-y-4">
              <button
                onClick={onSubscribe}
                className="w-full rounded-xl px-4 py-3 font-bold transition-opacity hover:opacity-90"
                style={{ background: 'var(--accent-active)', color: '#fff' }}
              >
                <CreditCard className="mr-2 inline h-5 w-5" />
                Subscribe Now
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-xl border px-4 py-3 transition-all hover:opacity-80"
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  background: 'transparent'
                }}
              >
                Maybe Later
              </button>
            </div>
            <p className="mt-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
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
    // Free tier limit: 5 stamps
    if (userTier === 'free' && stampCount >= 5) {
      setShowUpsell(true)
      toast.warning('Free tier limit reached (5 stamps). Upgrade to continue unlimited stamping.')
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
    }
  }

  const handleVoiceStamp = (voiceFile) => {
    handleFileProcessed(voiceFile)
    setShowVoiceStamp(false)
  }

  const handleSubscribe = async () => {
    try {
      const response = await fetch(`${API_URL}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: 'price_1ABC123',
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/dashboard?cancel=true`,
          email: 'user@example.com'
        })
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
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

      <div
        className="relative min-h-screen pb-20"
        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        {/* Ambient background glow */}
        <div
          className="pointer-events-none absolute top-0 left-1/4 h-[600px] w-1/2 blur-[140px]"
          style={{ background: 'var(--accent-active)', opacity: 0.03 }}
        />

        <div className="layout-container relative z-10 max-w-7xl">
          {/* ── Hero Row ── */}
          <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="flex-1">
              {/* Status badges — inline in header so they never collide with fixed nav */}
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
                  style={
                    userTier === 'pro'
                      ? {
                          background: 'rgba(240,180,41,0.15)',
                          color: 'var(--accent-gold)',
                          border: '1px solid rgba(240,180,41,0.3)'
                        }
                      : {
                          background: 'var(--surface-raised)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border)'
                        }
                  }
                >
                  <Crown className="mr-1 h-3 w-3" /> {userTier.toUpperCase()} Tier
                </span>

                {Object.keys(achievements).length > 0 && (
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
                    style={{
                      background: 'rgba(34,211,165,0.1)',
                      color: 'var(--accent-success)',
                      border: '1px solid rgba(34,211,165,0.2)'
                    }}
                  >
                    <Award className="mr-1 h-3 w-3" /> {Object.keys(achievements).length} Badges
                  </span>
                )}

                <button
                  onClick={() => setShowVoiceStamp(!showVoiceStamp)}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-opacity hover:opacity-80"
                  style={{ background: 'var(--accent-active)', color: '#fff' }}
                >
                  <Mic size={13} />
                  {showVoiceStamp ? 'Hide Voice' : 'Voice Stamp'}
                </button>
              </div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl shadow-2xl"
                style={{ background: 'var(--surface-raised)', color: 'var(--accent-active)' }}
              >
                <Network size={24} />
              </motion.div>

              <h1
                className="mb-5 text-5xl leading-none font-black tracking-tighter uppercase italic md:text-7xl"
                style={{ color: 'var(--text-primary)' }}
              >
                Sovereign <br />
                <span style={{ color: 'var(--accent-active)' }}>WORKSPACE.</span>
              </h1>
              <p
                className="max-w-xl text-base leading-relaxed font-medium italic md:text-lg"
                style={{ color: 'var(--text-secondary)' }}
              >
                Universal cryptographic truth layer. Anchor artifacts to Bitcoin, verify forensic
                provenance, and manage your institutional witness mesh.
              </p>
            </div>

            <div className="hidden lg:block">
              <BlockchainPulse />
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-12">
            {/* ── Main Work-Area ── */}
            <div className="space-y-12 lg:col-span-8">
              {/* STAMPING TERMINAL */}
              <div
                className="glass-card group relative overflow-hidden rounded-[3rem] p-1 shadow-2xl md:rounded-[3.5rem]"
                style={{ border: '1px solid var(--border)' }}
              >
                <div
                  className="relative z-10 flex min-h-[300px] flex-col justify-between rounded-[2.7rem] p-6 md:min-h-[320px] md:rounded-[3.2rem] md:p-10"
                  style={{
                    border: '1px solid var(--border)',
                    background: 'var(--bg-secondary)'
                  }}
                >
                  {!file ? (
                    <>
                      <div className="flex flex-1 flex-col items-center justify-center text-center">
                        <motion.div
                          animate={{
                            boxShadow: [
                              '0 0 0px rgba(59,130,246,0)',
                              '0 0 40px rgba(59,130,246,0.12)',
                              '0 0 0px rgba(59,130,246,0)'
                            ]
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] shadow-xl md:mb-10 md:h-24 md:w-24 md:rounded-[2.5rem]"
                          style={{
                            border: '1px solid var(--border)',
                            background: 'var(--surface-raised)',
                            color: 'var(--accent-active)'
                          }}
                        >
                          <FileCheck size={36} />
                        </motion.div>
                        <h3
                          className="mb-3 text-2xl font-black tracking-tighter uppercase italic md:mb-4 md:text-3xl"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          Ingest Protocol.
                        </h3>
                        <p
                          className="mb-8 max-w-sm text-sm leading-relaxed font-bold italic md:mb-10"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Drag any document, image, or forensic evidence to begin the cryptographic
                          anchoring process on the Bitcoin network.
                        </p>

                        {/* Technical Infill HUD */}
                        <div className="mt-2 grid grid-cols-2 gap-6 text-left opacity-0 transition-all delay-100 duration-700 group-hover:opacity-100 md:mt-4 md:gap-8">
                          <div className="space-y-1">
                            <p
                              className="text-[8px] font-black uppercase italic"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              Protocol_v4
                            </p>
                            <p
                              className="text-[10px] font-black uppercase"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              SATOHASH_CORE
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p
                              className="text-[8px] font-black uppercase italic"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              Cipher_Suite
                            </p>
                            <p
                              className="text-[10px] font-black uppercase"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              AES_256_GCM
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p
                              className="text-[8px] font-black uppercase italic"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              Mesh_Latency
                            </p>
                            <p
                              className="text-[10px] font-black uppercase"
                              style={{ color: 'var(--accent-success)' }}
                            >
                              12ms_STABLE
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p
                              className="text-[8px] font-black uppercase italic"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              Audit_Trail
                            </p>
                            <p
                              className="text-[10px] font-black uppercase"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              FULL_FORENSIC
                            </p>
                          </div>
                        </div>

                        {/* Protocol Sync Animation */}
                        <div className="mt-10 flex items-center gap-2 md:mt-12">
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
                              className="w-1 rounded-full"
                              style={{ background: 'var(--accent-active)' }}
                            />
                          ))}
                        </div>
                      </div>
                      <GlobalDropzone onFileProcessed={handleFileProcessed} />
                    </>
                  ) : (
                    <div className="flex flex-1 flex-col">
                      <div className="mb-10 flex items-center justify-between md:mb-12">
                        <span
                          className={`rounded-xl border px-4 py-2 text-[10px] font-black tracking-widest uppercase ${file.status === 'confirmed' ? '' : 'animate-pulse'}`}
                          style={
                            file.status === 'confirmed'
                              ? {
                                  border: '1px solid rgba(34,211,165,0.2)',
                                  background: 'rgba(34,211,165,0.08)',
                                  color: 'var(--accent-success)'
                                }
                              : {
                                  border: '1px solid rgba(240,180,41,0.2)',
                                  background: 'rgba(240,180,41,0.08)',
                                  color: 'var(--accent-gold)'
                                }
                          }
                        >
                          {file.status === 'confirmed'
                            ? 'BITCOIN_FINALITY_CONFIRMED'
                            : 'MESH_PROPAGATION_PENDING'}
                        </span>
                        <button
                          onClick={() => setFile(null)}
                          className="text-[10px] font-black tracking-widest uppercase italic underline decoration-2 underline-offset-4 transition-colors"
                          style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = 'var(--text-primary)')
                          }
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                        >
                          Reset Workbench
                        </button>
                      </div>

                      <div className="mb-10 flex items-start gap-6 md:mb-12 md:gap-8">
                        <div
                          className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[1.5rem] shadow-xl md:h-20 md:w-20 md:rounded-[1.8rem]"
                          style={{
                            border: '1px solid var(--border)',
                            background: 'var(--surface-raised)',
                            color: 'var(--accent-active)'
                          }}
                        >
                          <FileCheck size={28} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h2
                            className="mb-2 truncate text-2xl font-black tracking-tighter uppercase italic md:text-3xl"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {file.name}
                          </h2>
                          <div className="flex items-center gap-3">
                            <HashIcon size={12} style={{ color: 'var(--text-muted)' }} />
                            <code
                              className="truncate font-mono text-[10px] font-black"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {file.hash}
                            </code>
                          </div>
                        </div>
                      </div>

                      <div
                        className="group relative mb-10 cursor-pointer overflow-hidden rounded-[2rem] p-6 transition-all hover:border-[var(--border-bright)] md:mb-12 md:p-8"
                        style={{
                          border: '1px solid var(--border)',
                          background: 'var(--bg-primary)'
                        }}
                      >
                        <Merkle3D hash={file.hash} />
                      </div>

                      <div className="mt-auto grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
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
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Terminal size={20} style={{ color: 'var(--accent-active)' }} />
                    <h3
                      className="text-xl font-black tracking-tighter uppercase italic md:text-2xl"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Protocol <span style={{ color: 'var(--accent-active)' }}>HISTORY.</span>
                    </h3>
                  </div>
                  <Link
                    to="/trust"
                    className="text-[10px] font-black tracking-widest uppercase italic transition-opacity hover:opacity-70"
                    style={{ color: 'var(--accent-active)' }}
                  >
                    Full System Audit
                  </Link>
                </div>
                <HistoryList />
              </div>
            </div>

            {/* ── Sidebar Command Panel ── */}
            <div className="space-y-6 lg:col-span-4 lg:space-y-8">
              {/* Command Console Card */}
              <div
                className="glass-card group relative overflow-hidden p-8 shadow-2xl md:p-10"
                style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}
              >
                <div
                  className="pointer-events-none absolute top-0 right-0 p-10 opacity-5 transition-transform duration-1000 group-hover:scale-110"
                  style={{ color: 'var(--accent-active)' }}
                >
                  <ShieldCheck size={160} />
                </div>
                <h3
                  className="relative z-10 mb-6 text-2xl leading-none font-black tracking-tighter uppercase italic md:mb-8"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Command <br />
                  <span style={{ color: 'var(--text-secondary)' }}>CONSOLE.</span>
                </h3>
                <div className="relative z-10 space-y-3 md:space-y-4">
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
              <div
                className="glass-card p-8 shadow-2xl md:p-10"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <h4
                  className="mb-6 text-[10px] font-black tracking-[0.4em] uppercase italic md:mb-8"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Mesh_Telemetry
                </h4>
                <div className="space-y-5 md:space-y-6">
                  <TeleItem icon={Globe} label="Global Mirroring" status="NOMINAL_014" emerald />
                  <TeleItem icon={Zap} label="L2 Settlement" status="BOLT-12_ACTIVE" amber />
                  <TeleItem icon={Box} label="Genesis Block" status="#845922" />
                  <TeleItem icon={Lock} label="Privacy Shield" status="ZK_HARDENED" emerald />
                </div>
              </div>

              {/* Education Card */}
              <div
                className="group relative overflow-hidden rounded-[2rem] p-8 italic transition-all md:rounded-[2.5rem] md:p-10"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--bg-secondary)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div
                  className="pointer-events-none absolute top-0 right-0 p-8 opacity-5"
                  style={{ color: 'var(--accent-active)' }}
                >
                  <GraduationCap size={80} />
                </div>
                <h4
                  className="mb-3 text-sm font-black uppercase italic"
                  style={{ color: 'var(--text-primary)' }}
                >
                  The Giving Machine.
                </h4>
                <p
                  className="mb-6 text-[11px] leading-relaxed font-bold italic md:mb-8"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Every anchor you generate funds global truth preservation. Learn about the
                  Satohash non-profit mission.
                </p>
                <Link
                  to="/about"
                  className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase italic transition-all group-hover:gap-4"
                  style={{ color: 'var(--accent-active)' }}
                >
                  Read Whitepaper <ChevronRight size={14} />
                </Link>
              </div>

              {/* Compliance Badges */}
              <div
                className="flex flex-wrap justify-center gap-4 rounded-3xl p-6 md:gap-6 md:p-8"
                style={{
                  border: '1px solid rgba(34,211,165,0.15)',
                  background: 'rgba(34,211,165,0.04)'
                }}
              >
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

function HashIcon(props) {
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
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    borderRadius: '1rem',
    padding: '1rem 1.25rem',
    fontSize: '10px',
    fontWeight: 900,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    transition: 'all 0.15s',
    width: '100%',
    cursor: 'pointer',
    border: 'none'
  }

  const variantStyle = amber
    ? {
        background: 'rgba(240,180,41,0.1)',
        color: 'var(--accent-gold)',
        border: '1px solid rgba(240,180,41,0.2)'
      }
    : secondary
      ? {
          background: 'var(--surface-raised)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border)'
        }
      : {
          background: 'var(--accent-active)',
          color: '#fff'
        }

  return (
    <button onClick={onClick} style={{ ...baseStyle, ...variantStyle }}>
      <Icon size={16} /> {label}
    </button>
  )
}

function SideBtn({ icon: Icon, label, amber }) {
  return (
    <div
      className="group flex cursor-pointer items-center justify-between rounded-2xl p-5 transition-all"
      style={
        amber
          ? { background: 'var(--accent-gold)', color: '#0f172a' }
          : {
              background: 'var(--bg-primary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)'
            }
      }
      onMouseEnter={(e) => {
        if (!amber) {
          e.currentTarget.style.borderColor = 'var(--border-bright)'
          e.currentTarget.style.color = 'var(--text-primary)'
        }
      }}
      onMouseLeave={(e) => {
        if (!amber) {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.color = 'var(--text-secondary)'
        }
      }}
    >
      <div className="flex items-center gap-4">
        <Icon size={18} />
        <span className="text-[10px] font-black tracking-widest uppercase">{label}</span>
      </div>
      <ChevronRight size={14} />
    </div>
  )
}

function TeleItem({ icon: Icon, label, status, emerald, amber }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Icon size={15} style={{ color: 'var(--text-muted)' }} />
        <span
          className="text-xs leading-none font-bold uppercase italic"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </span>
      </div>
      <span
        className="text-[9px] font-black uppercase italic"
        style={{
          color: emerald
            ? 'var(--accent-success)'
            : amber
              ? 'var(--accent-gold)'
              : 'var(--text-muted)'
        }}
      >
        {status}
      </span>
    </div>
  )
}

function ComplianceBadge({ label }) {
  return (
    <div className="flex items-center gap-2">
      <ShieldCheck size={12} style={{ color: 'var(--accent-success)' }} />
      <span
        className="text-[9px] font-black tracking-tighter uppercase italic"
        style={{ color: 'var(--text-secondary)' }}
      >
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
