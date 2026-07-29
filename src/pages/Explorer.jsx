import { motion } from 'framer-motion'
import {
  Clock,
  Search,
  Compass,
  TreePine,
  GitMerge,
  FileText,
  Binary,
  ShieldCheck
} from 'lucide-react'
import { useState } from 'react'
import MerkleHeart from '../components/stamps/MerkleHeart'
import usePageMeta from '../hooks/usePageMeta'

const LEAF_DATA = {
  A: {
    name: 'estate_deed.pdf',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    sibling: 'B',
    parent: 'AB'
  },
  B: {
    name: 'merkle_root_spec.txt',
    hash: 'f1a7d653762bc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852923',
    sibling: 'A',
    parent: 'AB'
  },
  C: {
    name: 'nostr_key_backup.json',
    hash: 'a2b1c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b41a',
    sibling: 'D',
    parent: 'CD'
  },
  D: {
    name: 'deposition_mic_test.webm',
    hash: 'd9e8c753762bc1c149afbf4c8996fb92427ae41e4649b934ca495991b78521a2c',
    sibling: 'C',
    parent: 'CD'
  }
}

const PARENT_DATA = {
  AB: {
    left: 'A',
    right: 'B',
    hash: '87f5d723fa8c21a41b5204bc99e6ab4f26ca4e1837a28b03cfb186b5993de451'
  },
  CD: {
    left: 'C',
    right: 'D',
    hash: '9b2c8e31a8fc09e41b5204bc99e6ab4f26ca4e1837a28b03cfb186b5993ef92c'
  }
}

const ROOT_HASH = '3f7a8b9c2d1e0f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a'

export default function Explorer() {
  usePageMeta({ page: 'explorer' })
  const [view, setView] = useState('chrono') // chrono, merkle, path
  const [selectedLeaf, setSelectedLeaf] = useState('A')

  const currentLeaf = LEAF_DATA[selectedLeaf]
  const currentSibling = LEAF_DATA[currentLeaf.sibling]
  const currentParent = PARENT_DATA[currentLeaf.parent]

  return (
    <div className="flex h-full w-full max-w-full flex-col overflow-hidden pb-20 select-none">
      <header className="z-10 flex flex-col justify-between gap-4 border-b border-[var(--border)] bg-[var(--bg-primary)]/50 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:gap-0 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--accent-active)]/30 bg-[var(--accent-active)]/10 text-[var(--accent-active)]">
            <Compass size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tighter uppercase sm:text-2xl">
              Noir Explorer
            </h1>
            <p className="text-[9px] font-bold tracking-widest break-words text-[var(--text-secondary)] uppercase sm:text-[10px] sm:whitespace-nowrap">
              Experiential Discovery & Temporal Navigation
            </p>
          </div>
        </div>

        <div className="flex self-start rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1 sm:self-auto">
          <button
            type="button"
            aria-pressed={view === 'chrono'}
            onClick={() => setView('chrono')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase transition-all sm:px-4 sm:py-2 sm:text-[10px] ${view === 'chrono' ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}
          >
            <Clock size={12} className="sm:h-3.5 sm:w-3.5" /> Chrono
          </button>
          <button
            type="button"
            aria-pressed={view === 'merkle'}
            onClick={() => setView('merkle')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase transition-all sm:px-4 sm:py-2 sm:text-[10px] ${view === 'merkle' ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}
          >
            <TreePine size={12} className="sm:h-3.5 sm:w-3.5" /> Merkle Heart
          </button>
          <button
            type="button"
            aria-pressed={view === 'path'}
            onClick={() => setView('path')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase transition-all sm:px-4 sm:py-2 sm:text-[10px] ${view === 'path' ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}
          >
            <GitMerge size={12} className="sm:h-3.5 sm:w-3.5" /> Path Trace
          </button>
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden bg-black">
        {/* Cinematic Background */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-active),transparent)] opacity-20" />
          <div
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
            }}
          />
        </div>

        {view === 'chrono' && (
          <div className="flex h-full items-center justify-center overflow-y-auto p-4 sm:p-12">
            <div className="w-full max-w-4xl space-y-8 py-6 text-center sm:space-y-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 sm:space-y-6"
              >
                <h2 className="text-4xl leading-none font-extrabold tracking-tighter sm:text-6xl">
                  ChronoExplorer
                </h2>
                <p className="mx-auto max-w-2xl text-base text-[var(--text-secondary)] sm:text-xl">
                  A temporal search engine for the Bitcoin blockchain. Locate proofs by date, block
                  height, or era.
                </p>
                <div className="relative mx-auto max-w-xl px-2">
                  <Search className="absolute top-1/2 left-6 h-5 w-5 -translate-y-1/2 text-[var(--text-secondary)] sm:left-6 sm:h-6 sm:w-6" />
                  <input
                    type="search"
                    aria-label="Search block height or date"
                    placeholder="Enter block height or date (e.g. 2009-01-03)"
                    className="h-14 w-full rounded-[1.75rem] border border-white/10 bg-white/5 pr-4 pl-12 text-sm font-medium transition-all outline-none focus:border-[var(--accent-active)] focus:bg-white/10 sm:h-20 sm:rounded-[2.5rem] sm:pr-8 sm:pl-16 sm:text-xl"
                  />
                </div>
              </motion.div>

              <div className="grid grid-cols-1 gap-4 px-2 sm:grid-cols-3 sm:gap-6">
                {[
                  { label: 'Halving Era', value: '4th', desc: 'Current Block Era' },
                  { label: 'Time Travel', value: 'Enabled', desc: 'Sync Active' },
                  { label: 'Historical Depth', value: '841K', desc: 'Blocks Indexed' }
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="space-y-1 rounded-2xl border border-white/10 bg-white/5 p-5 text-left sm:space-y-2 sm:rounded-3xl sm:p-6"
                  >
                    <p className="text-[9px] font-bold tracking-widest text-[var(--text-secondary)] uppercase sm:text-[10px]">
                      {stat.label}
                    </p>
                    <p className="font-mono text-2xl font-bold sm:text-3xl">{stat.value}</p>
                    <p className="text-[9px] font-medium text-white/40 sm:text-[10px]">
                      {stat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'merkle' && (
          <div className="relative flex h-full flex-col items-center justify-center overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10 mb-8 space-y-2 px-4 text-center sm:mb-20 sm:space-y-4"
            >
              <h2 className="text-2xl font-bold tracking-tighter uppercase sm:text-4xl">
                The Merkle Heart
              </h2>
              <p className="max-w-md text-xs text-[var(--text-secondary)] sm:text-sm">
                A 3D visualization of the current Bitcoin Merkle tree. Every proof is a leaf
                climbing into the root of finality.
              </p>
            </motion.div>

            <div className="absolute inset-0">
              <MerkleHeart />
            </div>
          </div>
        )}

        {view === 'path' && (
          <div className="flex h-full flex-col overflow-hidden lg:flex-row">
            {/* Left: SVG Path Visualizer */}
            <div className="relative flex min-h-[350px] flex-1 flex-col items-center justify-center p-6">
              <div className="absolute top-6 left-6 z-10 space-y-1">
                <h3 className="text-xs font-black tracking-[0.2em] text-[var(--accent-active)] uppercase italic">
                  Interactive Path Tracer
                </h3>
                <p className="text-[10px] text-[var(--text-secondary)] uppercase">
                  Select a leaf node to trace sibling hash paths to the root
                </p>
              </div>

              <svg viewBox="0 0 400 320" className="relative z-10 h-auto w-full max-w-lg">
                {/* Connection lines from Leaves to Level 1 Parents */}
                {/* Path A to AB */}
                <line
                  x1="50"
                  y1="250"
                  x2="100"
                  y2="150"
                  stroke={
                    selectedLeaf === 'A'
                      ? 'var(--accent-active)'
                      : selectedLeaf === 'B'
                        ? 'var(--accent-active)'
                        : '#334155'
                  }
                  strokeWidth={selectedLeaf === 'A' || selectedLeaf === 'B' ? '3' : '1.5'}
                  className="transition-all duration-500"
                />
                <line
                  x1="150"
                  y1="250"
                  x2="100"
                  y2="150"
                  stroke={
                    selectedLeaf === 'B'
                      ? 'var(--accent-active)'
                      : selectedLeaf === 'A'
                        ? 'var(--accent-active)'
                        : '#334155'
                  }
                  strokeWidth={selectedLeaf === 'A' || selectedLeaf === 'B' ? '3' : '1.5'}
                  className="transition-all duration-500"
                />

                {/* Path C to CD */}
                <line
                  x1="250"
                  y1="250"
                  x2="300"
                  y2="150"
                  stroke={
                    selectedLeaf === 'C'
                      ? 'var(--accent-active)'
                      : selectedLeaf === 'D'
                        ? 'var(--accent-active)'
                        : '#334155'
                  }
                  strokeWidth={selectedLeaf === 'C' || selectedLeaf === 'D' ? '3' : '1.5'}
                  className="transition-all duration-500"
                />
                <line
                  x1="350"
                  y1="250"
                  x2="300"
                  y2="150"
                  stroke={
                    selectedLeaf === 'D'
                      ? 'var(--accent-active)'
                      : selectedLeaf === 'C'
                        ? 'var(--accent-active)'
                        : '#334155'
                  }
                  strokeWidth={selectedLeaf === 'C' || selectedLeaf === 'D' ? '3' : '1.5'}
                  className="transition-all duration-500"
                />

                {/* Connection lines from parents to Root */}
                <line
                  x1="100"
                  y1="150"
                  x2="200"
                  y2="50"
                  stroke={
                    selectedLeaf === 'A' || selectedLeaf === 'B'
                      ? 'var(--accent-active)'
                      : '#334155'
                  }
                  strokeWidth={selectedLeaf === 'A' || selectedLeaf === 'B' ? '3' : '1.5'}
                  className="transition-all duration-500"
                />
                <line
                  x1="300"
                  y1="150"
                  x2="200"
                  y2="50"
                  stroke={
                    selectedLeaf === 'C' || selectedLeaf === 'D'
                      ? 'var(--accent-active)'
                      : '#334155'
                  }
                  strokeWidth={selectedLeaf === 'C' || selectedLeaf === 'D' ? '3' : '1.5'}
                  className="transition-all duration-500"
                />

                {/* Nodes */}
                {/* Level 0: Merkle Root */}
                <g className="cursor-pointer">
                  <circle
                    cx="200"
                    cy="50"
                    r="22"
                    fill="#0f172a"
                    stroke="var(--accent-active)"
                    strokeWidth="3"
                    className="shadow-[0_0_15px_var(--accent-active)]"
                  />
                  <text
                    x="200"
                    y="53"
                    fill="white"
                    fontSize="9"
                    fontWeight="900"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    ROOT
                  </text>
                </g>

                {/* Level 1: Sibling parents */}
                {/* Node AB */}
                <g className="cursor-pointer">
                  <circle
                    cx="100"
                    cy="150"
                    r="18"
                    fill="#0f172a"
                    stroke={
                      selectedLeaf === 'A' || selectedLeaf === 'B'
                        ? 'var(--accent-active)'
                        : '#475569'
                    }
                    strokeWidth="2.5"
                    className="transition-all duration-500"
                  />
                  <text
                    x="100"
                    y="153"
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    H_AB
                  </text>
                </g>

                {/* Node CD */}
                <g className="cursor-pointer">
                  <circle
                    cx="300"
                    cy="150"
                    r="18"
                    fill="#0f172a"
                    stroke={
                      selectedLeaf === 'C' || selectedLeaf === 'D'
                        ? 'var(--accent-active)'
                        : '#475569'
                    }
                    strokeWidth="2.5"
                    className="transition-all duration-500"
                  />
                  <text
                    x="300"
                    y="153"
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    H_CD
                  </text>
                </g>

                {/* Level 2: Leaves */}
                {/* Leaf A */}
                <g className="cursor-pointer" onClick={() => setSelectedLeaf('A')}>
                  <circle
                    cx="50"
                    cy="250"
                    r="16"
                    fill={
                      selectedLeaf === 'A'
                        ? 'var(--accent-active)'
                        : selectedLeaf === 'B'
                          ? '#4f46e5'
                          : '#0f172a'
                    }
                    stroke={
                      selectedLeaf === 'A'
                        ? 'var(--accent-active)'
                        : selectedLeaf === 'B'
                          ? '#4f46e5'
                          : '#475569'
                    }
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  <text
                    x="50"
                    y="253"
                    fill="white"
                    fontSize="9"
                    fontWeight="black"
                    textAnchor="middle"
                  >
                    A
                  </text>
                </g>

                {/* Leaf B */}
                <g className="cursor-pointer" onClick={() => setSelectedLeaf('B')}>
                  <circle
                    cx="150"
                    cy="250"
                    r="16"
                    fill={
                      selectedLeaf === 'B'
                        ? 'var(--accent-active)'
                        : selectedLeaf === 'A'
                          ? '#4f46e5'
                          : '#0f172a'
                    }
                    stroke={
                      selectedLeaf === 'B'
                        ? 'var(--accent-active)'
                        : selectedLeaf === 'A'
                          ? '#4f46e5'
                          : '#475569'
                    }
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  <text
                    x="150"
                    y="253"
                    fill="white"
                    fontSize="9"
                    fontWeight="black"
                    textAnchor="middle"
                  >
                    B
                  </text>
                </g>

                {/* Leaf C */}
                <g className="cursor-pointer" onClick={() => setSelectedLeaf('C')}>
                  <circle
                    cx="250"
                    cy="250"
                    r="16"
                    fill={
                      selectedLeaf === 'C'
                        ? 'var(--accent-active)'
                        : selectedLeaf === 'D'
                          ? '#4f46e5'
                          : '#0f172a'
                    }
                    stroke={
                      selectedLeaf === 'C'
                        ? 'var(--accent-active)'
                        : selectedLeaf === 'D'
                          ? '#4f46e5'
                          : '#475569'
                    }
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  <text
                    x="250"
                    y="253"
                    fill="white"
                    fontSize="9"
                    fontWeight="black"
                    textAnchor="middle"
                  >
                    C
                  </text>
                </g>

                {/* Leaf D */}
                <g className="cursor-pointer" onClick={() => setSelectedLeaf('D')}>
                  <circle
                    cx="350"
                    cy="250"
                    r="16"
                    fill={
                      selectedLeaf === 'D'
                        ? 'var(--accent-active)'
                        : selectedLeaf === 'C'
                          ? '#4f46e5'
                          : '#0f172a'
                    }
                    stroke={
                      selectedLeaf === 'D'
                        ? 'var(--accent-active)'
                        : selectedLeaf === 'C'
                          ? '#4f46e5'
                          : '#475569'
                    }
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  <text
                    x="350"
                    y="253"
                    fill="white"
                    fontSize="9"
                    fontWeight="black"
                    textAnchor="middle"
                  >
                    D
                  </text>
                </g>
              </svg>
            </div>

            {/* Right: Path Cryptography Details Panel */}
            <div className="flex w-full flex-col justify-between space-y-8 overflow-y-auto border-t border-[var(--border)] bg-[#05070a]/90 p-8 lg:w-96 lg:border-t-0 lg:border-l">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Binary size={18} className="text-[var(--accent-active)]" />
                  <h3 className="text-sm font-black tracking-widest text-white uppercase italic">
                    Path Audit Ledger
                  </h3>
                </div>

                {/* Dynamic Selection card */}
                <div className="space-y-3 rounded-xl border border-[var(--border)] bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <FileText size={14} className="text-[var(--accent-active)]" />
                    <span>Target Leaf {selectedLeaf}</span>
                  </div>
                  <div className="text-[10px] leading-relaxed font-medium text-[var(--text-secondary)]">
                    Name: <strong className="text-white">{currentLeaf.name}</strong>
                    <br />
                    Hash:{' '}
                    <span className="font-mono text-[9px] break-all text-[var(--accent-active)]">
                      {currentLeaf.hash}
                    </span>
                  </div>
                </div>

                {/* Cryptographic Proof Step 1: Leaf + Sibling */}
                <div className="space-y-2">
                  <h4 className="text-[9px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                    Step 1: Partner Sibling Combination
                  </h4>
                  <div className="space-y-2 rounded-xl border border-[#4f46e5]/30 bg-[#4f46e5]/5 p-4 font-mono text-[9px]">
                    <p className="text-[8px] font-black text-white/40 uppercase">
                      Partner Sibling ({currentLeaf.sibling})
                    </p>
                    <p className="truncate text-white">{currentSibling.name}</p>
                    <p className="break-all text-[#4f46e5]">{currentSibling.hash}</p>
                  </div>
                </div>

                {/* Cryptographic Proof Step 2: Parent hash math */}
                <div className="space-y-2">
                  <h4 className="text-[9px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                    Step 2: Parent Node Hash Execution
                  </h4>
                  <div className="space-y-2 rounded-xl border border-[var(--border)] bg-white/5 p-4 font-mono text-[9px]">
                    <p className="text-[8px] font-black text-[var(--accent-active)] uppercase">
                      H_{currentLeaf.parent} = SHA256(Leaf_{currentLeaf.parent === 'AB' ? 'A' : 'C'}{' '}
                      + Leaf_{currentLeaf.parent === 'AB' ? 'B' : 'D'})
                    </p>
                    <p className="truncate text-[var(--text-secondary)]">
                      Left: {currentLeaf.parent === 'AB' ? 'A' : 'C'} | Right:{' '}
                      {currentLeaf.parent === 'AB' ? 'B' : 'D'}
                    </p>
                    <p className="break-all text-[var(--accent-active)]">{currentParent.hash}</p>
                  </div>
                </div>

                {/* Cryptographic Proof Step 3: Root confirmation */}
                <div className="space-y-2">
                  <h4 className="text-[9px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                    Step 3: Block Root Reconciliation
                  </h4>
                  <div className="space-y-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 font-mono text-[9px]">
                    <p className="text-[8px] font-black text-emerald-400 uppercase">
                      Root = SHA256(H_AB + H_CD)
                    </p>
                    <p className="break-all text-emerald-400">{ROOT_HASH}</p>
                  </div>
                </div>
              </div>

              {/* Integrity Shield footer */}
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                <ShieldCheck size={18} className="shrink-0 text-emerald-400" />
                <p className="text-[9px] leading-snug font-bold text-emerald-400 uppercase italic">
                  Path verifies successfully up to Bitcoin Anchor Block #842,402conf.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
