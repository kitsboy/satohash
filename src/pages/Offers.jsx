import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  ShoppingBag,
  Terminal,
  CheckCircle,
  Smartphone,
  Shield,
  Link2,
  Info,
  X,
  Repeat,
  ArrowRight,
  Lock,
  Activity
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { sendPaymentRequest } from '../utils/nwc'
import { toast } from 'sonner'
import { QRCodeSVG } from 'qrcode.react'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl } from '../config/constants'

export default function Bolt12Offers() {
  const { t } = useTranslation()
  usePageMeta({
    page: 'pricing',
    title: t('offersPage.metaTitle'),
    description: t('offersPage.metaDescription')
  })
  const [isPaid, setIsPaid] = useState(false)
  const [nwcUrl, setNwcUrl] = useState('')
  const [isConnectingNwc, setIsConnectingNwc] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [bolt12Offer, setBolt12Offer] = useState('')
  const [invoiceId, setInvoiceId] = useState('')

  const fetchOffer = async () => {
    if (!selectedPlan) {
      toast.error(t('offersPage.toastNeedPlan'))
      return
    }
    try {
      const res = await fetch(`${getApiUrl()}/api/lightning/offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlan.id, amountSats: selectedPlan.price })
      })
      const data = await res.json()
      setBolt12Offer(data.offer)
      setInvoiceId(data.invoiceId)
    } catch (e) {
      toast.error(t('offersPage.toastOfferFail'))
    }
  }

  useEffect(() => {
    let intervalId
    if (invoiceId && !isPaid) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`${getApiUrl()}/api/lightning/status/${invoiceId}`)
          const data = await res.json()
          if (data.status === 'paid') {
            setIsPaid(true)
            setBolt12Offer('')
            clearInterval(intervalId)
            toast.success(t('offersPage.toastPaid'), { icon: <CheckCircle /> })
          }
        } catch (e) {
          console.error('Error fetching lightning status:', e)
          toast.error(t('offersPage.toastStatusFail'), { description: e.message })
        }
      }, 2000)
    }
    return () => clearInterval(intervalId)
  }, [invoiceId, isPaid, t])

  const handleNwcPayment = async () => {
    if (!nwcUrl) {
      toast.error(t('offersPage.toastNeedNwc'))
      return
    }
    setIsPaying(true)
    try {
      toast.info(t('offersPage.toastDemoNwc'), { duration: 4000 })
      await sendPaymentRequest(nwcUrl, 'mock_invoice_for_500k_sats')
      setIsPaid(true)
      toast.success(t('offersPage.toastPayOk'))
    } catch (e) {
      toast.error(t('offersPage.toastPayFail', { message: e.message }))
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <div
      className="min-h-screen pb-20 selection:bg-amber-500/30"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="layout-container">
        {/* Plain-English Explainer */}
        <div className="mb-8 space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xl">⚡</span>
            <h2
              className="text-lg font-black tracking-tight uppercase"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('offersPage.explainerTitle')}
            </h2>
            <span
              className="rounded-full border px-3 py-1 font-mono text-[10px] font-black tracking-[0.18em] uppercase"
              style={{
                borderColor: 'rgba(240,180,41,0.55)',
                background: 'rgba(240,180,41,0.16)',
                color: 'var(--accent-gold)'
              }}
            >
              {t('offersPage.stagedChip')}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('offersPage.explainerP1')}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('offersPage.explainerP2')}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              t('offersPage.tagReusable'),
              t('offersPage.tagNoExpiry'),
              t('offersPage.tagAnyWallet'),
              t('offersPage.tagPayPerStamp')
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-3 py-1 text-[10px] font-bold"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Luminous Header */}
        <div className="mb-24 flex flex-col items-end justify-between gap-12 md:flex-row">
          <div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-amber-500 text-white shadow-2xl shadow-amber-500/20"
            >
              <Zap size={32} className="fill-white" />
            </motion.div>
            <h1
              className="mb-6 text-6xl leading-none font-black tracking-tighter uppercase italic md:text-8xl"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('offersPage.heroTitle')} <br />{' '}
              <span className="text-amber-600">{t('offersPage.heroHighlight')}</span>
            </h1>
            <p
              className="max-w-xl font-sans text-lg leading-relaxed font-bold italic"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('offersPage.heroLede')}
            </p>
          </div>

          <div
            className="glass-card flex max-w-sm items-center gap-6 border-amber-200 p-10 shadow-2xl shadow-amber-500/5"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <div className="absolute inset-0 animate-ping rounded-2xl border-2 border-amber-400 opacity-20" />
              <Repeat size={28} />
            </div>
            <div>
              <h4
                className="text-[10px] font-black uppercase italic"
                style={{ color: 'var(--text-primary)' }}
              >
                {t('offersPage.meshTitle')}
              </h4>
              <p className="text-[10px] leading-none font-bold tracking-widest text-amber-600 uppercase">
                {t('offersPage.meshStatus')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Settlement Console */}
          <div className="space-y-8 lg:col-span-3">
            <div
              className="glass-card relative overflow-hidden p-12 shadow-2xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShoppingBag size={120} />
              </div>

              <h3
                className="mb-12 text-xs font-black tracking-[0.4em] uppercase italic"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t('offersPage.inventoryTitle')}
              </h3>

              <div className="mb-12 space-y-6">
                {[
                  {
                    id: 'pro',
                    title: t('offersPage.planProTitle'),
                    desc: t('offersPage.planProDesc'),
                    price: t('offersPage.planProPrice'),
                    color: 'indigo'
                  },
                  {
                    id: 'ent',
                    title: t('offersPage.planEntTitle'),
                    desc: t('offersPage.planEntDesc'),
                    price: t('offersPage.planEntPrice'),
                    color: 'amber'
                  }
                ].map((plan) => (
                  <motion.button
                    key={plan.id}
                    whileHover={{ x: 6 }}
                    onClick={() => setSelectedPlan(plan)}
                    className={`group flex w-full items-center justify-between rounded-[2.5rem] border-2 p-8 transition-all ${selectedPlan?.id === plan.id ? 'border-amber-500 shadow-xl shadow-amber-500/10' : 'hover:border-amber-200'}`}
                    style={
                      selectedPlan?.id === plan.id
                        ? { background: 'var(--surface-raised)', borderColor: '#f59e0b' }
                        : { background: 'var(--surface-raised)', border: '2px solid var(--border)' }
                    }
                  >
                    <div className="flex items-center gap-6">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${selectedPlan?.id === plan.id ? 'bg-amber-500 text-white' : ''}`}
                        style={
                          selectedPlan?.id !== plan.id
                            ? {
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-secondary)'
                              }
                            : {}
                        }
                      >
                        <Zap
                          size={20}
                          className={selectedPlan?.id === plan.id ? 'fill-white' : ''}
                        />
                      </div>
                      <div className="text-left">
                        <div
                          className="text-sm font-black uppercase italic"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {plan.title}
                        </div>
                        <div
                          className="text-[9px] font-black tracking-widest uppercase italic"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {plan.desc}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-2xl font-black tracking-tighter italic ${selectedPlan?.id === plan.id ? 'text-amber-600' : ''}`}
                      style={selectedPlan?.id !== plan.id ? { color: 'var(--text-secondary)' } : {}}
                    >
                      {plan.price}
                    </div>
                  </motion.button>
                ))}
              </div>

              {!isPaid ? (
                <div className="space-y-6">
                  {bolt12Offer ? (
                    <div
                      className="flex flex-col items-center rounded-[2.5rem] border-2 border-amber-500 p-8 shadow-xl shadow-amber-500/10"
                      style={{ background: 'var(--bg-secondary)' }}
                    >
                      <h4 className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-amber-600 uppercase">
                        <Zap size={14} className="fill-amber-600" /> {t('offersPage.scanTitle')}
                      </h4>
                      <div
                        className="mb-6 rounded-2xl p-4 shadow-sm"
                        style={{
                          background: 'var(--surface-raised)',
                          border: '1px solid var(--border)'
                        }}
                      >
                        <QRCodeSVG
                          value={bolt12Offer}
                          size={220}
                          level="H"
                          includeMargin={true}
                          fgColor="var(--text-primary)"
                          bgColor="transparent"
                        />
                      </div>
                      <div
                        className="w-full rounded-xl p-4 text-center font-mono text-[9px] break-all selection:bg-amber-100 selection:text-amber-900"
                        style={{
                          background: 'var(--surface-raised)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {bolt12Offer}
                      </div>
                      <p className="mt-6 animate-pulse text-[10px] font-bold tracking-widest text-amber-500/60 uppercase italic">
                        {t('offersPage.awaiting')}
                      </p>
                      <button
                        onClick={() => setBolt12Offer('')}
                        className="mt-4 text-[9px] font-black tracking-widest uppercase transition-opacity hover:opacity-80"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {t('offersPage.cancel')}
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsConnectingNwc(true)}
                        className="flex w-full items-center justify-center gap-4 rounded-2xl py-6 text-[11px] font-black tracking-[0.2em] text-white uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                        style={{
                          background: 'var(--accent-active)',
                          border: '1px solid var(--accent-active)'
                        }}
                      >
                        <Lock size={16} className="text-amber-400" />
                        {t('offersPage.syncNwc')}
                      </button>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div
                            className="w-full border-t italic"
                            style={{ borderColor: 'var(--border)' }}
                          ></div>
                        </div>
                        <div
                          className="relative flex justify-center px-8 text-[9px] font-black tracking-[0.5em] uppercase italic"
                          style={{
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {t('offersPage.divider')}
                        </div>
                      </div>
                      <button
                        onClick={fetchOffer}
                        className="group flex w-full items-center justify-center gap-4 rounded-2xl border-2 border-amber-500 py-6 text-[11px] font-black tracking-[0.2em] text-amber-600 uppercase shadow-xl shadow-amber-500/5 transition-all hover:bg-amber-500 hover:text-white"
                        style={{ background: 'var(--bg-secondary)' }}
                      >
                        <Link2 size={16} className="transition-colors group-hover:text-white" />
                        {t('offersPage.fetchOffer')}
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="rounded-[3rem] p-12 text-center shadow-2xl"
                  style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}
                >
                  <CheckCircle size={64} className="mx-auto mb-6 text-emerald-500" />
                  <h3
                    className="mb-2 text-3xl font-black tracking-tighter uppercase italic"
                    style={{ color: 'var(--accent-success)' }}
                  >
                    {t('offersPage.settledTitle')}
                  </h3>
                  <p
                    className="text-[10px] font-black tracking-widest uppercase italic"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {t('offersPage.settledSub')}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Terminal Logs */}
            <div
              className="group relative rounded-[2.5rem] p-10 font-mono text-[10px] text-amber-700 shadow-2xl"
              style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}
            >
              <div className="absolute top-6 right-8 h-2 w-2 animate-pulse rounded-full bg-amber-500" />
              <div className="mb-6 flex items-center gap-3 text-amber-600">
                <Terminal size={16} />
                <span className="font-black tracking-[0.4em] uppercase">
                  {t('offersPage.terminalTitle')}
                </span>
              </div>
              <div className="space-y-2 italic opacity-60">
                <p>{t('offersPage.logAuth')}</p>
                <p>{t('offersPage.logPayment')}</p>
                <p>{t('offersPage.logMesh')}</p>
                {isPaying && (
                  <p className="animate-pulse text-emerald-400">{t('offersPage.logNwc')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Guidelines Sidebar */}
          <div className="space-y-8 lg:col-span-2">
            <div
              className="glass-card relative overflow-hidden p-12 shadow-2xl"
              style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}
            >
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <Shield size={160} />
              </div>
              <h3
                className="mb-10 text-2xl leading-none font-black tracking-tighter uppercase italic"
                style={{ color: 'var(--text-primary)' }}
              >
                {t('offersPage.manifestoTitle')} <br />{' '}
                <span style={{ color: 'var(--accent-active)' }}>
                  {t('offersPage.manifestoHighlight')}
                </span>
              </h3>
              <div className="relative z-10 space-y-10">
                <GuideItem
                  icon={Lock}
                  title={t('offersPage.guideNonCustodialTitle')}
                  desc={t('offersPage.guideNonCustodialDesc')}
                />
                <GuideItem
                  icon={Smartphone}
                  title={t('offersPage.guideNwcTitle')}
                  desc={t('offersPage.guideNwcDesc')}
                />
                <GuideItem
                  icon={Activity}
                  title={t('offersPage.guideAnchorTitle')}
                  desc={t('offersPage.guideAnchorDesc')}
                />
              </div>
            </div>

            <div className="glass-card border-amber-100 bg-amber-50 p-10 italic">
              <p className="mb-6 text-[11px] leading-relaxed font-bold text-amber-900/40 italic">
                {t('offersPage.enterpriseAsk')}
              </p>
              <button className="flex items-center gap-2 text-[10px] font-black tracking-widest text-amber-600 uppercase transition-all hover:gap-4">
                {t('offersPage.enterpriseCta')} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NWC Pairing Modal */}
      <AnimatePresence>
        {isConnectingNwc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05060f]/95 p-6 backdrop-blur-3xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card relative w-full max-w-xl p-12 shadow-[0_0_100px_rgba(245,158,11,0.2)]"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              <button
                onClick={() => setIsConnectingNwc(false)}
                className="absolute top-8 right-8 transition-colors hover:opacity-80"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X size={24} />
              </button>

              <div className="mb-12 text-center">
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] border border-amber-100 bg-amber-50 text-amber-600 shadow-xl shadow-amber-500/10">
                  <Link2 size={40} />
                </div>
                <h2
                  className="text-4xl font-black tracking-tighter uppercase italic"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {t('offersPage.nwcTitle')}
                </h2>
                <p
                  className="mt-3 text-[10px] font-black tracking-[0.4em] uppercase"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {t('offersPage.nwcSub')}
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <label
                    className="mb-4 block text-[10px] font-black tracking-widest uppercase italic"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {t('offersPage.nwcLabel')}
                  </label>
                  <input
                    type="text"
                    value={nwcUrl}
                    onChange={(e) => setNwcUrl(e.target.value)}
                    placeholder={t('offersPage.nwcPlaceholder')}
                    className="w-full rounded-2xl px-6 py-6 font-mono text-sm shadow-inner transition-all focus:outline-none"
                    style={{
                      background: 'var(--surface-raised)',
                      border: '2px solid var(--border)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div className="flex gap-6 rounded-3xl border border-amber-100 bg-amber-50 p-8">
                  <Info size={24} className="shrink-0 text-amber-600" />
                  <p className="text-[11px] leading-relaxed font-bold text-amber-900/60 italic">
                    {t('offersPage.nwcHint')}
                  </p>
                </div>

                <button
                  onClick={handleNwcPayment}
                  className="w-full rounded-2xl bg-amber-500 py-6 text-[12px] font-black tracking-[0.3em] text-white uppercase shadow-2xl shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-95"
                >
                  {t('offersPage.nwcPay')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function GuideItem({ icon: Icon, title, desc }) {
  return (
    <div className="group flex gap-8">
      <div
        className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg transition-all group-hover:bg-amber-500 group-hover:text-white"
        style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--accent-active)' }}
      >
        <Icon size={24} />
      </div>
      <div>
        <h4
          className="mb-2 text-sm font-black tracking-tight uppercase italic transition-colors group-hover:text-white"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h4>
        <p
          className="text-[10px] leading-relaxed font-medium italic"
          style={{ color: 'var(--text-secondary)', opacity: 0.6 }}
        >
          {desc}
        </p>
      </div>
    </div>
  )
}
