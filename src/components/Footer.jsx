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
    <footer className="w-full bg-slate-900 border-t border-slate-800 pt-24 pb-12 px-6 relative overflow-hidden mt-auto">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand & Socials Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg shadow-indigo-900/50">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">Satohash</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium mb-8">
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
                  className="flex items-center gap-3 text-slate-300 hover:text-sky-400 transition-colors bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 hover:border-sky-400/30 group shadow-md shadow-slate-900/50"
                >
                  <div className="bg-slate-900 p-2 rounded-lg group-hover:bg-sky-400/20 transition-colors">
                    <Twitter size={16} className="group-hover:text-sky-400 text-slate-400" />
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
                  className="flex items-center gap-3 text-slate-300 hover:text-purple-400 transition-colors bg-slate-800/80 p-3 rounded-xl border border-slate-700/50 hover:border-purple-400/30 group shadow-md shadow-slate-900/50"
                >
                  <div className="bg-slate-900 p-2 rounded-lg group-hover:bg-purple-400/20 transition-colors">
                    <AtSign size={16} className="group-hover:text-purple-400 text-slate-400" />
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
          <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 md:col-span-3 gap-12 md:pl-12">
            <div>
              <h4 className="font-black text-white uppercase tracking-widest text-xs mb-6">
                Protocol
              </h4>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li>
                  <a href="/#protocol-deep-dive" className="hover:text-white transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <Link to="/verify" className="hover:text-white transition-colors">
                    Verifier Tool
                  </Link>
                </li>
                <li>
                  <a
                    href="https://opentimestamps.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    Developer API <ExternalLink size={12} />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-white uppercase tracking-widest text-xs mb-6">
                Organization
              </h4>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li>
                  <Link to="/trust" className="hover:text-white transition-colors">
                    Trust Center
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Manifesto
                  </Link>
                </li>
                <li>
                  <Link to="/protocol-stats" className="hover:text-white transition-colors">
                    Network Status
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col justify-between h-full">
              <div className="mb-8 md:mb-0">
                <h4 className="font-black text-white uppercase tracking-widest text-xs mb-6">
                  Legal
                </h4>
                <ul className="space-y-4 text-sm font-bold text-slate-400">
                  <li>
                    <Link to="/legal/privacy" className="hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/legal/terms" className="hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/legal/crypto-notice" className="hover:text-white transition-colors">
                      Compliance Rules
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Expandable Interactive Bitcoin Donation Widget */}
              <div className="mt-auto bg-slate-800/80 border border-slate-700/50 rounded-2xl overflow-hidden transition-all shadow-xl shadow-slate-900/50 z-20">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-700/80 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#F7931A]/10 p-2 rounded-lg group-hover:bg-[#F7931A]/20 transition-colors">
                      <Bitcoin size={20} className="text-[#F7931A]" />
                    </div>
                    <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
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
                      className="border-t border-slate-700/50 p-5 flex flex-col items-center bg-slate-900/80 backdrop-blur-sm"
                    >
                      <div className="bg-white p-3 rounded-2xl mb-4 shadow-2xl ring-4 ring-white/10">
                        <QRCodeSVG
                          value={`bitcoin:${bitcoinAddress}`}
                          size={160}
                          fgColor="#0f172a"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono tracking-wider break-all text-center select-all cursor-text py-2 px-3 bg-slate-950 rounded-lg border border-slate-800">
                        {bitcoinAddress}
                      </p>
                      <p className="text-[10px] font-bold text-slate-500 mt-3 text-center uppercase tracking-widest">
                        Thank you for keeping Satohash free!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm font-bold">
          <p>© {currentYear} Satohash. Decentrally Validated.</p>
          <div className="flex items-center gap-2 group">
            Constructed with{' '}
            <Heart
              size={16}
              className="text-rose-500 fill-rose-500 group-hover:scale-125 transition-transform cursor-pointer"
            />{' '}
            for <span className="text-slate-300">The Decentralized Web</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
