import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe2, CheckCircle2, Shield, Scale, ChevronRight, Gavel } from 'lucide-react'

const regions = [
  {
    id: 'us',
    name: 'United States',
    law: 'ESIGN & UETA Acts',
    status: 'High',
    detail:
      'Blockchain timestamps are recognized as electronic evidence under the ESIGN Act and UETA at the federal and state levels. The mathematical immutability provides a prima facie presumption of integrity.',
    color: 'indigo'
  },
  {
    id: 'eu',
    name: 'European Union',
    law: 'eIDAS Regulation',
    status: 'Hardened',
    detail:
      'Qualifies as an Electronic Time Stamp under Article 41, creating a legal presumption of the accuracy of the date and time. Satahash aligns with AdES requirements for advanced signatures.',
    color: 'emerald'
  },
  {
    id: 'asia',
    name: 'APAC Region',
    law: 'Electronic Trans. Acts',
    status: 'Validated',
    detail:
      'Recognized in global trade hubs like Singapore and Hong Kong. Satahash follows UNCITRAL Model Law principles for data messages and automated verification.',
    color: 'amber'
  }
]

const LegalValidator = () => {
  const [selectedRegion, setSelectedRegion] = useState(regions[0])

  const colorMap = {
    indigo: { accent: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', glow: 'shadow-indigo-500/20' },
    emerald: { accent: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', glow: 'shadow-emerald-500/20' },
    amber: { accent: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', glow: 'shadow-amber-500/20' }
  }

  const c = colorMap[selectedRegion.color]

  return (
    <div className="space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
          <Gavel size={14} /> Global Compliance Protocol
        </div>
        <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-indigo-900 uppercase italic mb-6">
          Jurisdictional <br /> <span className="text-indigo-600 italic">INTELLIGENCE.</span>
        </h2>
        <p className="text-lg font-bold italic text-slate-500 leading-relaxed">
          Select a region to understand how Satohash cryptographic proofs align with global 
          electronic signature and timestamping regulations.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12 items-start">
        {/* Region Selector */}
        <div className="lg:col-span-2 space-y-4">
          {regions.map((region) => {
            const isActive = selectedRegion.id === region.id
            const regColor = colorMap[region.color]
            return (
              <motion.button
                key={region.id}
                whileHover={{ x: 8 }}
                onClick={() => setSelectedRegion(region)}
                className={`w-full text-left p-8 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${
                  isActive 
                  ? `${regColor.border} bg-white shadow-2xl ${regColor.glow}` 
                  : 'border-slate-100 bg-slate-50/50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                }`}
              >
                <div>
                  <div className={`text-lg font-black italic uppercase tracking-tighter leading-none mb-2 ${isActive ? regColor.accent : 'text-slate-400'}`}>
                    {region.name}
                  </div>
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">{region.law}</div>
                </div>
                {isActive && <ChevronRight size={20} className={regColor.accent} />}
              </motion.button>
            )
          })}
        </div>

        {/* Region Detail Display */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRegion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-12 bg-white border-indigo-50 shadow-2xl shadow-indigo-500/5 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 h-96 w-96 rounded-full ${c.bg} blur-[120px] opacity-20 -mr-48 -mt-48`} />
              
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-10">
                  <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl ${c.glow} bg-indigo-900`}>
                    <Globe2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic tracking-tighter text-indigo-900 uppercase italic leading-none mb-2">
                        {selectedRegion.name} <span className="text-indigo-600">Analysis.</span>
                    </h3>
                    <div className={`text-[10px] font-black uppercase tracking-[0.3em] ${c.accent}`}>
                        Formal Compliance Check Verified
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                    <p className="text-lg font-bold italic text-indigo-900/70 leading-relaxed">
                        {selectedRegion.detail}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <StatusCapability 
                            icon={CheckCircle2} 
                            color={c.accent}
                            title="Legal Validity" 
                            status="High (Admissible)" 
                            desc="Protocol proofs meet foundational legal requirements for timestamp validity."
                        />
                         <StatusCapability 
                            icon={Shield} 
                            color={c.accent}
                            title="e-Commerce Ready" 
                            status="Compliant" 
                            desc="Fully aligns with global electronic transfer and trade laws."
                        />
                    </div>

                    <div className="p-8 rounded-3xl bg-indigo-900 text-white shadow-inner flex items-start gap-6">
                        <motion.div 
                            animate={{ scale: [1, 1.1, 1] }} 
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="h-10 w-10 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400"
                        >
                            <Scale size={20} />
                        </motion.div>
                        <div>
                            <div className="text-xs font-black uppercase tracking-[0.2em] mb-2 text-indigo-300">Technical Presumption</div>
                            <p className="text-[11px] font-bold text-indigo-100/60 leading-relaxed italic">
                                Satohash anchoring creates a "Technical Certificate of Existence" that shifts 
                                the burden of proof to the challenging party in most judiciaries.
                            </p>
                        </div>
                    </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function StatusCapability({ icon: Icon, title, status, desc, color }) {
    return (
        <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-4">
                <Icon size={18} className={color} />
                <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">{title}</h4>
            </div>
            <div className="text-sm font-black italic text-indigo-900 mb-2">{status}</div>
            <p className="text-[9px] font-bold text-slate-500 leading-normal italic">{desc}</p>
        </div>
    )
}

export default LegalValidator
