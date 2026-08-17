import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code,
  Key,
  Zap,
  Terminal,
  Shield,
  Copy,
  Check,
  Globe,
  Layers,
  Vote,
  Network,
  BookOpen,
  Info,
  Lock,
  ArrowRight,
  ShieldCheck,
  Repeat,
  Gavel,
  EyeOff,
  Boxes,
  Layers as LayersIcon,
  GraduationCap,
  History,
  Fingerprint,
  Hash,
  Lightbulb,
  CheckCircle2
} from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import PartnershipForm from '../components/forms/PartnershipForm'
import usePageMeta from '../hooks/usePageMeta'

export default function DeveloperPortal() {
  usePageMeta({ page: 'developer' })
  const [activeTab, setActiveTab] = useState('mesh')
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('API Key copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] selection:bg-indigo-500/30">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-indigo-100 bg-white pt-32 pb-20">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-indigo-50/20 to-transparent" />
        <div className="layout-container relative z-10">
          <div className="flex flex-col items-end justify-between gap-10 md:flex-row">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-900 text-white shadow-xl shadow-indigo-500/30"
              >
                <Code size={28} />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 text-5xl leading-none font-extrabold tracking-tighter text-indigo-900 md:text-7xl"
              >
                Sovereign <br /> <span className="text-gradient">API Mesh.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-xl text-lg leading-relaxed font-medium text-slate-500"
              >
                Build on the universe&apos;s most secure computer network. High-volume batching,
                institutional-grade notarization, and sovereign identity primitives.
              </motion.p>
            </div>

            <div className="flex gap-3">
              <LinkButton label="Mesh Explorer" to="/protocol-stats" icon={Network} />
              <LinkButton label="System Health" to="/trust" icon={ShieldCheck} primary />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs — Pill-based */}
      <div className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 shadow-sm backdrop-blur-2xl">
        <div className="layout-container flex items-center justify-between gap-4 overflow-x-auto py-3">
          <div className="flex items-center gap-1 rounded-2xl border border-slate-100 bg-slate-50 p-1">
            <TabButton
              active={activeTab === 'mesh'}
              onClick={() => setActiveTab('mesh')}
              label="Sovereign Mesh"
              icon={Boxes}
            />
            <TabButton
              active={activeTab === 'institutional'}
              onClick={() => setActiveTab('institutional')}
              label="Institutional"
              icon={Shield}
            />
            <TabButton
              active={activeTab === 'mastery'}
              onClick={() => setActiveTab('mastery')}
              label="Learn"
              icon={GraduationCap}
            />
            <TabButton
              active={activeTab === 'docs'}
              onClick={() => setActiveTab('docs')}
              label="Docs"
              icon={BookOpen}
            />
            <TabButton
              active={activeTab === 'keys'}
              onClick={() => setActiveTab('keys')}
              label="API Keys"
              icon={Key}
            />
          </div>
          <button
            onClick={() => setActiveTab('partnership')}
            className={`rounded-xl px-6 py-2.5 text-[10px] font-bold tracking-[0.1em] whitespace-nowrap uppercase transition-all ${activeTab === 'partnership' ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-500/20' : 'border border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
          >
            Join the Mesh
          </button>
        </div>
      </div>

      <main className="layout-container py-20">
        <AnimatePresence mode="wait">
          {activeTab === 'mesh' && (
            <motion.div
              key="mesh"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-24"
            >
              {/* ── Getting Started Guide ──────────────── */}
              <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50/30 p-10 md:p-14">
                <div className="mb-8 flex items-center gap-3">
                  <Lightbulb size={18} className="text-amber-500" />
                  <span className="text-[11px] font-bold tracking-[0.12em] text-amber-600 uppercase">
                    Quick Start Guide
                  </span>
                </div>
                <h3 className="mb-8 text-3xl font-extrabold tracking-tight text-indigo-900">
                  Get anchoring in under 5 minutes
                </h3>
                <div className="grid gap-6 md:grid-cols-4">
                  {[
                    {
                      step: '1',
                      label: 'Get API Key',
                      desc: 'Generate a production key from the API Workbench tab.',
                      icon: Key,
                      edu: 'Your key connects you securely to the Mesh. Never expose it in client-side code; strictly proxy requests through your own backend architecture.'
                    },
                    {
                      step: '2',
                      label: 'Hash Locally',
                      desc: 'SHA-256 hash your document client-side for privacy.',
                      icon: Hash,
                      edu: 'SHA-256 mathematically compresses any file into a unique 64-character secure string. Your actual document never leaves your machine, ensuring absolute zero-knowledge privacy.'
                    },
                    {
                      step: '3',
                      label: 'Submit Hash',
                      desc: 'POST the hash to our API. We anchor it to Bitcoin.',
                      icon: ArrowRight,
                      edu: 'Hashes are programmatically gathered in a Merkle tree. The final Merkle root is immutably anchored in an OP_RETURN data output directly on the Bitcoin blockchain.'
                    },
                    {
                      step: '4',
                      label: 'Verify Proof',
                      desc: 'Anyone can verify your proof with any Bitcoin node.',
                      icon: CheckCircle2,
                      edu: 'Using the OpenTimestamp standard, verification requires only the blockchain itself. You do not need to trust our servers or any third-party to prove cryptographic authenticity.'
                    }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative z-10 flex cursor-help flex-col items-start gap-4 rounded-2xl border border-indigo-50 bg-white p-6 shadow-sm transition-all hover:z-20 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl"
                    >
                      {/* Tooltip on hover */}
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 w-[min(16rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] -translate-x-1/2 opacity-0 transition-all duration-300 group-hover:-translate-y-2 group-hover:opacity-100">
                        <div className="relative rounded-2xl border border-indigo-500/30 bg-slate-900 p-5 text-[11px] leading-[1.8] font-medium text-indigo-100 shadow-2xl shadow-indigo-900/40">
                          <div className="mb-3 flex items-center gap-2">
                            <Info size={12} className="text-indigo-400" />
                            <span className="text-[9px] font-extrabold tracking-[0.2em] text-indigo-400 uppercase">
                              Protocol Insight
                            </span>
                          </div>
                          {item.edu}
                          <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-r border-b border-indigo-500/30 bg-slate-900" />
                        </div>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-extrabold text-white shadow-md shadow-indigo-500/20 transition-transform group-hover:scale-110">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="mb-1 text-sm font-extrabold text-indigo-900">
                          {item.label}
                        </h4>
                        <p className="text-[12px] leading-relaxed font-medium text-slate-500">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Feature Grid */}
              <div className="grid gap-6 md:grid-cols-3">
                <FeatureCard
                  icon={Layers}
                  title="Batch Notarization"
                  desc="Anchor up to 100,000 artifacts in a single Bitcoin transaction using our Merkle-aggregator."
                  stat="1.2ms/hash"
                />
                <FeatureCard
                  icon={Vote}
                  title="Democracy Protocol"
                  desc="Cryptographic voting primitives with anonymous verifiable anchors for referendums."
                  stat="NIP-46 Ready"
                />
                <FeatureCard
                  icon={Globe}
                  title="Global Attestation"
                  desc="Witness-mesh delivery ensures your proofs are propagated to 1,400+ mirror nodes instantly."
                  stat="99.99% Uptime"
                />
              </div>

              {/* API Visualizer */}
              <section className="space-y-10 border-b border-slate-100 pb-20">
                <div className="max-w-3xl">
                  <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-indigo-900">
                    High-Fidelity <span className="text-gradient">Developer Space.</span>
                  </h2>
                  <p className="text-base leading-relaxed font-medium text-slate-500">
                    Interactive, colorful, and built for speed. Experience the next generation of
                    Bitcoin-anchored settlement and privacy primitives.
                  </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                  {/* BOLT-12 */}
                  <div className="glass-card group relative overflow-hidden border-amber-100 bg-white p-10 shadow-lg">
                    <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-amber-500/5 blur-[60px] transition-all duration-700 group-hover:bg-amber-500/10" />
                    <div className="mb-8 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
                        <Zap size={24} className="fill-white" />
                      </div>
                      <span className="text-[10px] font-bold tracking-[0.2em] text-amber-600 uppercase">
                        L2 Settlement
                      </span>
                    </div>
                    <h3 className="mb-3 text-xl font-extrabold text-indigo-900">
                      BOLT-12 Sovereign Billing
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed font-medium text-slate-500">
                      Static, reusable payment offers. No more one-time invoices. Pay per anchor,
                      pay per batch, or subscribe via automated Lightning Budgets.
                    </p>
                    <div className="edu-callout">
                      <span className="edu-callout-title">What is BOLT-12?</span>
                      BOLT-12 is a Lightning Network standard for reusable payment offers — like a
                      static QR code that never expires.
                    </div>
                    <div className="mt-6 truncate rounded-2xl border border-amber-100 bg-amber-50 p-4 font-mono text-[10px] text-amber-900/40">
                      lno1pgqg...offer_address_reusable
                    </div>
                  </div>

                  {/* Fedimint */}
                  <div className="glass-card group relative overflow-hidden border-indigo-900/30 bg-[#0c1220] p-10 text-white shadow-[0_0_60px_rgba(79,70,229,0.12)]">
                    <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-10" />
                    <div className="relative z-10 mb-8 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/40">
                        <EyeOff size={24} />
                      </div>
                      <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-400 uppercase">
                        Privacy Shield
                      </span>
                    </div>
                    <h3 className="relative z-10 mb-3 text-xl font-extrabold text-white">
                      Fedimint Privacy Shields
                    </h3>
                    <p className="relative z-10 mb-4 text-sm leading-relaxed font-medium text-indigo-200/50">
                      Leverage &quot;Blind Mint&quot; technology to hide the relationship between
                      your identity and the specific batch anchor. Cryptographically secure
                      anonymity.
                    </p>
                    <div
                      className="edu-callout relative z-10"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderColor: 'rgba(255,255,255,0.1)'
                      }}
                    >
                      <span className="edu-callout-title" style={{ color: '#a5b4fc' }}>
                        What is Fedimint?
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Fedimint is a community-custody protocol that uses &quot;blind
                        signatures&quot; for privacy — your payments are unlinkable.
                      </span>
                    </div>
                    <div className="relative z-10 mt-6 flex gap-4">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-indigo-900">
                        <motion.div
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                          className="h-full w-1/3 bg-emerald-400 blur-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Endpoints & Docs */}
              <div className="grid items-start gap-16 lg:grid-cols-2">
                <div className="space-y-8">
                  <h3 className="text-2xl font-extrabold tracking-tight text-indigo-900">
                    Core Endpoints
                  </h3>
                  <div className="space-y-4">
                    <EndpointItem
                      method="POST"
                      path="/v1/batch/notarize"
                      desc="Anchor a Merkle-root of content hashes."
                    />
                    <EndpointItem
                      method="GET"
                      path="/v1/witness/quorum"
                      desc="Verify witness status across mirror nodes."
                    />
                    <EndpointItem
                      method="POST"
                      path="/v1/democracy/vote"
                      desc="Anchor a verifiable anonymous ballot."
                    />
                    <EndpointItem
                      method="GET"
                      path="/v1/identity/nip05"
                      desc="Resolve Satahash-verified Nostr IDs."
                    />
                  </div>
                </div>

                <div className="relative rounded-3xl border border-slate-100 bg-slate-50 p-8">
                  <Terminal size={32} className="absolute top-8 right-8 text-slate-200" />
                  <h4 className="mb-6 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                    Quickstart
                  </h4>
                  <pre className="overflow-x-auto rounded-2xl border border-slate-100 bg-white p-6 font-mono text-[11px] leading-relaxed text-indigo-900">
                    {`curl -X POST https://api.satohash.io/v1/anchor \\
  -H "Authorization: Bearer $SATOHASH_KEY" \\
  -d '{
    "hash": "0x4f...f21a",
    "metadata": {
      "origin": "court_entry_124",
      "mesh": "global"
    }
  }'`}
                  </pre>
                  <div className="edu-callout mt-4">
                    <span className="edu-callout-title">Tip</span>
                    Always hash your documents locally before submitting. The API only needs the
                    64-character SHA-256 hash, not your file.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'institutional' && (
            <motion.div
              key="institutional"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-24"
            >
              <div className="max-w-4xl">
                <h2 className="mb-6 text-4xl font-extrabold tracking-tighter text-indigo-900 md:text-6xl">
                  Premium <br /> <span className="text-gradient">Institutional Mesh.</span>
                </h2>
                <p className="max-w-2xl text-lg leading-relaxed font-medium text-slate-500">
                  High-volume anchors for legal firms, governments, and enterprise oracles.
                  Guaranteed priority on the global witness chain.
                </p>
              </div>

              <div className="grid gap-10 md:grid-cols-2">
                <InstitutionalFeature
                  icon={Repeat}
                  title="Recurring Notarization"
                  desc="Automated monthly anchor budgets via BOLT-12 offers."
                />
                <InstitutionalFeature
                  icon={Gavel}
                  title="Judicial White-Labeling"
                  desc="Your own branded notary portal with legal compliance anchors."
                />
                <InstitutionalFeature
                  icon={Network}
                  title="Liquid L2 Mesh"
                  desc="Instant 60-second anchors via the Liquid sidechain network."
                />
                <InstitutionalFeature
                  icon={LayersIcon}
                  title="Enterprise Quorum"
                  desc="Select your own mesh of witness nodes for private verification quorums."
                />
              </div>

              {/* Escrow Visual */}
              <div className="relative overflow-hidden rounded-3xl bg-indigo-900 p-12 text-white shadow-xl md:p-16">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                  <Shield size={160} />
                </div>
                <div className="relative z-10 grid items-center gap-16 lg:grid-cols-2">
                  <div>
                    <div className="mb-6 w-fit rounded-xl border border-white/5 bg-white/10 px-3 py-1.5 text-[9px] font-bold tracking-widest text-emerald-400 uppercase">
                      Protocol-Hedged Billing
                    </div>
                    <h3 className="mb-5 text-3xl font-extrabold tracking-tight">
                      Bitcoin <span className="text-indigo-400">&quot;Hedge&quot;</span> Escrow
                    </h3>
                    <p className="mb-8 text-base leading-relaxed font-medium text-indigo-200/50">
                      Our institutional model utilizes a unique escrow hedge. Pay in advance via
                      Lightning, and funds are only released as individual anchor proofs are
                      finalized.
                    </p>
                    <div
                      className="edu-callout"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderColor: 'rgba(255,255,255,0.1)'
                      }}
                    >
                      <span className="edu-callout-title" style={{ color: '#a5b4fc' }}>
                        How It Works
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Funds sit in a multi-sig escrow. Only when a Merkle proof is confirmed
                        on-chain does payment release to the protocol. Unanchored funds are
                        automatically refunded.
                      </span>
                    </div>
                    <ul className="mt-6 space-y-3">
                      <li className="flex items-center gap-3 text-sm font-bold text-indigo-200">
                        <ShieldCheck size={16} className="text-emerald-500" /> Automated Refund
                        Logic
                      </li>
                      <li className="flex items-center gap-3 text-sm font-bold text-indigo-200">
                        <ShieldCheck size={16} className="text-emerald-500" /> Proof-of-Anchor
                        Settlement
                      </li>
                    </ul>
                  </div>

                  <div className="glass-card rounded-3xl border-white/10 bg-white/5 p-10 backdrop-blur-2xl">
                    <div className="flex flex-col gap-6">
                      <EscrowStep
                        label="Lightning Deposit"
                        status="COMPLETE"
                        value="2.5M SATS"
                        active
                      />
                      <div className="ml-4 h-8 w-px border-l border-dashed bg-indigo-500/30" />
                      <EscrowStep
                        label="Merkle Anchoring"
                        status="PROCESSING"
                        value="12,500 ITEMS"
                        active
                        animate
                      />
                      <div className="ml-4 h-8 w-px border-l border-dashed bg-white/10" />
                      <EscrowStep label="Hedge Release" status="PENDING" value="1.8M SATS" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'mastery' && (
            <motion.div
              key="mastery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-24"
            >
              <div className="max-w-4xl">
                <h2 className="mb-6 text-4xl font-extrabold tracking-tighter text-indigo-900 md:text-6xl">
                  Mesh <br /> <span className="text-gradient-warm">Mastery.</span>
                </h2>
                <p className="max-w-2xl text-lg leading-relaxed font-medium text-slate-500">
                  Educational pathways for sovereign architects. Master the cryptographic primitives
                  that power the global truth layer.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <MasteryCard
                  icon={History}
                  title="Protocol History"
                  desc="From Proof-of-Work anchors to the modern witness mesh. Learn the evolution of cryptographic truth."
                  diff="Level 01"
                />
                <MasteryCard
                  icon={Fingerprint}
                  title="Identity Attestation"
                  desc="How NIP-05 and Bitcoin identities converge to create permanent, verifiable reputation."
                  diff="Level 02"
                  active
                />
                <MasteryCard
                  icon={Network}
                  title="Oracle Topology"
                  desc="Advanced mesh design for institutional nodes. Scaling to 1M+ anchors per block."
                  diff="Level 03"
                />
              </div>

              {/* Case Study */}
              <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-12 shadow-lg transition-all hover:border-indigo-100 md:p-16">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                  <Globe size={140} />
                </div>
                <div className="flex flex-col items-center gap-16 text-left md:flex-row">
                  <div className="md:w-1/2">
                    <div className="mb-4 text-[10px] font-bold tracking-[0.2em] text-indigo-400 uppercase">
                      Case Study · Democracy
                    </div>
                    <h3 className="mb-5 text-3xl font-extrabold tracking-tight text-indigo-900">
                      Securing the <br /> <span className="text-gradient">Global Ballot.</span>
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed font-medium text-slate-500">
                      Learn how the Democracy Node was utilized to anchor 4.2M anonymous ballots in
                      the sovereign referendum of 2026. Zero fraud. 100% Bitcoin finality.
                    </p>
                    <div className="edu-callout mb-8">
                      <span className="edu-callout-title">Why This Matters</span>
                      Traditional voting systems require trust in institutions. Bitcoin-anchored
                      voting removes that requirement entirely — every ballot is mathematically
                      verifiable.
                    </div>
                    <button className="btn-holographic">Explore Implementation</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:w-1/2">
                    <div className="flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-8">
                      <span className="text-2xl font-extrabold text-indigo-900">4.2M</span>
                      <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                        Ballots Anchored
                      </span>
                    </div>
                    <div className="flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-8">
                      <span className="font-mono text-2xl font-extrabold text-emerald-900">
                        0.00%
                      </span>
                      <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                        Verification Failure
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'docs' && <DocsContent />}
          {activeTab === 'keys' && (
            <KeysContent copyToClipboard={copyToClipboard} copied={copied} />
          )}
          {activeTab === 'partnership' && <PartnershipForm />}
        </AnimatePresence>
      </main>
    </div>
  )
}

function TabButton({ active, onClick, label, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-[10px] font-bold tracking-[0.1em] whitespace-nowrap uppercase transition-all ${
        active
          ? 'border border-slate-100 bg-white text-indigo-900 shadow-md'
          : 'text-slate-400 hover:text-indigo-600'
      }`}
    >
      <Icon size={13} />
      {label}
    </button>
  )
}

function MasteryCard({ icon: Icon, title, desc, diff, active }) {
  return (
    <div
      className={`glass-card group bg-white p-8 transition-all hover:shadow-xl ${active ? 'ring-2 ring-indigo-100' : ''}`}
    >
      <div
        className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl ${active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-50 text-slate-300'} transition-transform group-hover:scale-105`}
      >
        <Icon size={28} />
      </div>
      <div className="mb-2 text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
        {diff}
      </div>
      <h3 className="mb-3 text-lg font-extrabold text-indigo-900">{title}</h3>
      <p className="mb-6 text-[12px] leading-relaxed font-medium text-slate-500">{desc}</p>
      <button className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase group-hover:underline">
        Begin Roadmap <ArrowRight size={14} />
      </button>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc, stat }) {
  return (
    <div className="glass-card group bg-white p-8 transition-all hover:shadow-xl">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white">
        <Icon size={24} />
      </div>
      <div className="mb-2 text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
        {stat}
      </div>
      <h3 className="mb-3 text-lg font-extrabold text-indigo-900">{title}</h3>
      <p className="text-[12px] leading-relaxed font-medium text-slate-500">{desc}</p>
    </div>
  )
}

function EndpointItem({ method, path, desc }) {
  const color =
    method === 'POST' ? 'text-indigo-600 bg-indigo-50' : 'text-emerald-600 bg-emerald-50'
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 transition-all hover:border-indigo-100 hover:shadow-sm">
      <span className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase ${color}`}>
        {method}
      </span>
      <code className="flex-1 font-mono text-[11px] font-bold text-indigo-900 transition-colors group-hover:text-indigo-600">
        {path}
      </code>
      <span className="hidden text-[10px] font-medium text-slate-400 sm:block">{desc}</span>
    </div>
  )
}

function InstitutionalFeature({ icon: Icon, title, desc }) {
  return (
    <div className="group flex gap-6">
      <div className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-300 shadow-sm transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white">
        <Icon size={28} />
      </div>
      <div>
        <h4 className="mb-2 text-lg font-extrabold text-indigo-900 transition-colors group-hover:text-indigo-600">
          {title}
        </h4>
        <p className="text-sm leading-relaxed font-medium text-slate-500">{desc}</p>
      </div>
    </div>
  )
}

function EscrowStep({ label, status, value, active, animate }) {
  return (
    <div
      className={`flex items-center justify-between gap-8 ${active ? 'opacity-100' : 'opacity-30'}`}
    >
      <div className="flex items-center gap-6">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${active ? 'border-emerald-400 text-emerald-400' : 'border-white/20 text-white/20'}`}
        >
          {animate ? (
            <div className="h-3 w-3 animate-ping rounded-full bg-emerald-400" />
          ) : (
            <div className="h-3 w-3 rounded-full bg-current" />
          )}
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-widest text-indigo-200 uppercase">
            {label}
          </div>
          <div className="text-sm font-bold text-white">{value}</div>
        </div>
      </div>
      <span
        className={`rounded-lg bg-white/10 px-2.5 py-1 text-[8px] font-bold uppercase ${status === 'COMPLETE' ? 'text-emerald-400' : 'text-indigo-400'}`}
      >
        {status}
      </span>
    </div>
  )
}

function LinkButton({ label, to, icon: Icon, primary }) {
  const base =
    'px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-all flex items-center gap-2.5'
  const style = primary
    ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.03] active:scale-[0.97]'
    : 'bg-white border border-slate-100 text-indigo-900 hover:bg-slate-50 hover:border-slate-200'

  return (
    <Link to={to} className={`${base} ${style}`}>
      <Icon size={14} /> {label}
    </Link>
  )
}

function DocsContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid gap-10 lg:grid-cols-3"
    >
      <div className="space-y-10 lg:col-span-2">
        <h3 className="text-3xl font-extrabold tracking-tight text-indigo-900">
          Protocol <br /> Implementation
        </h3>
        <div className="prose prose-slate max-w-none text-[15px] leading-[1.8] font-medium text-slate-600">
          <p>
            The Satohash API Mesh utilizes <strong>RESTful primitives</strong> with{' '}
            <strong>Nostr-based event propagation</strong>. Every anchor request is processed
            locally, hashed, and then submitted to our global Merkle-aggregator.
          </p>
          <p>
            Institutional clients can utilize <strong>Permanent Witness Anchors</strong> which
            provide judicial-grade certificates recognized by global judiciaries under the{' '}
            <strong>ESIGN Act</strong>
            and <strong>eIDAS Article 41</strong>.
          </p>
        </div>

        <div className="edu-callout">
          <span className="edu-callout-title">Understanding Merkle Trees</span>A Merkle tree is a
          data structure that efficiently summarizes large sets of data. By combining hashes
          pairwise up to a single root, we can prove any individual hash was part of the tree
          without revealing the other hashes. This is how we anchor millions of documents in one
          Bitcoin transaction.
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="group flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-8 transition-all hover:bg-white hover:shadow-lg">
            <Shield className="text-indigo-600" size={22} />
            <h4 className="text-sm font-extrabold text-indigo-900">Cryptographic Integrity</h4>
            <p className="text-xs leading-relaxed font-medium text-slate-500">
              Learn about our SHA-256 and SHA-3 selection process for long-term secure hashing.
            </p>
            <button className="text-left text-[10px] font-bold text-indigo-600 uppercase underline decoration-indigo-200 decoration-2 underline-offset-4 group-hover:text-indigo-900">
              Read Security Audit
            </button>
          </div>
          <div className="group flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-8 transition-all hover:bg-white hover:shadow-lg">
            <Lock className="text-emerald-600" size={22} />
            <h4 className="text-sm font-extrabold text-emerald-900">Mesh Governance</h4>
            <p className="text-xs leading-relaxed font-medium text-slate-500">
              Understand how witness nodes reach consensus on anchor finality.
            </p>
            <button className="text-left text-[10px] font-bold text-emerald-600 uppercase underline decoration-emerald-200 decoration-2 underline-offset-4 group-hover:text-emerald-900">
              Explore Quorum Logic
            </button>
          </div>
        </div>
      </div>
      <div className="glass-card sticky top-32 h-fit bg-white p-8">
        <h4 className="mb-6 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
          Resource Library
        </h4>
        <ul className="space-y-5">
          <ResourceLink label="API Node Manifest" />
          <ResourceLink label="SDK (Go / Rust / TS)" />
          <ResourceLink label="Judicial Whitepaper" />
          <ResourceLink label="Nostr NIP-05 Guide" />
          <ResourceLink label="BOLT-12 Standard" />
        </ul>
      </div>
    </motion.div>
  )
}

function ResourceLink({ label }) {
  return (
    <li>
      <button className="group flex w-full items-center justify-between">
        <span className="text-xs font-bold text-indigo-900 transition-colors group-hover:text-indigo-600">
          {label}
        </span>
        <ArrowRight
          size={14}
          className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-indigo-600"
        />
      </button>
    </li>
  )
}

function KeysContent({ copyToClipboard, copied }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto max-w-3xl text-center"
    >
      <div className="mb-10 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-900 text-white shadow-xl shadow-indigo-500/20">
        <Key size={28} />
      </div>
      <h3 className="mb-4 text-3xl font-extrabold tracking-tight text-indigo-900">API Workbench</h3>
      <p className="mx-auto mb-10 max-w-xl font-medium text-slate-500">
        Generate your production credentials and establish protocol-level authentication for your
        sovereign mesh.
      </p>

      <div className="glass-card group relative mb-10 overflow-hidden bg-white p-10 shadow-lg">
        <div className="absolute top-0 right-0 p-6">
          <Zap size={18} className="text-slate-200 transition-colors group-hover:text-indigo-400" />
        </div>
        <div className="mb-3 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
          Production Key
        </div>
        <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <code className="truncate font-mono text-xs font-bold text-indigo-900">
            sh_prod_7294_mesh_witness_721948x...
          </code>
          <button
            onClick={() => copyToClipboard('sh_prod_7294_mesh_witness_721948x...')}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-indigo-100 bg-white px-5 py-2.5 text-[10px] font-bold text-indigo-600 uppercase shadow-sm transition-all hover:border-indigo-600 hover:bg-indigo-600 hover:text-white"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="text-lg font-extrabold text-indigo-900">12.4M</div>
            <div className="text-[9px] font-bold tracking-widest text-slate-300 uppercase">
              Calls / Month
            </div>
          </div>
          <div className="h-10 w-px bg-slate-100" />
          <div className="text-center">
            <div className="text-lg font-extrabold text-indigo-900">0.02s</div>
            <div className="text-[9px] font-bold tracking-widest text-slate-300 uppercase">
              Avg Latency
            </div>
          </div>
        </div>
      </div>

      <button className="rounded-xl border border-rose-100 bg-rose-50 px-6 py-2.5 text-[10px] font-bold tracking-widest text-rose-500 uppercase transition-all hover:border-rose-500 hover:bg-rose-500 hover:text-white">
        Revoke Credentials
      </button>
    </motion.div>
  )
}
