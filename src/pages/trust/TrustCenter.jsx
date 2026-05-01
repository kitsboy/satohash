import { motion } from 'framer-motion'
import {
  Shield,
  Lock,
  Scale,
  Globe,
  Binary,
  CheckCircle,
  ChevronRight,
  Activity,
  Zap,
  ShieldAlert,
  Cpu
} from 'lucide-react'
import GlobalJurisdictionMap from '../../components/GlobalJurisdictionMap'
import ProofAnalytics from '../../components/ProofAnalytics'

export default function TrustCenter() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-40 pb-32 text-[var(--text-primary)]">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-[var(--accent-active)] opacity-10 blur-[150px]" />
        <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-[var(--accent-purple)] opacity-5 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-8">
        {/* Hero Section */}
        <section className="mb-32 space-y-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto mb-10 flex w-fit items-center gap-3 rounded-full border border-[var(--border-bright)] bg-[var(--surface-raised)]/60 px-5 py-2 shadow-[0_0_20px_rgba(59,130,246,0.1)] backdrop-blur-xl"
          >
            <Shield size={14} className="text-[var(--accent-active)]" />
            <span className="font-mono text-[10px] font-black tracking-[0.2em] text-[var(--text-secondary)] uppercase">
              Sovereign Protocol Transparency Dashboard
            </span>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl leading-[0.85] font-extrabold tracking-tighter uppercase md:text-9xl"
          >
            Institutional <br />
            <span className="bg-gradient-to-r from-[var(--accent-active)] via-[var(--accent-purple)] to-[var(--accent-success)] bg-clip-text text-transparent">
              Trust.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-auto max-w-3xl text-xl leading-relaxed font-medium text-[var(--text-secondary)] md:text-2xl"
          >
            Mathematical proof of existence and integrity. We bridge the gap between decentralized
            protocol reality and institutional-grade legal requirements.
          </motion.p>
        </section>

        {/* Global Jurisdiction Section (The "Cool Card Feature") */}
        <section className="mb-40">
          <GlobalJurisdictionMap />
        </section>

        {/* Core Trust Pillars */}
        <section className="mb-40">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Cpu,
                title: 'Network Security',
                desc: "Anchored directly into the Bitcoin blockchain via the world's most secure Proof-of-Work network.",
                color: 'var(--accent-active)'
              },
              {
                icon: Lock,
                title: 'Zero Leak Privacy',
                desc: 'Secure local-first hashing ensures your source documents never leave your local environment.',
                color: 'var(--accent-purple)'
              },
              {
                icon: Scale,
                title: 'Legal Standing',
                desc: 'Compliant with ESIGN, UETA, and eIDAS Article 41 for electronic timestamping integrity.',
                color: 'var(--accent-success)'
              },
              {
                icon: ShieldAlert,
                title: 'Forensic Audit',
                desc: 'Proofs are independently verifiable via open-source tools and public block explorers.',
                color: 'var(--accent-danger)'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-10 transition-all hover:border-[var(--border-bright)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                <div
                  className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border transition-all group-hover:scale-110"
                  style={{
                    borderColor: `${item.color}30`,
                    backgroundColor: `${item.color}05`,
                    color: item.color
                  }}
                >
                  <item.icon size={28} />
                </div>
                <h3 className="mb-4 text-lg font-bold tracking-tight text-white uppercase">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed font-medium text-[var(--text-secondary)]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Dynamic Analytics Block */}
        <section className="mb-40">
          <ProofAnalytics />
        </section>

        {/* Institutional Commitment Banner */}
        <section className="relative overflow-hidden rounded-[4rem] border border-[var(--border-bright)] bg-[var(--bg-secondary)] p-16 text-center md:p-24">
          {/* Grid Pattern Overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(var(--text-secondary) 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}
          />

          <div className="relative z-10 space-y-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--accent-success)]/10 text-[var(--accent-success)] shadow-[0_0_50px_rgba(16,185,129,0.2)]">
              <Shield Check size={48} />
            </div>

            <h2 className="text-4xl leading-none font-black tracking-tighter uppercase md:text-6xl">
              Institutional Ready. <br />
              <span className="text-[var(--text-secondary)]">Judicial Hardened.</span>
            </h2>

            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <ComplianceBadge label="eIDAS Ready" status="Certified" />
              <ComplianceBadge label="ESIGN Act" status="Compliant" />
              <ComplianceBadge label="UETA Laws" status="Active" />
              <ComplianceBadge label="ZK-SHA256" status="Hardened" />
            </div>

            <p className="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-[var(--text-secondary)]">
              Satohash is constructed to survive judicial scrutiny. Our proofs are mathematically
              self-evident, requiring no central authority for verification after anchoring.
            </p>

            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <button className="flex h-16 w-full min-w-[240px] items-center justify-center gap-3 rounded-2xl bg-white text-[12px] font-extrabold tracking-[0.2em] text-black uppercase transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] sm:w-auto">
                Verify a Global Proof <ChevronRight size={18} />
              </button>
              <button className="flex h-16 w-full min-w-[240px] items-center justify-center gap-3 rounded-2xl border border-[var(--border-bright)] bg-white/5 text-[12px] font-extrabold tracking-[0.2em] text-white uppercase backdrop-blur-md transition-all hover:bg-white/10 sm:w-auto">
                Technical Specification
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function ComplianceBadge({ label, status }) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] font-black tracking-[0.3em] text-[var(--text-secondary)] uppercase opacity-60">
        {label}
      </div>
      <div className="flex items-center justify-center gap-2 text-xl font-bold text-white">
        <CheckCircle size={16} className="text-[var(--accent-success)]" />
        {status}
      </div>
    </div>
  )
}
