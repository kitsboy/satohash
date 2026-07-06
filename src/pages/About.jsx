import { motion } from 'framer-motion'
import { Shield, Globe, Heart, Scale, BookOpen, Quote, Network, Binary, Cpu } from 'lucide-react'
import { Link } from 'react-router-dom'
import LanguageSwitcher from '../components/LanguageSwitcher'
import KimiContact from '../components/KimiContact'

export default function About() {
  return (
    <div
      className="relative min-h-screen overflow-hidden pb-32"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.03]" />

      {/* ── Simple top nav ─────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 flex items-center gap-4 border-b px-6 py-4"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--bg-secondary)',
          backdropFilter: 'blur(16px)'
        }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-secondary)' }}
        >
          ← Home
        </Link>
        <span style={{ color: 'var(--border)', userSelect: 'none' }}>|</span>
        <span
          className="text-sm font-black tracking-widest uppercase"
          style={{ color: 'var(--accent-gold)' }}
        >
          About / Whitepaper
        </span>
        <div className="ml-auto">
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Institutional Header */}
      <header
        className="mesh-bg-light relative border-b pt-16 pb-16"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[var(--accent-active)]/5 to-transparent" />
        <div className="layout-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--surface-raised)] p-4 text-[var(--accent-active)] shadow-[var(--accent-active)]/20 shadow-2xl"
          >
            <BookOpen size={40} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-noir-primary mb-4 text-5xl font-black tracking-tighter uppercase italic md:text-8xl"
          >
            The Satahash <br /> <span style={{ color: 'var(--accent-active)' }}>PROTOCOL.</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-[10px] font-black tracking-[0.4em] text-[var(--text-secondary)] uppercase">
              Whitepaper v3.0.0-PRO • Institutional Release
            </div>
            <div className="flex items-center gap-2 font-mono text-[9px] font-bold text-[var(--text-secondary)]">
              <span>HASH: 0000000000000000000086fb...</span>
              <span className="h-1 w-1 rounded-full bg-[var(--border)]" />
              <span>DECENTRALIZED_TRUTH_ENGINE</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Abstract Pull Quote */}
      <section
        className="border-b py-16"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="layout-container max-w-4xl px-8">
          <div className="relative">
            <Quote
              className="absolute -top-10 -left-10 opacity-5"
              size={120}
              style={{ color: 'var(--accent-active)' }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-noir-primary relative z-10 mb-12 text-2xl leading-[1.1] font-black italic md:text-4xl"
            >
              &quot;In an era of hyper-ephemeral digital artifacts, truth has become a variable of
              centralized authority. Satahash returns finality to the people by anchoring digital
              history to the most secure computer network in human history: Bitcoin.&quot;
            </motion.p>
          </div>
          <div className="mb-8 h-0.5 w-24" style={{ backgroundColor: 'var(--accent-active)' }} />
          <p
            className="text-sm font-black tracking-widest uppercase italic"
            style={{ color: 'var(--text-secondary)' }}
          >
            The Satahash Council • 2026
          </p>
        </div>
      </section>

      {/* Main Whitepaper Content */}
      <main className="layout-container py-16">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-12">
          {/* Table of Contents - Desktop Sidebar */}
          <aside className="sticky top-32 hidden h-fit lg:col-span-3 lg:block">
            <nav className="space-y-6">
              <p
                className="mb-8 text-[10px] font-black tracking-widest uppercase"
                style={{ color: 'var(--text-secondary)' }}
              >
                Chapters
              </p>
              {[
                'I. The Epistemic Crisis',
                'II. Protocol Architecture',
                'III. The Give A Bit Mission',
                'IV. Judicial Reliability',
                'V. The Giving Machine',
                'VI. Institutional Horizon'
              ].map((chapter, i) => (
                <motion.a
                  key={i}
                  whileHover={{ x: 6, color: 'var(--accent-active)' }}
                  href={`#chapter-${i + 1}`}
                  className="block text-xs font-black tracking-tighter uppercase italic transition-all"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {chapter}
                </motion.a>
              ))}
            </nav>
          </aside>

          {/* Scholarly Body */}
          <article className="space-y-24 lg:col-span-9">
            {/* Chapter 1: Epistemic Crisis */}
            <section id="chapter-1" className="space-y-8">
              <div className="flex items-center gap-4 text-emerald-600">
                <Shield size={18} />
                <span className="text-[10px] font-black tracking-widest uppercase">
                  CHAPTER_ONE
                </span>
              </div>
              <h2 className="text-noir-primary text-5xl font-black tracking-tighter uppercase italic">
                The Epistemic Crisis.
              </h2>
              <div
                className="document-paper border-noir relative space-y-6 overflow-hidden p-8 text-lg leading-relaxed font-medium italic shadow-2xl md:p-12"
                style={{ color: 'var(--text-secondary)' }}
              >
                <div
                  className="pointer-events-none absolute top-4 right-6 text-[8px] font-black tracking-[0.3em] uppercase italic opacity-10"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Forensic_Integrity_Mesh // v4.0
                </div>
                <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.01]" />
                <p>
                  Current notarization and attestation methods are bottlenecked by centralized
                  fragility. Whether it is a government land title, a corporate vote, or a digital
                  contract, the validity of the proof is typically dependent on a database owned by
                  a single entity.
                </p>
                <p>
                  If the entity fails, the truth fails. This is the **Epistemic Crisis** of the 21st
                  century. Digital evidence is easily manipulated, deepfakes are reaching parity
                  with reality, and our collective record is being eroded.
                </p>
                <div className="relative mt-12 overflow-hidden rounded-3xl bg-[var(--surface-raised)] p-10 shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Quote size={80} />
                  </div>
                  <h4
                    className="mb-6 text-sm font-black uppercase italic"
                    style={{ color: 'var(--accent-active)' }}
                  >
                    The Oracle Statement:
                  </h4>
                  <p
                    className="relative z-10 text-base leading-relaxed italic"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    &quot;Truth must be independent of its creator. A contract should be valid not
                    because a company says so, but because the universe&apos;s most powerful
                    consensus mechanism has witnessed it.&quot;
                  </p>
                </div>
              </div>
            </section>

            {/* Chapter 2: Protocol Architecture */}
            <section id="chapter-2" className="space-y-8">
              <div className="flex items-center gap-4" style={{ color: 'var(--accent-active)' }}>
                <Cpu size={18} />
                <span className="text-[10px] font-black tracking-widest uppercase">
                  CHAPTER_TWO
                </span>
              </div>
              <h2 className="text-noir-primary text-5xl font-black tracking-tighter uppercase italic">
                Architecture.
              </h2>
              <div className="document-paper border-noir relative space-y-12 overflow-hidden p-8 shadow-2xl md:p-12">
                <div
                  className="pointer-events-none absolute top-4 right-6 text-[8px] font-black tracking-[0.3em] uppercase italic opacity-10"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Protocol_Architecture // Level_02
                </div>
                <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.01]" />
                <div
                  className="space-y-6 leading-relaxed font-medium italic"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <p>
                    Satohash implements a **Tiered Witness Model** powered by Merkle-Tree
                    Aggregation and the OpenTimestamps (OTS) protocol. By batching individual
                    SHA-256 hashes into a unified root, we achieve near-infinite scalability while
                    maintaining 100% Bitcoin finality.
                  </p>
                </div>

                <div className="grid gap-8 py-8 md:grid-cols-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="rounded-[2.5rem] border p-10 italic shadow-sm transition-all hover:shadow-md"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-primary)' }}
                  >
                    <Binary className="mb-6" size={32} style={{ color: 'var(--accent-active)' }} />
                    <h4
                      className="mb-3 text-sm font-black uppercase"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Merkle Roots
                    </h4>
                    <p
                      className="text-xs leading-relaxed font-bold"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Each batch anchor creates a technical certificate (.ots) which serves as a
                      forensic roadmap back to a specific Bitcoin block.
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="rounded-[2.5rem] border p-10 italic shadow-sm transition-all hover:shadow-md"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-primary)' }}
                  >
                    <Globe className="mb-6" size={32} style={{ color: 'var(--accent-active)' }} />
                    <h4
                      className="mb-3 text-sm font-black uppercase"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Relay Mesh
                    </h4>
                    <p
                      className="text-xs leading-relaxed font-bold"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Nostr-native relay propagation ensures that your attestation is visible to the
                      entire world before the first confirmation.
                    </p>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Chapter 3: Mission */}
            <section id="chapter-3" className="space-y-8">
              <div className="flex items-center gap-4 text-rose-500">
                <Heart size={18} />
                <span className="text-[10px] font-black tracking-widest uppercase">
                  CHAPTER_THREE
                </span>
              </div>
              <h2 className="text-noir-primary text-5xl font-black tracking-tighter uppercase italic">
                Mission: Give A Bit.
              </h2>
              <div
                className="document-paper border-noir relative overflow-hidden p-8 shadow-2xl md:p-12"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <div
                  className="pointer-events-none absolute top-4 right-6 text-[8px] font-black tracking-[0.3em] uppercase italic opacity-10"
                  style={{ color: 'var(--accent-danger)' }}
                >
                  Philanthropic_Engine // Verified_Heart
                </div>
                <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.01]" />
                <div className="mb-16 text-center">
                  <div className="mb-8 inline-block rounded-[2.5rem] border border-rose-500/20 bg-rose-500/10 p-8 text-rose-500 shadow-xl shadow-rose-500/5">
                    <Heart size={48} className="animate-pulse" />
                  </div>
                  <h3
                    className="mb-6 text-3xl font-black tracking-tighter uppercase italic"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Sovereignty via Immutability.
                  </h3>
                  <p
                    className="mx-auto max-w-2xl leading-relaxed font-bold italic"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    The **Give A Bit** mission is founded on a simple principle: every human being
                    deserves access to a &quot;Sovereign Proof of Truth&quot; regardless of their
                    jurisdiction.
                  </p>
                </div>
                <div
                  className="space-y-10 leading-relaxed font-medium italic"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <p>
                    In developing nations, land titles are often &quot;deleted&quot; by corrupt
                    regimes. In authoritarian environments, voting records are &quot;updated&quot;
                    over time.
                  </p>
                  <p
                    className="rounded-r-3xl border-l-4 border-rose-500 px-12 py-8 shadow-sm"
                    style={{ background: 'var(--surface-raised)', color: 'var(--text-primary)' }}
                  >
                    &quot;We aim to **Give A Bit** of Bitcoin&apos;s immutable strength to those who
                    need it most. By providing free-tier notarization for personal identify and
                    basic rights, we level the playing field between the individual and the
                    institution.&quot;
                  </p>
                  <p>
                    This isn&apos;t just a corporate mission; it is a **philanthropic protocol**.
                    Part of every institutional API fee is redirected to sustain the &quot;Global
                    Free Notary&quot; tier, ensuring that the world&apos;s most vulnerable can
                    anchor their life&apos;s most important moments for free.
                  </p>
                </div>
              </div>
            </section>

            {/* Chapter 4: Judicial Reliability */}
            <section id="chapter-4" className="space-y-8">
              <div className="flex items-center gap-4 text-amber-500">
                <Scale size={18} />
                <span className="text-[10px] font-black tracking-widest uppercase">
                  CHAPTER_FOUR
                </span>
              </div>
              <h2 className="text-noir-primary text-5xl font-black tracking-tighter uppercase italic">
                Judicial Proof.
              </h2>
              <div
                className="document-paper border-noir relative space-y-12 overflow-hidden p-8 shadow-2xl md:p-12"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <div
                  className="pointer-events-none absolute top-4 right-6 text-[8px] font-black tracking-[0.3em] uppercase italic opacity-10"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Judicial_Standard // Level_04
                </div>
                <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.01]" />
                <p
                  className="text-lg leading-relaxed font-bold italic"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  In a court of law, truth is a matter of verification. Satahash transitions digital
                  evidence from &quot;trusted hearsay&quot; to &quot;mathematical fact.&quot;
                </p>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {['ANONYMOUS', 'IMMUTABLE', 'VERIFIABLE', 'FINAL'].map((val) => (
                    <motion.div
                      key={val}
                      whileHover={{ y: -4 }}
                      className="rounded-2xl border p-6 text-center shadow-sm transition-all"
                      style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
                    >
                      <span
                        className="text-[10px] font-black tracking-widest italic"
                        style={{ color: 'var(--accent-active)' }}
                      >
                        {val}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div
                  className="relative overflow-hidden rounded-[2.5rem] p-10 italic"
                  style={{ background: 'var(--surface-raised)' }}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Scale size={100} />
                  </div>
                  <p
                    className="relative z-10 text-sm leading-relaxed font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    &quot;A digital timestamp anchored to the Bitcoin blockchain is legally superior
                    to a centralized database entry. While a server admin can alter a database, only
                    a reorganization of the global Proof-of-Work hashpower can alter a Satahash
                    anchor.&quot;
                    <br />
                    <span
                      className="mt-6 block text-[10px] tracking-widest uppercase"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      — Sovereign Legal Framework 2026
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {/* Chapter 5: The Giving Machine */}
            <section id="chapter-5" className="space-y-8">
              <div className="flex items-center gap-4 text-rose-500">
                <Heart size={18} />
                <span className="text-[10px] font-black tracking-widest uppercase">
                  CHAPTER_FIVE
                </span>
              </div>
              <h2 className="text-noir-primary text-5xl leading-none font-black tracking-tighter uppercase italic">
                The Giving <br />{' '}
                <span
                  className="italic underline decoration-4 underline-offset-8"
                  style={{
                    color: 'var(--accent-active)',
                    textDecorationColor: 'var(--accent-active)'
                  }}
                >
                  Machine.
                </span>
              </h2>
              <div
                className="document-paper border-noir relative space-y-12 overflow-hidden p-8 shadow-2xl md:p-12"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <div
                  className="pointer-events-none absolute top-4 right-6 text-[8px] font-black tracking-[0.3em] uppercase italic opacity-10"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Sovereign_Giving // Level_05
                </div>
                <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.01]" />
                <p
                  className="text-lg leading-relaxed font-bold italic"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  The Philanthropic Protocol Engine: Satohash is not merely a utility; it is a
                  sustainable engine for social preservation. The &quot;Give A Bit&quot; mission is
                  integrated into the source code.
                </p>
                <div className="grid gap-8 md:grid-cols-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="rounded-[3rem] border p-10 italic shadow-sm transition-all hover:shadow-md"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
                  >
                    <h4
                      className="mb-4 text-sm font-black uppercase italic"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Social Subsidization
                    </h4>
                    <p
                      className="text-[11px] leading-relaxed font-bold"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Fee-harvesting from institutional batching directly funds the archival
                      infrastructure for journalists and global activist meshes.
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="rounded-[3rem] border p-10 italic shadow-sm transition-all hover:shadow-md"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
                  >
                    <h4
                      className="mb-4 text-sm font-black uppercase italic"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Permanent Record
                    </h4>
                    <p
                      className="text-[11px] leading-relaxed font-bold"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      By anchoring history for the decentralized world, we ensure a donated human
                      memory that survives any political era.
                    </p>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Oracle Mesh Topology Map */}
            <section className="relative overflow-hidden rounded-[4rem] bg-[#0a0d17] p-10 text-white shadow-2xl md:p-16">
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  background: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }}
              />

              <div className="relative z-10 grid items-center gap-20 text-left lg:grid-cols-2">
                <div>
                  <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-active)] text-white shadow-[var(--accent-active)]/40 shadow-lg">
                    <Network size={24} />
                  </div>
                  <h3 className="mb-6 text-4xl leading-tight font-black tracking-tighter text-white uppercase italic">
                    Global Oracle <br />{' '}
                    <span className="text-[var(--accent-active)]">Mesh Topology.</span>
                  </h3>
                  <p className="mb-10 max-w-md text-sm leading-relaxed font-medium text-white/60 italic">
                    Our network is a distributed lattice of Witness Nodes that cross-verify every
                    anchor. If the consensus falls, the proofs remain sovereign and verifiable via
                    any public block explorer globally.
                  </p>
                  <div className="flex gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 px-6 text-center italic">
                      <div
                        className="mb-1 text-[8px] font-black uppercase"
                        style={{ color: 'var(--accent-active)' }}
                      >
                        Mirror Nodes
                      </div>
                      <div className="text-sm font-black tracking-tighter text-white italic">
                        1,402+
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 px-6 text-center italic">
                      <div className="mb-1 text-[8px] font-black text-emerald-400 uppercase">
                        Daily Syncs
                      </div>
                      <div className="text-sm font-black tracking-tighter text-white italic">
                        12.4M
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Relay Convergence', status: 'OK_SECURE', color: 'emerald' },
                    { label: 'Witness Quorum', status: 'STABLE_V3', color: 'indigo' },
                    { label: 'Mempool Pressure', status: 'MINIMAL_LOW', color: 'amber' },
                    { label: 'Proof Finalization', status: 'BITCOIN_READY', color: 'emerald' }
                  ].map((node, i) => (
                    <div
                      key={i}
                      className="glass-card flex items-center justify-between border-white/10 bg-white/5 p-5"
                    >
                      <span className="text-[10px] font-black tracking-widest text-white uppercase">
                        {node.label}
                      </span>
                      <span
                        className={`text-[8px] font-black text-${node.color}-400 tracking-widest uppercase`}
                      >
                        {node.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Final Call to Action */}
            <section className="border-t pt-16" style={{ borderColor: 'var(--border)' }}>
              <div
                className="relative overflow-hidden rounded-[3rem] p-12 text-center text-white shadow-2xl md:p-24"
                style={{ background: 'var(--surface-raised)' }}
              >
                <div className="relative z-10 mx-auto max-w-2xl">
                  <Shield className="mx-auto mb-10 animate-pulse text-emerald-400" size={64} />
                  <h2
                    className="mb-8 text-5xl leading-tight font-black tracking-tighter italic"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Join the <br />{' '}
                    <span style={{ color: 'var(--accent-active)' }}>Final Record.</span>
                  </h2>
                  <p
                    className="mb-12 text-lg leading-relaxed font-bold italic"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Whether you are an institution securing a referendum or a citizen securing a
                    deed, the Satohash Mesh is your final point of truth.
                  </p>
                  <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link to="/dashboard">
                      <button
                        className="rounded-2xl px-12 py-5 text-[12px] font-black tracking-[0.2em] uppercase italic transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
                        style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                      >
                        Launch Workbench
                      </button>
                    </Link>
                    <Link to="/developer">
                      <button
                        className="rounded-2xl border-2 px-12 py-5 text-[12px] font-black tracking-[0.2em] uppercase italic transition-all hover:bg-white/5 active:scale-95"
                        style={{
                          borderColor: 'var(--border-bright)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Access Mesh API
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </article>
        </div>
      </main>

      <section className="layout-container mb-16 px-6">
        <h2
          className="mb-6 text-center text-sm font-bold tracking-widest uppercase"
          style={{ color: 'var(--accent-gold)' }}
        >
          Agent Roster · Give A Bit
        </h2>
        <div className="mx-auto max-w-lg">
          <KimiContact />
        </div>
      </section>

      {/* Institutional Footer Seal */}
      <footer
        className="border-t py-16"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="layout-container flex flex-col items-center" style={{ opacity: 0.5 }}>
          <Shield size={48} className="mb-6" style={{ color: 'var(--text-secondary)' }} />
          <div
            className="text-[10px] font-black tracking-[0.5em] uppercase"
            style={{ color: 'var(--text-secondary)' }}
          >
            SATOHASH_PROTOCOL_SECURITY_COUNCIL
          </div>
          <div className="mt-3 font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>
            GENESIS_HASH: 000000000019d6689c085ae165831e934ff763...
          </div>
          <p
            className="mt-4 text-[8px] font-black tracking-widest uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            Immutable Data Rights Reserved • {new Date().getFullYear()}
          </p>
        </div>

        {/* Legal links */}
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t py-4 text-xs"
          style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
        >
          <Link to="/legal/terms" className="transition-opacity hover:opacity-70">
            Terms of Service
          </Link>
          <Link to="/legal/privacy" className="transition-opacity hover:opacity-70">
            Privacy Policy
          </Link>
          <Link to="/legal/crypto-notice" className="transition-opacity hover:opacity-70">
            Cryptographic Notice
          </Link>
          <Link to="/trust" className="transition-opacity hover:opacity-70">
            Trust Center
          </Link>
        </div>
      </footer>
    </div>
  )
}
