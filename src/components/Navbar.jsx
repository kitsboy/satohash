import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import LanguagePicker from './LanguagePicker'
import { NAV_LINKS, APP_CONFIG } from '@/config/constants'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navSpring = { type: 'spring', stiffness: 400, damping: 30 };

  return (
    <>
      <nav
        className={clsx(
            "fixed inset-x-0 top-0 z-[2000] flex h-20 items-center justify-between px-6 transition-all duration-500",
            isScrolled ? "bg-black/60 backdrop-blur-2xl border-b border-white/5 py-4" : "bg-transparent py-6"
        )}
      >
        {/* Logo & Brand */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={navSpring}
          onClick={() => navigate('/')}
          className="group flex cursor-pointer items-center gap-4 rounded-2xl bg-white/[0.03] px-4 py-2.5 ring-1 ring-white/10 transition-all hover:bg-white/[0.08]"
        >
          <div className="relative">
             <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-lg border border-indigo-500/30" 
             />
             <img
                src={APP_CONFIG.LOGO}
                alt="Logo"
                className="relative z-10 h-6 w-6 grayscale transition-all group-hover:grayscale-0"
              />
          </div>
          <span className="text-xl font-black italic tracking-tighter text-white uppercase italic">
            {APP_CONFIG.NAME}
          </span>
        </motion.div>

        {/* Main Links */}
        <div className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={clsx(
                    "relative px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                    isActive ? "text-white" : "text-white/40 hover:text-white"
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute inset-0 -z-10 rounded-xl bg-white/5 ring-1 ring-white/10"
                    transition={navSpring}
                  />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLangOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white shadow-xl ring-1 ring-white/10 transition-all hover:bg-white/10"
          >
            <Globe size={18} />
          </motion.button>

          <Link to="/dashboard" className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={navSpring}
              className="btn-holographic flex items-center gap-2"
            >
              <Zap size={14} className="fill-white" />
              Workbench
            </motion.button>
          </Link>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white ring-1 ring-white/10 md:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={navSpring}
            className="fixed inset-x-0 top-24 z-[1900] mx-4 overflow-hidden rounded-[2rem] border border-white/10 bg-black/80 p-8 backdrop-blur-3xl md:hidden"
          >
            <div className="flex flex-col gap-8">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    navigate(link.path)
                    setIsOpen(false)
                  }}
                  className={clsx(
                    "text-3xl font-black uppercase italic tracking-tighter",
                    location.pathname === link.path ? "text-indigo-400" : "text-white"
                  )}
                >
                  {link.name}
                </button>
              ))}
              <div className="h-px w-full bg-white/10" />
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-holographic w-full py-6 text-center text-lg"
              >
                Launch Workbench
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LanguagePicker isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} />
    </>
  )
}
