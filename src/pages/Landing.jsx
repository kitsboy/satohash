import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
    ShieldCheck, ChevronRight, Globe, Lock, Clock, ArrowRight, 
    Sparkles, Cpu, FileCheck, Library, Network, Zap, Boxes, 
    Gavel, Shield, Activity, Fingerprint, MousePointer2,
    BookOpen, Hash, CheckCircle2
} from 'lucide-react'
import LiveNetworkDashboard from '../components/LiveNetworkDashboard'
import GlobalActivity from '../components/GlobalActivity'

const FeatureCard = ({ icon: Icon, title, description, delay, accent = 'indigo' }) => {
  const colors = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', glow: 'group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-all duration-500' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', glow: 'group-hover:bg-violet-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-violet-500/20 transition-all duration-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', glow: 'group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-500' },
  }
  const c = colors[accent]
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 100, delay }}
      className="glass-card group cursor-default p-10 bg-white border-slate-100 hover:border-indigo-100 hover:shadow-[0_20px_50px_-15px_rgba(79,70,229,0.12)] transition-all"
    >
      <div className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl ${c.bg} ${c.text} ${c.glow}`}>
        <Icon size={24} />
      </div>
      <h3 className="mb-3 text-xl font-extrabold tracking-tight text-indigo-900">
        {title}
      </h3>
      <p className="text-sm font-medium leading-relaxed text-slate-500">
        {description}
      </p>
    </motion.div>
  )
}

const StatItem = ({ label, value, sub }) => (
  <div className="text-center lg:text-left group cursor-pointer">
    <p className="mb-2 text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-300 group-hover:text-indigo-400 transition-colors">{label}</p>
    <p className="mb-1 text-4xl md:text-5xl font-extrabold tracking-tighter text-white">{value}</p>
    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{sub}</p>
  </div>
)

export default function Landing() {
  const { scrollYProgress } = useScroll()
  const yRange = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacityRange = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <div className="min-h-screen bg-[#fcfcfc] selection:bg-indigo-500/30 overflow-hidden">
      
      {/* ── Background Mesh ──────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0">
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
      <section className="relative mx-auto flex max-w-[90rem] flex-col items-center px-6 pt-48 md:pt-56 pb-32 text-center relative z-10">
        <motion.div style={{ opacity: opacityRange, y: yRange }} className="w-full">

          {/* Protocol Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pill-indigo mx-auto mb-10 flex h-10 items-center justify-center gap-3 bg-white border-2 border-indigo-50 shadow-lg shadow-indigo-500/5"
          >
            <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse shadow-[0_0_8px_#4f46e5]" />
            <span className="text-[10px] font-bold tracking-[0.15em] text-indigo-900 uppercase">
              Satohash Protocol v4.0 · Sovereign Mesh Active
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="mx-auto mb-8 max-w-5xl text-5xl font-extrabold leading-[0.95] tracking-tighter text-indigo-900 md:text-[8rem]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Mathematical <br />
            <span className="text-gradient">Finality.</span>
          </motion.h1>

          <motion.p
            className="mx-auto mb-12 max-w-2xl text-lg md:text-xl font-medium leading-relaxed text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            The global standard for cryptographic attestation. Anchor documents, 
            identities, and archives to the Bitcoin network with institutional-grade 
            witnessing and zero-knowledge privacy.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/dashboard" className="w-full sm:w-auto">
              <button className="group relative w-full sm:w-auto h-16 md:h-18 min-w-[260px] overflow-hidden rounded-2xl bg-indigo-900 px-10 text-[12px] font-extrabold uppercase tracking-[0.2em] text-white shadow-2xl shadow-indigo-500/30 transition-all hover:scale-[1.03] active:scale-[0.97]">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-400 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative flex items-center justify-center gap-3">
                  Open Workbench <ChevronRight size={16} />
                </span>
              </button>
            </Link>
            <Link to="/developers" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-16 md:h-18 min-w-[260px] rounded-2xl border-2 border-indigo-100 bg-white px-10 text-[12px] font-extrabold uppercase tracking-[0.2em] text-indigo-900 transition-all hover:bg-indigo-50 hover:border-indigo-200">
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
          className="relative mt-32 w-full max-w-7xl overflow-hidden rounded-3xl md:rounded-[3rem] bg-white border-2 border-slate-100 p-2 shadow-[0_40px_100px_-20px_rgba(79,70,229,0.15)] group"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-50 px-8 md:px-12 py-6 bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              </div>
              <span className="ml-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hidden sm:block">
                Sovereign Kernel Mesh v4.0
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-widest hidden sm:block">Witness Node Sync Nominal</span>
            </div>
          </div>
          
          <div className="relative p-6 md:p-12 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent h-64 bottom-0 z-10 pointer-events-none" />
             <div className="mb-16 grid lg:grid-cols-2 gap-8 items-end">
                <div className="text-left">
                   <div className="pill-indigo w-fit mb-4">Oracle Layer v2</div>
                   <h3 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-indigo-900 leading-tight">
                     Decentralized <br /> Witness Mesh Telemetry.
                   </h3>
                </div>
                <div className="flex justify-start lg:justify-end gap-12">
                   <div className="text-center">
                      <div className="text-2xl md:text-3xl font-extrabold text-indigo-900">845,922</div>
                      <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Height</div>
                   </div>
                   <div className="text-center">
                      <div className="text-2xl md:text-3xl font-extrabold text-emerald-600">99.999%</div>
                      <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Uptime</div>
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
          className="text-center mb-20"
        >
          <div className="pill-indigo mx-auto mb-6 w-fit">
            <BookOpen size={12} /> Learn
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-indigo-900 mb-6">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="mx-auto max-w-xl text-lg font-medium text-slate-500 leading-relaxed">
            Three simple steps to create mathematically provable evidence that your document existed at a specific point in time.
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
              className="step-card text-left group"
            >
              <div className="flex items-start gap-5 mb-6">
                <div className="step-number shrink-0">{item.step}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-extrabold tracking-tight text-indigo-900 mb-3">{item.title}</h3>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed mb-4">{item.desc}</p>
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
      <section className="bg-[#0c1220] py-20 border-y border-white/5 relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ background: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            <StatItem label="Finality"  value="Bitcoin" sub="PoW Consensus" />
            <StatItem label="Privacy"   value="ZK-SHA"  sub="Local Hashing" />
            <StatItem label="Audit"     value="SEC Ready" sub="Institutional" />
            <StatItem label="Network"   value="Global"  sub="1,400+ Nodes" />
          </div>
        </div>
      </section>

      {/* ── Feature Grid ──────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="max-w-3xl">
                <div className="pill-indigo mb-5 w-fit">Protocol Topology</div>
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-indigo-900 mb-6 leading-none">
                    Built for the <br /> <span className="text-gradient">Sovereign Class.</span>
                </h2>
                <p className="max-w-xl text-lg font-medium text-slate-500 leading-relaxed">
                    Universal infrastructure for securing institutional assets, legal evidence, 
                    and cryptographic identities on the world&apos;s most resilient network.
                </p>
            </div>
            <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-2xl border border-slate-100">
               <ShieldCheck size={28} className="text-indigo-600" />
               <div>
                 <h4 className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest mb-1">Judicial Alignment</h4>
                 <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em]">Verified Secure eIDAS</p>
               </div>
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={Lock} accent="indigo" title="ZK-Privacy Shields" description="Your documents never leave your local environment. We anchor SHA-256 fingerprints with absolute data sovereignty." delay={0.1} />
          <FeatureCard icon={Clock} accent="violet" title="Temporal Finality" description="Anchored via OpenTimestamps, providing immutable proof of existence at an auditable Bitcoin block height." delay={0.2} />
          <FeatureCard icon={Globe} accent="emerald" title="Nostr Mesh Propagation" description="Proofs are broadcast across 100+ global relays, ensuring censorship resistance and universal verification." delay={0.3} />
          <FeatureCard icon={Zap} accent="indigo" title="BOLT-12 Settlement" description="Reusable Lightning Network payment addresses for automated institutional subscriptions. No invoices, just truth." delay={0.15} />
          <FeatureCard icon={Gavel} accent="violet" title="Expert Witnessing" description="Court-ready Affidavit PDFs that interpret Bitcoin consensus into legally superior evidentiary fact." delay={0.25} />
          <FeatureCard icon={Network} accent="emerald" title="Oracle Mesh Nodes" description="A distributed network of Witness Nodes that cross-validate proofs. Redundant, trustless, and persistent." delay={0.35} />
        </div>
      </section>

      {/* ── Global Witness Stream ──────────────── */}
      <section className="mx-auto max-w-[90rem] px-6 pb-32">
        <div className="rounded-3xl md:rounded-[3.5rem] overflow-hidden p-10 md:p-16 bg-white border-2 border-slate-100 shadow-xl relative group">
          <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none group-hover:scale-110 transition-all duration-1000">
              <Boxes size={240} className="text-indigo-900" />
          </div>
          <div className="grid items-center gap-16 lg:grid-cols-2 relative z-10">
            <GlobalActivity />
            <div className="text-left">
              <div className="pill-emerald mb-6 w-fit">Protocol Telemetry Live</div>
              <h2 className="mb-8 text-4xl md:text-6xl font-extrabold tracking-tighter text-indigo-900 leading-none">
                Mesh <br />
                <span className="text-gradient">Truth Log.</span>
              </h2>
              <div className="space-y-10">
                <EvidenceItem icon={Activity} label="Real-Time Attribution" desc="Every stamp is verifiable via the global mesh in under 60 seconds." />
                <EvidenceItem icon={Fingerprint} label="Forensic Integrity" desc="Instant verification via block explorers and local institutional tooling." />
              </div>
              <Link to="/dashboard" className="mt-12 inline-flex">
                <button className="h-16 px-10 rounded-2xl bg-indigo-900 text-white font-extrabold uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 hover:scale-[1.03] active:scale-[0.97] transition-all">
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
          className="rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50/50 border border-indigo-100 p-10 md:p-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <BookOpen size={20} className="text-indigo-600" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-600">Educational Guide</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-indigo-900 mb-6">
            What is Bitcoin Timestamping?
          </h3>
          <div className="space-y-4 text-[15px] leading-[1.8] text-slate-600 font-medium">
            <p>
              <strong className="text-indigo-900">Bitcoin timestamping</strong> is the process of creating a permanent, tamper-proof record that a piece of data existed at a specific moment in time. Think of it as a <strong className="text-indigo-900">digital notary</strong> powered by mathematics instead of trust.
            </p>
            <p>
              When you timestamp a document, we don&apos;t store your file. Instead, we create a cryptographic hash — a unique mathematical fingerprint — and embed it into the Bitcoin blockchain. Because Bitcoin blocks are practically impossible to alter, your proof becomes <strong className="text-indigo-900">permanent and tamper-proof</strong>.
            </p>
            <p>
              This technology is used by <strong className="text-indigo-900">legal professionals, journalists, artists, and enterprises</strong> to prove document authenticity, protect intellectual property, and create court-admissible evidence — all without relying on any centralized authority.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/about">
              <button className="btn-holographic text-[10px]">
                Read the Whitepaper
              </button>
            </Link>
            <Link to="/developers">
              <button className="btn-secondary text-[10px]">
                Explore the API
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Final CTA ─────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="relative overflow-hidden rounded-3xl md:rounded-[3.5rem] p-16 md:p-24 text-center bg-indigo-900 shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)]">
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full pointer-events-none opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(79,70,229,1) 0%, transparent 70%)' }}
          />
          <h2 className="relative z-10 mb-6 text-5xl md:text-7xl font-extrabold tracking-tighter text-white">Ready to Anchor?</h2>
          <p className="relative z-10 mx-auto mb-12 max-w-xl text-lg font-medium text-indigo-200/60 leading-relaxed">
            Join the Oracle Mesh and make your digital artifacts permanently, mathematically provable.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
             <Link to="/dashboard" className="w-full sm:w-auto">
               <button className="w-full sm:w-auto min-w-[260px] h-16 rounded-2xl bg-white text-indigo-900 font-extrabold text-[12px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all hover:scale-[1.03] shadow-xl">
                 Launch Workbench
               </button>
             </Link>
             <Link to="/trust" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto min-w-[260px] h-16 rounded-2xl bg-transparent border-2 border-white/20 text-white font-extrabold text-[12px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
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
        <div className="flex gap-6 group">
            <div className="mt-1 h-14 w-14 shrink-0 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <Icon size={24} />
            </div>
            <div>
                <h4 className="text-lg font-extrabold tracking-tight text-indigo-900 mb-2 group-hover:text-indigo-600 transition-colors">{label}</h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
