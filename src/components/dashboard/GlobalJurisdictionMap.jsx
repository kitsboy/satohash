import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  ShieldCheck,
  Scale,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Gavel,
  MapPin
} from 'lucide-react'

const JURISDICTIONS = [
  {
    id: 'eu',
    name: 'European Union',
    region: 'Supporting evidence',
    status: 'Evidentiary',
    color: '#10b981', // Emerald
    bgGlow: 'rgba(16, 185, 129, 0.1)',
    law: 'eIDAS Regulation',
    description:
      'Satohash provides independently verifiable cryptographic evidence of existence-at-a-time. It is not a qualified electronic time stamp under eIDAS Article 42 (which requires an accredited Time Stamping Authority) and does not carry the eIDAS presumption of accuracy. A qualified time stamp should be used where the law requires one.',
    body: 'European Telecommunications Standards Institute (ETSI)',
    rating: 'Green'
  },
  {
    id: 'na',
    name: 'North America',
    region: 'Supporting evidence',
    status: 'Supporting evidence',
    color: '#3b82f6', // Cyber Blue
    bgGlow: 'rgba(59, 130, 246, 0.1)',
    law: 'ESIGN Act & UETA',
    description:
      'Under ESIGN and UETA, electronic records are not denied legal effect solely because they are electronic. A Bitcoin-anchored hash is an electronic record of existence-at-a-time; its admissibility and weight depend on the rules of evidence and chain of custody.',
    body: 'National Conference of Commissioners on Uniform State Laws (NCCUSL)',
    rating: 'Green'
  },
  {
    id: 'asia',
    name: 'Asia Pacific',
    region: 'Territorial Variance',
    status: 'Emerging',
    color: '#f59e0b', // Amber
    bgGlow: 'rgba(245, 158, 11, 0.1)',
    law: 'UNCITRAL Model Law',
    description:
      'Admissibility varies significantly between progressive hubs (Singapore, HK) and developing regions. Generally follows the principle of non-discrimination against electronic evidence.',
    body: 'United Nations Commission on International Trade Law',
    rating: 'Amber'
  },
  {
    id: 'latam',
    name: 'Latin America',
    region: 'Statutory Acceptance',
    status: 'Validated',
    color: '#8b5cf6', // Purple
    bgGlow: 'rgba(139, 92, 246, 0.1)',
    law: 'Ley Modelo de la CNUDMI',
    description:
      'Rapidly adopting digital evidence standards. Most jurisdictions now recognize electronic timestamps as providing legal certainty for commercial transactions.',
    body: 'Organization of American States (OAS)',
    rating: 'Green'
  }
]

export default function GlobalJurisdictionMap() {
  const [selected, setSelected] = useState(JURISDICTIONS[0])

  return (
    <div className="w-full space-y-12 py-12">
      <div className="flex flex-col justify-between gap-6 border-b border-[var(--border)] pb-8 md:flex-row md:items-end">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-active)]/30 bg-[var(--accent-active)]/10 px-4 py-1.5 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <Globe size={14} className="text-[var(--accent-active)]" />
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[var(--accent-active)] uppercase">
              Global Jurisdictional Admissibility
            </span>
          </div>
          <h2 className="text-4xl leading-none font-black tracking-tighter uppercase md:text-5xl">
            Judicial <span className="text-[var(--text-secondary)]">Coverage.</span>
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed font-medium text-[var(--text-secondary)]">
          Satohash proofs are independently verifiable evidence of existence-at-a-time.
          Admissibility and weight are decided by a court.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Selector List */}
        <div className="space-y-4 lg:col-span-5">
          {JURISDICTIONS.map((j) => {
            const isActive = selected.id === j.id
            return (
              <button
                key={j.id}
                onClick={() => setSelected(j)}
                className={`group relative w-full overflow-hidden rounded-3xl border p-6 text-left transition-all duration-300 ${
                  isActive
                    ? 'border-[var(--accent-active)] bg-[var(--surface-raised)] shadow-[0_20px_40px_rgba(0,0,0,0.4)]'
                    : 'border-[var(--border)] bg-transparent hover:border-[var(--border-bright)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-glow"
                    className="pointer-events-none absolute inset-0 opacity-10"
                    style={{
                      background: `radial-gradient(circle at center, ${j.color}, transparent 70%)`
                    }}
                  />
                )}

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl border transition-all"
                      style={{
                        borderColor: isActive ? `${j.color}50` : 'var(--border)',
                        backgroundColor: isActive ? `${j.color}10` : 'transparent',
                        color: isActive ? j.color : 'var(--text-secondary)'
                      }}
                    >
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-bold tracking-tight transition-colors ${isActive ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}
                      >
                        {j.name}
                      </h3>
                      <p className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase opacity-60">
                        {j.law}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="rounded-md border px-2 py-1 text-[9px] font-black tracking-widest uppercase"
                      style={{
                        color: j.color,
                        borderColor: `${j.color}30`,
                        backgroundColor: `${j.color}05`
                      }}
                    >
                      {j.status}
                    </span>
                    <ChevronRight
                      size={16}
                      className={`transition-transform duration-300 ${isActive ? 'translate-x-0 text-white' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}
                    />
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Detail Card */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full overflow-hidden rounded-[2.5rem] border border-[var(--border-bright)] bg-[var(--bg-secondary)] p-10 shadow-2xl shadow-black/50 md:p-14"
            >
              {/* Background Ambient Glow */}
              <div
                className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full opacity-20 blur-[120px]"
                style={{ backgroundColor: selected.color }}
              />

              <div className="relative z-10 flex h-full flex-col justify-between gap-12">
                <div className="space-y-10">
                  <header className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-1.5 w-1.5 rounded-full shadow-[0_0_10px_currentcolor]"
                          style={{ color: selected.color, backgroundColor: selected.color }}
                        />
                        <span className="text-[11px] font-bold tracking-[0.3em] uppercase opacity-60">
                          Forensic Intelligence Report
                        </span>
                      </div>
                      <h4 className="text-3xl font-black tracking-tighter uppercase md:text-4xl">
                        {selected.name} <span style={{ color: selected.color }}>Analysis.</span>
                      </h4>
                    </div>
                    <div
                      className="hidden h-14 w-14 items-center justify-center rounded-2xl border shadow-xl sm:flex"
                      style={{
                        borderColor: `${selected.color}30`,
                        backgroundColor: `${selected.color}05`,
                        color: selected.color
                      }}
                    >
                      <Scale size={28} />
                    </div>
                  </header>

                  <div className="space-y-6">
                    <p className="text-lg leading-relaxed font-medium text-[var(--text-secondary)] md:text-xl">
                      {selected.description}
                    </p>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-5">
                        <div className="flex items-center gap-2 text-[var(--accent-active)]">
                          <ShieldCheck size={16} />
                          <span className="text-[10px] font-bold tracking-widest uppercase">
                            Admissibility
                          </span>
                        </div>
                        <p className="text-sm font-bold text-white">{selected.region}</p>
                      </div>
                      <div className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-5">
                        <div className="flex items-center gap-2 text-[var(--accent-pending)]">
                          <Gavel size={16} />
                          <span className="text-[10px] font-bold tracking-widest uppercase">
                            Governing Body
                          </span>
                        </div>
                        <p className="text-sm leading-tight font-bold text-white">
                          {selected.body}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--border)] pt-8">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-8 items-center gap-2 rounded-full border px-3"
                      style={{
                        borderColor: `${selected.color}30`,
                        backgroundColor: `${selected.color}10`,
                        color: selected.color
                      }}
                    >
                      {selected.rating === 'Green' ? (
                        <CheckCircle size={12} />
                      ) : (
                        <AlertTriangle size={12} />
                      )}
                      <span className="text-[10px] font-black tracking-widest uppercase">
                        {selected.rating} Rated
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-[var(--text-secondary)] uppercase opacity-40">
                      Ref: {selected.law}
                    </span>
                  </div>
                  <button className="hidden items-center gap-2 text-[10px] font-bold tracking-widest text-white uppercase transition-colors hover:text-[var(--accent-active)] sm:flex">
                    Download Full Brief <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
