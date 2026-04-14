import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, Search, Calendar, Hash, ExternalLink, Download, Clock } from 'lucide-react'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function ImageVault() {
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/vault/images`)
      if (!response.ok) throw new Error('Failed to fetch image vault')
      const data = await response.json()
      setImages(data)
    } catch (error) {
      toast.error('Could not load your image proofs.')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredImages = images.filter((img) =>
    img.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.hash.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[var(--bg-base)] px-6 pt-32 pb-32">
      <div className="mx-auto max-w-7xl">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl md:text-8xl font-black italic tracking-tighter text-indigo-900 uppercase italic"
          >
            Image <span className="text-indigo-600">VAULT.</span>
          </motion.h1>
          <p className="mt-6 text-xl font-medium text-slate-500 italic max-w-2xl">
            Secure cryptographic provenance for every visual asset notarized by the protocol.
          </p>
        </div>

        <div className="flex w-full max-w-md items-center gap-4 rounded-2xl border-2 border-slate-100 bg-slate-50 px-6 py-4 focus-within:border-indigo-500/30 focus-within:bg-white transition-all shadow-inner">
          <Search size={20} className="text-slate-300" />
          <input
            type="text"
            placeholder="FILTER_BY_HASH_OR_NAME..."
            className="w-full bg-transparent text-sm font-bold text-indigo-900 outline-none placeholder:text-slate-300 uppercase italic tracking-widest"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-6">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Scanning Protocol Mesh...</p>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-indigo-100 bg-white/50 text-center p-12 shadow-sm">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-200">
            <ImageIcon size={48} />
          </div>
          <h3 className="text-2xl font-black italic tracking-tighter text-indigo-900 uppercase italic">Vault Empty.</h3>
          <p className="mt-4 max-w-xs text-slate-500 font-medium italic leading-relaxed">
            Notarize visual evidence via the dashboard to secure them in the institutional vault.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {filteredImages.map((image, idx) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-5 transition-all hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                <div className="mb-6 aspect-square overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200 transition-all group-hover:bg-indigo-50 group-hover:text-indigo-200">
                    <ImageIcon size={56} strokeWidth={1.5} />
                </div>

                <div className="space-y-4">
                  <h3 className="truncate text-sm font-black italic uppercase tracking-tighter text-indigo-900 transition-colors group-hover:text-indigo-600">
                    {image.filename}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase italic">
                    <Clock size={12} />
                    NOTARIZED_{new Date(image.created_at).toLocaleDateString()}
                  </div>
 
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3 transition-all group-hover:bg-indigo-50 group-hover:border-indigo-100">
                    <Hash size={12} className="text-indigo-600 shrink-0" />
                    <code className="truncate font-mono text-[9px] font-bold text-indigo-900/40">
                        {image.hash}
                    </code>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <a
                      href={`${API_URL}/api/stamps/${image.id}?download=true`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-[10px] font-black text-white uppercase tracking-widest transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20"
                    >
                      <Download size={14} /> PROOF
                    </a>
                    <button className="flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200">
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      </div>
    </div>
  )
}
