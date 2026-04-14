import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, Info, Lock, Scale, Globe, Binary, CheckCircle, ChevronRight, Activity, Zap } from 'lucide-react'
import ProofAnalytics from '../../components/ProofAnalytics'
import LegalValidator from '../../components/LegalValidator'

export default function TrustCenter() {
  return (
    <div className="min-h-screen pt-32 pb-32" style={{ background: 'var(--bg-base)' }}>
      <div className="layout-container">
        
        {/* Hero Section */}
        <section className="text-center mb-24">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="pill-indigo mx-auto mb-10 w-fit"
          >
            Protocol Transparency Dashboard
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-black italic tracking-tighter text-indigo-900 uppercase italic mb-8"
          >
            Sovereign <span className="text-indigo-600">TRUST.</span>
          </motion.h1>
          <p className="max-w-3xl mx-auto text-xl font-bold italic text-slate-500 leading-relaxed mb-12">
            Mathematical proof of existence and integrity. We bridge the gap between 
            decentralized protocol reality and institutional-grade legal requirements.
          </p>
          
          <div className="flex justify-center gap-4">
             <Link to="/developers">
                <button className="btn-holographic px-10 py-5">View API Compliance</button>
             </Link>
             <Link to="/about">
                <button className="btn-secondary px-10 py-5 border-indigo-100 text-indigo-900 uppercase font-black text-[11px] tracking-widest">Read Whitepaper</button>
             </Link>
          </div>
        </section>

        {/* Core Trust Pillars */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {[
            { icon: Shield, title: 'Network Security', desc: 'Anchored directly into the Bitcoin blockchain via the world\'s most secure Proof-of-Work network.', color: 'indigo' },
            { icon: Lock, title: 'Zero Leak Privacy', desc: 'Secure local-first hashing ensures your source documents never leave your local environment.', color: 'emerald' },
            { icon: Scale, title: 'Legal Standing', desc: 'Compliant with ESIGN, UETA, and eIDAS Article 41 for electronic timestamping integrity.', color: 'amber' },
            { icon: Globe, title: 'Witness Mesh', desc: 'A decentralized network of nodes providing redundant validation for every proof generated.', color: 'violet' }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="glass-card p-10 bg-white border-indigo-50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all"
            >
              <div className={`h-14 w-14 rounded-2xl bg-${item.color}-500/10 text-${item.color}-600 flex items-center justify-center mb-8`}>
                <item.icon size={28} />
              </div>
              <h3 className="text-lg font-black text-indigo-900 uppercase italic mb-4">{item.title}</h3>
              <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Analytics Block */}
        <div className="mb-32">
           <ProofAnalytics />
        </div>

        {/* Intersectional Jurisdictions */}
        <div className="mb-32">
           <LegalValidator />
        </div>

        {/* Trust Seal / Compliance Banner */}
        <section className="relative overflow-hidden rounded-[4rem] bg-indigo-900 p-20 text-center text-white shadow-2xl shadow-indigo-500/20">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:40px_40px]" />
            </div>
            
            <div className="relative z-10">
                <Shield className="mx-auto mb-10 text-emerald-400" size={64} />
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 italic">Institutional Ready. <br /> Judicial Hardened.</h2>
                <div className="flex flex-wrap justify-center gap-12 mb-16">
                    <ComplianceBadge label="eIDAS Ready" status="Certified" />
                    <ComplianceBadge label="ESIGN Act" status="Compliant" />
                    <ComplianceBadge label="UETA Laws" status="Active" />
                    <ComplianceBadge label="ZK-SHA256" status="Hardened" />
                </div>
                <p className="max-w-2xl mx-auto text-sm font-medium text-indigo-200/60 italic mb-12">
                   Satohash is constructed to survive judicial scrutiny. Our proofs are mathematically self-evident, 
                   requiring no central authority for verification after anchoring.
                </p>
                <Link to="/verify">
                    <button className="bg-white text-indigo-900 px-12 py-5 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                        Verify a Global Proof
                    </button>
                </Link>
            </div>
        </section>

      </div>
    </div>
  )
}

function ComplianceBadge({ label, status }) {
    return (
        <div className="text-center">
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-300 mb-1">{label}</div>
            <div className="text-lg font-black italic text-white flex items-center justify-center gap-2">
                <CheckCircle size={14} className="text-emerald-400" />
                {status}
            </div>
        </div>
    )
}
