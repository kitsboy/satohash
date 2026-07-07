import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { clientId } from '../utils/id'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Tablet,
  Smartphone,
  CheckCircle,
  Shield,
  QrCode,
  Fingerprint,
  Lock,
  Bell,
  ChevronRight,
  Activity
} from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'

export default function MobileSigner() {
  usePageMeta({ page: 'mobileSigner' })
  const [isPaired, setIsPaired] = useState(
    () => localStorage.getItem('satohash_mobile_paired') === 'true'
  )
  const [pendingRequests, setPendingRequests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('satohash_mobile_pending') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (!pendingRequests.length) {
      setPendingRequests([
        {
          id: 'sig-8492',
          type: 'MULTI-SIG',
          doc: 'Institutional_Asset_Registry.pdf',
          time: '2m ago',
          demo: true
        }
      ])
    }
  }, [])

  const handlePair = () => {
    const deviceId = clientId('device')
    localStorage.setItem('satohash_mobile_paired', 'true')
    localStorage.setItem('satohash_mobile_device_id', deviceId)
    setIsPaired(true)
    toast.success('Demo device paired', {
      description: 'Pairing saved locally until Mobile Signer Pro ships.'
    })
  }

  return (
    <div
      className="min-h-screen px-6 py-24 pb-20 font-sans"
      style={{ color: 'var(--text-primary)' }}
    >
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Column: Vision & Identity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div
              className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: 'rgba(59,130,246,0.1)',
                color: 'var(--accent-active)',
                boxShadow: '0 0 0 1px rgba(59,130,246,0.2)'
              }}
            >
              <Fingerprint size={28} />
            </div>
            <h1
              className="mb-6 text-6xl font-black tracking-tighter uppercase italic md:text-7xl"
              style={{ color: 'var(--text-primary)' }}
            >
              BIOMETRIC <br />
              <span style={{ color: 'var(--accent-active)' }}>SIGNER.</span>
            </h1>
            <p
              className="mb-8 text-lg leading-relaxed font-medium italic"
              style={{ color: 'var(--text-secondary)' }}
            >
              Authorize protocol actions using your mobile device&apos;s Secure Enclave. The
              Satohash Signer app turns your phone into a high-security hardware security module
              (HSM).
            </p>

            <div className="flex flex-col gap-4">
              {[
                {
                  icon: Shield,
                  label: 'Zero-Knowledge Pairing',
                  desc: 'Secure Handshake via WebRTC'
                },
                {
                  icon: Lock,
                  label: 'Hardware-Level Security',
                  desc: 'Protected by Apple/Android Secure Core'
                },
                { icon: Activity, label: 'Real-time Authority', desc: 'Instant push-notarization' }
              ].map((item, i) => (
                <div key={i} className="group flex items-start gap-4">
                  <div
                    className="mt-1 flex h-5 w-5 items-center justify-center rounded-full transition-colors"
                    style={{ backgroundColor: 'var(--surface-raised)' }}
                  >
                    <item.icon size={12} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <h4
                      className="text-[10px] font-black tracking-widest uppercase"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {item.label}
                    </h4>
                    <p
                      className="text-[10px] font-bold uppercase italic"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Interaction Area */}
          <div className="flex items-center justify-center">
            {!isPaired ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] p-10 shadow-2xl"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border)'
                }}
              >
                <div className="absolute top-0 right-0 p-6">
                  <div
                    className="h-2 w-2 animate-pulse rounded-full"
                    style={{
                      backgroundColor: 'var(--accent-pending)',
                      boxShadow: '0 0 12px var(--accent-pending)'
                    }}
                  />
                </div>

                <div className="mb-10 flex flex-col items-center">
                  <div
                    className="mb-10 rounded-3xl p-6"
                    style={{ backgroundColor: 'var(--surface-raised)' }}
                  >
                    {/* High-end Simulated QR */}
                    <div
                      className="flex h-48 w-48 flex-wrap items-center justify-center gap-[1px] rounded-xl p-2"
                      style={{ backgroundColor: 'var(--bg-primary)' }}
                    >
                      {Array(400)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="h-[8px] w-[8px] rounded-[1px]"
                            style={{
                              backgroundColor: [0, 1, 2, 19, 20, 21].some((x) => i % 20 === x)
                                ? 'var(--accent-active)'
                                : (i * 7 + 13) % 10 > 6
                                  ? 'var(--border-bright)'
                                  : 'transparent'
                            }}
                          />
                        ))}
                    </div>
                  </div>
                  <p
                    className="text-center text-[10px] font-black tracking-[0.3em] uppercase"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Scan with Satohash Signer App
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-center text-[10px] font-bold tracking-widest text-amber-500 uppercase">
                    Demo pairing — production app in development
                  </p>
                  <button
                    type="button"
                    onClick={handlePair}
                    className="btn-holographic w-full py-5 text-[10px]"
                  >
                    Simulate Device Pairing
                  </button>
                  <div className="flex gap-3">
                    <div
                      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl p-3 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                      style={{
                        backgroundColor: 'var(--surface-raised)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <Smartphone size={14} style={{ color: 'var(--text-secondary)' }} />
                      <span
                        className="text-[8px] font-black uppercase"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        App Store
                      </span>
                    </div>
                    <div
                      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl p-3 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                      style={{
                        backgroundColor: 'var(--surface-raised)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <Tablet size={14} style={{ color: 'var(--text-secondary)' }} />
                      <span
                        className="text-[8px] font-black uppercase"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Play Store
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md space-y-6"
              >
                {/* Device Status Card */}
                <div
                  className="glass-card p-10"
                  style={{
                    backgroundColor: 'rgba(34,211,165,0.05)',
                    borderColor: 'rgba(34,211,165,0.3)'
                  }}
                >
                  <div className="mb-8 flex items-center justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{
                        backgroundColor: 'rgba(34,211,165,0.1)',
                        color: 'var(--accent-success)'
                      }}
                    >
                      <CheckCircle size={24} />
                    </div>
                    <span className="pill-emerald text-[9px]">ENCRYPTED CONTEXT</span>
                  </div>
                  <h3
                    className="text-xl font-black tracking-tighter uppercase italic"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Device Synchronized
                  </h3>
                  <p
                    className="mt-1 text-[9px] font-bold tracking-widest uppercase"
                    style={{ color: 'var(--accent-success)' }}
                  >
                    iPhone 16 Pro · Authorizing Node-01
                  </p>
                </div>

                {/* Pending Authorization Tasks */}
                <div
                  className="glass-card overflow-hidden p-0"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div
                    className="flex items-center justify-between border-b p-6"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--surface-raised)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Bell size={14} style={{ color: 'var(--accent-pending)' }} />
                      <h4
                        className="text-[10px] font-black uppercase"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Awaiting Signature
                      </h4>
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {pendingRequests.length} Tasks
                    </span>
                  </div>
                  <div style={{ borderColor: 'var(--border)' }}>
                    <AnimatePresence>
                      {pendingRequests.map((req) => (
                        <motion.div
                          key={req.id}
                          exit={{ height: 0, opacity: 0 }}
                          className="group flex cursor-pointer items-center justify-between p-6 transition-colors"
                          style={{ borderTop: '1px solid var(--border)' }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = 'var(--surface-raised)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = 'transparent')
                          }
                        >
                          <div className="overflow-hidden">
                            <p
                              className="mb-1 text-[8px] font-black uppercase"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {req.type} REQUEST
                            </p>
                            <p
                              className="max-w-[180px] truncate text-xs font-bold"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {req.doc}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className="text-[9px] font-bold uppercase italic"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {req.time}
                            </span>
                            <div
                              className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
                              style={{
                                backgroundColor: 'var(--surface-raised)',
                                color: 'var(--text-secondary)'
                              }}
                            >
                              <ChevronRight size={14} />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <button
                  onClick={() => setIsPaired(false)}
                  className="w-full py-4 text-[9px] font-black tracking-[0.4em] uppercase transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-active)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  Revoke Device Access
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
