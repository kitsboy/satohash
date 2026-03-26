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
    <div className="mx-auto min-h-screen max-w-7xl px-6 pt-32 pb-20">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display text-4xl font-bold text-white md:text-5xl"
          >
            Image Vault
          </motion.h1>
          <p className="mt-3 text-lg text-white/40">
            Secure cryptographic provenance for every image you've notarized.
          </p>
        </div>

        <div className="flex w-full max-w-sm items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-5 py-3 focus-within:border-indigo-500/50 focus-within:bg-white/10 transition-all">
          <Search size={20} className="text-white/20" />
          <input
            type="text"
            placeholder="Search filenames or hashes..."
            className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />
          <p className="text-sm font-medium text-white/40">Scanning the blockchain gallery...</p>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 text-center p-12">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-white/20">
            <ImageIcon size={40} />
          </div>
          <h3 className="text-xl font-bold text-white">No images found</h3>
          <p className="mt-2 max-w-xs text-white/40">
            Upload JPG, PNG, or WebP files to the dashboard to see them appear here with permanent proof.
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
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0f111a] p-4 transition-all hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                <div className="mb-4 aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 transition-all group-hover:scale-[1.02]">
                    <div className="flex h-full w-full items-center justify-center text-white/10">
                        <ImageIcon size={48} strokeWidth={1} />
                    </div>
                </div>

                <div className="space-y-3">
                  <h3 className="truncate font-bold text-white transition-colors group-hover:text-indigo-400">
                    {image.filename}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-xs font-medium text-white/30">
                    <Clock size={12} />
                    {new Date(image.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2 transition-all group-hover:bg-white/10">
                    <Hash size={12} className="text-indigo-400" />
                    <code className="truncate font-mono text-[10px] text-white/40">
                        {image.hash}
                    </code>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <a
                      href={`${API_URL}/api/stamps/${image.id}?download=true`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/5 py-2 text-xs font-bold text-white transition-all hover:bg-indigo-500 hover:text-white"
                    >
                      <Download size={14} /> Proof
                    </a>
                    <button className="flex items-center justify-center rounded-lg bg-white/5 px-3 py-2 text-white transition-all hover:bg-white/10">
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
  )
}
