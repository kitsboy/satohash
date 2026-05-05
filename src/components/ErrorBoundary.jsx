import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, ShieldAlert } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical Satohash UI Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#05070a] px-6 text-white overflow-hidden relative">
          {/* Animated Background Orbs */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[var(--accent-active)]/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px] animate-pulse" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative z-10 glass-card max-w-lg border-white/5 bg-white/5 p-12 text-center rounded-[2.5rem] shadow-2xl backdrop-blur-3xl"
          >
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500/20 to-orange-500/10 text-rose-500 shadow-inner">
              <ShieldAlert size={48} strokeWidth={1.5} />
            </div>
            
            <h1 className="mb-4 text-3xl font-black tracking-tighter">System Desync</h1>
            <p className="mb-10 text-white/40 leading-relaxed font-medium">
              The interface encountered an unexpected interruption. Your cryptographic anchors and Bitcoin proofs remain active and secure in the protocol layer.
            </p>
            
            <div className="mb-10 rounded-2xl bg-black/40 p-5 text-left border border-white/5">
                <p className="text-[10px] font-black tracking-widest text-rose-500/60 uppercase mb-2">Internal Fault Report</p>
                <code className="block font-mono text-xs text-white/30 truncate">
                    {this.state.error?.message || 'Render level interruption'}
                </code>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 py-4.5 text-sm font-black text-white transition-all hover:bg-indigo-500 hover:scale-[1.02] active:scale-0.98 shadow-xl shadow-indigo-600/20"
            >
              <RefreshCw size={18} className="animate-spin-slow" />
              RE-INITIALIZE INTERFACE
            </button>
            
            <p className="mt-8 font-mono text-[9px] text-white/10 uppercase tracking-[0.3em]">
              Satohash Protocol v1.2.0 • Recovery Layer Active
            </p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
