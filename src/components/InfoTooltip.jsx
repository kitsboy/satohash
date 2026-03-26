import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium info tooltip with educational mouseovers.
 */
export default function InfoTooltip({ content, children }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-flex items-center gap-1 group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <HelpCircle size={14} className="text-white/20 transition-colors group-hover:text-indigo-400 cursor-help" />
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-1/2 z-[2000] mb-3 w-64 -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0f111a] p-4 text-xs font-medium text-white/60 shadow-2xl backdrop-blur-3xl"
          >
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="h-5 w-5 flex items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                        <HelpCircle size={12} />
                    </div>
                    <span className="font-black text-[10px] uppercase tracking-widest text-white/40">Protocol Education</span>
                </div>
                <p className="leading-relaxed">
                    {content}
                </p>
                <div className="absolute top-full left-1/2 -ml-1 border-8 border-transparent border-t-[#0f111a]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
