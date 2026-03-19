import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShieldCheck, Clock, FileLock, CheckCircle2, ChevronRight, Zap } from 'lucide-react'
import LiveNetworkDashboard from '../components/LiveNetworkDashboard'
import GlobalActivity from '../components/GlobalActivity'

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="glass-card group rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10"
  >
    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-110">
      <Icon size={24} />
    </div>
    <h3 className="mb-3 text-xl font-bold text-slate-900">{title}</h3>
    <p className="leading-relaxed text-slate-500">{description}</p>
  </motion.div>
)

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden pt-24">
      {/* Hero Section */}
      <section className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-20 text-center md:pb-32">
        {/* Background Gradients & Ornaments */}
        <div className="animate-pulse-slow absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-200/30 via-purple-200/30 to-rose-200/30 blur-3xl" />
        <div className="animate-float absolute top-40 -left-20 -z-10 h-64 w-64 rounded-full bg-yellow-200/20 blur-3xl" />
        <div
          className="animate-float absolute -right-20 bottom-40 -z-10 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl"
          style={{ animationDelay: '2s' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-4 py-2 text-xs font-bold tracking-widest text-indigo-700 uppercase shadow-sm backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600"></span>
          </span>
          Protocol v2.4 Live
        </motion.div>

        <motion.h1
          className="font-display mb-8 max-w-4xl text-5xl leading-tight font-bold tracking-tight md:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Immutable Truth for the <br />
          <span className="text-gradient">Digital Age.</span>
        </motion.h1>

        <motion.p
          className="mb-10 max-w-2xl text-xl leading-relaxed text-slate-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Secure your documents, ideas, and contracts on the Bitcoin blockchain forever.
          Zero-knowledge proof means your data never leaves your device.
        </motion.p>

        <motion.div
          className="flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link to="/welcome">
            <button className="group flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-slate-900/20 transition-colors hover:bg-slate-800">
              Start Notarizing{' '}
              <ChevronRight className="transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
          <Link to="/verify">
            <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-900 shadow-sm transition-colors hover:border-indigo-200 hover:bg-indigo-50/50">
              <ShieldCheck size={20} /> Verify Proof
            </button>
          </Link>
        </motion.div>

        {/* Demo Live Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="group relative mt-20 w-full max-w-5xl cursor-pointer overflow-hidden rounded-[32px] shadow-2xl"
        >
          <LiveNetworkDashboard />

          {/* Hover Overlay Title */}
          <div className="absolute top-8 left-8 z-20 text-left">
            <span className="mb-2 block font-mono text-[10px] tracking-[0.4em] text-white/60 uppercase">
              Network Status
            </span>
            <h3 className="text-xl font-black tracking-tighter text-white uppercase">
              Live Protocol Nodes
            </h3>
          </div>

          <div className="pointer-events-none absolute inset-0 bg-indigo-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
        </motion.div>
      </section>

      {/* Activity Feed Section */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div>
            <h2 className="font-display mb-6 text-4xl font-black tracking-tight text-slate-900 uppercase">
              Real-time Protocol Activity
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-slate-500">
              Watch as documents are cryptographically anchored to the blockchain across the globe.
              The Satohash network is processing decentralized trust every second.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">99.99% Uptime Guarantee</h4>
                  <p className="text-sm text-slate-500">
                    Decentralized calendar nodes ensure your proofs are always processed.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Live Bitcoin Connection</h4>
                  <p className="text-sm text-slate-500">
                    Real-time monitoring of mempool and block confirmations.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <GlobalActivity />
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-slate-200 bg-white/50 py-12 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="mb-8 text-sm font-medium tracking-widest text-slate-400 uppercase">
            Trusted by builders at
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale transition-all duration-500 hover:grayscale-0">
            {/* Simulated Logos */}
            <span className="font-display text-xl font-bold">Stripe</span>
            <span className="font-display text-xl font-bold">Vercel</span>
            <span className="font-display text-xl font-bold">Opentimestamps</span>
            <span className="font-display text-xl font-bold">Blockstream</span>
            <span className="font-display text-xl font-bold">Paradigm</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={FileLock}
            title="Cryptographic Hash"
            description="We generate a SHA-256 fingerprint of your file locally. Your actual data never leaves your browser, ensuring total privacy."
            delay={0.1}
          />
          <FeatureCard
            icon={Clock}
            title="Bitcoin Timestamp"
            description="Your file's fingerprint is anchored into the Bitcoin blockchain using the OpenTimestamps protocol, proving existence at a specific time."
            delay={0.2}
          />
          <FeatureCard
            icon={CheckCircle2}
            title="Independent Verification"
            description="Anyone can verify your proof using the standalone .ots file, without relying on our servers or third-party validators."
            delay={0.3}
          />
        </div>
      </section>
    </div>
  )
}
