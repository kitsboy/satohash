import { Twitter, Heart, ExternalLink, AtSign, Bitcoin, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [showQR, setShowQR] = useState(false)

  // Demo standard bitcoin address generated for display purposes
  const bitcoinAddress = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'

  return (
    <footer className="relative mt-auto w-full overflow-hidden border-t border-slate-800 bg-slate-900 px-6 pt-24 pb-12">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 h-px w-full max-w-4xl -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand & Socials Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-2 shadow-lg shadow-indigo-900/50">
                <img
                  src="/logo.png"
                  alt="Satohash Logo"
                  width="32"
                  height="32"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">Satohash</span>
            </div>
            <p className="mb-8 text-sm leading-relaxed font-medium text-slate-400">
              Immutable cryptographic proof for a digital world. Anchoring global trust to the
              Bitcoin blockchain safely.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <h5 className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  Connect
                </h5>

                {/* Twitter */}
                <a
                  href="https://twitter.com/give_bit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/80 p-3 text-slate-300 shadow-md shadow-slate-900/50 transition-colors hover:border-sky-400/30 hover:text-sky-400"
                >
                  <div className="rounded-lg bg-slate-900 p-2 transition-colors group-hover:bg-sky-400/20">
                    <Twitter size={16} className="text-slate-400 group-hover:text-sky-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                      Twitter
                    </span>
                    <span className="text-sm font-semibold tracking-wide">@give_bit</span>
                  </div>
                </a>

                {/* NOSTR */}
                <a
                  href="nostr:kimi@giveabit.io"
                  className="group flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/80 p-3 text-slate-300 shadow-md shadow-slate-900/50 transition-colors hover:border-purple-400/30 hover:text-purple-400"
                >
                  <div className="rounded-lg bg-slate-900 p-2 transition-colors group-hover:bg-purple-400/20">
                    <AtSign size={16} className="text-slate-400 group-hover:text-purple-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                      Nostr
                    </span>
                    <span className="text-sm font-semibold tracking-wide">kimi@giveabit.io</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Core Navigation & Legal */}
          <div className="col-span-1 grid grid-cols-2 gap-12 md:col-span-3 md:grid-cols-3 md:pl-12">
            <div>
              <h4 className="mb-6 text-xs font-black tracking-widest text-white uppercase">
                Protocol
              </h4>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li>
                  <a href="/#protocol-deep-dive" className="transition-colors hover:text-white">
                    How it Works
                  </a>
                </li>
                <li>
                  <Link to="/verify" className="transition-colors hover:text-white">
                    Verifier Tool
                  </Link>
                </li>
                <li>
                  <a
                    href="https://opentimestamps.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 transition-colors hover:text-white"
                  >
                    Developer API <ExternalLink size={12} />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-xs font-black tracking-widest text-white uppercase">
                Organization
              </h4>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li>
                  <Link to="/trust" className="transition-colors hover:text-white">
                    Trust Center
                  </Link>
                </li>
                <li>
                  <Link to="/" className="transition-colors hover:text-white">
                    Manifesto
                  </Link>
                </li>
                <li>
                  <Link to="/protocol-stats" className="transition-colors hover:text-white">
                    Network Status
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex h-full flex-col justify-between">
              <div className="mb-8 md:mb-0">
                <h4 className="mb-6 text-xs font-black tracking-widest text-white uppercase">
                  Legal
                </h4>
                <ul className="space-y-4 text-sm font-bold text-slate-400">
                  <li>
                    <Link to="/legal/privacy" className="transition-colors hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/legal/terms" className="transition-colors hover:text-white">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/legal/crypto-notice" className="transition-colors hover:text-white">
                      Compliance Rules
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Expandable Interactive Bitcoin Donation Widget */}
              <div className="z-20 mt-auto overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/80 shadow-xl shadow-slate-900/50 transition-all">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="group flex w-full cursor-pointer items-center justify-between p-4 transition-colors hover:bg-slate-700/80"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#F7931A]/10 p-2 transition-colors group-hover:bg-[#F7931A]/20">
                      <Bitcoin size={20} className="text-[#F7931A]" />
                    </div>
                    <span className="text-sm font-bold text-slate-200 transition-colors group-hover:text-white">
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
                      className="flex flex-col items-center border-t border-slate-700/50 bg-slate-900/80 p-5 backdrop-blur-sm"
                    >
                      <div className="mb-4 rounded-2xl bg-white p-3 shadow-2xl ring-4 ring-white/10">
                        <QRCodeSVG
                          value={`bitcoin:${bitcoinAddress}`}
                          size={160}
                          fgColor="#0f172a"
                        />
                      </div>
                      <p className="cursor-text rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-center font-mono text-[10px] tracking-wider break-all text-slate-400 select-all">
                        {bitcoinAddress}
                      </p>
                      <p className="mt-3 text-center text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                        Thank you for keeping Satohash free!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-800 pt-8 text-sm font-bold text-slate-500 md:flex-row">
          <p>© {currentYear} Satohash. Decentrally Validated.</p>
          <div className="group flex items-center gap-2">
            Constructed with{' '}
            <Heart
              size={16}
              className="cursor-pointer fill-rose-500 text-rose-500 transition-transform group-hover:scale-125"
            />{' '}
            for <span className="text-slate-300">The Decentralized Web</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
