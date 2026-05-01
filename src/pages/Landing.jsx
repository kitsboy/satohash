import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  ChevronRight,
  Globe,
  Lock,
  Clock,
  ArrowRight,
  Cpu,
  Network,
  Zap,
  Layers,
  Fingerprint,
  FileText,
  Database,
  Activity,
  Shield
} from 'lucide-react'
import LiveNetworkDashboard from '../components/LiveNetworkDashboard'
import MerkleHeart from '../components/MerkleHeart'
import Footer from '../components/Footer'

const PlaneCard = ({ icon: Icon, title, description, delay, accent = 'indigo' }) => {
  const accentColors = {
    indigo: 'text-[var(--accent-active)]',
    amber: 'text-[var(--accent-pending)]',
    green: 'text-[var(--accent-success)]',
    red: 'text-[var(--accent-danger)]'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 100, delay }}
      className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-10 transition-all hover:border-[var(--border-bright)] hover:bg-[var(--surface-raised)]/20"
    >
      <div
        className={`mb-8 flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] transition-all group-hover:border-[var(--accent-active)]/50 ${accentColors[accent]}`}
      >
        <Icon size={24} />
      </div>
      <h3 className="mb-3 text-xl font-bold tracking-tight text-[var(--text-primary)]">{title}</h3>
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>
    </motion.div>
  )
}

export default function Landing() {
  const { scrollYProgress } = useScroll()
  const yRange = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacityRange = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[var(--accent-active)]/30">
      {/* ── Background Merkle Heart ──────────────── */}
      <div className="pointer-events-none absolute inset-0 z-0 h-[100vh] overflow-hidden">
        <MerkleHeart />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-primary)]/80 to-[var(--bg-primary)]" />
      </div>

      {/* ── Hero Section ─────────────────────────── */}
      <section className="relative z-10 mx-auto flex max-w-[90rem] flex-col items-center px-6 pt-56 pb-32 text-center">
        <motion.div style={{ opacity: opacityRange, y: yRange }} className="w-full">
          {/* Version Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 inline-flex items-center gap-3 rounded-full border border-[var(--border-bright)] bg-[var(--surface-raised)]/60 px-5 py-2.5 shadow-[0_0_30px_rgba(59,130,246,0.1)] backdrop-blur-xl transition-all hover:border-[var(--accent-active)]/50"
          >
            <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent-active)] shadow-[0_0_12px_var(--accent-active)]" />
            <span className="font-mono text-[11px] font-bold tracking-[0.25em] text-[var(--text-secondary)] uppercase">
              Satohash <span className="text-white">v5.0.0</span> · Modern Institutional
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="mx-auto mb-8 max-w-6xl text-6xl leading-[0.9] font-extrabold tracking-tighter md:text-[9rem]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Sovereign <br />
            <span className="bg-gradient-to-r from-[var(--accent-active)] via-[var(--accent-purple)] to-[var(--accent-success)] bg-clip-text text-transparent">
              Evidence.
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed font-medium text-[var(--text-secondary)] md:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            The Bitcoin-native operating system for zero-knowledge proof-of-existence, institutional
            verification, and forensic web capture. Redesigned for absolute clarity.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link to="/vault" className="w-full sm:w-auto">
              <button className="flex h-16 w-full min-w-[280px] items-center justify-center gap-3 rounded-2xl bg-white text-[12px] font-extrabold tracking-[0.2em] text-black uppercase shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.02] hover:bg-gray-100 hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] active:scale-[0.98]">
                Access Workbench <ChevronRight size={18} />
              </button>
            </Link>
            <Link to="/access" className="w-full sm:w-auto">
              <button className="h-16 w-full min-w-[280px] rounded-2xl border border-[var(--border-bright)] bg-white/5 text-[12px] font-extrabold tracking-[0.2em] text-white uppercase backdrop-blur-lg transition-all hover:border-white/30 hover:bg-white/10 active:scale-[0.98]">
                Cryptographic Sign-In
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Four Planes Architecture ──────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl space-y-24 px-6 py-32">
        <div className="space-y-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
            The Four <span className="text-[var(--accent-active)]">Operating Planes</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-medium text-[var(--text-secondary)]">
            A high-assurance architecture designed for the sovereign class.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <PlaneCard
            icon={ShieldCheck}
            title="Proof Plane"
            accent="indigo"
            description="Stamp, verify, and vault digital assets with OpenTimestamps. Mathematical finality without accounts or intermediaries."
            delay={0.1}
          />
          <PlaneCard
            icon={Fingerprint}
            title="Identity Plane"
            accent="green"
            description="NIP-05 identity mapping for human-readable cryptographic authority. Public keys bound to sovereign reputation."
            delay={0.2}
          />
          <PlaneCard
            icon={Zap}
            title="Settlement Plane"
            accent="amber"
            description="Lightning-native L402 payment gating. Instant, metered access to high-assurance services with BOLT-12."
            delay={0.3}
          />
          <PlaneCard
            icon={Globe}
            title="Atlas Plane"
            accent="indigo"
            description="Live chain intelligence and proof telemetry. Bitcoin Core node context enriched with mempool and network state."
            delay={0.4}
          />
        </div>
      </section>

      {/* ── Protocol Telemetry ────────────────────── */}
      <section className="relative z-10 mx-auto max-w-[90rem] px-6 py-32">
        <div className="relative overflow-hidden rounded-[3rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-8 md:p-16">
          <div className="pointer-events-none absolute top-0 right-0 p-16 opacity-5">
            <Database size={240} />
          </div>
          <div className="relative z-10 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-success)]/20 bg-[var(--accent-success)]/10 px-3 py-1">
                <Activity size={14} className="text-[var(--accent-success)]" />
                <span className="font-mono text-[10px] font-bold tracking-widest text-[var(--accent-success)] uppercase">
                  Live Network Feed
                </span>
              </div>
              <h2 className="text-4xl leading-none font-bold tracking-tight md:text-6xl">
                Sovereign <br /> <span className="text-[var(--accent-active)]">Truth Log.</span>
              </h2>
              <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
                Every attestation is monitored in real-time. Witness nodes propagate proof data
                across the global mesh ensuring absolute censorship resistance.
              </p>
              <div className="flex flex-col gap-8 pt-4 sm:flex-row">
                <div>
                  <p className="font-mono text-3xl font-bold">841,204</p>
                  <p className="font-mono text-[10px] tracking-widest text-[var(--text-secondary)] uppercase">
                    Current Height
                  </p>
                </div>
                <div>
                  <p className="font-mono text-3xl font-bold text-[var(--accent-success)]">
                    99.99%
                  </p>
                  <p className="font-mono text-[10px] tracking-widest text-[var(--text-secondary)] uppercase">
                    Mesh Uptime
                  </p>
                </div>
                <div>
                  <p className="font-mono text-3xl font-bold text-[var(--accent-pending)]">
                    42s/vB
                  </p>
                  <p className="font-mono text-[10px] tracking-widest text-[var(--text-secondary)] uppercase">
                    Fee Density
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 shadow-2xl">
              <LiveNetworkDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────── */}
      <section className="relative z-10 mx-auto max-w-5xl space-y-12 px-6 py-32 text-center">
        <h2 className="text-5xl font-bold tracking-tighter md:text-7xl">Ready to Anchor?</h2>
        <p className="mx-auto max-w-2xl text-xl text-[var(--text-secondary)]">
          Join the institutional operating system for the next century of digital evidence.
        </p>
        <div className="flex flex-col justify-center gap-6 sm:flex-row">
          <Link to="/vault">
            <button className="h-16 rounded-xl bg-[var(--text-primary)] px-12 font-extrabold tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.05]">
              Enter Workbench
            </button>
          </Link>
          <Link to="/trust">
            <button className="h-16 rounded-xl border border-[var(--border)] bg-transparent px-12 font-extrabold tracking-widest text-[var(--text-primary)] uppercase transition-all hover:bg-[var(--surface-raised)]">
              Trust Center
            </button>
          </Link>
        </div>
      </section>

      {/* ── Global Footer ────────────────────────── */}
      <Footer />
    </div>
  )
}
