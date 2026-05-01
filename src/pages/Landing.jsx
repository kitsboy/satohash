import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  Globe,
  Lock,
  ArrowRight,
  Cpu,
  Network,
  Fingerprint,
  FileText,
  Activity,
  Shield,
  Code2,
  Building2,
  Smartphone,
  Stamp
} from 'lucide-react'
import { useEffect } from 'react'
import LiveNetworkDashboard from '../components/LiveNetworkDashboard'
import MerkleHeart from '../components/MerkleHeart'
import Footer from '../components/Footer'

const PlaneCard = ({ icon: Icon, title, description, delay, accent = 'indigo' }) => {
  const accentColors = {
    indigo: 'text-[var(--accent-active)]',
    amber: 'text-[var(--accent-pending)]',
    green: 'text-[var(--accent-success)]',
    red: 'text-[var(--accent-danger)]',
    purple: 'text-[var(--accent-purple)]'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 100, delay }}
      className="group relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-10 transition-all hover:border-[var(--border-bright)] hover:bg-[var(--surface-raised)]/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-0 transition-opacity group-hover:opacity-5" />

      <div
        className={`mb-8 flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] transition-all group-hover:scale-110 group-hover:border-[var(--accent-active)]/50 ${accentColors[accent]}`}
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

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 25, stiffness: 150 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[var(--accent-active)]/30">
      <motion.div
        className="pointer-events-none fixed inset-0 z-50 opacity-40 mix-blend-screen"
        style={{
          background: `radial-gradient(600px circle at ${mouseXSpring}px ${mouseYSpring}px, rgba(59, 130, 246, 0.15), transparent 80%)`
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-rule='evenodd' stroke='%23fff' stroke-width='1' fill='none'/%3E%3C/svg%3E\")",
          backgroundSize: '80px 80px'
        }}
      />

      <nav className="fixed top-0 right-0 left-0 z-[100] flex items-center justify-between border-b border-white/5 px-8 py-6 backdrop-blur-xl">
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[var(--accent-active)] opacity-20 blur-lg transition-opacity group-hover:opacity-40" />
            <img
              src="/logo.png"
              alt="Satohash"
              className="relative h-10 w-10 object-contain transition-transform group-hover:scale-110"
            />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase">
            Satohash
          </span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {['Vault', 'Trust', 'Templates', 'Atlas'].map((link) => (
            <Link
              key={link}
              to={`/${link.toLowerCase()}`}
              className="text-[10px] font-black tracking-[0.3em] text-[var(--text-secondary)] uppercase transition-colors hover:text-white"
            >
              {link}
            </Link>
          ))}
          <Link to="/access">
            <button className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-white/10">
              Sign In
            </button>
          </Link>
        </div>
      </nav>

      <div className="pointer-events-none absolute inset-0 z-0 h-[100vh] overflow-hidden">
        <MerkleHeart />
      </div>

      <main className="relative">
        <section className="relative z-10 mx-auto flex max-w-[90rem] flex-col items-center px-6 pt-64 pb-32 text-center">
          <motion.div style={{ opacity: opacityRange, y: yRange }} className="w-full">
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
              The Bitcoin-native operating system for zero-knowledge proof-of-existence,
              institutional verification, and forensic web capture. Redesigned for absolute clarity.
            </motion.p>

            <motion.div
              className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link to="/vault" className="w-full sm:w-auto">
                <button className="group relative flex h-16 w-full min-w-[280px] items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white text-[12px] font-extrabold tracking-[0.2em] text-black uppercase shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.05] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] active:scale-[0.98]">
                  <span className="relative z-10 flex items-center gap-3">
                    Access Workbench{' '}
                    <ChevronRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                </button>
              </Link>
              <Link to="/access" className="w-full sm:w-auto">
                <button className="group flex h-16 w-full min-w-[280px] items-center justify-center gap-3 rounded-2xl border border-[var(--border-bright)] bg-white/5 text-[12px] font-extrabold tracking-[0.2em] text-white uppercase backdrop-blur-lg transition-all hover:border-white/30 hover:bg-white/10 active:scale-[0.98]">
                  <Fingerprint
                    size={18}
                    className="text-[var(--accent-active)] transition-transform group-hover:scale-125"
                  />
                  Cryptographic Sign-In
                </button>
              </Link>
            </motion.div>

            <div className="relative mx-auto mt-20 max-w-lg">
              <div className="absolute -inset-10 rounded-full bg-[var(--accent-active)]/20 opacity-50 blur-[100px]" />
              <div className="group relative overflow-hidden rounded-[3rem] border border-[var(--border-bright)] bg-[var(--bg-secondary)]/80 p-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-[var(--accent-success)] shadow-[0_0_10px_var(--accent-success)]" />
                    <span className="text-[10px] font-black tracking-widest text-white/60 uppercase">
                      ANCHOR_IN_PROGRESS
                    </span>
                  </div>
                  <span className="font-mono text-[9px] font-bold text-[var(--accent-active)]">
                    TX_842142_S
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-active)]/20 text-[var(--accent-active)]">
                      <FileText size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-white">clinical_v2.pdf</p>
                      <p className="font-mono text-[9px] text-[var(--text-secondary)]">
                        e3b0c442...8b1a
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                        Witness Quorum
                      </p>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="h-1.5 w-6 rounded-full bg-[var(--accent-success)] shadow-[0_0_8px_var(--accent-success)]"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                        Epoch
                      </p>
                      <p className="font-mono text-xs font-bold text-white">841,202</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <div className="relative mb-32 overflow-hidden border-y border-white/5 bg-black/40 py-6 backdrop-blur-xl">
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="flex items-center gap-24 px-12 whitespace-nowrap"
          >
            {[
              { id: '1', block: '842,421', hash: 'E3B0C442', sats: '1.2M' },
              { id: '2', block: '842,425', hash: '8F92C3A2', sats: '4.2M' },
              { id: '3', block: '842,429', hash: 'C2E8A1F3', sats: '840K' },
              { id: '4', block: '842,432', hash: 'D4F1E9A2', sats: '12.4M' },
              { id: '5', block: '842,438', hash: '7A1B2C3D', sats: '2.1M' },
              { id: '6', block: '842,442', hash: 'B9A8C7D6', sats: '500K' },
              { id: '7', block: '842,448', hash: '1E2F3G4H', sats: '8.8M' },
              { id: '8', block: '842,455', hash: '5I6J7K8L', sats: '1.5M' }
            ].map((item) => (
              <div key={item.id} className="flex items-center gap-12">
                <div className="group flex cursor-default items-center gap-4">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent-success)] shadow-[0_0_12px_var(--accent-success)]" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">
                      PROTOCOL_ANCHOR
                    </span>
                    <span className="font-mono text-sm font-bold text-[var(--accent-active)]">{`BLOCK_${item.block} // ${item.hash}`}</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="group flex cursor-default items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-[var(--accent-purple)] shadow-[0_0_12px_var(--accent-purple)]" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">
                      INSTITUTIONAL_BATCH
                    </span>
                    <span className="font-mono text-sm font-bold text-[var(--accent-purple)]">{`${item.sats} ASSETS // SIG_VAL_ELITE`}</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/10" />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative mx-auto mb-12 h-24 max-w-7xl px-8">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            className="absolute top-1/2 left-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-active)] to-transparent opacity-20"
          />
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[var(--accent-active)] bg-[var(--bg-primary)] shadow-[0_0_15px_var(--accent-active-glow)]"
          />
        </div>

        <section className="mb-32">
          <div className="flex justify-center gap-12 opacity-30 grayscale md:gap-24">
            {['eIDAS', 'ESIGN', 'UETA', 'ETSI', 'NIST'].map((seal) => (
              <div key={seal} className="flex flex-col items-center gap-2">
                <Shield size={32} />
                <span className="text-[9px] font-black tracking-widest uppercase">
                  {seal} Ready
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-8 py-32">
          <div className="mb-20 space-y-6 text-center">
            <h2 className="text-4xl font-extrabold tracking-tighter uppercase md:text-7xl">
              Four Planes of <br />
              <span className="text-[var(--text-secondary)]">Forensic Verification.</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg font-medium text-[var(--text-secondary)]">
              Satohash operates across four distinct technical planes to ensure absolute data
              integrity and judicial admissibility.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <PlaneCard
              icon={Stamp}
              accent="indigo"
              title="Plane Alpha: Proof"
              description="Local-first ZK-hashing. Your data remains on-prem while the cryptographic fingerprints are prepared for anchoring."
              delay={0.1}
            />
            <PlaneCard
              icon={Globe}
              accent="amber"
              title="Plane Beta: Atlas"
              description="A temporal search engine mapping file hashes to historical blockchain states. Trace provenance across decades."
              delay={0.2}
            />
            <PlaneCard
              icon={Network}
              accent="green"
              title="Plane Gamma: Mesh"
              description="A decentralized network of witness nodes providing redundant attestation for every sovereign proof."
              delay={0.3}
            />
            <PlaneCard
              icon={Lock}
              accent="red"
              title="Plane Delta: Noir"
              description="The hardened security layer. Cold-storage proof management and encrypted vault orchestration."
              delay={0.4}
            />
          </div>
        </section>

        {/* Upgrade 11: API Strategy Section */}
        <section className="mx-auto max-w-[90rem] px-8 py-32">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full bg-[var(--accent-purple)]/10 px-4 py-2 text-[10px] font-bold tracking-widest text-[var(--accent-purple)] uppercase">
                <Code2 size={14} /> Programmable Truth
              </div>
              <h2 className="text-5xl font-extrabold tracking-tighter uppercase md:text-7xl">
                API <br />
                <span className="text-[var(--text-secondary)]">Strategy.</span>
              </h2>
              <p className="text-xl leading-relaxed font-medium text-[var(--text-secondary)]">
                Build on the universe&apos;s most secure computer network. Whether you are anchoring
                millions of financial ledgers or automating the sovereign history of your personal
                media stream, Satohash is your API for digital evidence.
              </p>
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="flex-1 space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
                  <Building2 className="text-[var(--accent-purple)]" size={32} />
                  <h4 className="font-bold tracking-tight text-white uppercase">Corporate</h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    High-volume batching for auditing and legal workflows.
                  </p>
                </div>
                <div className="flex-1 space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
                  <Smartphone className="text-[var(--accent-active)]" size={32} />
                  <h4 className="font-bold tracking-tight text-white uppercase">Personal</h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Automated proof-of-existence for mobile media and files.
                  </p>
                </div>
              </div>
              <Link to="/developer">
                <button className="flex h-14 items-center justify-center gap-3 rounded-xl border border-[var(--border-bright)] bg-white/5 px-8 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:bg-white/10">
                  Explore API Offerings <ArrowRight size={16} />
                </button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[var(--accent-active)]/20 via-transparent to-[var(--accent-purple)]/20 opacity-50 blur-3xl" />
              <div className="relative rounded-[3rem] border border-[var(--border-bright)] bg-black p-8 font-mono text-[11px] leading-relaxed shadow-2xl">
                <div className="mb-6 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500/50" />
                  <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                  <div className="h-2 w-2 rounded-full bg-green-500/50" />
                  <span className="ml-4 text-[9px] tracking-widest uppercase opacity-30">
                    satohash_api_v5.0.0
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="text-[var(--accent-active)]"># Anchor Financial Batch #772</div>
                  <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                    <span className="text-purple-400">POST</span> /v1/anchor <br />
                    <span className="text-blue-400">Authorization:</span> Bearer L402_TOKEN <br />
                    <span className="text-emerald-400">{`{ "hash": "e3b0c442...", "metadata": { "origin": "audit_ledger" } }`}</span>
                  </div>
                  <div className="text-white/40">{`> BATCH_MERKLE_ROOT: 0x8f2a... COMMITTED`}</div>
                  <div className="text-[var(--accent-success)]">{`> ANCHOR_SUCCESS: Block 842,125 Witnessed`}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-8 py-32">
          <div className="relative overflow-hidden rounded-[4rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-12 lg:p-24">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Cpu size={400} />
            </div>
            <div className="relative z-10 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 rounded-full bg-[var(--accent-active)]/10 px-4 py-2 text-[10px] font-bold tracking-widest text-[var(--accent-active)] uppercase">
                  <Activity size={14} /> Real-time Telemetry
                </div>
                <h2 className="text-5xl font-extrabold tracking-tighter uppercase md:text-7xl">
                  Protocol <br />
                  <span className="text-[var(--text-secondary)]">Activity.</span>
                </h2>
                <p className="text-xl leading-relaxed font-medium text-[var(--text-secondary)]">
                  Monitor the global Satohash mesh. Watch as hashes are bundled, witnesses attest,
                  and anchors are irrevocably committed to the Bitcoin blockchain.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/atlas">
                    <button className="active:scale-0.95 flex h-14 items-center justify-center gap-3 rounded-xl bg-[var(--text-primary)] px-8 text-[10px] font-bold tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-105">
                      Launch Atlas Explorer <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>
              </div>
              <div className="rounded-3xl border border-white/5 bg-[var(--bg-primary)] p-2 shadow-2xl">
                <LiveNetworkDashboard />
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: 200%;
          animation: marquee 30s linear infinite;
        }
      `
        }}
      />
    </div>
  )
}
