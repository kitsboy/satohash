import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Code, Webhook, Play, Globe, Bitcoin } from 'lucide-react'

const TABS = [
  { id: 'overview', label: 'Overview', icon: Globe },
  { id: 'playground', label: 'Playground', icon: Play },
  { id: 'examples', label: 'Code', icon: Code },
  { id: 'pricing', label: 'Pricing', icon: Bitcoin },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook }
]

export default function MobileNav({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition-all hover:border-indigo-200"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 border-l border-slate-200 bg-white p-6 shadow-2xl"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="text-lg font-extrabold tracking-tight text-slate-900">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {TABS.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id)
                        setIsOpen(false)
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${
                        activeTab === tab.id
                          ? 'border border-indigo-100 bg-indigo-50 text-indigo-600'
                          : 'border border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
