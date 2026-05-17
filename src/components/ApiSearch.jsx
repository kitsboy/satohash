import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/v1/timestamp',
    name: 'Create Timestamp',
    description: 'Create a cryptographic timestamp proof'
  },
  {
    method: 'GET',
    path: '/api/v1/verify',
    name: 'Verify Timestamp',
    description: 'Verify against Bitcoin blockchain'
  },
  {
    method: 'POST',
    path: '/api/v1/verify',
    name: 'Verify Upload',
    description: 'Upload binary .ots file'
  },
  {
    method: 'GET',
    path: '/api/v1/price',
    name: 'Get Pricing',
    description: 'Current API pricing in sats'
  },
  {
    method: 'GET',
    path: '/api/v1/block-height',
    name: 'Block Height',
    description: 'Latest Bitcoin block'
  },
  {
    method: 'POST',
    path: '/api/v1/upgrade',
    name: 'Upgrade',
    description: 'Upgrade to Bitcoin confirmation'
  },
  {
    method: 'POST',
    path: '/api/v1/timestamp/batch',
    name: 'Batch Timestamp',
    description: 'Timestamp up to 1000 hashes'
  },
  {
    method: 'GET',
    path: '/api/v1/batches',
    name: 'List Batches',
    description: 'Get recent batches'
  },
  { method: 'GET', path: '/api/health', name: 'Health Check', description: 'System status' }
]

export default function ApiSearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return ENDPOINTS.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.path.toLowerCase().includes(q) ||
        e.method.toLowerCase().includes(q)
    )
  }, [query])

  const handleSelect = (endpoint) => {
    onSelect(endpoint)
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search endpoints..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full rounded-xl border border-gray-700 bg-gray-800/50 py-2 pr-4 pl-10 text-white placeholder-gray-500 focus:border-orange-500/50 focus:outline-none md:w-64"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            className="absolute top-1/2 right-3 -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-white" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-xl"
          >
            {results.map((endpoint) => (
              <button
                key={endpoint.path + endpoint.method}
                onClick={() => handleSelect(endpoint)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-700/50"
              >
                <span
                  className={`rounded px-2 py-0.5 font-mono text-xs ${
                    endpoint.method === 'GET'
                      ? 'bg-blue-500/20 text-blue-400'
                      : endpoint.method === 'POST'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {endpoint.method}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-white">{endpoint.name}</div>
                  <div className="truncate text-xs text-gray-500">{endpoint.path}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
