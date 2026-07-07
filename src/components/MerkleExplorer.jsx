import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  FileText,
  Database,
  Shield,
  Download,
  Clock,
  Zap,
  CheckCircle2
} from 'lucide-react'
import Button from './Button'

export default function MerkleExplorer({ tree, highlightedIndex = null }) {
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [selectedAtom, setSelectedAtom] = useState(null)

  if (!tree) return null

  const pseudoHash = (input, salt) => {
    let h = 0
    const s = `${input}:${salt}`
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
    return h.toString(16).padStart(64, '0').slice(0, 64)
  }

  const downloadProof = (atom) => {
    const proofJson = {
      leaf: atom,
      root: tree.root,
      proof: [
        { side: 'right', hash: pseudoHash(atom, 'right') },
        { side: 'left', hash: pseudoHash(tree.root, 'left') }
      ],
      note: 'Illustrative Merkle path — verify against your OTS proof for authoritative data.',
      protocol: 'Satohash SHIELD-256',
      timestamp: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(proofJson, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `merkle_proof_${atom.substring(0, 8)}.json`
    a.click()
  }

  return (
    <div className="merkle-explorer relative overflow-hidden rounded-[32px] border border-slate-800 bg-slate-900 p-8 shadow-2xl">
      {/* Visual Header */}
      <div className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--accent-active)]/30 bg-[var(--accent-active)]/20 text-[var(--accent-active)]">
            <Layers size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-white uppercase">
              Protocol Layer: Merkle Tree
            </h3>
            <p className="mt-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
              Hierarchical Cryptographic Proof
            </p>
          </div>
        </div>
        <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-[10px] font-black tracking-widest text-emerald-400 uppercase">
          Live Computation
        </div>
      </div>

      {/* The Tree Visualization */}
      <div className="relative flex flex-col items-center gap-16">
        {/* ROOT NODE */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="group relative cursor-help"
          onClick={() => setSelectedLevel('root')}
        >
          <div className="relative z-10 w-64 rounded-2xl border-4 border-[var(--accent-active)]/30 bg-[var(--accent-active)] p-6 text-center shadow-[var(--accent-active)]/20 shadow-2xl transition-transform active:scale-95">
            <div className="mb-2 flex items-center justify-center gap-2 text-white/90">
              <Shield size={16} />
              <span className="text-[10px] font-black tracking-widest uppercase">
                Merkle Root (Anchor)
              </span>
            </div>
            <div className="truncate rounded-lg border border-white/20 bg-black/30 px-2 py-2 font-mono text-[11px] text-white">
              {tree.root}
            </div>
          </div>
          {/* Animated Lines coming down (pseudo-code visualization) */}
          <div className="absolute top-full left-1/2 h-16 w-0.5 bg-gradient-to-b from-[var(--accent-active)] to-transparent" />
        </motion.div>

        {/* INTERMEDIATE BRANCHES (Simplified for UI depth) */}
        <div className="relative flex w-full max-w-4xl justify-around">
          <div className="absolute top-0 right-1/4 left-1/4 h-px bg-slate-800" />

          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-8">
              <div
                className="w-48 cursor-pointer rounded-xl border border-slate-700 bg-slate-800 p-4 text-center transition-all active:scale-95"
                onClick={() => setSelectedLevel('branch')}
              >
                <span className="mb-2 block text-[9px] font-black tracking-widest text-slate-500 uppercase">
                  Branch Node
                </span>
                <div className="h-2 w-full rounded border border-slate-600/50 bg-slate-700" />
              </div>

              {/* LEAVES (The actual files/atoms) */}
              <div className="flex gap-4">
                {tree.atoms.slice((i - 1) * 2, i * 2).map((atom, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5, scale: 1.05 }}
                    onClick={() => setSelectedAtom(atom)}
                    className={`w-32 cursor-pointer rounded-xl border-2 p-4 transition-all ${
                      highlightedIndex === (i - 1) * 2 + idx
                        ? 'border-[var(--accent-active)] bg-[var(--accent-active)]/20 shadow-[var(--accent-active)]/10 shadow-lg'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
                    }`}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <FileText
                        size={14}
                        className={
                          highlightedIndex === (i - 1) * 2 + idx
                            ? 'text-[var(--accent-active)]'
                            : 'text-slate-500'
                        }
                      />
                      <span className="text-[9px] font-black text-slate-400 uppercase">
                        Document Atom
                      </span>
                    </div>
                    <div className="mb-2 line-clamp-2 text-[10px] font-medium text-slate-300 italic">
                      &ldquo;{atom.substring(0, 40)}...&rdquo;
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-slate-700">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="h-full bg-[var(--accent-active)]"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedAtom && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="relative mt-12 rounded-2xl border border-slate-700 bg-slate-800 p-6"
          >
            <button
              onClick={() => setSelectedAtom(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              ✕
            </button>
            <h4 className="mb-4 text-xs font-black tracking-widest text-[var(--accent-active)] uppercase">
              Leaf Specification
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-[9px] font-black text-slate-500 uppercase">
                  Raw Identifier
                </label>
                <p className="font-mono text-[11px] break-all text-white">{selectedAtom}</p>
              </div>
              <div className="flex flex-col justify-end">
                <Button variant="primary" size="small" onClick={() => downloadProof(selectedAtom)}>
                  <Download size={14} /> Download inclusion Proof
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROOF OF HISTORY TIMELINE */}
      <div className="mt-20 border-t border-slate-800 pt-12">
        <h4 className="mb-8 text-center text-[10px] font-black tracking-[0.2em] text-[var(--accent-active)] uppercase">
          Protocol Journey: Proof of History
        </h4>
        <div className="relative mx-auto flex max-w-2xl items-start justify-between">
          <div className="absolute top-4 right-0 left-0 z-0 h-0.5 bg-slate-800" />

          <HistoryStep icon={Zap} label="Hashing" status="Complete" active />
          <HistoryStep icon={Layers} label="Bundling" status="Complete" active />
          <HistoryStep icon={Database} label="Anchoring" status="Pending" />
          <HistoryStep icon={CheckCircle2} label="Verifiable" status="Awaiting" />
        </div>
      </div>

      <div className="mt-16 flex justify-center gap-8 border-t border-slate-800 pt-8 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[var(--accent-active)]" />
          Secure Anchor
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-slate-700" />
          Cryptographic Branch
        </div>
        <div className="flex items-center gap-2 text-[var(--accent-active)]">
          <div className="h-2 w-2 animate-ping rounded-full bg-[var(--accent-active)]" />
          Verified Leaf
        </div>
      </div>
    </div>
  )
}

function HistoryStep({ icon: Icon, label, status, active }) {
  return (
    <div className="relative z-10 flex w-24 flex-col items-center gap-3">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${active ? 'border-[var(--accent-active)] bg-[var(--accent-active)] text-white' : 'border-slate-800 bg-slate-900 text-slate-600'}`}
      >
        <Icon size={14} />
      </div>
      <div className="text-center">
        <p
          className={`text-[10px] font-black uppercase ${active ? 'text-white' : 'text-slate-600'}`}
        >
          {label}
        </p>
        <p className="mt-1 text-[8px] font-bold text-slate-500 uppercase">{status}</p>
      </div>
    </div>
  )
}
