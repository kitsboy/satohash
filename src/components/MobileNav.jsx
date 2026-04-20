import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code, Webhook, Play, Globe, Bitcoin } from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Globe },
  { id: 'playground', label: 'Playground', icon: Play },
  { id: 'examples', label: 'Code', icon: Code },
  { id: 'pricing', label: 'Pricing', icon: Bitcoin },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook },
];

export default function MobileNav({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 shadow-sm transition-all hover:border-indigo-200"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white border-l border-slate-200 z-50 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-bold ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
