import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe2, CheckCircle2, Shield, Scale, ChevronRight, Gavel } from 'lucide-react'

const regions = [
  {
    id: 'us',
    name: 'United States',
    law: 'ESIGN & UETA Acts',
    status: 'Supporting evidence',
    detail:
      'Under ESIGN and UETA, electronic records are not denied legal effect merely because they are electronic. A Bitcoin-anchored hash is an electronic record of existence-at-a-time; its admissibility and weight depend on the rules of evidence and chain of custody.',
    color: 'indigo'
  },
  {
    id: 'eu',
    name: 'European Union',
    law: 'eIDAS Regulation',
    status: 'Evidentiary',
    detail:
      'Satohash provides independently verifiable cryptographic evidence of existence-at-a-time. It is not a qualified electronic time stamp under eIDAS Article 42 (which requires an accredited Time Stamping Authority) and does not carry the eIDAS presumption of accuracy. A qualified time stamp should be used where the law requires one.',
    color: 'emerald'
  },
  {
    id: 'asia',
    name: 'APAC Region',
    law: 'Electronic Transactions Acts',
    status: 'Supporting evidence',
    detail:
      'Many APAC jurisdictions adopt UNCITRAL Model Law principles for electronic data messages. Whether a Bitcoin-anchored hash is admitted, and its weight, is decided under each jurisdiction\u2019s evidence rules — confirm with local counsel.',
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
          <Gavel size={14} /> Global Evidence Orientation
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
                      Evidence Orientation
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
                      status="Evidentiary"
                      desc="Protocol proofs support existence-at-a-time; admissibility and weight vary by jurisdiction and proceeding."
                    />
                    <StatusCapability
                      icon={Shield}
                      color={c.accent}
                      title="e-Commerce Ready"
                      status="Aligned"
                      desc="Aligns with global electronic record and transfer concepts; evidentiary weight varies by jurisdiction."
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
                        Technical Evidence
                      </div>
                      <p className="text-[11px] leading-relaxed font-bold text-indigo-100/60 italic">
                        Satohash anchoring produces a portable “Technical Certificate of Existence.”
                        Whether it shifts any burden of proof is a question for the court and
                        counsel in the governing jurisdiction — independent verification makes the
                        evidence easier to authenticate, nothing more.
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
