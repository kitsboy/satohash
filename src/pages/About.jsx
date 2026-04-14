import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Users, Cpu, Lock, ChevronRight, Binary, BookOpen, Quote, Heart, Anchor, Scale, Vote, Network, Anchor as AnchorIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const chapterSpring = { type: 'spring', stiffness: 300, damping: 30 };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-32">
      {/* Institutional Header */}
      <header className="relative pt-32 pb-24 border-b border-indigo-100 bg-white">
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-indigo-50/20 to-transparent pointer-events-none" />
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
            className="text-5xl md:text-8xl font-black italic tracking-tighter text-indigo-900 uppercase mb-4"
          >
            The Satahash <br /> <span className="text-indigo-600">PROTOCOL.</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
             <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-900/50">Whitepaper v3.0.0-PRO • Institutional Release</div>
             <div className="flex items-center gap-2 text-[9px] font-mono text-indigo-900/60 font-bold">
                <span>HASH: 0000000000000000000086fb...</span>
                <span className="h-1 w-1 bg-indigo-200 rounded-full" />
                <span>DECENTRALIZED_TRUTH_ENGINE</span>
             </div>
          </motion.div>
        </div>
      </header>

      {/* Abstract Pull Quote */}
      <section className="py-24 bg-white border-b border-indigo-50">
        <div className="layout-container max-w-4xl px-8">
           <div className="relative">
              <Quote className="absolute -top-10 -left-10 text-indigo-50" size={120} />
              <motion.p
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 className="relative z-10 text-2xl md:text-4xl font-black italic text-indigo-900 leading-[1.1] mb-12"
              >
                "In an era of hyper-ephemeral digital artifacts, truth has become a variable of centralized authority. Satahash returns finality to the people by anchoring digital history to the most secure computer network in human history: Bitcoin."
              </motion.p>
           </div>
           <div className="h-0.5 w-24 bg-indigo-600 mb-8" />
           <p className="text-sm font-black text-indigo-900/40 uppercase tracking-widest italic">The Satahash Council • 2026</p>
        </div>
      </section>

      {/* Main Whitepaper Content */}
      <main className="layout-container py-32">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Table of Contents - Desktop Sidebar */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit">
               <nav className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-900/30 mb-8">Chapters</p>
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
                      href={`#chapter-${i+1}`}
                      className="block text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-tighter transition-all italic"
                    >
                      {chapter}
                    </motion.a>
                  ))}
               </nav>
            </aside>

            {/* Scholarly Body */}
            <article className="lg:col-span-9 space-y-40">
               {/* Chapter 1: Epistemic Crisis */}
               <section id="chapter-1" className="space-y-12">
                  <div className="flex items-center gap-4 text-emerald-600">
                     <Shield size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest">CHAPTER_ONE</span>
                  </div>
                  <h2 className="text-5xl font-black italic tracking-tighter text-indigo-900 uppercase">The Epistemic Crisis.</h2>
                  <div className="document-paper p-10 md:p-16 text-lg leading-relaxed text-slate-700 italic font-medium space-y-6 shadow-xl">
                     <p>
                        Current notarization and attestation methods are bottlenecked by centralized fragility. 
                        Whether it is a government land title, a corporate vote, or a digital contract, 
                        the validity of the proof is typically dependent on a database owned by a single entity.
                     </p>
                     <p>
                        If the entity fails, the truth fails. This is the **Epistemic Crisis** of the 21st century. 
                        Digital evidence is easily manipulated, deepfakes are reaching parity with reality, 
                        and our collective record is being eroded.
                     </p>
                     <div className="bg-indigo-900 rounded-3xl p-10 text-white mt-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Quote size={80} />
                        </div>
                        <h4 className="text-sm font-black uppercase italic mb-6 text-indigo-200">The Oracle Statement:</h4>
                        <p className="text-indigo-100 text-base leading-relaxed italic relative z-10">
                           "Truth must be independent of its creator. A contract should be valid not because a company says so, 
                           but because the universe's most powerful consensus mechanism has witnessed it."
                        </p>
                     </div>
                  </div>
               </section>

               {/* Chapter 2: Protocol Architecture */}
               <section id="chapter-2" className="space-y-12">
                  <div className="flex items-center gap-4 text-indigo-600">
                     <Cpu size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest">CHAPTER_TWO</span>
                  </div>
                  <h2 className="text-5xl font-black italic tracking-tighter text-indigo-900 uppercase italic">Architecture.</h2>
                  <div className="document-paper p-10 md:p-16 space-y-12 shadow-xl">
                     <div className="space-y-6 text-slate-600 italic font-medium leading-relaxed">
                        <p>
                           Satohash implements a **Tiered Witness Model** powered by Merkle-Tree Aggregation and 
                           the OpenTimestamps (OTS) protocol. By batching individual SHA-256 hashes into a 
                           unified root, we achieve near-infinite scalability while maintaining 100% Bitcoin finality.
                        </p>
                     </div>

                     <div className="grid md:grid-cols-2 gap-8 py-8">
                        <div className="p-10 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 italic">
                           <Binary className="text-indigo-600 mb-6" size={32} />
                           <h4 className="text-sm font-black text-indigo-900 uppercase mb-3">Merkle Roots</h4>
                           <p className="text-xs text-indigo-900/70 font-bold leading-relaxed">
                              Each batch anchor creates a technical certificate (.ots) which serves as a forensic 
                              roadmap back to a specific Bitcoin block.
                           </p>
                        </div>
                        <div className="p-10 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 italic">
                           <Globe className="text-indigo-600 mb-6" size={32} />
                           <h4 className="text-sm font-black text-indigo-900 uppercase mb-3">Relay Mesh</h4>
                           <p className="text-xs text-indigo-900/70 font-bold leading-relaxed">
                              Nostr-native relay propagation ensures that your attestation is visible to the 
                              entire world before the first confirmation.
                           </p>
                        </div>
                     </div>
                  </div>
               </section>

               {/* Chapter 3: Mission */}
               <section id="chapter-3" className="space-y-12">
                  <div className="flex items-center gap-4 text-rose-500">
                     <Heart size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest">CHAPTER_THREE</span>
                  </div>
                  <h2 className="text-5xl font-black italic tracking-tighter text-indigo-900 uppercase italic">Mission: Give A Bit.</h2>
                  <div className="document-paper p-10 md:p-16 bg-gradient-to-br from-white to-rose-50/10 shadow-xl">
                     <div className="text-center mb-16">
                        <div className="inline-block p-8 rounded-[2.5rem] bg-rose-50 text-rose-500 mb-8 border border-rose-100 shadow-xl shadow-rose-500/5">
                           <Heart size={48} className="animate-pulse" />
                        </div>
                        <h3 className="text-3xl font-black italic text-indigo-900 uppercase mb-6 tracking-tighter">Sovereignty via Immutability.</h3>
                        <p className="text-indigo-900/60 font-bold italic max-w-2xl mx-auto leading-relaxed">
                           The **Give A Bit** mission is founded on a simple principle: every human being deserves 
                           access to a "Sovereign Proof of Truth" regardless of their jurisdiction.
                        </p>
                     </div>
                     <div className="space-y-10 text-slate-700 italic font-medium leading-relaxed">
                        <p>
                           In developing nations, land titles are often "deleted" by corrupt regimes. In authoritarian 
                           environments, voting records are "updated" over time.
                        </p>
                        <p className="px-12 py-8 bg-white border-l-4 border-rose-500 rounded-r-3xl shadow-sm text-indigo-900">
                           "We aim to **Give A Bit** of Bitcoin&apos;s immutable strength to those who need it most. 
                           By providing free-tier notarization for personal identify and basic rights, we 
                           level the playing field between the individual and the institution."
                        </p>
                        <p>
                           This isn&apos;t just a corporate mission; it is a **philanthropic protocol**. 
                           Part of every institutional API fee is redirected to sustain the "Global Free Notary" tier, 
                           ensuring that the world&apos;s most vulnerable can anchor their life&apos;s most 
                           important moments for free.
                        </p>
                     </div>
                  </div>
               </section>

               {/* Chapter 4: Judicial Reliability */}
               <section id="chapter-4" className="space-y-12">
                  <div className="flex items-center gap-4 text-amber-500">
                     <Scale size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest">CHAPTER_FOUR</span>
                  </div>
                  <h2 className="text-5xl font-black italic tracking-tighter text-indigo-900 uppercase italic">Judicial Proof.</h2>
                  <div className="document-paper p-10 md:p-16 space-y-12 shadow-xl">
                     <p className="text-lg font-bold italic text-slate-600 leading-relaxed">
                        In a court of law, truth is a matter of verification. Satahash transitions digital 
                        evidence from "trusted hearsay" to "mathematical fact."
                     </p>
                     
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['ANONYMOUS', 'IMMUTABLE', 'VERIFIABLE', 'FINAL'].map((val) => (
                           <div key={val} className="p-6 rounded-2xl border border-indigo-100 bg-white text-center shadow-sm">
                              <span className="text-[10px] font-black tracking-widest text-indigo-600 italic">{val}</span>
                           </div>
                        ))}
                     </div>

                     <div className="p-10 rounded-[2.5rem] bg-indigo-900 text-white italic relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Scale size={100} />
                        </div>
                        <p className="text-sm font-bold leading-relaxed relative z-10">
                           "A digital timestamp anchored to the Bitcoin blockchain is legally superior to a 
                           centralized database entry. While a server admin can alter a database, only a 
                           reorganization of the global Proof-of-Work hashpower can alter a Satahash anchor."
                           <br />
                           <span className="mt-6 block text-[10px] uppercase tracking-widest text-indigo-300">— Sovereign Legal Framework 2026</span>
                        </p>
                     </div>
                  </div>
               </section>

               {/* Chapter 5: The Giving Machine */}
               <section id="chapter-5" className="space-y-12">
                  <div className="flex items-center gap-4 text-rose-500">
                     <Heart size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest">CHAPTER_FIVE</span>
                  </div>
                  <h2 className="text-5xl font-black italic tracking-tighter text-indigo-900 uppercase italic leading-none">The Giving <br /> <span className="text-indigo-600 underline decoration-indigo-200 decoration-4 underline-offset-8 italic">Machine.</span></h2>
                  <div className="document-paper p-10 md:p-16 space-y-12 shadow-xl">
                     <p className="text-lg font-bold italic text-slate-600 leading-relaxed">
                        The Philanthropic Protocol Engine: Satohash is not merely a utility; it is a sustainable 
                        engine for social preservation. The "Give A Bit" mission is integrated into the source code.
                     </p>
                     <div className="grid gap-8 md:grid-cols-2">
                        <div className="p-10 rounded-[3rem] bg-indigo-50 border border-indigo-100 italic">
                           <h4 className="text-sm font-black text-indigo-900 uppercase mb-4 italic">Social Subsidization</h4>
                           <p className="text-[11px] text-indigo-900/70 font-bold leading-relaxed">
                              Fee-harvesting from institutional batching directly funds the archival infrastructure 
                              for journalists and global activist meshes.
                           </p>
                        </div>
                        <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-200 italic">
                           <h4 className="text-sm font-black text-indigo-900 uppercase mb-4 italic">Permanent Record</h4>
                           <p className="text-[11px] text-indigo-900/70 font-bold leading-relaxed">
                              By anchoring history for the decentralized world, we ensure a donated 
                              human memory that survives any political era.
                           </p>
                        </div>
                     </div>
                  </div>
               </section>

               {/* Oracle Mesh Topology Map */}
               <section className="relative overflow-hidden p-12 md:p-24 bg-[#0a0d17] rounded-[4rem] text-white shadow-2xl">
                  <div className="absolute inset-0 opacity-20 pointer-events-none" 
                       style={{ background: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                  
                  <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center text-left">
                     <div>
                        <div className="inline-flex h-12 w-12 rounded-2xl bg-indigo-600 text-white items-center justify-center mb-8 shadow-lg shadow-indigo-500/40">
                            <Network size={24} />
                        </div>
                        <h3 className="text-4xl font-black italic tracking-tighter uppercase mb-6 leading-tight italic">Global Oracle <br /> <span className="text-indigo-400">Mesh Topology.</span></h3>
                        <p className="text-sm font-medium leading-relaxed text-indigo-200/50 italic mb-10 max-w-md">
                           Our network is a distributed lattice of Witness Nodes that cross-verify every anchor. 
                           If the consensus falls, the proofs remain sovereign and verifiable via any public block explorer globally.
                        </p>
                        <div className="flex gap-4">
                           <div className="p-4 px-6 rounded-2xl bg-white/5 border border-white/10 italic text-center">
                              <div className="text-[8px] font-black text-indigo-400 uppercase mb-1">Mirror Nodes</div>
                              <div className="text-sm font-black text-white italic tracking-tighter">1,402+</div>
                           </div>
                           <div className="p-4 px-6 rounded-2xl bg-white/5 border border-white/10 italic text-center">
                              <div className="text-[8px] font-black text-emerald-400 uppercase mb-1">Daily Syncs</div>
                              <div className="text-sm font-black text-white italic tracking-tighter">12.4M</div>
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
                             <div key={i} className="glass-card p-5 bg-white/5 border-white/10 flex items-center justify-between">
                                 <span className="text-[10px] font-black text-white uppercase tracking-widest">{node.label}</span>
                                 <span className={`text-[8px] font-black text-${node.color}-400 uppercase tracking-widest`}>{node.status}</span>
                             </div>
                         ))}
                     </div>
                  </div>
               </section>

               {/* Final Call to Action */}
               <section className="pt-24 border-t border-indigo-100">
                  <div className="bg-indigo-900 rounded-[3rem] p-12 md:p-24 text-center text-white shadow-2xl relative overflow-hidden">
                     <div className="relative z-10 max-w-2xl mx-auto">
                        <Shield className="mx-auto mb-10 text-emerald-400 animate-pulse" size={64} />
                        <h2 className="text-5xl font-black tracking-tighter mb-8 leading-tight italic">Join the <br /> <span className="text-indigo-400">Final Record.</span></h2>
                        <p className="text-lg font-bold leading-relaxed text-indigo-200/60 italic mb-12">
                           Whether you are an institution securing a referendum or a citizen securing a deed, 
                           the Satohash Mesh is your final point of truth.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                           <Link to="/dashboard">
                              <button className="rounded-2xl bg-white px-12 py-5 text-[12px] font-black uppercase tracking-[0.2em] text-indigo-900 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-white/20 active:scale-95 italic">
                                 Launch Workbench
                              </button>
                           </Link>
                           <Link to="/developers">
                              <button className="rounded-2xl border-2 border-white/20 px-12 py-5 text-[12px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10 active:scale-95 italic">
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
      <footer className="py-32 border-t border-indigo-50 bg-white">
         <div className="layout-container flex flex-col items-center opacity-30">
            <Shield size={60} className="text-indigo-900 mb-8" />
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-900">SATOHASH_PROTOCOL_SECURITY_COUNCIL</div>
            <div className="mt-4 text-[9px] font-mono">GENESIS_HASH: 000000000019d6689c085ae165831e934ff763...</div>
            <p className="mt-6 text-[8px] font-black uppercase tracking-widest text-indigo-900/60">Immutable Data Rights Reserved • {new Date().getFullYear()}</p>
         </div>
      </footer>
    </div>
  );
}
