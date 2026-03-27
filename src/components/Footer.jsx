import {
  Twitter,
  Heart,
  ExternalLink,
  AtSign,
  Bitcoin,
  ChevronDown,
  ChevronUp,
  Github,
  Disc
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { APP_CONFIG, FOOTER_EXTRA_LINKS } from '@/config/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)

  const bitcoinAddress = 'bc1qhm5ndfjhqxdk3cx0pngyps4f5nnwdckulmge6c8keyf2pk0neqtshjn8ad'

  const copyAddress = () => {
    navigator.clipboard.writeText(bitcoinAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <footer className="relative mt-auto w-full overflow-hidden border-t border-slate-100 bg-slate-50 px-6 pt-24 pb-12">
      {/* Background Ornaments / Luminous Glow */}
      <div className="absolute top-0 left-1/2 h-px w-full max-w-4xl -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-100/30 blur-3xl" />
      <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-rose-100/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand & Socials Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-2 shadow-xl ring-1 shadow-indigo-100/50 ring-slate-100">
                <img
                  src={APP_CONFIG.LOGO}
                  alt="Satohash Logo"
                  width="32"
                  height="32"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                {APP_CONFIG.NAME}
              </span>
            </div>
            <p className="mb-8 text-sm leading-relaxed font-semibold text-slate-500">
              Immutable proof for a digital world. <br />
              Anchoring global trust to the <br />
              Bitcoin blockchain, securely.
            </p>

            <div className="flex flex-col gap-3">
              <h5 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Satellite Channels
              </h5>

              <div className="flex flex-wrap gap-2">
                {/* Twitter */}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://twitter.com/give_bit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
                >
                  <Twitter size={18} />
                </motion.a>

                {/* GitHub */}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://github.com/kitsboy/satohash"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Github size={18} />
                </motion.a>

                {/* Discord */}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Disc size={18} />
                </motion.a>

                {/* Nostr */}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="nostr:kimi@giveabit.io"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
                >
                  <AtSign size={18} />
                </motion.a>
              </div>
            </div>
          </div>

          {/* Core Navigation & Legal — now spans 2 cols */}
          <div className="col-span-1 grid grid-cols-2 gap-12 md:col-span-2 md:pl-8">
            <div>
              <h4 className="mb-6 text-xs font-black tracking-widest text-slate-900 uppercase">
                Protocol
              </h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li>
                  <a
                    href="/#protocol-deep-dive"
                    className="transition-colors hover:text-indigo-600"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <Link to="/verify" className="transition-colors hover:text-indigo-600">
                    Verifier Tool
                  </Link>
                </li>
                <li>
                  <a
                    href="https://opentimestamps.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 transition-colors hover:text-indigo-600"
                  >
                    OpenTimestamps Node <ExternalLink size={12} />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-xs font-black tracking-widest text-slate-900 uppercase">
                Utility
              </h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li>
                  <Link to="/trust" className="transition-colors hover:text-indigo-600">
                    Trust Center
                  </Link>
                </li>
                <li>
                  <Link to="/protocol-stats" className="transition-colors hover:text-indigo-600">
                    Pulse Monitor
                  </Link>
                </li>
                <li>
                  <Link to="/snap-and-stamp" className="transition-colors hover:text-indigo-600">
                    Web Capture
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex h-full flex-col justify-between">
              <div className="mb-8 md:mb-0">
                <h4 className="mb-6 text-xs font-black tracking-widest text-slate-900 uppercase">
                  Legal
                </h4>
                <ul className="space-y-4 text-sm font-bold text-slate-500">
                  <li>
                    <Link to="/legal/privacy" className="transition-colors hover:text-indigo-600">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/legal/terms" className="transition-colors hover:text-indigo-600">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/legal/crypto-notice"
                      className="transition-colors hover:text-indigo-600"
                    >
                      Crypto Notice
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Expandable Interactive Bitcoin Donation Widget (Luminous Light Version) */}
              <div className="z-20 mt-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-indigo-100/20 transition-all">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="group flex w-full cursor-pointer items-center justify-between p-4 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#F7931A]/10 p-2 transition-colors group-hover:bg-[#F7931A]/20">
                      <Bitcoin size={20} className="text-[#F7931A]" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 transition-colors group-hover:text-slate-900">
                      Donate Bitcoin
                    </span>
                  </div>
                  {showQR ? (
                    <ChevronUp size={16} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400" />
                  )}
                </button>

                <AnimatePresence>
                  {showQR && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex flex-col items-center border-t border-slate-100 bg-slate-50/50 p-5 backdrop-blur-sm"
                    >
                      <div className="group/qr relative mb-4 flex items-center justify-center overflow-hidden rounded-2xl bg-white p-3 shadow-2xl ring-4 ring-slate-100">
                        <QRCodeSVG
                          value={`bitcoin:${bitcoinAddress}`}
                          size={160}
                          fgColor="#0f172a"
                          level="H"
                          imageSettings={{
                            src: 'https://raw.githubusercontent.com/spesmilo/bitcoin-logo/master/bitcoin.png',
                            x: undefined,
                            y: undefined,
                            height: 32,
                            width: 32,
                            excavate: true
                          }}
                        />
                      </div>
                      <p
                        onClick={copyAddress}
                        title="Click to copy"
                        className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-center font-mono text-[10px] tracking-wider break-all text-slate-600 select-all transition-colors hover:border-indigo-300 hover:text-indigo-600"
                      >
                        {copied ? '✓ Copied!' : bitcoinAddress}
                      </p>
                      <p className="mt-3 text-center text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Sovereign Sustainability
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* 4th column: More Pages */}
          <div className="col-span-1">
            <h4 className="mb-6 text-xs font-black tracking-widest text-slate-900 uppercase">More</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              {FOOTER_EXTRA_LINKS.map((link) =>
                link.internal ? (
                  <li key={link.path}>
                    <Link to={link.path} className="transition-colors hover:text-indigo-600">
                      {link.name}
                    </Link>
                  </li>
                ) : (
                  <li key={link.path}>
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 transition-colors hover:text-indigo-600"
                    >
                      {link.name} <ExternalLink size={11} />
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-8 text-sm font-bold text-slate-400 md:flex-row">
          <p>
            © {currentYear} {APP_CONFIG.NAME}. Luminous Protocol Edition.
          </p>
          <div className="group flex items-center gap-2">
            Proof of Work with{' '}
            <Heart
              size={16}
              className="cursor-pointer fill-rose-500 text-rose-500 transition-transform group-hover:scale-125"
            />{' '}
            for <span className="text-slate-700">The Decentralized Web</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
