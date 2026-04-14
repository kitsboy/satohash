import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShieldCheck, ChevronRight, Globe, Lock, Clock, ArrowRight, Sparkles, Cpu, FileCheck, Library } from 'lucide-react'
import LiveNetworkDashboard from '../components/LiveNetworkDashboard'
import GlobalActivity from '../components/GlobalActivity'

const FeatureCard = ({ icon: Icon, title, description, delay, accent = 'indigo' }) => {
  const colors = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-200', glow: 'group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-[0_0_24px_rgba(79,70,229,0.4)]' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-200', glow: 'group-hover:bg-violet-600 group-hover:text-white group-hover:shadow-[0_0_24px_rgba(124,58,237,0.4)]' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200', glow: 'group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-[0_0_24px_rgba(5,150,105,0.4)]' },
  }
  const c = colors[accent]
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 120, delay }}
      className="glass-card group cursor-default p-10"
    >
      <div className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl ${c.bg} ${c.text} ring-1 ${c.ring} transition-all duration-300 ${c.glow}`}>
        <Icon size={22} />
      </div>
      <h3 className="mb-3 text-xl font-black tracking-tight" style={{ color: 'var(--text-base)' }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>
    </motion.div>
  )
}

const StatItem = ({ label, value, sub }) => (
  <div className="text-center lg:text-left">
    <p className="mb-1 text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: 'var(--primary)' }}>{label}</p>
    <p className="mb-1 text-4xl font-black tracking-tighter" style={{ color: 'var(--text-base)' }}>{value}</p>
    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>{sub}</p>
  </div>
)

export default function Landing() {
  const { scrollYProgress } = useScroll()
  const yRange = useTransform(scrollYProgress, [0, 1], [0, -60])
  const opacityRange = useTransform(scrollYProgress, [0, 0.25], [1, 0])

  return (
    <div className="min-h-screen pt-28 pb-24" style={{ background: 'var(--bg-base)' }}>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-20 text-center md:pb-32">
        <motion.div style={{ opacity: opacityRange, y: yRange }} className="relative z-10 w-full">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="pill-indigo mx-auto mb-10 w-fit"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
            </span>
            Satohash Protocol v3.0.0-PRO · Oracle Mesh Live
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-display mx-auto mb-8 max-w-5xl text-4xl font-black leading-[0.95] tracking-tighter md:text-[7.5rem]"
            style={{ color: 'var(--text-base)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            Immutable <br />
            <span className="text-gradient">Digital Truth.</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            className="mx-auto mb-12 max-w-2xl text-lg font-medium leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            The global standard for cryptographic attestation. Anchor your documents, code, and assets 
            to the Bitcoin blockchain with zero-knowledge privacy and legal-grade attestation.
          </motion.p>

          {/* CTA row */}
          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <Link to="/dashboard">
              <button className="btn-holographic flex items-center gap-2.5 min-w-[200px] justify-center">
                Enter Protocol Center
                <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
            <Link to="/verify">
              <button className="btn-secondary flex items-center gap-2.5 min-w-[200px] justify-center">
                <ShieldCheck size={15} />
                Verify Evidence
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Dashboard preview card */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'circOut' }}
          className="relative mt-24 w-full max-w-6xl overflow-hidden rounded-[2.5rem] shadow-[0_20px_80px_-20px_rgba(79,70,229,0.2)]"
          style={{ border: '1.5px solid var(--border)', background: 'var(--bg-card)' }}
        >
          {/* Top bar */}
          <div className="flex items-center gap-2 border-b px-6 py-4" style={{ borderColor: 'var(--border)' }}>
            <div className="h-3 w-3 rounded-full bg-rose-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>
              Oracle Mesh · Witness Node 1 · UTC {new Date().toUTCString()}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-32 z-10"
            style={{ background: `linear-gradient(to top, var(--bg-base), transparent)` }} />
          <LiveNetworkDashboard />

          {/* Label */}
          <div className="absolute top-16 left-10 z-20">
            <p className="pill-indigo mb-2">Consensus Layer</p>
            <h3 className="text-2xl font-black tracking-tighter" style={{ color: 'var(--text-base)' }}>
              Global Witness Node Mesh
            </h3>
          </div>
        </motion.div>
      </section>

      {/* ── Stats Ticker ───────────────────────────────────── */}
      <section className="border-y py-14" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            <StatItem label="Uptime"    value="99.99%" sub="Decentralized" />
            <StatItem label="Consensus" value="Bitcoin" sub="Proof-of-Work" />
            <StatItem label="Audit"     value="SEC-Ready" sub="Institutional" />
            <StatItem label="Privacy"   value="ZK-SHA256" sub="Zero Leak" />
          </div>
        </div>
      </section>

      {/* ── Institutional Features ─────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="mb-20 text-center">
          <p className="pill-indigo mx-auto mb-6 w-fit">Protocol Capabilities</p>
          <h2 className="mb-5 text-5xl font-black tracking-tighter md:text-6xl" style={{ color: 'var(--text-base)' }}>
            Built for <span className="text-gradient">Sovereign Trust.</span>
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            A mission-critical infrastructure for securing corporate assets and intellectual property on the world&apos;s most resilient network.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={Lock}
            accent="indigo"
            title="ZK-Privacy"
            description="Your documents never leave your browser. We generate a SHA-256 fingerprint locally, ensuring total data sovereignty and zero server exposure."
            delay={0.1}
          />
          <FeatureCard
            icon={Clock}
            accent="violet"
            title="Immutability"
            description="Anchored into the Bitcoin blockchain via OpenTimestamps, providing permanent proof of existence at a specific, auditable block height."
            delay={0.2}
          />
          <FeatureCard
            icon={Globe}
            accent="emerald"
            title="Nostr Mesh"
            description="Proofs are broadcast across the Nostr relay network, ensuring global accessibility, censorship resistance, and decentralized verification."
            delay={0.3}
          />
          <FeatureCard
            icon={Cpu}
            accent="indigo"
            title="BOLT-12 Offers"
            description="Reusable Lightning Network payment addresses for recurring notarization subscriptions. No expiring invoices, ever."
            delay={0.15}
          />
          <FeatureCard
            icon={FileCheck}
            accent="violet"
            title="Legal Exports"
            description="Court-ready Expert Witness Affidavit PDFs that explain the mathematics of Bitcoin timestamps in language judges understand."
            delay={0.25}
          />
          <FeatureCard
            icon={Sparkles}
            accent="emerald"
            title="Oracle Mesh"
            description="A distributed network of Witness Nodes that cross-validate proofs. If one server goes down, your evidence lives on."
            delay={0.35}
          />
          <FeatureCard
            icon={Library}
            accent="indigo"
            title="Notary Library"
            description="Access 12+ pre-built legal templates including Wills, NDAs, and Affidavits, ready for bit-for-bit Bitcoin anchoring."
            delay={0.4}
          />
        </div>
      </section>

      {/* ── Decentralized Witness Log ──────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="glass-card overflow-hidden p-12 md:p-20" style={{ background: 'var(--bg-card)' }}>
          <div className="grid items-center gap-20 lg:grid-cols-2">
            <GlobalActivity />
            <div>
              <p className="pill-emerald mb-6 w-fit">Live Protocol Feed</p>
              <h2 className="mb-10 text-5xl font-black tracking-tighter" style={{ color: 'var(--text-base)' }}>
                Decentralized <br />
                <span className="text-gradient">Witness Log.</span>
              </h2>
              <div className="space-y-8">
                {[
                  { color: 'var(--success)', label: 'Real-time Attribution', desc: 'Every stamp is verifiable by the global community in under 60 seconds.' },
                  { color: 'var(--primary)', label: 'Audit Transparency', desc: 'Instant verification via public block explorers and standard OTS tooling.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="mt-1 h-1 w-10 rounded-full flex-shrink-0" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                    <div>
                      <h4 className="mb-1.5 text-base font-black tracking-tight" style={{ color: 'var(--text-base)' }}>{item.label}</h4>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/dashboard" className="mt-10 inline-flex">
                <button className="btn-holographic flex items-center gap-2">
                  Open Workbench
                  <ArrowRight size={14} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="relative overflow-hidden rounded-[2.5rem] p-16 text-center"
          style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />
          <h2 className="mb-5 text-5xl font-black tracking-tighter text-white">Ready to Anchor?</h2>
          <p className="mx-auto mb-10 max-w-lg text-base font-medium text-white/70">
            Join the Oracle Mesh and make your digital work permanently, mathematically provable.
          </p>
          <Link to="/dashboard">
            <button className="rounded-xl bg-white px-10 py-4 text-[11px] font-black uppercase tracking-[0.15em] transition-all hover:scale-105 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              style={{ color: 'var(--primary)' }}>
              Launch the Oracle Mesh
            </button>
          </Link>
        </div>
      </section>

    </div>
  )
}
