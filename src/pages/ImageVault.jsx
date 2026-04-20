import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Image as ImageIcon, Search, Calendar, Hash, ExternalLink, Download, 
    Clock, Shield, LayoutGrid, List, Filter, Activity, Fingerprint,
    Info, FileText, ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function ImageVault() {
  const [images, setImages] = useState([
    { id: '1', filename: 'Evidence_Alpha_01.png', hash: '3c8e...f21a', created_at: new Date().toISOString() },
    { id: '2', filename: 'Contract_Scan_Witness.jpg', hash: '7d1a...902x', created_at: new Date().toISOString() },
    { id: '3', filename: 'Web_Snapshot_Entry.webp', hash: '1a2b...4c5d', created_at: new Date().toISOString() }
  ])
  const [isLoading, setIsLoading] = useState(false) // Mock loading for UI demo
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // grid, list

  const filteredImages = images.filter((img) =>
    img.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.hash.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-40 pb-32 selection:bg-indigo-500/30">
      <div className="layout-container max-w-7xl">
        
        {/* Elite Header & Controls */}
        <div className="mb-20 flex flex-col lg:flex-row justify-between items-end gap-12">
            <div className="max-w-3xl">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-indigo-900 text-white shadow-2xl shadow-indigo-500/20"
                >
                    <Shield size={32} />
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-indigo-900 uppercase italic leading-none mb-6">
                    Image <br /> <span className="text-indigo-600">VAULT.</span>
                </h1>
                <p className="max-w-xl text-lg font-bold italic text-slate-500 leading-relaxed font-sans">
                    Institutional-grade cryptographic storage for every visual asset notarized by the mesh. 
                    Search and verify forensic provenance instantly.
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
                <div className="relative group flex-1 min-w-[300px]">
                    <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="FILTER_BY_HASH_OR_NAME..."
                        className="w-full bg-white border-2 border-slate-100 rounded-2xl py-5 px-14 text-xs font-black text-indigo-900 outline-none focus:border-indigo-500 transition-all shadow-sm italic tracking-widest uppercase placeholder:text-slate-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex bg-white border-2 border-slate-100 rounded-2xl p-1 shadow-sm">
                    <ControlButton active={viewMode === 'grid'} onClick={() => setViewMode('grid')} icon={LayoutGrid} />
                    <ControlButton active={viewMode === 'list'} onClick={() => setViewMode('list')} icon={List} />
                </div>
            </div>
        </div>

        {/* Dynamic Content Layer */}
        {isLoading ? (
            <div className="flex h-96 flex-col items-center justify-center gap-8">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-50 border-t-indigo-600" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Scanning Protocol Mesh...</p>
            </div>
        ) : filteredImages.length === 0 ? (
            <div className="flex h-[500px] flex-col items-center justify-center rounded-[4rem] border-2 border-dashed border-indigo-100 bg-white shadow-2xl shadow-indigo-500/5 text-center p-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                    <ImageIcon size={160} />
                </div>
                <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-indigo-50 text-indigo-300">
                    <ImageIcon size={48} />
                </div>
                <h3 className="text-4xl font-black italic tracking-tighter text-indigo-900 uppercase italic mb-6">Vault Buffer Empty.</h3>
                <p className="max-w-md text-slate-500 font-bold italic leading-relaxed mb-12">
                   Your institutional asset vault is awaiting its first cryptographic anchor. 
                   Notarize a document via the dashboard to establish provenance.
                </p>
                <button className="px-12 py-5 rounded-2xl bg-indigo-900 text-white font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all">
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
        <div className="mt-32 p-12 rounded-[3.5rem] bg-[#0c1220] text-white flex flex-col md:flex-row justify-between items-center gap-12 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="flex items-center gap-8 relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                    <Activity size={28} />
                </div>
                <div>
                   <h4 className="text-xl font-black italic tracking-tighter text-white uppercase italic">Active Witness <span className="text-indigo-400">SYNC.</span></h4>
                   <p className="text-[10px] font-black text-indigo-300/40 uppercase tracking-widest italic">All assets synchronized with Bitcoin Block #845,922</p>
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
            className={`group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 ${isGrid ? 'p-6' : 'p-4 flex items-center gap-8'}`}
        >
            <div className={`overflow-hidden rounded-2xl bg-slate-50 border border-slate-50 flex items-center justify-center text-slate-200 transition-all group-hover:bg-indigo-50 group-hover:text-indigo-200 shrink-0 ${isGrid ? 'mb-6 aspect-square' : 'h-20 w-20'}`}>
                <ImageIcon size={isGrid ? 56 : 32} strokeWidth={1.5} />
            </div>

            <div className={`flex-1 ${isGrid ? 'space-y-5' : 'flex items-center gap-12'}`}>
                <div className="flex-1 min-w-0">
                    <h3 className="truncate text-sm font-black italic uppercase tracking-tighter text-indigo-900 transition-colors group-hover:text-indigo-600 mb-2">
                        {image.filename}
                    </h3>
                    <div className="flex items-center gap-3 text-[9px] font-black text-slate-300 uppercase italic tracking-widest">
                        <Clock size={12} />
                        NOTARIZED_{new Date(image.created_at).toLocaleDateString()}
                    </div>
                </div>

                {isGrid && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-4 transition-all group-hover:bg-indigo-50 group-hover:border-indigo-100">
                        <Fingerprint size={16} className="text-indigo-600 shrink-0" />
                        <code className="truncate font-mono text-[9px] font-bold text-indigo-900/40">
                            {image.hash}
                        </code>
                    </div>
                )}

                <div className={`flex gap-3 px-1 ${isGrid ? '' : 'ml-auto'}`}>
                    <button className="flex-1 min-w-[100px] flex items-center justify-center gap-3 rounded-xl bg-indigo-900 border border-indigo-900 py-4 text-[9px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-500/10 hover:scale-105 active:scale-95 transition-all">
                        <Download size={14} className="text-amber-400" /> PROOF
                    </button>
                    <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-300 transition-all hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50">
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
            className={`p-3 rounded-xl transition-all ${active ? 'bg-indigo-900 text-white shadow-lg' : 'text-slate-300 hover:text-indigo-600 hover:bg-indigo-50'}`}
        >
            <Icon size={20} />
        </button>
    )
}

function StatItem({ label, value }) {
    return (
        <div className="text-center group">
            <div className="text-[18px] font-black italic text-white group-hover:text-amber-400 transition-colors">{value}</div>
            <div className="text-[9px] font-black uppercase text-indigo-300/30 tracking-[0.3em] italic">{label}</div>
        </div>
    )
}
