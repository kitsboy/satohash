import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShieldCheck, Clock, FileLock, CheckCircle2, ChevronRight, Zap, Globe, Lock } from 'lucide-react'
import LiveNetworkDashboard from '../components/LiveNetworkDashboard'
import GlobalActivity from '../components/GlobalActivity'

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ type: 'spring', stiffness: 100, delay }}
    className="glass-card group p-10 hover:bg-white/[0.05]"
  >
    <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-indigo-400 ring-1 ring-white/10 transition-transform group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-[0_0_30px_#6366f1]">
      <Icon size={24} />
    </div>
    <h3 className="mb-4 text-2xl font-black text-white uppercase italic tracking-tighter italic">{title}</h3>
    <p className="text-sm font-medium leading-relaxed text-white/40 italic">{description}</p>
  </motion.div>
)

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const yRange = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityRange = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="min-h-screen pt-32 pb-24">
      {/* Hero Section */}
      <section className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-20 text-center md:pb-40">
        <motion.div style={{ opacity: opacityRange, y: yRange }} className="relative z-10">
            <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12 inline-flex items-center gap-3 rounded-full bg-white/5 px-6 py-2.5 text-[10px] font-black tracking-[0.3em] text-white/60 uppercase italic ring-1 ring-white/10 backdrop-blur-3xl"
            >
            <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400"></span>
            </span>
            Satohash Protocol v2.5.0 Deployment Live
            </motion.div>

            <motion.h1
            className="font-display mb-10 max-w-5xl text-6xl leading-[0.95] font-black tracking-tighter text-white uppercase italic md:text-9xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            >
            Immutable <br />
            <span className="text-gradient">Digital Truth.</span>
            </motion.h1>

            <motion.p
            className="mb-14 max-w-3xl text-xl font-medium leading-[1.6] text-white/40 italic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            >
            The global standard for cryptographic attestation. Anchor your documents, source code, and assets to the Bitcoin blockchain with zero-knowledge privacy.
            </motion.p>

            <motion.div
            className="flex flex-col gap-6 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            >
            <Link to="/dashboard">
                <button className="btn-holographic min-w-[200px] flex items-center justify-center gap-3 group">
                Enter Protocol Center
                <ChevronRight className="transition-transform group-hover:translate-x-1" size={16} />
                </button>
            </Link>
            <Link to="/verify">
                <button className="min-w-[200px] flex items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] italic text-white/60 transition-all hover:bg-white/10 hover:text-white">
                <ShieldCheck size={16} /> Verify Evidence
                </button>
            </Link>
            </motion.div>
        </motion.div>

        {/* Cinematic Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="group relative mt-32 w-full max-w-6xl cursor-crosshair overflow-hidden rounded-[4rem] border border-white/5 bg-[#0a0c14] shadow-[0_0_100px_rgba(0,0,0,0.8)]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#05060f] via-transparent to-transparent z-10" />
          <LiveNetworkDashboard />

          <div className="absolute top-12 left-12 z-20 text-left">
            <span className="mb-2 block font-mono text-[9px] font-black tracking-[0.4em] text-white/30 uppercase">
              Consensus Layer
            </span>
            <h3 className="text-3xl font-black tracking-tighter text-white uppercase italic">
              Global Witness Node Mesh
            </h3>
          </div>
        </motion.div>
      </section>

      {/* Stats Divider */}
      <section className="bg-white/[0.02] border-y border-white/5 py-16">
        <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {[
                    { l: "Uptime", v: "99.99%", s: "Decentralized" },
                    { l: "Consensus", v: "Bitcoin", s: "Proof-of-Work" },
                    { l: "Audit", v: "SEC-Ready", s: "Institutional" },
                    { l: "Privacy", v: "ZK-SHA256", s: "Zero Leak" }
                ].map((s, i) => (
                    <div key={i} className="text-center md:text-left">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 italic">{s.l}</p>
                        <p className="text-4xl font-black text-white italic tracking-tighter mb-1">{s.v}</p>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">{s.s}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Institutional Features */}
      <section className="mx-auto max-w-7xl px-6 py-40">
        <div className="mb-24 text-center">
            <h2 className="mb-6 text-5xl font-black italic tracking-tighter text-white uppercase italic md:text-7xl">
                Built for <br /> <span className="text-indigo-400">Sovereign Trust.</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg font-medium text-white/30 italic">
                A mission-critical protocol for securing corporate assets and intellectual property on the world's most secure network.
            </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={Lock}
            title="ZK-Privacy"
            description="Your documents never leave your browser. We generate a SHA-256 fingerprint locally, ensuring total data sovereignty."
            delay={0.1}
          />
          <FeatureCard
            icon={Clock}
            title="Immutability"
            description="Anchored into the Bitcoin blockchain via OpenTimestamps, providing permanent proof of existence at a specific block height."
            delay={0.2}
          />
          <FeatureCard
            icon={Globe}
            title="Nostr Mesh"
            description="Proofs are broadcast across the Nostr relay network, ensuring global accessibility and censorship resistance."
            delay={0.3}
          />
        </div>
      </section>

      {/* Interactive Global Feed */}
      <section className="mx-auto max-w-7xl px-6 pb-40">
        <div className="glass-card overflow-hidden bg-white/[0.01] p-12 md:p-24 border-white/5">
            <div className="grid items-center gap-24 lg:grid-cols-2">
                <GlobalActivity />
                <div className="text-left">
                    <h2 className="mb-10 text-6xl font-black italic tracking-tighter text-white uppercase italic leading-[0.9]">
                        Decentralized <br /> <span className="text-emerald-400">Witness Log.</span>
                    </h2>
                    <div className="space-y-10">
                        <div className="flex gap-6">
                            <div className="h-px w-12 bg-emerald-500 mt-4 h-1 shadow-[0_0_10px_#10b981]" />
                            <div>
                                <h4 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">Real-time Attribution</h4>
                                <p className="text-sm font-medium text-white/30 italic">Every stamp is verifiable by the global community in under 60 seconds.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="h-px w-12 bg-indigo-500 mt-4 h-1 shadow-[0_0_10px_#6366f1]" />
                            <div>
                                <h4 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">Audit Transparency</h4>
                                <p className="text-sm font-medium text-white/30 italic">Instant verification via public block explorers and OTS tools.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  )
}
