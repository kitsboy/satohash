import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  ChevronRight,
  Globe,
  Lock,
  Clock,
  ArrowRight,
  Sparkles,
  Cpu,
  FileCheck,
  Library,
  Network,
  Zap,
  Boxes,
  Gavel,
  Shield,
  Activity,
  Fingerprint,
  MousePointer2,
  BookOpen,
  Hash,
  CheckCircle2
} from 'lucide-react'
import LiveNetworkDashboard from '../components/LiveNetworkDashboard'
import GlobalActivity from '../components/GlobalActivity'

const FeatureCard = ({ icon: Icon, title, description, delay, accent = 'indigo' }) => {
  const colors = {
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      glow: 'group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-all duration-500'
    },
    violet: {
      bg: 'bg-violet-50',
      text: 'text-violet-600',
      glow: 'group-hover:bg-violet-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-violet-500/20 transition-all duration-500'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      glow: 'group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-500'
    }
  }
  const c = colors[accent]
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 100, delay }}
      className="glass-card group relative cursor-default overflow-hidden border-slate-100 bg-white p-10 transition-all hover:border-indigo-200 hover:bg-slate-50/50 hover:shadow-[0_20px_50px_-15px_rgba(79,70,229,0.12)]"
    >
      <div className="bg-grid-slate-100 absolute inset-0 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] opacity-0 transition-opacity group-hover:opacity-10" />
      <div
        className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl ${c.bg} ${c.text} ${c.glow}`}
      >
        <Icon size={24} />
      </div>
      <h3 className="mb-3 text-xl font-extrabold tracking-tight text-indigo-900">{title}</h3>
      <p className="text-sm leading-relaxed font-medium text-slate-500">{description}</p>
    </motion.div>
  )
}

const StatItem = ({ label, value, sub }) => (
  <div className="group cursor-pointer text-center lg:text-left">
    <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-indigo-300 uppercase transition-colors group-hover:text-indigo-400">
      {label}
    </p>
    <p className="mb-1 text-4xl font-extrabold tracking-tighter text-white md:text-5xl">{value}</p>
    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{sub}</p>
  </div>
)

export default function Landing() {
  const { scrollYProgress } = useScroll()
  const yRange = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacityRange = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fcfcfc] selection:bg-indigo-500/30">
      <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.03]" />

      {/* ── Background Mesh ──────────────── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1.5px,transparent_1.5px)] [background-size:48px_48px] opacity-[0.03]" />
        <div className="absolute top-0 left-1/2 h-[800px] w-full max-w-7xl -translate-x-1/2 bg-gradient-to-b from-indigo-50/50 to-transparent" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-500 blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-10%] left-[-10%] h-[800px] w-[800px] rounded-full bg-violet-600 blur-[180px]"
        />
      </div>

      {/* ── Hero section ─────────────────────────── */}
      <section className="relative z-10 mx-auto flex max-w-[90rem] flex-col items-center px-6 pt-48 pb-32 text-center md:pt-56">
        <motion.div style={{ opacity: opacityRange, y: yRange }} className="w-full">
          {/* Protocol Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pill-indigo mx-auto mb-10 flex h-10 items-center justify-center gap-3 border-2 border-indigo-50 bg-white shadow-lg shadow-indigo-500/5"
          >
            <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-600 shadow-[0_0_8px_#4f46e5]" />
            <span className="text-[10px] font-bold tracking-[0.15em] text-indigo-900 uppercase">
              Satohash Protocol v4.0 · Sovereign Mesh Active
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-noir-primary mx-auto mb-8 max-w-5xl text-5xl leading-[0.95] font-extrabold tracking-tighter md:text-[8rem]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Mathematical <br />
            <span className="text-gradient">Finality.</span>
          </motion.h1>

          <motion.p
            className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed font-medium text-slate-500 md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            The global standard for cryptographic attestation. Anchor documents, identities, and
            archives to the Bitcoin network with institutional-grade witnessing and zero-knowledge
            privacy.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/dashboard" className="w-full sm:w-auto">
              <button className="group relative h-16 w-full min-w-[260px] overflow-hidden rounded-2xl bg-indigo-900 px-10 text-[12px] font-extrabold tracking-[0.2em] text-white uppercase shadow-2xl shadow-indigo-500/30 transition-all hover:scale-[1.03] active:scale-[0.97] sm:w-auto md:h-18">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-400 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative flex items-center justify-center gap-3">
                  Open Workbench <ChevronRight size={16} />
                </span>
              </button>
            </Link>
            <Link to="/developers" className="w-full sm:w-auto">
              <button className="h-16 w-full min-w-[260px] rounded-2xl border-2 border-indigo-100 bg-white px-10 text-[12px] font-extrabold tracking-[0.2em] text-indigo-900 uppercase transition-all hover:border-indigo-200 hover:bg-indigo-50 sm:w-auto md:h-18">
                <span className="flex items-center justify-center gap-3">
                  <Cpu size={16} /> API Documentation
                </span>
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="border-noir group relative mt-32 w-full max-w-7xl overflow-hidden rounded-3xl bg-white p-2 shadow-[0_40px_100px_-20px_rgba(79,70,229,0.15)] md:rounded-[3rem]"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 px-8 py-6 md:px-12">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              </div>
              <span className="ml-4 hidden text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase sm:block">
                Sovereign Kernel Mesh v4.0
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="hidden text-[10px] font-bold tracking-widest text-emerald-600 uppercase sm:block">
                Witness Node Sync Nominal
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden p-6 md:p-12">
            <div className="pointer-events-none absolute inset-0 bottom-0 z-10 h-64 bg-gradient-to-t from-white to-transparent" />
            <div className="mb-16 grid items-end gap-8 lg:grid-cols-2">
              <div className="text-left">
                <div className="pill-indigo mb-4 w-fit">Oracle Layer v2</div>
                <h3 className="text-3xl leading-tight font-extrabold tracking-tighter text-indigo-900 md:text-4xl">
                  Decentralized <br /> Witness Mesh Telemetry.
                </h3>
              </div>
              <div className="flex justify-start gap-12 lg:justify-end">
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-indigo-900 md:text-3xl">845,922</div>
                  <div className="text-[9px] font-bold tracking-widest text-slate-300 uppercase">
                    Height
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-emerald-600 md:text-3xl">
                    99.999%
                  </div>
                  <div className="text-[9px] font-bold tracking-widest text-slate-300 uppercase">
                    Uptime
                  </div>
                </div>
              </div>
            </div>
            <LiveNetworkDashboard />
          </div>
        </motion.div>
      </section>

      {/* ── How It Works (Educational) ─────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <div className="pill-indigo mx-auto mb-6 w-fit">
            <BookOpen size={12} /> Learn
          </div>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tighter text-indigo-900 md:text-6xl">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="mx-auto max-w-xl text-lg leading-relaxed font-medium text-slate-500">
            Three simple steps to create mathematically provable evidence that your document existed
            at a specific point in time.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              step: '01',
              icon: Hash,
              title: 'Hash Your Document',
              desc: 'Your file is processed locally on your device. A unique SHA-256 fingerprint is generated — a one-way mathematical signature that represents your document without exposing its contents.',
              detail: 'Privacy first — your document never leaves your device.'
            },
            {
              step: '02',
              icon: Shield,
              title: 'Anchor to Bitcoin',
              desc: 'The hash is submitted to the Bitcoin blockchain via OpenTimestamps, bundled with thousands of other hashes in a Merkle tree. One Bitcoin transaction secures them all.',
              detail: 'Cost-efficient — thousands of proofs share one transaction.'
            },
            {
              step: '03',
              icon: CheckCircle2,
              title: 'Verify Anywhere',
              desc: 'Anyone can independently verify your proof using any Bitcoin node. No accounts needed, no trust required — just mathematics.',
              detail: 'Permanent — your proof exists for as long as Bitcoin exists.'
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, type: 'spring', stiffness: 100 }}
              className="step-card group text-left"
            >
              <div className="mb-6 flex items-start gap-5">
                <div className="step-number shrink-0">{item.step}</div>
                <div className="flex-1">
                  <h3 className="mb-3 text-xl font-extrabold tracking-tight text-indigo-900">
                    {item.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed font-medium text-slate-500">
                    {item.desc}
                  </p>
                  <div className="edu-callout">
                    <span className="edu-callout-title">Key Insight</span>
                    {item.detail}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Stats ────────────────────────────── */}
      <section className="relative border-y border-white/5 bg-[#0c1220] py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-5"
          style={{
            background: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            <StatItem label="Finality" value="Bitcoin" sub="PoW Consensus" />
            <StatItem label="Privacy" value="ZK-SHA" sub="Local Hashing" />
            <StatItem label="Audit" value="SEC Ready" sub="Institutional" />
            <StatItem label="Network" value="Global" sub="1,400+ Nodes" />
          </div>
        </div>
      </section>

      {/* ── Feature Grid ──────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="mb-24 flex flex-col items-end justify-between gap-10 md:flex-row">
          <div className="max-w-3xl">
            <div className="pill-indigo mb-5 w-fit">Protocol Topology</div>
            <h2 className="mb-6 text-4xl leading-none font-extrabold tracking-tighter text-indigo-900 md:text-6xl">
              Built for the <br /> <span className="text-gradient">Sovereign Class.</span>
            </h2>
            <p className="max-w-xl text-lg leading-relaxed font-medium text-slate-500">
              Universal infrastructure for securing institutional assets, legal evidence, and
              cryptographic identities on the world&apos;s most resilient network.
            </p>
          </div>
          <div className="flex items-center gap-5 rounded-2xl border border-slate-100 bg-slate-50 p-6">
            <ShieldCheck size={28} className="text-indigo-600" />
            <div>
              <h4 className="mb-1 text-[10px] font-bold tracking-widest text-indigo-900 uppercase">
                Judicial Alignment
              </h4>
              <p className="text-[10px] font-medium tracking-[0.15em] text-slate-400 uppercase">
                Verified Secure eIDAS
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={Lock}
            accent="indigo"
            title="ZK-Privacy Shields"
            description="Your documents never leave your local environment. We anchor SHA-256 fingerprints with absolute data sovereignty."
            delay={0.1}
          />
          <FeatureCard
            icon={Clock}
            accent="violet"
            title="Temporal Finality"
            description="Anchored via OpenTimestamps, providing immutable proof of existence at an auditable Bitcoin block height."
            delay={0.2}
          />
          <FeatureCard
            icon={Globe}
            accent="emerald"
            title="Nostr Mesh Propagation"
            description="Proofs are broadcast across 100+ global relays, ensuring censorship resistance and universal verification."
            delay={0.3}
          />
          <FeatureCard
            icon={Zap}
            accent="indigo"
            title="BOLT-12 Settlement"
            description="Reusable Lightning Network payment addresses for automated institutional subscriptions. No invoices, just truth."
            delay={0.15}
          />
          <FeatureCard
            icon={Gavel}
            accent="violet"
            title="Expert Witnessing"
            description="Court-ready Affidavit PDFs that interpret Bitcoin consensus into legally superior evidentiary fact."
            delay={0.25}
          />
          <FeatureCard
            icon={Network}
            accent="emerald"
            title="Oracle Mesh Nodes"
            description="A distributed network of Witness Nodes that cross-validate proofs. Redundant, trustless, and persistent."
            delay={0.35}
          />
        </div>
      </section>

      {/* ── Global Witness Stream ──────────────── */}
      <section className="mx-auto max-w-[90rem] px-6 pb-32">
        <div className="border-noir group relative overflow-hidden rounded-3xl bg-white p-10 shadow-xl md:rounded-[3.5rem] md:p-16">
          <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.02]" />
          <div className="pointer-events-none absolute top-0 right-0 p-16 opacity-5 transition-all duration-1000 group-hover:scale-110">
            <Boxes size={240} className="text-indigo-900" />
          </div>
          <div className="relative z-10 grid items-center gap-16 lg:grid-cols-2">
            <GlobalActivity />
            <div className="text-left">
              <div className="pill-emerald mb-6 w-fit">Protocol Telemetry Live</div>
              <h2 className="mb-8 text-4xl leading-none font-extrabold tracking-tighter text-indigo-900 md:text-6xl">
                Mesh <br />
                <span className="text-gradient">Truth Log.</span>
              </h2>
              <div className="space-y-10">
                <EvidenceItem
                  icon={Activity}
                  label="Real-Time Attribution"
                  desc="Every stamp is verifiable via the global mesh in under 60 seconds."
                />
                <EvidenceItem
                  icon={Fingerprint}
                  label="Forensic Integrity"
                  desc="Instant verification via block explorers and local institutional tooling."
                />
              </div>
              <Link to="/dashboard" className="mt-12 inline-flex">
                <button className="flex h-16 items-center justify-center gap-3 rounded-2xl bg-indigo-900 px-10 text-[11px] font-extrabold tracking-[0.2em] text-white uppercase shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.03] active:scale-[0.97]">
                  Access Workbench <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── What is Bitcoin Timestamping? (Educational) ──────── */}
      <section className="mx-auto max-w-4xl px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50/50 p-10 md:p-16"
        >
          <div className="mb-6 flex items-center gap-3">
            <BookOpen size={20} className="text-indigo-600" />
            <span className="text-[11px] font-bold tracking-[0.15em] text-indigo-600 uppercase">
              Educational Guide
            </span>
          </div>
          <h3 className="mb-6 text-3xl font-extrabold tracking-tight text-indigo-900 md:text-4xl">
            What is Bitcoin Timestamping?
          </h3>
          <div className="space-y-4 text-[15px] leading-[1.8] font-medium text-slate-600">
            <p>
              <strong className="text-indigo-900">Bitcoin timestamping</strong> is the process of
              creating a permanent, tamper-proof record that a piece of data existed at a specific
              moment in time. Think of it as a{' '}
              <strong className="text-indigo-900">digital notary</strong> powered by mathematics
              instead of trust.
            </p>
            <p>
              When you timestamp a document, we don&apos;t store your file. Instead, we create a
              cryptographic hash — a unique mathematical fingerprint — and embed it into the Bitcoin
              blockchain. Because Bitcoin blocks are practically impossible to alter, your proof
              becomes <strong className="text-indigo-900">permanent and tamper-proof</strong>.
            </p>
            <p>
              This technology is used by{' '}
              <strong className="text-indigo-900">
                legal professionals, journalists, artists, and enterprises
              </strong>{' '}
              to prove document authenticity, protect intellectual property, and create
              court-admissible evidence — all without relying on any centralized authority.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/about">
              <button className="btn-holographic text-[10px]">Read the Whitepaper</button>
            </Link>
            <Link to="/developers">
              <button className="btn-secondary text-[10px]">Explore the API</button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Final CTA ─────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="relative overflow-hidden rounded-3xl bg-indigo-900 p-16 text-center shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)] md:rounded-[3.5rem] md:p-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              background:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
            }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="pointer-events-none absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(79,70,229,1) 0%, transparent 70%)' }}
          />
          <h2 className="relative z-10 mb-6 text-5xl font-extrabold tracking-tighter text-white md:text-7xl">
            Ready to Anchor?
          </h2>
          <p className="relative z-10 mx-auto mb-12 max-w-xl text-lg leading-relaxed font-medium text-indigo-200/60">
            Join the Oracle Mesh and make your digital artifacts permanently, mathematically
            provable.
          </p>
          <div className="relative z-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/dashboard" className="w-full sm:w-auto">
              <button className="h-16 w-full min-w-[260px] rounded-2xl bg-white text-[12px] font-extrabold tracking-[0.2em] text-indigo-900 uppercase shadow-xl transition-all hover:scale-[1.03] hover:bg-slate-50 sm:w-auto">
                Launch Workbench
              </button>
            </Link>
            <Link to="/trust" className="w-full sm:w-auto">
              <button className="h-16 w-full min-w-[260px] rounded-2xl border-2 border-white/20 bg-transparent text-[12px] font-extrabold tracking-[0.2em] text-white uppercase transition-all hover:bg-white/10 sm:w-auto">
                Visit Trust Center
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function EvidenceItem({ icon: Icon, label, desc }) {
  return (
    <div className="group flex gap-6">
      <div className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-400 shadow-sm transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white">
        <Icon size={24} />
      </div>
      <div>
        <h4 className="mb-2 text-lg font-extrabold tracking-tight text-indigo-900 transition-colors group-hover:text-indigo-600">
          {label}
        </h4>
        <p className="text-sm leading-relaxed font-medium text-slate-500">{desc}</p>
      </div>
    </div>
  )
}
