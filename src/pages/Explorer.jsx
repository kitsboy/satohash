import { motion } from 'framer-motion'
import { Clock, Search, Compass, TreePine } from 'lucide-react'
import { useState } from 'react'
import MerkleHeart from '../components/MerkleHeart'

export default function Explorer() {
  const [view, setView] = useState('chrono') // chrono, merkle, travel

  return (
    <div className="flex h-full w-full max-w-full flex-col overflow-hidden pb-20">
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
            onClick={() => setView('chrono')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase transition-all sm:px-4 sm:py-2 sm:text-[10px] ${view === 'chrono' ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-lg' : 'text-[var(--text-secondary)]'}`}
          >
            <Clock size={12} className="sm:h-3.5 sm:w-3.5" /> Chrono
          </button>
          <button
            onClick={() => setView('merkle')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase transition-all sm:px-4 sm:py-2 sm:text-[10px] ${view === 'merkle' ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-lg' : 'text-[var(--text-secondary)]'}`}
          >
            <TreePine size={12} className="sm:h-3.5 sm:w-3.5" /> Merkle Heart
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
                    type="text"
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
      </main>
    </div>
  )
}
