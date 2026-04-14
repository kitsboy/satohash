import {
  Twitter,
  Heart,
  ExternalLink,
  AtSign,
  Bitcoin,
  ChevronDown,
  ChevronUp,
  Github,
  Disc,
  Shield,
  Activity,
  FileText,
  Lock,
  Globe,
  Zap,
  Briefcase
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { APP_CONFIG, FOOTER_EXTRA_LINKS } from '@/config/constants'
import { getBlockHeight } from '../utils/mempool'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isJobsOpen, setIsJobsOpen] = useState(false)
  const [blockHeight, setBlockHeight] = useState(830000)
  const bitcoinAddress = 'bc1qhm5ndfjhqxdk3cx0pngyps4f5nnwdckulmge6c8keyf2pk0neqtshjn8ad'
  const jobs = [
    {
      title: 'Lead Protocol Engineer (Rust)',
      dept: 'Engineering',
      desc: 'Architecting the future of Bitcoin-anchored attestation. Deep knowledge of OTS and Merkle trees required.'
    },
    {
      title: 'Sovereign DevOps Lead',
      dept: 'Infrastructure',
      desc: 'Scaling the global Witness Mesh. Focus on trustless node orchestration and high-availability relays.'
    },
    {
      title: 'Institutional Marketing Manager',
      dept: 'Growth',
      desc: 'Bridging the gap between Bitcoin protocol and legal-grade institutional trust globally.'
    },
    {
      title: 'Premium UX/UI Designer',
      dept: 'Design',
      desc: 'Crafting the Institutional Noir experience. Specialize in complex data visualization and sleek aesthetics.'
    },
    {
      title: 'Senior Backend Architect (Node.js)',
      dept: 'Engineering',
      desc: 'Hardening the cryptographic pipeline and ensuring 99.99% uptime for the Satohash Oracle.'
    },
    {
      title: 'Cryptography Specialist',
      dept: 'Security',
      desc: 'Mathematical verification of SHA-256 anchoring pipelines and zero-knowledge privacy layers.'
    },
    {
      title: 'Global Growth Lead',
      dept: 'Strategy',
      desc: 'Expanding the Satohash mesh into international judiciaries and enterprise enterprise sectors.'
    }
  ]

  useEffect(() => {
    const fetchHeight = async () => {
      const height = await getBlockHeight()
      if (height) setBlockHeight(height)
    }
    fetchHeight()
  }, [])

  const copyAddress = () => {
    navigator.clipboard.writeText(bitcoinAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const navSpring = { type: 'spring', stiffness: 400, damping: 30 }

  return (
    <footer className="relative mt-auto w-full border-t border-indigo-100 bg-[#f8faff] pt-32 pb-12">
      {/* Background Ornaments / Luminous Depth */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]" />
        <div className="absolute top-0 left-1/2 h-px w-full max-w-6xl -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
        <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-violet-500/5 blur-[100px]" />
      </div>

      <div className="layout-container relative z-10">
        <div className="mb-24 grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Mission */}
          <div className="lg:col-span-1">
            <motion.div 
               whileHover={{ scale: 1.02 }}
               className="mb-8 flex items-center gap-3"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow-2xl shadow-indigo-500/10 ring-1 ring-indigo-50">
                <img
                  src={APP_CONFIG.LOGO}
                  alt="Satohash Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-3xl font-black tracking-tighter text-indigo-900 italic">
                {APP_CONFIG.NAME}
              </span>
            </motion.div>
            <p className="mb-10 text-sm font-bold italic leading-relaxed text-indigo-900/70">
              Anchoring digital history to the Bitcoin blockchain. Immutable, local-first, and institutional-grade attestation for the Sovereign Web.
            </p>
            
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Twitter, href: 'https://twitter.com/give_bit' },
                { icon: Github, href: 'https://github.com/kitsboy/satohash' },
                { icon: AtSign, href: 'nostr:kimi@giveabit.io' }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href={social.href}
                  target="_blank"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-indigo-50 text-slate-400 transition-all hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-500/20"
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Protocol Col */}
          <div>
            <h4 className="mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-900/50">
               <span className="flex items-center gap-2"> <Shield size={12} /> PROTOCOL</span>
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500 italic">
              <li><Link to="/dashboard" className="transition-colors hover:text-indigo-600">Workbench</Link></li>
              <li><Link to="/verify" className="transition-colors hover:text-indigo-600">Global Verifier</Link></li>
              <li><Link to="/about" className="transition-colors hover:text-indigo-600">Whitepaper</Link></li>
              <li>
                  <a href="https://opentimestamps.org/" target="_blank" className="flex items-center gap-2 hover:text-indigo-600">
                    OTS Calendar <ExternalLink size={12} />
                  </a>
              </li>
            </ul>
          </div>

          {/* Utility Col */}
          <div>
            <h4 className="mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-900/50">
               <span className="flex items-center gap-2"> <Zap size={12} /> UTILITIES</span>
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500 italic">
              <li><Link to="/identity" className="transition-colors hover:text-indigo-600">Identity Hub</Link></li>
              <li><Link to="/snap-and-stamp" className="transition-colors hover:text-indigo-600">Web Capture</Link></li>
              <li><Link to="/image-vault" className="transition-colors hover:text-indigo-600">Image Vault</Link></li>
              <li><Link to="/offers" className="transition-colors hover:text-indigo-600">BOLT-12 Offers</Link></li>
            </ul>
          </div>

          {/* Extra Col */}
          <div>
            <h4 className="mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-900/50">
               <span className="flex items-center gap-2"> <Globe size={12} /> RESOURCES</span>
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500 italic">
              <li><Link to="/trust" className="transition-colors hover:text-indigo-600">Trust Center</Link></li>
              <li><Link to="/developers" className="transition-colors hover:text-indigo-600">API Documentation</Link></li>
              <li><Link to="/legal/privacy" className="transition-colors hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link to="/legal/terms" className="transition-colors hover:text-indigo-600">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Network Pulse Col */}
          <div className="relative">
            <h4 className="mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-900/50">
               <span className="flex items-center gap-2"> <Activity size={12} /> NETWORK PULSE</span>
            </h4>
            <div className="space-y-6">
                <div className="rounded-2xl bg-white border border-indigo-50 p-6 shadow-sm">
                    <div className="mb-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Bitcoin Block Height</div>
                    <div className="text-2xl font-black text-indigo-900 italic tracking-tighter">#{blockHeight.toLocaleString()}</div>
                    <div className="mt-3 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        <span className="text-[9px] font-bold text-emerald-600 uppercase">CALENDAR_NODE_LIVE</span>
                    </div>
                </div>
                
                {/* Donation Widget Integrated */}
                <div className="rounded-2xl bg-indigo-900 p-6 shadow-xl shadow-indigo-900/20 text-white">
                    <div className="mb-4 flex items-center justify-between">
                         <Bitcoin size={20} className="text-amber-400" />
                         <button 
                            onClick={() => setShowQR(!showQR)}
                            className="text-[9px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all"
                         >
                            {showQR ? 'CLOSE' : 'DONATE'}
                         </button>
                    </div>
                    <p className="text-[10px] font-bold text-indigo-200 uppercase italic">Sovereign Sustainability</p>
                    <AnimatePresence>
                        {showQR && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-white/10 flex flex-col items-center"
                            >
                                <div className="p-3 bg-white rounded-xl mb-4">
                                    <QRCodeSVG value={`bitcoin:${bitcoinAddress}`} size={120} />
                                </div>
                                <button 
                                    onClick={copyAddress}
                                    className="text-[9px] font-mono text-white/50 hover:text-white transition-colors break-all text-center"
                                >
                                    {copied ? '✓ COPIED' : bitcoinAddress}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-8 border-t border-indigo-50 pt-12 text-sm font-bold text-slate-400 md:flex-row">
           <div className="flex flex-col gap-2">
              <p className="text-indigo-900/60 uppercase text-[10px] tracking-widest font-black">
                 © {currentYear} {APP_CONFIG.NAME} • Institutional Attestation Protocol
              </p>
              <div className="flex items-center gap-4 text-[9px] font-mono text-slate-300">
                 <span>v3.0.0-PRO</span>
                 <div className="h-1 w-1 rounded-full bg-slate-200" />
                 <span>ORACLE_MESH_ACTIVE</span>
              </div>
           </div>

           <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsJobsOpen(!isJobsOpen)}
                  className="pill-indigo flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <Briefcase size={12} /> {isJobsOpen ? 'CLOSE_MESH' : 'JOIN_THE_MESH'} {isJobsOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                </button>
                <div className="h-4 w-px bg-slate-100" />
                <Link to="/trust" className="hover:text-indigo-600 transition-colors uppercase text-[10px] tracking-widest font-black">Trust Center</Link>
                <div className="h-4 w-px bg-slate-100" />
                <div className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
                    Built for <span className="text-indigo-900/30 group-hover:text-indigo-600 transition-colors">THE DECENTRALIZED WEB</span>
                    <Heart size={14} className="fill-rose-500 text-rose-500 animate-pulse" />
                </div>
           </div>
        </div>

        {/* Careers Dropdown Drawer */}
        <AnimatePresence>
            {isJobsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-white border border-indigo-50 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10"
              >
                {jobs.map((job, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -4 }}
                    className="p-6 rounded-3xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-indigo-100 transition-all flex flex-col"
                  >
                    <div className="mb-4 flex items-center justify-between">
                       <span className="text-[9px] font-black text-indigo-600 border border-indigo-100 bg-white px-2.5 py-1 rounded-full uppercase tracking-widest">{job.dept}</span>
                       <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <h5 className="text-sm font-black text-indigo-900 mb-2 leading-tight uppercase">{job.title}</h5>
                    <p className="text-[11px] font-bold text-slate-500 mb-6 flex-grow leading-relaxed italic">{job.desc}</p>
                    <a 
                      href={`mailto:hello@giveabit.io?subject=Satohash Job Application: ${job.title}&body=Job Offering Details:%0D%0A${job.title}%0D%0A%0D%0AMessage: Satohash%0D%0A%0D%0AI am applying for the above position documented on the Satohash v3.0.0-PRO protocol portal.`}
                      className="w-full btn-holographic py-3 text-center text-[9px]"
                      style={{ padding: '0.75rem' }}
                    >
                      APPLY_TO_MESH
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </footer>
  )
}
