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
import { useTranslation } from 'react-i18next'
import usePageMeta from '../hooks/usePageMeta'

export default function MobileSigner() {
  const { t } = useTranslation()
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
    toast.success(t('mobileSignerPage.toastTitle'), {
      description: t('mobileSignerPage.toastBody')
    })
  }

  const handleUnpair = () => {
    localStorage.removeItem('satohash_mobile_paired')
    localStorage.removeItem('satohash_mobile_device_id')
    setIsPaired(false)
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
            <div
              className="mb-6 inline-flex w-fit items-center rounded-full border px-3 py-1"
              style={{
                borderColor: 'rgba(240,180,41,0.55)',
                background: 'rgba(240,180,41,0.16)',
                color: 'var(--accent-gold)'
              }}
            >
              <span className="font-mono text-[10px] font-black tracking-[0.18em] uppercase">
                {t('mobileSignerPage.demoChip')}
              </span>
            </div>
            <h1
              className="mb-6 text-6xl font-black tracking-tighter uppercase italic md:text-7xl"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('mobileSignerPage.title')} <br />
              <span style={{ color: 'var(--accent-active)' }}>
                {t('mobileSignerPage.titleHighlight')}
              </span>
            </h1>
            <p
              className="mb-8 text-lg leading-relaxed font-medium italic"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('mobileSignerPage.lede')}
            </p>

            <div className="flex flex-col gap-4">
              {[
                {
                  icon: Shield,
                  label: t('mobileSignerPage.featPairLabel'),
                  desc: t('mobileSignerPage.featPairDesc')
                },
                {
                  icon: Lock,
                  label: t('mobileSignerPage.featStoreLabel'),
                  desc: t('mobileSignerPage.featStoreDesc')
                },
                {
                  icon: Activity,
                  label: t('mobileSignerPage.featPushLabel'),
                  desc: t('mobileSignerPage.featPushDesc')
                }
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
                    {t('mobileSignerPage.scanHint')}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-center text-[10px] font-bold tracking-widest text-amber-500 uppercase">
                    {t('mobileSignerPage.demoNote')}
                  </p>
                  <button
                    type="button"
                    onClick={handlePair}
                    className="btn-holographic w-full py-5 text-[10px]"
                  >
                    {t('mobileSignerPage.simulate')}
                  </button>
                  <div className="flex gap-3">
                    <div
                      className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl p-3 opacity-60 grayscale"
                      style={{
                        backgroundColor: 'var(--surface-raised)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Smartphone size={14} style={{ color: 'var(--text-secondary)' }} />
                        <span
                          className="text-[8px] font-black uppercase"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {t('mobileSignerPage.storeIos')}
                        </span>
                      </div>
                      <span
                        className="text-[7px] font-bold tracking-widest uppercase"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {t('mobileSignerPage.notShipped')}
                      </span>
                    </div>
                    <div
                      className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl p-3 opacity-60 grayscale"
                      style={{
                        backgroundColor: 'var(--surface-raised)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Tablet size={14} style={{ color: 'var(--text-secondary)' }} />
                        <span
                          className="text-[8px] font-black uppercase"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {t('mobileSignerPage.storeAndroid')}
                        </span>
                      </div>
                      <span
                        className="text-[7px] font-bold tracking-widest uppercase"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {t('mobileSignerPage.notShipped')}
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
                    <span className="pill-emerald text-[9px]">
                      {t('mobileSignerPage.pairedBadge')}
                    </span>
                  </div>
                  <h3
                    className="text-xl font-black tracking-tighter uppercase italic"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {t('mobileSignerPage.pairedTitle')}
                  </h3>
                  <p
                    className="mt-1 text-[9px] font-bold tracking-widest uppercase"
                    style={{ color: 'var(--accent-success)' }}
                  >
                    {t('mobileSignerPage.pairedSub')}
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
                        {t('mobileSignerPage.awaiting')}
                      </h4>
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {t('mobileSignerPage.tasks', { count: pendingRequests.length })}
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
                              {req.demo ? t('mobileSignerPage.sampleType') : req.type}{' '}
                              {t('mobileSignerPage.requestSuffix')}
                            </p>
                            <p
                              className="max-w-[180px] truncate text-xs font-bold"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {req.demo ? t('mobileSignerPage.sampleDoc') : req.doc}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className="text-[9px] font-bold uppercase italic"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {req.demo ? t('mobileSignerPage.sampleTime') : req.time}
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
                  type="button"
                  onClick={handleUnpair}
                  className="w-full py-4 text-[9px] font-black tracking-[0.4em] uppercase transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-active)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {t('mobileSignerPage.revoke')}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
