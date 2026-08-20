import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Zap, Copy, Check, ExternalLink, Shield, Lock, ArrowLeft } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'
import Footer from '../components/layout/Footer'

const LNURL = 'https://api.satohash.io:8443/.well-known/lnurlp/satohash'
const LUD16 = 'satohash@api.satohash.io:8443'
const ONCHAIN = 'bc1qkrlg6ssme0ztgynr2us846mtlde0r33ly7kdmc'
const EXPLORER = `https://mempool.space/address/${ONCHAIN}`

function CopyField({ label, value, mono = true }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-3">
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
          {label}
        </div>
        <div className={`truncate text-sm ${mono ? 'font-mono' : ''}`}>{value}</div>
      </div>
      <button
        type="button"
        onClick={copy}
        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs font-semibold transition-colors hover:border-[var(--accent-gold)]"
      >
        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}

export default function Donate() {
  usePageMeta({ page: 'donate' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] pb-24">
      <div className="mx-auto max-w-4xl space-y-8 p-4 pt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-gold)]"
        >
          <ArrowLeft size={15} /> Back to Satohash
        </Link>

        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold sm:text-5xl"
          >
            Support <span className="text-[var(--accent-gold)]">Satohash</span>
          </motion.h1>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--text-secondary)]">
            Satohash keeps document proof free and anchored to Bitcoin. If Satohash helps you, a
            small tip keeps the calendars, the node, and the API running. Every sat goes straight to
            the Satohash Wallet — never a middleman.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Lightning card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400">
                <Zap size={13} /> Lightning
              </span>
              <span className="text-xs text-[var(--text-muted)]">instant · near-zero fee</span>
            </div>
            <div className="mb-4 flex justify-center">
              <div className="rounded-xl border border-[var(--border)] bg-white p-3">
                <QRCodeSVG value={LNURL} size={168} level="M" />
              </div>
            </div>
            <CopyField label="Lightning address" value={LUD16} />
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">
              Scan the QR with any Lightning wallet (Phoenix, Wallet of Satoshi, Alby, Zeus…), or
              send to the address above. Min 1,000 sats (~$0.60). Lightning is like a text message
              for money — it arrives in seconds and costs fractions of a cent.
            </p>
          </motion.div>

          {/* On-chain card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/15 px-3 py-1 text-xs font-bold text-orange-400">
                ₿ Bitcoin
              </span>
              <span className="text-xs text-[var(--text-muted)]">on-chain · ~10 min confirm</span>
            </div>
            <CopyField label="Bitcoin address" value={ONCHAIN} />
            <div className="mt-3">
              <a
                href={EXPLORER}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[var(--accent-gold)] hover:underline"
              >
                View on mempool.space <ExternalLink size={12} />
              </a>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">
              On-chain works for any amount. It&apos;s a native SegWit address on the Satohash LND
              wallet — backed by an offline seed backup, so funds are recoverable even if the server
              ever failed. Confirmations take ~10 minutes.
            </p>
          </motion.div>
        </div>

        {/* Transparency */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5"
        >
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Shield size={18} className="text-[var(--accent-gold)]" /> Where your sats go
          </h2>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li className="flex items-start gap-2">
              <Lock size={14} className="mt-0.5 shrink-0 text-[var(--accent-gold)]" />
              <span>
                <strong className="text-[var(--text-primary)]">Stamps stay free.</strong> Your tips
                fund the free public stamping tier — they don&apos;t paywall it.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Lock size={14} className="mt-0.5 shrink-0 text-[var(--accent-gold)]" />
              <span>
                <strong className="text-[var(--text-primary)]">Infrastructure.</strong> The
                OpenTimestamps calendars, THOR node, and API that keep proofs verifiable forever.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Lock size={14} className="mt-0.5 shrink-0 text-[var(--accent-gold)]" />
              <span>
                <strong className="text-[var(--text-primary)]">No middleman.</strong> Sats land
                directly in the Satohash Wallet on LNbits — fully transparent, no platform cut.
              </span>
            </li>
          </ul>
        </motion.div>

        <div className="text-center text-xs text-[var(--text-muted)]">
          Prefer to contribute code instead?{' '}
          <Link to="/contribute" className="text-[var(--accent-gold)] hover:underline">
            See the contribute page
          </Link>
          .
        </div>
      </div>
      <Footer />
    </div>
  )
}
