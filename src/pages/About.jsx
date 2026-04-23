import { motion } from 'framer-motion'
import { Shield, Globe, Heart, Scale, BookOpen, Quote, Network, Binary, Cpu } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-32">
      {/* Institutional Header */}
      <header className="relative border-b border-indigo-100 bg-white pt-24 pb-16">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-indigo-50/20 to-transparent" />
        <div className="layout-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-900 p-4 text-white shadow-2xl shadow-indigo-500/20"
          >
            <BookOpen size={40} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-5xl font-black tracking-tighter text-indigo-900 uppercase italic md:text-8xl"
          >
            The Satahash <br /> <span className="text-indigo-600">PROTOCOL.</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-[10px] font-black tracking-[0.4em] text-indigo-900/50 uppercase">
              Whitepaper v3.0.0-PRO • Institutional Release
            </div>
            <div className="flex items-center gap-2 font-mono text-[9px] font-bold text-indigo-900/60">
              <span>HASH: 0000000000000000000086fb...</span>
              <span className="h-1 w-1 rounded-full bg-indigo-200" />
              <span>DECENTRALIZED_TRUTH_ENGINE</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Abstract Pull Quote */}
      <section className="border-b border-indigo-50 bg-white py-16">
        <div className="layout-container max-w-4xl px-8">
          <div className="relative">
            <Quote className="absolute -top-10 -left-10 text-indigo-50" size={120} />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="relative z-10 mb-12 text-2xl leading-[1.1] font-black text-indigo-900 italic md:text-4xl"
            >
              &quot;In an era of hyper-ephemeral digital artifacts, truth has become a variable of
              centralized authority. Satahash returns finality to the people by anchoring digital
              history to the most secure computer network in human history: Bitcoin.&quot;
            </motion.p>
          </div>
          <div className="mb-8 h-0.5 w-24 bg-indigo-600" />
          <p className="text-sm font-black tracking-widest text-indigo-900/40 uppercase italic">
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
              <p className="mb-8 text-[10px] font-black tracking-widest text-indigo-900/30 uppercase">
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
                  whileHover={{ x: 6 }}
                  href={`#chapter-${i + 1}`}
                  className="block text-xs font-black tracking-tighter text-slate-400 uppercase italic transition-all hover:text-indigo-600"
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
              <h2 className="text-5xl font-black tracking-tighter text-indigo-900 uppercase italic">
                The Epistemic Crisis.
              </h2>
              <div className="document-paper space-y-6 p-10 text-lg leading-relaxed font-medium text-slate-700 italic shadow-xl md:p-16">
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
                <div className="relative mt-12 overflow-hidden rounded-3xl bg-indigo-900 p-10 text-white shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Quote size={80} />
                  </div>
                  <h4 className="mb-6 text-sm font-black text-indigo-200 uppercase italic">
                    The Oracle Statement:
                  </h4>
                  <p className="relative z-10 text-base leading-relaxed text-indigo-100 italic">
                    &quot;Truth must be independent of its creator. A contract should be valid not
                    because a company says so, but because the universe&apos;s most powerful
                    consensus mechanism has witnessed it.&quot;
                  </p>
                </div>
              </div>
            </section>

            {/* Chapter 2: Protocol Architecture */}
            <section id="chapter-2" className="space-y-8">
              <div className="flex items-center gap-4 text-indigo-600">
                <Cpu size={18} />
                <span className="text-[10px] font-black tracking-widest uppercase">
                  CHAPTER_TWO
                </span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter text-indigo-900 uppercase italic">
                Architecture.
              </h2>
              <div className="document-paper space-y-12 p-10 shadow-xl md:p-16">
                <div className="space-y-6 leading-relaxed font-medium text-slate-600 italic">
                  <p>
                    Satohash implements a **Tiered Witness Model** powered by Merkle-Tree
                    Aggregation and the OpenTimestamps (OTS) protocol. By batching individual
                    SHA-256 hashes into a unified root, we achieve near-infinite scalability while
                    maintaining 100% Bitcoin finality.
                  </p>
                </div>

                <div className="grid gap-8 py-8 md:grid-cols-2">
                  <div className="rounded-[2.5rem] border border-indigo-100 bg-indigo-50 p-10 italic">
                    <Binary className="mb-6 text-indigo-600" size={32} />
                    <h4 className="mb-3 text-sm font-black text-indigo-900 uppercase">
                      Merkle Roots
                    </h4>
                    <p className="text-xs leading-relaxed font-bold text-indigo-900/70">
                      Each batch anchor creates a technical certificate (.ots) which serves as a
                      forensic roadmap back to a specific Bitcoin block.
                    </p>
                  </div>
                  <div className="rounded-[2.5rem] border border-indigo-100 bg-indigo-50 p-10 italic">
                    <Globe className="mb-6 text-indigo-600" size={32} />
                    <h4 className="mb-3 text-sm font-black text-indigo-900 uppercase">
                      Relay Mesh
                    </h4>
                    <p className="text-xs leading-relaxed font-bold text-indigo-900/70">
                      Nostr-native relay propagation ensures that your attestation is visible to the
                      entire world before the first confirmation.
                    </p>
                  </div>
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
              <h2 className="text-5xl font-black tracking-tighter text-indigo-900 uppercase italic">
                Mission: Give A Bit.
              </h2>
              <div className="document-paper bg-gradient-to-br from-white to-rose-50/10 p-10 shadow-xl md:p-16">
                <div className="mb-16 text-center">
                  <div className="mb-8 inline-block rounded-[2.5rem] border border-rose-100 bg-rose-50 p-8 text-rose-500 shadow-xl shadow-rose-500/5">
                    <Heart size={48} className="animate-pulse" />
                  </div>
                  <h3 className="mb-6 text-3xl font-black tracking-tighter text-indigo-900 uppercase italic">
                    Sovereignty via Immutability.
                  </h3>
                  <p className="mx-auto max-w-2xl leading-relaxed font-bold text-indigo-900/60 italic">
                    The **Give A Bit** mission is founded on a simple principle: every human being
                    deserves access to a &quot;Sovereign Proof of Truth&quot; regardless of their
                    jurisdiction.
                  </p>
                </div>
                <div className="space-y-10 leading-relaxed font-medium text-slate-700 italic">
                  <p>
                    In developing nations, land titles are often &quot;deleted&quot; by corrupt
                    regimes. In authoritarian environments, voting records are &quot;updated&quot;
                    over time.
                  </p>
                  <p className="rounded-r-3xl border-l-4 border-rose-500 bg-white px-12 py-8 text-indigo-900 shadow-sm">
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
              <h2 className="text-5xl font-black tracking-tighter text-indigo-900 uppercase italic">
                Judicial Proof.
              </h2>
              <div className="document-paper space-y-12 p-10 shadow-xl md:p-16">
                <p className="text-lg leading-relaxed font-bold text-slate-600 italic">
                  In a court of law, truth is a matter of verification. Satahash transitions digital
                  evidence from &quot;trusted hearsay&quot; to &quot;mathematical fact.&quot;
                </p>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {['ANONYMOUS', 'IMMUTABLE', 'VERIFIABLE', 'FINAL'].map((val) => (
                    <div
                      key={val}
                      className="rounded-2xl border border-indigo-100 bg-white p-6 text-center shadow-sm"
                    >
                      <span className="text-[10px] font-black tracking-widest text-indigo-600 italic">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-900 p-10 text-white italic">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Scale size={100} />
                  </div>
                  <p className="relative z-10 text-sm leading-relaxed font-bold">
                    &quot;A digital timestamp anchored to the Bitcoin blockchain is legally superior
                    to a centralized database entry. While a server admin can alter a database, only
                    a reorganization of the global Proof-of-Work hashpower can alter a Satahash
                    anchor.&quot;
                    <br />
                    <span className="mt-6 block text-[10px] tracking-widest text-indigo-300 uppercase">
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
              <h2 className="text-5xl leading-none font-black tracking-tighter text-indigo-900 uppercase italic">
                The Giving <br />{' '}
                <span className="text-indigo-600 italic underline decoration-indigo-200 decoration-4 underline-offset-8">
                  Machine.
                </span>
              </h2>
              <div className="document-paper space-y-12 p-10 shadow-xl md:p-16">
                <p className="text-lg leading-relaxed font-bold text-slate-600 italic">
                  The Philanthropic Protocol Engine: Satohash is not merely a utility; it is a
                  sustainable engine for social preservation. The &quot;Give A Bit&quot; mission is
                  integrated into the source code.
                </p>
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="rounded-[3rem] border border-indigo-100 bg-indigo-50 p-10 italic">
                    <h4 className="mb-4 text-sm font-black text-indigo-900 uppercase italic">
                      Social Subsidization
                    </h4>
                    <p className="text-[11px] leading-relaxed font-bold text-indigo-900/70">
                      Fee-harvesting from institutional batching directly funds the archival
                      infrastructure for journalists and global activist meshes.
                    </p>
                  </div>
                  <div className="rounded-[3rem] border border-slate-200 bg-slate-50 p-10 italic">
                    <h4 className="mb-4 text-sm font-black text-indigo-900 uppercase italic">
                      Permanent Record
                    </h4>
                    <p className="text-[11px] leading-relaxed font-bold text-indigo-900/70">
                      By anchoring history for the decentralized world, we ensure a donated human
                      memory that survives any political era.
                    </p>
                  </div>
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
                  <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/40">
                    <Network size={24} />
                  </div>
                  <h3 className="mb-6 text-4xl leading-tight font-black tracking-tighter uppercase italic">
                    Global Oracle <br /> <span className="text-indigo-400">Mesh Topology.</span>
                  </h3>
                  <p className="mb-10 max-w-md text-sm leading-relaxed font-medium text-indigo-200/50 italic">
                    Our network is a distributed lattice of Witness Nodes that cross-verify every
                    anchor. If the consensus falls, the proofs remain sovereign and verifiable via
                    any public block explorer globally.
                  </p>
                  <div className="flex gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 px-6 text-center italic">
                      <div className="mb-1 text-[8px] font-black text-indigo-400 uppercase">
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
            <section className="border-t border-indigo-100 pt-16">
              <div className="relative overflow-hidden rounded-[3rem] bg-indigo-900 p-12 text-center text-white shadow-2xl md:p-24">
                <div className="relative z-10 mx-auto max-w-2xl">
                  <Shield className="mx-auto mb-10 animate-pulse text-emerald-400" size={64} />
                  <h2 className="mb-8 text-5xl leading-tight font-black tracking-tighter italic">
                    Join the <br /> <span className="text-indigo-400">Final Record.</span>
                  </h2>
                  <p className="mb-12 text-lg leading-relaxed font-bold text-indigo-200/60 italic">
                    Whether you are an institution securing a referendum or a citizen securing a
                    deed, the Satohash Mesh is your final point of truth.
                  </p>
                  <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link to="/dashboard">
                      <button className="rounded-2xl bg-white px-12 py-5 text-[12px] font-black tracking-[0.2em] text-indigo-900 uppercase italic transition-all hover:scale-105 hover:shadow-2xl hover:shadow-white/20 active:scale-95">
                        Launch Workbench
                      </button>
                    </Link>
                    <Link to="/developers">
                      <button className="rounded-2xl border-2 border-white/20 px-12 py-5 text-[12px] font-black tracking-[0.2em] text-white uppercase italic transition-all hover:bg-white/10 active:scale-95">
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

      {/* Institutional Footer Seal */}
      <footer className="border-t border-indigo-50 bg-white py-20">
        <div className="layout-container flex flex-col items-center opacity-30">
          <Shield size={60} className="mb-8 text-indigo-900" />
          <div className="text-[10px] font-black tracking-[0.5em] text-indigo-900 uppercase">
            SATOHASH_PROTOCOL_SECURITY_COUNCIL
          </div>
          <div className="mt-4 font-mono text-[9px]">
            GENESIS_HASH: 000000000019d6689c085ae165831e934ff763...
          </div>
          <p className="mt-6 text-[8px] font-black tracking-widest text-indigo-900/60 uppercase">
            Immutable Data Rights Reserved • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}
