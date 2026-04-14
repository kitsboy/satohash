import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Cpu, Database } from 'lucide-react'

export default function PrivacyPolicy() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-[140px] pb-32">
      <div className="layout-container max-w-5xl">
        <motion.button 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate(-1)} 
          className="mb-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-900/40 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Protocol
        </motion.button>

        <div className="document-paper mx-auto overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-emerald-600 to-indigo-600" />
          
          <div className="p-12 md:p-24">
            <header className="mb-20 text-center">
                <div className="inline-flex h-16 w-16 rounded-[1.5rem] bg-emerald-50 text-emerald-600 items-center justify-center mb-8 border border-emerald-100 shadow-xl shadow-emerald-500/10">
                    <EyeOff size={32} />
                </div>
                <h1 className="mb-4 text-5xl font-black tracking-tighter text-indigo-900 uppercase italic">
                    Privacy <span className="text-emerald-600">POLICY.</span>
                </h1>
                <div className="h-1 w-24 bg-indigo-100 mx-auto mb-6" />
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase italic">
                    Zero-Knowledge Architecture • Effective: {new Date().toLocaleDateString()}
                </p>
            </header>

            <div className="grid gap-16 text-slate-700 leading-relaxed font-bold italic">
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black italic">01</div>
                        <h2 className="text-xl font-black text-indigo-900 uppercase italic tracking-tight">Zero-Knowledge Core</h2>
                    </div>
                    <p className="pl-12 text-sm text-slate-500">
                        Satohash is engineered on the principle of minimal data exposure. We utilize 
                        local-side SHA-3 and SHA-256 hashing to ensure that your source documents never 
                        cross the network. Our servers never touch, view, or record your private artifacts. 
                        We only witness the mathematical proof.
                    </p>
                </section>

                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black italic">02</div>
                        <h2 className="text-xl font-black text-indigo-900 uppercase italic tracking-tight">Data Transmission</h2>
                    </div>
                    <p className="pl-12 text-sm text-slate-500">
                        The only data that traverses our Mesh API includes: 
                        (a) Your document's cryptographic hash; 
                        (b) Merkle-branch metadata for OTS aggregation; 
                        (c) Public Nostr keys if you choose to broadcast your attestation. 
                        We do not collect IP addresses or browser fingerprints for commercial tracking.
                    </p>
                </section>

                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black italic">03</div>
                        <h2 className="text-xl font-black text-indigo-900 uppercase italic tracking-tight">Non-Custodial Storage</h2>
                    </div>
                    <p className="pl-12 text-sm text-slate-500">
                        Proofs are stored in your localized Secure Vault (Browser IndexedDB). 
                        Satohash does not provide cloud backup for your private artifacts. 
                        Once a hash is anchored to Bitcoin, the only way to verify it is with 
                        your original file and the forensic .ots receipt. Protect them both.
                    </p>
                </section>

                <div className="grid md:grid-cols-3 gap-6 py-8">
                   <FeatureBox icon={Cpu} title="On-Device Hashing" />
                   <FeatureBox icon={Lock} title="No Tracking Cookies" />
                   <FeatureBox icon={Database} title="Decentralized Finality" />
                </div>

                <div className="rounded-[2.5rem] bg-indigo-900 p-12 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShieldCheck size={120} />
                    </div>
                    <h4 className="text-sm font-black uppercase italic tracking-widest text-emerald-400 mb-6">Security Standard</h4>
                    <p className="text-xs font-bold leading-relaxed text-indigo-200/60 italic">
                        Because we never hold your private keys or documents, we are mathematically 
                        incapable of leaking them. Your privacy is not a promise; it is a cryptographic constraint.
                    </p>
                </div>

                <div className="text-center pt-8">
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-6">Need technical confirmation of zero-knowledge flows?</p>
                   <Link to="/about">
                      <button className="px-10 py-4 rounded-xl border-2 border-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:border-emerald-600 hover:text-emerald-600 transition-all">
                        Technical Architecture
                      </button>
                   </Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureBox({ icon: Icon, title }) {
    return (
        <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col items-center text-center">
            <Icon size={20} className="text-indigo-400 mb-4" />
            <span className="text-[10px] font-black uppercase text-indigo-900 tracking-tight">{title}</span>
        </div>
    )
}
