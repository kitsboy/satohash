import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Globe,
  ChevronRight,
  ArrowUpRight,
  Briefcase,
  Lock,
  Scale,
  X,
  Heart
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import KimiContact from './KimiContact'
import BackToTop from './BackToTop'

const JobCard = ({ title, description }) => {
  const emailLink = `mailto:hello@giveabit.io?subject=Application for ${title}`
  return (
    <motion.a
      href={emailLink}
      whileHover={{ x: 5 }}
      className="group block rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 transition-all hover:border-[var(--accent-active)] hover:shadow-[0_0_20px_var(--accent-active-glow)]"
    >
      <div className="mb-3 flex items-start justify-between">
        <h4 className="text-lg font-bold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-active)]">
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
        Apply Now{' '}
        <ChevronRight size={12} className="transition-transform group-hover:translate-x-1" />
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
        'Evolve the "Modern Institutional" design system. Craft high-density, low-latency interfaces for sovereign intelligence consoles.'
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
    <>
      <BackToTop />
    <footer className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--bg-secondary)] pt-24 pb-12">
      {/* Donation Popup */}
      <AnimatePresence>
        {showDonation && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed right-8 bottom-32 z-[60] w-96 space-y-8 rounded-[2.5rem] border border-[var(--border-bright)] bg-[var(--bg-secondary)] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-3">
                <Heart size={16} className="text-[var(--accent-active)]" />
                <h3 className="text-[12px] font-bold tracking-widest text-[var(--text-primary)] uppercase">
                  Support Protocol
                </h3>
              </div>
              <button
                onClick={() => setShowDonation(false)}
                className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex aspect-square items-center justify-center rounded-[2rem] bg-white p-6 shadow-[0_0_40px_var(--accent-active-glow)]">
              <QRCodeSVG
                value={`bitcoin:${btcAddress}`}
                size={220}
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold tracking-widest text-[var(--accent-active)] uppercase">
                Bitcoin Address
              </p>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4 font-mono text-[11px] font-bold break-all text-[var(--text-primary)] select-all">
                {btcAddress}
              </div>
            </div>

            <p className="text-[11px] leading-relaxed font-medium text-[var(--text-secondary)] italic">
              Your contribution fuels the sovereign mesh, ensuring censorship resistance and global
              accessibility for the Truth OS.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-7xl px-8">
        <div className="mb-24 grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Logo & Legal Column */}
          <div className="space-y-12 lg:col-span-4">
            <div className="space-y-6">
              <Link to="/" className="group flex items-center gap-4">
                <img
                  src="/logo.png"
                  alt="Satohash"
                  className="h-10 w-10 object-contain transition-transform group-hover:scale-110 group-hover:rotate-12"
                />
                <span className="text-3xl font-black tracking-tighter text-white uppercase">
                  Satohash
                </span>
              </Link>
              <p className="text-[14px] leading-relaxed font-medium text-[var(--text-secondary)]">
                The sovereign operating system for digital truth. Anchored to the Bitcoin network,
                we provide the ultimate cryptographic ledger for institutional provenance and
                forensic verification.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-[var(--text-primary)]">
                <Scale size={18} className="text-[var(--accent-active)]" />
                <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase">
                  Legal Framework
                </h3>
              </div>
              <div className="space-y-4 text-[10px] leading-loose font-medium tracking-widest text-[var(--text-secondary)] uppercase">
                <p>
                  SATOHASH V5.0.0 IS A DECENTRALIZED PROTOCOL. ALL CRYPTOGRAPHIC OPERATIONS ARE
                  PERFORMED LOCALLY. WE DO NOT MAINTAIN CUSTODY OF PRIVATE MATERIAL OR ORIGINAL
                  DATA.
                </p>
                <p>
                  PROOFS GENERATED EXCEED eIDAS AND ESIGN STANDARDS BY LEVERAGING IMMUTABLE BITCOIN
                  ATTESTATIONS. LEGAL ADMISSIBILITY MAY VARY. CONSULT INDEPENDENT COUNSEL.
                </p>
                <p className="text-[var(--accent-active)]">
                  © 2026 GIVEABIT LTD. REGISTERED IN THE SEYCHELLES. ALL RIGHTS RESERVED.
                </p>
              </div>
            </div>
          </div>

          {/* Jobs Board Column */}
          <div className="space-y-10 lg:col-span-5">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-3 text-[var(--text-primary)]">
                <Briefcase size={18} className="text-[var(--accent-active)]" />
                <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase">
                  Sovereign Careers
                </h3>
              </div>
              <span className="animate-pulse rounded-full border border-[var(--accent-active)]/30 bg-[var(--accent-active)]/10 px-4 py-1 text-[9px] font-black tracking-widest text-[var(--accent-active)] uppercase shadow-[0_0_15px_var(--accent-active-glow)]">
                Hiring Now
              </span>
            </div>
            <div className="custom-scrollbar grid max-h-[600px] grid-cols-1 gap-5 overflow-y-auto pr-4">
              {jobs.map((job, i) => (
                <JobCard key={i} title={job.title} description={job.description} />
              ))}
            </div>
          </div>

          {/* Contact & Navigation Column */}
          <div className="space-y-12 lg:col-span-3">
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4 text-[var(--text-primary)]">
                <Mail size={18} className="text-[var(--accent-purple)]" />
                <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase">Communications</h3>
              </div>
              <div className="space-y-4">
                <a
                  href="mailto:hello@giveabit.io"
                  className="group block rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-5 transition-all hover:border-[var(--accent-purple)] hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                >
                  <p className="mb-2 text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                    Email Terminal
                  </p>
                  <p className="text-[13px] font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-purple)]">
                    hello@giveabit.io
                  </p>
                </a>
                <a
                  href="nostr:kimi@giveabit.io"
                  className="group block rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-5 transition-all hover:border-[var(--accent-purple)] hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                >
                  <p className="mb-2 text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                    Nostr NIP-05
                  </p>
                  <p className="text-[13px] font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-purple)]">
                    kimi@giveabit.io
                  </p>
                </a>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4 text-[var(--text-primary)]">
                <Globe size={18} className="text-[var(--accent-success)]" />
                <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase">Atlas Links</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {[
                  { name: 'About', path: '/about' },
                  { name: 'Pitch', path: '/pitch' },
                  { name: 'Trust Center', path: '/trust' },
                  { name: 'Documentation', path: '/docs' },
                  { name: 'Status', path: '/status' },
                  { name: 'FAQ', path: '/faq' },
                  { name: 'Pricing', path: '/pricing' },
                  { name: 'Guides', path: '/guides' },
                  { name: 'Glossary', path: '/glossary' },
                  { name: 'Privacy', path: '/legal/privacy' },
                  { name: 'Terms', path: '/legal/terms' },
                  { name: 'Crypto Notice', path: '/legal/crypto-notice' },
                  { name: 'Security', path: '/security' },
                  { name: 'X', path: 'https://x.com/give_bit', external: true },
                  { name: 'Integrations', path: '/integrations' },
                  { name: 'GitHub', path: 'https://github.com/kitsboy/satohash', external: true }
                ].map((link) =>
                  link.external ? (
                    <a
                      key={link.name}
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[11px] font-bold tracking-widest text-[var(--text-secondary)] uppercase transition-colors hover:translate-x-1 hover:text-[var(--accent-success)]"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="inline-block text-[11px] font-bold tracking-widest text-[var(--text-secondary)] uppercase transition-colors hover:translate-x-1 hover:text-[var(--accent-success)]"
                    >
                      {link.name}
                    </Link>
                  )
                )}
              </div>
            </div>

            <div className="space-y-4 border-t border-[var(--border)] pt-8">
              <KimiContact compact />
              <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 text-[var(--text-secondary)]">
                <Lock size={16} className="text-[var(--accent-success)]" />
                <span className="text-[11px] font-bold tracking-widest uppercase">
                  v{typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '5.0.0'} (Build{' '}
                  {typeof __BUILD_NUMBER__ !== 'undefined' ? __BUILD_NUMBER__ : '1'}) Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-8 border-t border-[var(--border)] pt-12 md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-6 text-[var(--text-secondary)] md:justify-start">
            <span className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--text-secondary)]" /> Handshake:
              1.2s
            </span>
            <span className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[var(--accent-success)] uppercase">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-success)] shadow-[0_0_8px_var(--accent-success)]" />{' '}
              Protocol Active
            </span>
            <button
              onClick={() => setShowDonation(!showDonation)}
              className="group flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2 text-[10px] font-bold tracking-widest text-[var(--text-primary)] uppercase transition-all hover:border-[var(--accent-active)] hover:bg-[var(--surface-raised)]"
            >
              <Heart
                size={12}
                className="text-[var(--accent-active)] transition-transform group-hover:scale-125"
              />
              Support the Mission
            </button>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent-active)] shadow-[0_0_12px_var(--accent-active)]" />
              <span className="font-mono text-[11px] font-bold tracking-[0.3em] text-[var(--text-secondary)] uppercase">
                Powered by OpenTimestamps & Bitcoin
              </span>
            </div>
            <a
              href="https://giveabit.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 opacity-50 transition-opacity hover:opacity-80"
            >
              <span className="text-[9px] font-bold tracking-[0.2em] text-[var(--text-secondary)] uppercase">
                Created by
              </span>
              <img src="/giveabit.png" alt="Give A Bit" className="h-5 w-auto object-contain" />
            </a>
          </div>
        </div>
      </div>
</footer>
    </>
  )
}
