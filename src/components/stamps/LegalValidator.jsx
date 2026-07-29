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
    indigo: {
      accent: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      glow: 'shadow-indigo-500/20'
    },
    emerald: {
      accent: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      glow: 'shadow-emerald-500/20'
    },
    amber: {
      accent: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      glow: 'shadow-amber-500/20'
    }
  }

  const c = colorMap[selectedRegion.color]

  return (
    <div className="space-y-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-[10px] font-black tracking-[0.3em] text-indigo-600 uppercase">
          <Gavel size={14} /> Global Compliance Protocol
        </div>
        <h2 className="mb-6 text-4xl font-black tracking-tighter text-indigo-900 uppercase italic md:text-5xl">
          Jurisdictional <br /> <span className="text-indigo-600 italic">INTELLIGENCE.</span>
        </h2>
        <p className="text-lg leading-relaxed font-bold text-slate-500 italic">
          Select a region to understand how Satohash cryptographic proofs align with global
          electronic signature and timestamping regulations.
        </p>
      </div>

      <div className="grid items-start gap-12 lg:grid-cols-5">
        {/* Region Selector */}
        <div className="space-y-4 lg:col-span-2">
          {regions.map((region) => {
            const isActive = selectedRegion.id === region.id
            const regColor = colorMap[region.color]
            return (
              <motion.button
                key={region.id}
                whileHover={{ x: 8 }}
                onClick={() => setSelectedRegion(region)}
                className={`group flex w-full items-center justify-between rounded-[2rem] border-2 p-8 text-left transition-all ${
                  isActive
                    ? `${regColor.border} bg-white shadow-2xl ${regColor.glow}`
                    : 'border-slate-100 bg-slate-50/50 opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                }`}
              >
                <div>
                  <div
                    className={`mb-2 text-lg leading-none font-black tracking-tighter uppercase italic ${isActive ? regColor.accent : 'text-slate-400'}`}
                  >
                    {region.name}
                  </div>
                  <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase italic">
                    {region.law}
                  </div>
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
              className="glass-card relative overflow-hidden border-indigo-50 bg-white p-12 shadow-2xl shadow-indigo-500/5"
            >
              <div
                className={`absolute top-0 right-0 h-96 w-96 rounded-full ${c.bg} -mt-48 -mr-48 opacity-20 blur-[120px]`}
              />

              <div className="relative z-10">
                <div className="mb-10 flex items-center gap-6">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-[1.5rem] text-white shadow-xl ${c.glow} bg-indigo-900`}
                  >
                    <Globe2 size={32} />
                  </div>
                  <div>
                    <h3 className="mb-2 text-2xl leading-none font-black tracking-tighter text-indigo-900 uppercase italic">
                      {selectedRegion.name} <span className="text-indigo-600">Analysis.</span>
                    </h3>
                    <div
                      className={`text-[10px] font-black tracking-[0.3em] uppercase ${c.accent}`}
                    >
                      Formal Compliance Check Verified
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-lg leading-relaxed font-bold text-indigo-900/70 italic">
                    {selectedRegion.detail}
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
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

                  <div className="flex items-start gap-6 rounded-3xl bg-indigo-900 p-8 text-white shadow-inner">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-emerald-400"
                    >
                      <Scale size={20} />
                    </motion.div>
                    <div>
                      <div className="mb-2 text-xs font-black tracking-[0.2em] text-indigo-300 uppercase">
                        Technical Presumption
                      </div>
                      <p className="text-[11px] leading-relaxed font-bold text-indigo-100/60 italic">
                        Satohash anchoring creates a “Technical Certificate of Existence” that
                        shifts the burden of proof to the challenging party in most judiciaries.
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
    <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-6">
      <div className="mb-4 flex items-center gap-3">
        <Icon size={18} className={color} />
        <h4 className="text-[10px] font-black tracking-widest text-indigo-900 uppercase">
          {title}
        </h4>
      </div>
      <div className="mb-2 text-sm font-black text-indigo-900 italic">{status}</div>
      <p className="text-[9px] leading-normal font-bold text-slate-500 italic">{desc}</p>
    </div>
  )
}

export default LegalValidator
