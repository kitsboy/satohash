import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Copy, Check, RefreshCw, ExternalLink, AlertTriangle } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'
import { clientId } from '../../utils/id'

function generateOffer(amount) {
  const id = clientId('SH').split('-').pop().toUpperCase()
  return `lno1qgsqvgnwgcg35z6ee2h3yczraddm72xrfua9uve2rlrvmr02n06s3qx_SH_${id}_${amount || 0}`
}

const STATUS_COLOR = {
  pending: 'var(--accent-pending,#f59e0b)',
  paid: 'var(--accent-success)',
  expired: '#ef4444',
  generating: 'var(--accent-active)'
}
const STATUS_LABEL = {
  pending: 'Awaiting Payment',
  paid: '⚡ Settled',
  expired: 'Expired',
  generating: 'Generating…'
}

function ExpiryRing({ total, remaining }) {
  const r = 20,
    circ = 2 * Math.PI * r,
    dash = (remaining / total) * circ
  return (
    <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="28" cy="28" r={r} fill="none" stroke="var(--border)" strokeWidth="3" />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        stroke={remaining < 60 ? '#ef4444' : 'var(--accent-active)'}
        strokeWidth="3"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s linear' }}
      />
      <text
        x="28"
        y="28"
        dominantBaseline="central"
        textAnchor="middle"
        fill="var(--text-primary)"
        fontSize="9"
        fontWeight="800"
        style={{ transform: 'rotate(90deg)', transformOrigin: '28px 28px' }}
      >
        {remaining}s
      </text>
    </svg>
  )
}

export default function Bolt12InvoiceDrawer({
  isOpen,
  onClose,
  amount,
  memo = 'Satohash Payment',
  onPaid
}) {
  const [status, setStatus] = useState('generating')
  const [offer, setOffer] = useState(null)
  const [copied, setCopied] = useState(false)
  const [remaining, setRemaining] = useState(600)
  const TOTAL = 600
  const timer = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      clearInterval(timer.current)
      setStatus('generating')
      setOffer(null)
      setRemaining(TOTAL)
      return
    }
    const t = setTimeout(() => {
      setOffer(generateOffer(amount))
      setStatus('pending')
    }, 500)
    return () => clearTimeout(t)
  }, [isOpen, amount])

  useEffect(() => {
    if (status !== 'pending') return
    timer.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(timer.current)
          setStatus('expired')
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(timer.current)
  }, [status])

  const copy = () => {
    if (!offer) return
    navigator.clipboard.writeText(offer)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('BOLT-12 offer copied!')
  }
  const refresh = () => {
    setStatus('generating')
    setRemaining(TOTAL)
    setTimeout(() => {
      setOffer(generateOffer(amount))
      setStatus('pending')
    }, 400)
  }
  const simPay = () => {
    clearInterval(timer.current)
    setStatus('paid')
    toast.success('⚡ Payment received!', { description: `${amount ?? '?'} sats settled` })
    onPaid?.({ offer, amount, settledAt: new Date().toISOString() })
  }

  const mins = Math.floor(remaining / 60),
    secs = remaining % 60

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="bolt-bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2300] bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            key="bolt-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 z-[2400] flex w-full max-w-md flex-col border-l shadow-2xl"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-bright)' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between border-b p-5"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(255,183,0,0.15)', color: '#fbbf24' }}
                >
                  <Zap size={18} />
                </div>
                <div>
                  <h2 className="text-[14px] font-black" style={{ color: 'var(--text-primary)' }}>
                    Lightning Payment
                  </h2>
                  <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                    BOLT-12 Offer
                  </p>
                </div>
              </div>
              <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-1 flex-col items-center gap-5 overflow-y-auto p-6">
              {/* Status */}
              <div
                className="flex items-center gap-2 rounded-full px-4 py-2"
                style={{
                  background: `${STATUS_COLOR[status]}18`,
                  border: `1px solid ${STATUS_COLOR[status]}40`
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: STATUS_COLOR[status],
                    boxShadow: `0 0 8px ${STATUS_COLOR[status]}`,
                    animation: status === 'pending' ? 'pulse 2s infinite' : 'none'
                  }}
                />
                <span
                  className="text-[11px] font-black tracking-widest uppercase"
                  style={{ color: STATUS_COLOR[status] }}
                >
                  {STATUS_LABEL[status]}
                </span>
              </div>

              {/* Amount */}
              {amount && (
                <div className="text-center">
                  <p
                    className="text-5xl font-black tabular-nums"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {amount.toLocaleString()}
                  </p>
                  <p
                    className="mt-1 text-[11px] font-bold tracking-widest uppercase"
                    style={{ color: '#fbbf24' }}
                  >
                    Satoshis ⚡
                  </p>
                </div>
              )}

              {/* QR */}
              <AnimatePresence mode="wait">
                {status === 'generating' && (
                  <motion.div
                    key="gen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-56 w-56 items-center justify-center rounded-3xl"
                    style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: '#fbbf24' }}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                {status === 'pending' && offer && (
                  <motion.div
                    key="qr"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="rounded-3xl bg-white p-4 shadow-xl"
                  >
                    <QRCodeSVG value={offer} size={200} level="H" />
                  </motion.div>
                )}
                {status === 'paid' && (
                  <motion.div
                    key="paid"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex h-56 w-56 flex-col items-center justify-center gap-4 rounded-3xl"
                    style={{
                      background: 'rgba(34,197,94,0.1)',
                      border: '2px solid rgba(34,197,94,0.3)'
                    }}
                  >
                    <div className="text-6xl">⚡</div>
                    <p
                      className="text-[12px] font-black tracking-widest uppercase"
                      style={{ color: 'var(--accent-success)' }}
                    >
                      Payment Received
                    </p>
                  </motion.div>
                )}
                {status === 'expired' && (
                  <motion.div
                    key="exp"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-56 w-56 flex-col items-center justify-center gap-4 rounded-3xl"
                    style={{
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.25)'
                    }}
                  >
                    <AlertTriangle size={40} style={{ color: '#ef4444' }} />
                    <p className="text-[11px] font-black" style={{ color: '#ef4444' }}>
                      Invoice Expired
                    </p>
                    <button
                      onClick={refresh}
                      className="flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase"
                      style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
                    >
                      <RefreshCw size={12} /> Regenerate
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Countdown */}
              {status === 'pending' && (
                <div className="flex items-center gap-4">
                  <ExpiryRing total={TOTAL} remaining={remaining} />
                  <div>
                    <p className="text-[10px] font-bold" style={{ color: 'var(--text-secondary)' }}>
                      Expires in
                    </p>
                    <p
                      className="font-mono text-lg font-black"
                      style={{ color: remaining < 60 ? '#ef4444' : 'var(--text-primary)' }}
                    >
                      {mins}:{String(secs).padStart(2, '0')}
                    </p>
                  </div>
                </div>
              )}

              {/* Memo */}
              <div
                className="w-full rounded-xl px-4 py-3"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
              >
                <p
                  className="mb-1 text-[9px] font-black tracking-widest uppercase"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Payment Memo
                </p>
                <p className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>
                  {memo}
                </p>
              </div>

              {/* Offer string */}
              {offer && status === 'pending' && (
                <div className="w-full space-y-2">
                  <p
                    className="text-[9px] font-black tracking-widest uppercase"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    BOLT-12 Offer
                  </p>
                  <div
                    className="flex items-start gap-2 rounded-xl p-3"
                    style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                  >
                    <code
                      className="flex-1 font-mono text-[9px] leading-relaxed break-all"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {offer.substring(0, 80)}...
                    </code>
                    <button
                      onClick={copy}
                      style={{ color: 'var(--text-secondary)', flexShrink: 0, marginTop: '1px' }}
                    >
                      {copied ? (
                        <Check size={14} style={{ color: 'var(--accent-success)' }} />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* BOLT-12 info */}
              <div
                className="w-full rounded-xl p-4"
                style={{
                  background: 'rgba(251,191,36,0.08)',
                  border: '1px solid rgba(251,191,36,0.2)'
                }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Zap size={13} style={{ color: '#fbbf24' }} />
                  <p className="text-[10px] font-black" style={{ color: '#fbbf24' }}>
                    About BOLT-12
                  </p>
                </div>
                <p
                  className="text-[10px] leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Reusable, privacy-preserving Lightning payment requests that support recurring
                  payments without revealing your node identity.
                </p>
                <a
                  href="https://bolt12.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center gap-1 text-[10px] font-bold"
                  style={{ color: '#fbbf24' }}
                >
                  Learn more <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex gap-3 border-t p-4"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
            >
              {status === 'pending' && (
                <>
                  <button
                    onClick={copy}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-[11px] font-black uppercase transition-all"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy Offer'}
                  </button>
                  <button
                    onClick={simPay}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[11px] font-black text-white uppercase transition-all hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}
                  >
                    <Zap size={14} /> Simulate Pay
                  </button>
                </>
              )}
              {status === 'paid' && (
                <button
                  onClick={onClose}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[11px] font-black text-white uppercase"
                  style={{ background: 'var(--accent-success)' }}
                >
                  <Check size={14} />
                  Continue
                </button>
              )}
              {(status === 'expired' || status === 'generating') && (
                <button
                  onClick={refresh}
                  disabled={status === 'generating'}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-[11px] font-black uppercase transition-all disabled:opacity-50"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  <RefreshCw size={14} />
                  New Invoice
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
