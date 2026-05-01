import { motion } from 'framer-motion'
import { Clock, Search, Compass, TreePine } from 'lucide-react'
import { useState } from 'react'
import MerkleHeart from '../components/MerkleHeart'

export default function Explorer() {
  const [view, setView] = useState('chrono') // chrono, merkle, travel

  return (
    <div className="flex h-full flex-col">
      <header className="z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-primary)]/50 p-8 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent-active)]/30 bg-[var(--accent-active)]/10 text-[var(--accent-active)]">
            <Compass size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter uppercase">Noir Explorer</h1>
            <p className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
              Experiential Discovery & Temporal Navigation
            </p>
          </div>
        </div>

        <div className="flex rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1">
          <button
            onClick={() => setView('chrono')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${view === 'chrono' ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-lg' : 'text-[var(--text-secondary)]'}`}
          >
            <Clock size={14} /> Chrono
          </button>
          <button
            onClick={() => setView('merkle')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${view === 'merkle' ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-lg' : 'text-[var(--text-secondary)]'}`}
          >
            <TreePine size={14} /> Merkle Heart
          </button>
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden bg-black">
        {/* Cinematic Background */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-active),transparent)] opacity-20" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay" />
        </div>

        {view === 'chrono' && (
          <div className="flex h-full items-center justify-center p-12">
            <div className="w-full max-w-4xl space-y-12 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <h2 className="text-6xl leading-none font-extrabold tracking-tighter">
                  ChronoExplorer
                </h2>
                <p className="mx-auto max-w-2xl text-xl text-[var(--text-secondary)]">
                  A temporal search engine for the Bitcoin blockchain. Locate proofs by date, block
                  height, or era.
                </p>
                <div className="relative mx-auto max-w-xl">
                  <Search
                    size={24}
                    className="absolute top-1/2 left-6 -translate-y-1/2 text-[var(--text-secondary)]"
                  />
                  <input
                    type="text"
                    placeholder="Enter block height or historical date (e.g. 2009-01-03)"
                    className="h-20 w-full rounded-[2.5rem] border border-white/10 bg-white/5 pr-8 pl-16 text-xl font-medium transition-all outline-none focus:border-[var(--accent-active)] focus:bg-white/10"
                  />
                </div>
              </motion.div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[
                  { label: 'Halving Era', value: '4th', desc: 'Current Block Era' },
                  { label: 'Time Travel', value: 'Enabled', desc: 'Sync Active' },
                  { label: 'Historical Depth', value: '841K', desc: 'Blocks Indexed' }
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="space-y-2 rounded-3xl border border-white/10 bg-white/5 p-6 text-left"
                  >
                    <p className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                      {stat.label}
                    </p>
                    <p className="font-mono text-3xl font-bold">{stat.value}</p>
                    <p className="text-[10px] font-medium text-white/40">{stat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'merkle' && (
          <div className="relative flex h-full flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10 mb-20 space-y-4 text-center"
            >
              <h2 className="text-4xl font-bold tracking-tighter uppercase">The Merkle Heart</h2>
              <p className="max-w-md text-sm text-[var(--text-secondary)]">
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
