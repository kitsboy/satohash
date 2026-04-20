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
  Briefcase,
  BookOpen,
  Lightbulb,
  Code
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { APP_CONFIG, FOOTER_EXTRA_LINKS } from '@/config/constants'
import { getBlockHeight } from '../utils/mempool'

const EDUCATION_FACTS = [
  {
    title: 'What is Timestamping?',
    text: 'Bitcoin timestamping creates an immutable proof that a document existed at a specific point in time, using the Bitcoin blockchain as a global clock.',
    icon: '⏰'
  },
  {
    title: 'SHA-256 Explained',
    text: 'SHA-256 is a one-way cryptographic function that turns any data into a unique 64-character fingerprint. Even changing one letter produces a completely different hash.',
    icon: '🔐'
  },
  {
    title: 'What is a Merkle Tree?',
    text: 'A Merkle tree lets us bundle thousands of hashes into a single root hash, which means we can anchor millions of documents in one Bitcoin transaction.',
    icon: '🌳'
  },
  {
    title: 'Why Bitcoin?',
    text: 'Bitcoin has the most secure and decentralized network. Once a hash is anchored in a Bitcoin block, it would cost billions to alter — making it the ultimate source of truth.',
    icon: '₿'
  },
  {
    title: 'Privacy by Design',
    text: 'Your documents never leave your device. Only the SHA-256 hash (a mathematical fingerprint) is submitted. The original content remains 100% private.',
    icon: '🛡️'
  }
]

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isJobsOpen, setIsJobsOpen] = useState(false)
  const [blockHeight, setBlockHeight] = useState(830000)
  const [factIndex, setFactIndex] = useState(0)
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
      desc: 'Expanding the Satohash mesh into international judiciaries and enterprise sectors.'
    }
  ]

  useEffect(() => {
    const fetchHeight = async () => {
      const height = await getBlockHeight()
      if (height) setBlockHeight(height)
    }
    fetchHeight()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % EDUCATION_FACTS.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const copyAddress = () => {
    navigator.clipboard.writeText(bitcoinAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentFact = EDUCATION_FACTS[factIndex]

  return (
    <footer className="relative mt-auto w-full border-t border-indigo-100 bg-[#f8faff] pt-24 pb-12">
      {/* Background Ornaments */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]" />
        <div className="absolute top-0 left-1/2 h-px w-full max-w-6xl -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
        <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-violet-500/5 blur-[100px]" />
      </div>

      <div className="layout-container relative z-10">

        {/* ── Educational "Did You Know?" Carousel ────────────── */}
        <div className="mb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={factIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="rounded-3xl bg-white border border-indigo-50 p-8 md:p-10 flex flex-col md:flex-row items-start gap-6 shadow-sm"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                {currentFact.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Lightbulb size={14} className="text-amber-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-600">
                    Did You Know?
                  </span>
                </div>
                <h4 className="text-lg font-extrabold tracking-tight text-indigo-900 mb-2">
                  {currentFact.title}
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium max-w-2xl">
                  {currentFact.text}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-1 self-center">
                {EDUCATION_FACTS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFactIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${i === factIndex ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-200 hover:bg-slate-300'}`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Mission */}
          <div className="lg:col-span-1">
            <motion.div 
               whileHover={{ scale: 1.02 }}
               className="mb-6 flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-2 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-50">
                <img
                  src={APP_CONFIG.LOGO}
                  alt="Satohash Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-tighter text-indigo-900">
                {APP_CONFIG.NAME}
              </span>
            </motion.div>
            <p className="mb-8 text-sm font-medium leading-relaxed text-slate-500">
              Anchoring digital history to the Bitcoin blockchain. Immutable, local-first, and institutional-grade attestation for the Sovereign Web.
            </p>
            
            <div className="flex flex-wrap gap-2.5">
              {[
                { icon: Twitter, href: 'https://twitter.com/give_bit', label: 'Twitter' },
                { icon: Github, href: 'https://github.com/kitsboy/satohash', label: 'GitHub' },
                { icon: AtSign, href: 'nostr:kimi@giveabit.io', label: 'Nostr' }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  href={social.href}
                  target="_blank"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 transition-all hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-500/20 hover:border-indigo-600"
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Protocol Col */}
          <div>
            <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
               <span className="flex items-center gap-2"> <Shield size={12} /> Protocol</span>
            </h4>
            <ul className="space-y-3.5 text-sm font-medium text-slate-500">
              <li><Link to="/dashboard" className="transition-colors hover:text-indigo-600">Workbench</Link></li>
              <li><Link to="/verify" className="transition-colors hover:text-indigo-600">Global Verifier</Link></li>
              <li><Link to="/about" className="transition-colors hover:text-indigo-600">Whitepaper</Link></li>
              <li>
                  <a href="https://opentimestamps.org/" target="_blank" className="flex items-center gap-2 hover:text-indigo-600">
                    OTS Calendar <ExternalLink size={11} />
                  </a>
              </li>
            </ul>
          </div>

          {/* Utility Col */}
          <div>
            <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
               <span className="flex items-center gap-2"> <Zap size={12} /> Utilities</span>
            </h4>
            <ul className="space-y-3.5 text-sm font-medium text-slate-500">
              <li><Link to="/identity" className="transition-colors hover:text-indigo-600">Identity Hub</Link></li>
              <li><Link to="/snap-and-stamp" className="transition-colors hover:text-indigo-600">Web Capture</Link></li>
              <li><Link to="/image-vault" className="transition-colors hover:text-indigo-600">Image Vault</Link></li>
              <li><Link to="/offers" className="transition-colors hover:text-indigo-600">BOLT-12 Offers</Link></li>
            </ul>
          </div>

          {/* Resources Col */}
          <div>
            <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
               <span className="flex items-center gap-2"> <Globe size={12} /> Resources</span>
            </h4>
            <ul className="space-y-3.5 text-sm font-medium text-slate-500">
              <li><Link to="/trust" className="transition-colors hover:text-indigo-600">Trust Center</Link></li>
              <li><Link to="/developers" className="flex items-center gap-2 transition-colors hover:text-indigo-600"><Code size={12} /> API Documentation</Link></li>
              <li><Link to="/legal/privacy" className="transition-colors hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link to="/legal/terms" className="transition-colors hover:text-indigo-600">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Network Pulse Col */}
          <div className="relative">
            <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
               <span className="flex items-center gap-2"> <Activity size={12} /> Network Pulse</span>
            </h4>
            <div className="space-y-4">
                <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
                    <div className="mb-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Bitcoin Block Height</div>
                    <div className="text-2xl font-extrabold text-indigo-900 tracking-tighter">#{blockHeight.toLocaleString()}</div>
                    <div className="mt-3 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        <span className="text-[9px] font-bold text-emerald-600 uppercase">Mainnet Live</span>
                    </div>
                </div>
                
                {/* Donation Widget */}
                <div className="rounded-2xl bg-indigo-900 p-5 shadow-xl shadow-indigo-900/20 text-white">
                    <div className="mb-3 flex items-center justify-between">
                         <Bitcoin size={18} className="text-amber-400" />
                         <button 
                            onClick={() => setShowQR(!showQR)}
                            className="text-[9px] font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all"
                         >
                            {showQR ? 'Close' : 'Donate ₿'}
                         </button>
                    </div>
                    <p className="text-[10px] font-medium text-indigo-200 uppercase">Support Open Source</p>
                    <AnimatePresence>
                        {showQR && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-white/10 flex flex-col items-center"
                            >
                                <div className="p-3 bg-white rounded-xl mb-3">
                                    <QRCodeSVG value={`bitcoin:${bitcoinAddress}`} size={120} />
                                </div>
                                <button 
                                    onClick={copyAddress}
                                    className="text-[9px] font-mono text-white/50 hover:text-white transition-colors break-all text-center"
                                >
                                    {copied ? '✓ Copied' : bitcoinAddress}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-indigo-50 pt-10 text-sm text-slate-400 md:flex-row">
           <div className="flex flex-col gap-1.5">
              <p className="text-slate-500 text-[11px] tracking-wide font-medium">
                 © {currentYear} {APP_CONFIG.NAME} · Institutional Attestation Protocol
              </p>
              <div className="flex items-center gap-3 text-[9px] font-mono text-slate-300">
                 <span>v4.0.0-ELITE</span>
                 <div className="h-1 w-1 rounded-full bg-slate-200" />
                 <span>Oracle Mesh Active</span>
              </div>
           </div>

           <div className="flex items-center gap-4 flex-wrap">
                <button 
                  onClick={() => setIsJobsOpen(!isJobsOpen)}
                  className="pill-indigo flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <Briefcase size={12} /> {isJobsOpen ? 'Close' : 'We\'re Hiring'} {isJobsOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                </button>
                <div className="h-4 w-px bg-slate-100" />
                <Link to="/trust" className="hover:text-indigo-600 transition-colors text-[11px] font-bold">Trust Center</Link>
                <div className="h-4 w-px bg-slate-100" />
                <div className="group flex items-center gap-2 text-[11px] font-medium text-slate-300">
                    Built for <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">the decentralized web</span>
                    <Heart size={14} className="fill-rose-500 text-rose-500 animate-pulse" />
                </div>
           </div>
        </div>

        {/* Careers Drawer */}
        <AnimatePresence>
            {isJobsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white border border-indigo-50 rounded-3xl shadow-xl"
              >
                {jobs.map((job, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -3 }}
                    className="p-5 rounded-2xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="mb-3 flex items-center justify-between">
                       <span className="text-[9px] font-bold text-indigo-600 border border-indigo-100 bg-white px-2.5 py-1 rounded-full uppercase tracking-widest">{job.dept}</span>
                       <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <h5 className="text-sm font-extrabold text-indigo-900 mb-2 leading-tight">{job.title}</h5>
                    <p className="text-[11px] font-medium text-slate-500 mb-5 flex-grow leading-relaxed">{job.desc}</p>
                    <a 
                      href={`mailto:hello@giveabit.io?subject=Satohash Job Application: ${job.title}&body=Job Offering Details:%0D%0A${job.title}%0D%0A%0D%0AMessage: Satohash%0D%0A%0D%0AI am applying for the above position documented on the Satohash protocol portal.`}
                      className="w-full btn-holographic py-3 text-center text-[9px]"
                    >
                      Apply Now
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
