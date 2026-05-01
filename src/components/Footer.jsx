import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Mail,
  Globe,
  ChevronRight,
  ArrowUpRight,
  Zap,
  Cpu,
  Briefcase,
  Lock,
  Scale,
  X,
  Heart
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

const JobCard = ({ title, description }) => {
  const emailLink = `mailto:hello@giveabit.io?subject=Application for ${title}`
  return (
    <motion.a
      href={emailLink}
      whileHover={{ x: 5 }}
      className="group block rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 transition-all hover:border-[var(--accent-active)]"
    >
      <div className="mb-3 flex items-start justify-between">
        <h4 className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-[var(--accent-active)]">
          {title}
        </h4>
        <ArrowUpRight
          size={18}
          className="text-[var(--text-secondary)] transition-colors group-hover:text-[var(--accent-active)]"
        />
      </div>
      <p className="mb-4 text-xs leading-relaxed font-medium text-[var(--text-secondary)]">
        {description}
      </p>
      <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[var(--accent-active)] uppercase">
        Apply Now <ChevronRight size={12} />
      </div>
    </motion.a>
  )
}

export default function Footer() {
  const jobs = [
    {
      title: 'L402 Protocol Architect',
      description:
        'Design and implement the high-frequency Lightning settlement layer. Focus on BOLT-12 integration and metered API orchestration.'
    },
    {
      title: 'Forensic Rust Engineer',
      description:
        'Optimize our low-level cryptographic primitives and OpenTimestamps witness engine. Performance and safety are absolute requirements.'
    },
    {
      title: 'Cryptography Systems Lead',
      description:
        'Lead the development of ZK-SHA256 implementations and advanced Merkle path traversal algorithms for courtroom-grade verification.'
    },
    {
      title: 'Institutional UX Designer',
      description:
        'Evolve the "Institutional Noir" design system. Craft high-density, low-latency interfaces for sovereign intelligence consoles.'
    },
    {
      title: 'Nostr Identity Specialist',
      description:
        'Build the bridge between sovereign keys and human-readable reputation. Master NIP-05 and decentralized signing workflows.'
    },
    {
      title: 'Sovereign Node DevOps',
      description:
        'Orchestrate our global mesh of witness nodes. Ensure 99.999% availability for the Truth OS under extreme network conditions.'
    },
    {
      title: 'Blockchain Data Scientist',
      description:
        'Architect the Atlas Plane’s temporal search engine. Mine historical blockchain data to establish unprecedented forensic context.'
    }
  ]

  const [showDonation, setShowDonation] = useState(false)
  const btcAddress = 'bc1qhm5ndfjhqxdk3cx0pngyps4f5nnwdckulmge6c8keyf2pk0neqtshjn8ad'

  return (
    <footer className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--bg-secondary)] pt-24 pb-12">
      {/* Donation Popup */}
      <AnimatePresence>
        {showDonation && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed right-8 bottom-32 z-[60] w-80 space-y-6 rounded-[2.5rem] bg-white p-8 text-black shadow-[0_0_50px_rgba(255,255,255,0.1)]"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                Support the Mission
              </h3>
              <button
                onClick={() => setShowDonation(false)}
                className="text-gray-400 transition-colors hover:text-black"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex aspect-square items-center justify-center rounded-2xl border-2 border-gray-100 bg-white p-4">
              <QRCodeSVG
                value={`bitcoin:${btcAddress}`}
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>
            <div className="space-y-2">
              <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                Bitcoin Address
              </p>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 font-mono text-[10px] font-bold break-all">
                {btcAddress}
              </div>
            </div>
            <p className="text-[10px] leading-relaxed font-medium text-gray-500 italic">
              Your contribution keeps the truth mesh sovereign and censorship-resistant.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-7xl px-8">
        <div className="mb-24 grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* ... existing columns ... */}
          {/* Logo & Legal Column */}
          <div className="space-y-12 lg:col-span-4">
            <div className="space-y-6">
              <Link to="/" className="group flex items-center gap-4">
                <div className="h-10 w-10 rotate-45 rounded-sm bg-[var(--accent-active)] shadow-[0_0_20px_var(--accent-active)] transition-transform group-hover:rotate-90" />
                <span className="text-3xl font-black tracking-tighter uppercase">Satohash</span>
              </Link>
              <p className="text-sm leading-relaxed font-medium text-[var(--text-secondary)]">
                Satohash is the sovereign operating system for digital truth. Anchored to the
                Bitcoin network, we provide the ultimate cryptographic ledger for institutional
                provenance and forensic verification.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-white">
                <Scale size={20} className="text-[var(--accent-active)]" />
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase">
                  Legal Framework
                </h3>
              </div>
              <div className="space-y-4 text-[10px] leading-loose font-medium tracking-widest text-[var(--text-secondary)] uppercase">
                <p>
                  SATOHASH V4.0.0-ELITE+ IS A DECENTRALIZED PROTOCOL. ALL CRYPTOGRAPHIC OPERATIONS
                  ARE PERFORMED LOCALLY. WE DO NOT MAINTAIN CUSTODY OF PRIVATE MATERIAL OR ORIGINAL
                  DATA.
                </p>
                <p>
                  PROOFS GENERATED BY SATOHASH ARE DESIGNED TO EXCEED eIDAS AND ESIGN STANDARDS BY
                  LEVERAGING IMMUTABLE BITCOIN ATTESTATIONS. HOWEVER, LEGAL ADMISSIBILITY MAY VARY
                  BY JURISDICTION. CONSULT WITH INDEPENDENT COUNSEL FOR SPECIFIC USE CASES.
                </p>
                <p>© 2026 GIVEABIT LTD. REGISTERED IN THE SEYCHELLES. ALL RIGHTS RESERVED.</p>
              </div>
            </div>
          </div>

          {/* Jobs Board Column */}
          <div className="space-y-10 lg:col-span-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <Briefcase size={20} className="text-[var(--accent-active)]" />
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase">
                  Sovereign Careers
                </h3>
              </div>
              <span className="animate-pulse rounded-full border border-[var(--accent-active)]/20 bg-[var(--accent-active)]/10 px-3 py-1 text-[8px] font-black tracking-widest text-[var(--accent-active)] uppercase">
                Hiring Now
              </span>
            </div>
            <div className="custom-scrollbar grid max-h-[600px] grid-cols-1 gap-4 overflow-y-auto pr-4">
              {jobs.map((job, i) => (
                <JobCard key={i} title={job.title} description={job.description} />
              ))}
            </div>
          </div>

          {/* Contact & Navigation Column */}
          <div className="space-y-12 lg:col-span-3">
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-white">
                <Mail size={20} className="text-[var(--accent-active)]" />
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase">Communications</h3>
              </div>
              <div className="space-y-4">
                <a
                  href="mailto:hello@giveabit.io"
                  className="group block rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4 transition-all hover:border-[var(--accent-active)]"
                >
                  <p className="mb-1 text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                    Email Terminal
                  </p>
                  <p className="text-sm font-bold text-white transition-colors group-hover:text-[var(--accent-active)]">
                    hello@giveabit.io
                  </p>
                </a>
                <a
                  href="nostr:kimi@giveabit.io"
                  className="group block rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4 transition-all hover:border-[var(--accent-active)]"
                >
                  <p className="mb-1 text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                    Nostr NIP-05
                  </p>
                  <p className="text-sm font-bold text-white transition-colors group-hover:text-[var(--accent-active)]">
                    kimi@giveabit.io
                  </p>
                </a>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-3 text-white">
                <Globe size={20} className="text-[var(--accent-active)]" />
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase">Atlas Links</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { name: 'About', path: '/about' },
                  { name: 'Trust Center', path: '/trust' },
                  { name: 'Documentation', path: '/documentation' },
                  { name: 'Status', path: '/status' },
                  { name: 'Twitter', path: 'https://twitter.com/giveabit', external: true },
                  { name: 'GitHub', path: 'https://github.com/kitsboy', external: true }
                ].map((link) =>
                  link.external ? (
                    <a
                      key={link.name}
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold tracking-widest text-[var(--text-secondary)] uppercase transition-colors hover:text-[var(--accent-active)]"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="text-xs font-bold tracking-widest text-[var(--text-secondary)] uppercase transition-colors hover:text-[var(--accent-active)]"
                    >
                      {link.name}
                    </Link>
                  )
                )}
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-8">
              <div className="flex items-center gap-4 text-[var(--text-secondary)]">
                <Lock size={16} />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  v4.0.0-ELITE+ Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-8 border-t border-[var(--border)] pt-12 md:flex-row">
          <div className="flex items-center gap-8 text-[var(--text-secondary)]">
            <span className="text-[9px] font-bold tracking-widest uppercase">
              Secure Handshake: 1.2s
            </span>
            <span className="text-[9px] font-bold tracking-widest text-[var(--accent-success)] uppercase">
              Protocol Active
            </span>
            <button
              onClick={() => setShowDonation(!showDonation)}
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-bold tracking-widest text-white uppercase transition-all hover:bg-white/10"
            >
              <Heart
                size={10}
                className="text-[var(--accent-active)] transition-transform group-hover:scale-125"
              />
              Support the Mission
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent-active)] shadow-[0_0_10px_var(--accent-active)]" />
            <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-[var(--text-secondary)] uppercase">
              Powered by OpenTimestamps & Bitcoin
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
