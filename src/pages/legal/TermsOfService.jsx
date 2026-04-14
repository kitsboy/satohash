import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Gavel, Scale, Lock, Globe } from 'lucide-react'

export default function TermsOfService() {
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
          <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-indigo-600 to-indigo-400" />
          
          <div className="p-12 md:p-24">
            <header className="mb-20 text-center">
                <Shield className="mx-auto mb-8 text-indigo-600" size={48} />
                <h1 className="mb-4 text-5xl font-black tracking-tighter text-indigo-900 uppercase italic">
                    Terms of <span className="text-indigo-600">SERVICE.</span>
                </h1>
                <div className="h-1 w-24 bg-indigo-100 mx-auto mb-6" />
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase italic">
                    Protocol Version 3.0.0-PRO • Effective: {new Date().toLocaleDateString()}
                </p>
            </header>

            <div className="grid gap-16 text-slate-700 leading-relaxed font-bold italic">
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black italic">01</div>
                        <h2 className="text-xl font-black text-indigo-900 uppercase italic tracking-tight">Acceptance of Protocol</h2>
                    </div>
                    <p className="pl-12 text-sm text-slate-500">
                        By interacting with the Satohash interface or the underlying API Mesh, you acknowledge that you are 
                        engaging with a cryptographic attestation protocol. Use of the service constitutes agreement 
                        to these Terms of Service. Satohash provides a non-custodial gateway to the Bitcoin blockchain.
                    </p>
                </section>

                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black italic">02</div>
                        <h2 className="text-xl font-black text-indigo-900 uppercase italic tracking-tight">Nature of Service</h2>
                    </div>
                    <p className="pl-12 text-sm text-slate-500">
                        Satohash is a technical facilitator for OpenTimestamps (OTS). We bridge local SHA-256 hashing 
                        with the Bitcoin PoW consensus. We never store, transmit, or view the original binary data 
                        of your documents. All hashing is performed in the client&apos;s local environment.
                    </p>
                </section>

                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black italic">03</div>
                        <h2 className="text-xl font-black text-indigo-900 uppercase italic tracking-tight">No Legal Practice</h2>
                    </div>
                    <p className="pl-12 text-sm text-slate-500">
                        The Satohash Global Council is a provider of cryptographic software, not a law firm. 
                        The availability of legal-themed templates or "Judicial Grade" branding refers to technical 
                        alignment with standards like eIDAS and UETA, but does not constitute legal advice. 
                        Always consult with professional counsel for jurisdictional specificities.
                    </p>
                </section>

                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black italic">04</div>
                        <h2 className="text-xl font-black text-indigo-900 uppercase italic tracking-tight">Immutable Responsibility</h2>
                    </div>
                    <p className="pl-12 text-sm text-slate-500">
                        The user bears sole responsibility for the preservation of the original file. A Bitcoin 
                        anchor is mathematically useless without the bit-for-bit identical original artifact. 
                        Loss of the file results in permanent loss of verifiability.
                    </p>
                </section>

                <div className="rounded-[2.5rem] bg-[#0c1220] p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Gavel size={120} />
                    </div>
                    <h4 className="text-sm font-black uppercase italic tracking-widest text-indigo-400 mb-6">Finality Protocol</h4>
                    <p className="text-xs font-bold leading-relaxed text-slate-400 italic mb-10">
                        These terms are governed by the decentralized consensus laws of the Bitcoin network. 
                    </p>
                    <div className="flex items-center justify-between border-t border-white/10 pt-8">
                        <div className="flex items-center gap-2 text-[8px] font-black uppercase text-indigo-200">
                            <Scale size={12} /> Judicial Alignment Active
                        </div>
                        <div className="flex items-center gap-2 text-[8px] font-black uppercase text-rose-400">
                            <Lock size={12} /> Non-Custodial Security
                        </div>
                    </div>
                </div>

                <div className="text-center pt-12 border-t border-slate-100">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-8">Questions regarding protocol compliance?</p>
                    <Link to="/trust">
                        <button className="px-10 py-4 rounded-xl border-2 border-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:border-indigo-600 transition-all">
                            Visit Trust Center
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
