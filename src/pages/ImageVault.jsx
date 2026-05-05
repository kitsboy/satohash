import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Image as ImageIcon, Search, Calendar, Hash, ExternalLink, Download,
    Clock, Shield, LayoutGrid, List, Filter, Activity, Fingerprint,
    Info, FileText, ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const MOCK_ITEMS = [
  { id: '1', filename: 'Evidence_Alpha_01.png', hash: '3c8e...f21a', created_at: new Date().toISOString() },
  { id: '2', filename: 'Contract_Scan_Witness.jpg', hash: '7d1a...902x', created_at: new Date().toISOString() },
  { id: '3', filename: 'Web_Snapshot_Entry.webp', hash: '1a2b...4c5d', created_at: new Date().toISOString() }
]

export default function ImageVault() {
  const [images, setImages] = useState(MOCK_ITEMS)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // grid, list

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`${API_URL}/api/vault/images`)
        if (res.ok) {
          const data = await res.json()
          setImages(data)
        }
        // on non-ok response, silently keep mock items
      } catch {
        // silently keep mock items on network error
      } finally {
        setIsLoading(false)
      }
    }
    fetchImages()
  }, [])

  const filteredImages = images.filter((img) =>
    img.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.hash.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen pb-20 selection:bg-[var(--accent-active)]/30" style={{ background: 'var(--bg-primary)' }}>
      <div className="layout-container max-w-7xl">

        {/* Elite Header & Controls */}
        <div className="mb-20 flex flex-col lg:flex-row justify-between items-end gap-12">
            <div className="max-w-3xl">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2.5rem] shadow-2xl"
                    style={{ background: 'var(--accent-active)', color: '#fff' }}
                >
                    <Shield size={32} />
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-6" style={{ color: 'var(--text-primary)' }}>
                    Image <br /> <span style={{ color: 'var(--accent-active)' }}>VAULT.</span>
                </h1>
                <p className="max-w-xl text-lg font-bold italic leading-relaxed font-sans" style={{ color: 'var(--text-secondary)' }}>
                    Institutional-grade cryptographic storage for every visual asset notarized by the mesh.
                    Search and verify forensic provenance instantly.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
                <div className="relative group flex-1 min-w-[300px]">
                    <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 transition-colors" style={{ color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="FILTER_BY_HASH_OR_NAME..."
                        className="w-full rounded-2xl py-5 px-14 text-xs font-black outline-none transition-all shadow-sm italic tracking-widest uppercase"
                        style={{
                            background: 'var(--bg-secondary)',
                            border: '2px solid var(--border)',
                            color: 'var(--text-primary)'
                        }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex rounded-2xl p-1 shadow-sm" style={{ background: 'var(--bg-secondary)', border: '2px solid var(--border)' }}>
                    <ControlButton active={viewMode === 'grid'} onClick={() => setViewMode('grid')} icon={LayoutGrid} />
                    <ControlButton active={viewMode === 'list'} onClick={() => setViewMode('list')} icon={List} />
                </div>
            </div>
        </div>

        {/* Dynamic Content Layer */}
        {isLoading ? (
            <div className="flex h-96 flex-col items-center justify-center gap-8">
                <div className="h-16 w-16 animate-spin rounded-full border-4" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent-active)' }} />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] italic" style={{ color: 'var(--text-secondary)' }}>Scanning Protocol Mesh...</p>
            </div>
        ) : filteredImages.length === 0 ? (
            <div className="flex h-[500px] flex-col items-center justify-center rounded-[4rem] border-2 border-dashed shadow-2xl text-center p-20 relative overflow-hidden" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                <div className="absolute top-0 right-0 p-12 opacity-5">
                    <ImageIcon size={160} />
                </div>
                <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-[2.5rem]" style={{ background: 'var(--surface-raised)', color: 'var(--text-secondary)' }}>
                    <ImageIcon size={48} />
                </div>
                <h3 className="text-4xl font-black italic tracking-tighter uppercase mb-6" style={{ color: 'var(--text-primary)' }}>Vault Buffer Empty.</h3>
                <p className="max-w-md font-bold italic leading-relaxed mb-12" style={{ color: 'var(--text-secondary)' }}>
                   Your institutional asset vault is awaiting its first cryptographic anchor.
                   Notarize a document via the dashboard to establish provenance.
                </p>
                <button
                    className="px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    style={{ background: 'var(--accent-active)', color: '#fff' }}
                >
                   NOTARIZE_FIRST_ASSET
                </button>
            </div>
        ) : (
            <div className={viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                : "flex flex-col gap-4"
            }>
                <AnimatePresence>
                    {filteredImages.map((image, idx) => (
                        <VaultItem
                            key={image.id}
                            image={image}
                            viewMode={viewMode}
                            idx={idx}
                        />
                    ))}
                </AnimatePresence>
            </div>
        )}

        {/* Global Stats Footer */}
        <div className="mt-32 p-12 rounded-[3.5rem] flex flex-col md:flex-row justify-between items-center gap-12 relative overflow-hidden shadow-2xl" style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}>
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(var(--accent-active) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="flex items-center gap-8 relative z-10">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-active)', color: '#fff' }}>
                    <Activity size={28} />
                </div>
                <div>
                   <h4 className="text-xl font-black italic tracking-tighter uppercase" style={{ color: 'var(--text-primary)' }}>Active Witness <span style={{ color: 'var(--accent-active)' }}>SYNC.</span></h4>
                   <p className="text-[10px] font-black uppercase tracking-widest italic" style={{ color: 'var(--text-secondary)' }}>All assets synchronized with Bitcoin Block #845,922</p>
                </div>
            </div>
            <div className="flex gap-12 relative z-10">
                <StatItem label="Total Provenance" value="1.2k" />
                <StatItem label="Verifiable" value="100%" />
                <StatItem label="Storage" value="0.0kb" />
            </div>
        </div>
      </div>
    </div>
  )
}

function VaultItem({ image, viewMode, idx }) {
    const isGrid = viewMode === 'grid';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`group relative overflow-hidden rounded-[2.5rem] transition-all hover:shadow-2xl ${isGrid ? 'p-6' : 'p-4 flex items-center gap-8'}`}
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
        >
            <div
                className={`overflow-hidden rounded-2xl flex items-center justify-center transition-all shrink-0 ${isGrid ? 'mb-6 aspect-square' : 'h-20 w-20'}`}
                style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
                <ImageIcon size={isGrid ? 56 : 32} strokeWidth={1.5} />
            </div>

            <div className={`flex-1 ${isGrid ? 'space-y-5' : 'flex items-center gap-12'}`}>
                <div className="flex-1 min-w-0">
                    <h3 className="truncate text-sm font-black italic uppercase tracking-tighter mb-2 transition-colors" style={{ color: 'var(--text-primary)' }}>
                        {image.filename}
                    </h3>
                    <div className="flex items-center gap-3 text-[9px] font-black uppercase italic tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                        <Clock size={12} />
                        NOTARIZED_{new Date(image.created_at).toLocaleDateString()}
                    </div>
                </div>

                {isGrid && (
                    <div className="p-4 rounded-xl flex items-center gap-4 transition-all" style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}>
                        <Fingerprint size={16} className="shrink-0" style={{ color: 'var(--accent-active)' }} />
                        <code className="truncate font-mono text-[9px] font-bold" style={{ color: 'var(--text-secondary)' }}>
                            {image.hash}
                        </code>
                    </div>
                )}

                <div className={`flex gap-3 px-1 ${isGrid ? '' : 'ml-auto'}`}>
                    <button
                        className="flex-1 min-w-[100px] flex items-center justify-center gap-3 rounded-xl py-4 text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all"
                        style={{ background: 'var(--accent-active)', color: '#fff', border: '1px solid var(--accent-active)' }}
                    >
                        <Download size={14} className="text-amber-400" /> PROOF
                    </button>
                    <button
                        className="flex h-12 w-12 items-center justify-center rounded-xl transition-all"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                    >
                        <ExternalLink size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

function ControlButton({ active, onClick, icon: Icon }) {
    return (
        <button
            onClick={onClick}
            className="p-3 rounded-xl transition-all"
            style={active
                ? { background: 'var(--accent-active)', color: '#fff' }
                : { color: 'var(--text-secondary)' }
            }
        >
            <Icon size={20} />
        </button>
    )
}

function StatItem({ label, value }) {
    return (
        <div className="text-center group">
            <div className="text-[18px] font-black italic transition-colors" style={{ color: 'var(--text-primary)' }}>{value}</div>
            <div className="text-[9px] font-black uppercase tracking-[0.3em] italic" style={{ color: 'var(--text-secondary)' }}>{label}</div>
        </div>
    )
}
