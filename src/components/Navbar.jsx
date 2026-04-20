import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe, Zap, Code } from 'lucide-react'
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

  const navSpring = { type: 'spring', stiffness: 400, damping: 30 }

  return (
    <>
      <nav
        className={clsx(
          'fixed inset-x-0 top-0 z-[2000] flex h-18 items-center transition-all duration-400',
          isScrolled
            ? 'backdrop-blur-2xl shadow-sm border-b'
            : 'bg-transparent'
        )}
        style={isScrolled
          ? { background: 'rgba(247, 248, 252, 0.88)', borderColor: 'var(--border)' }
          : {}
        }
      >
        <div className="layout-container flex w-full items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={navSpring}
            onClick={() => navigate('/')}
            className="group flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 transition-all"
            style={{ background: isScrolled ? 'transparent' : 'rgba(255,255,255,0.6)', border: '1px solid var(--border)' }}
          >
            <div className="relative h-7 w-7 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-lg"
                style={{ border: '1.5px solid rgba(79,70,229,0.3)' }}
              />
              <img
                src={APP_CONFIG.LOGO}
                alt="Satohash logo"
                className="relative z-10 h-5 w-5"
              />
            </div>
            <span className="text-lg font-extrabold tracking-tighter" style={{ color: 'var(--text-base)' }}>
              {APP_CONFIG.NAME}
            </span>
            <span className="pill-indigo hidden sm:inline-flex">v4.0</span>
          </motion.div>
  
          {/* Main Links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={clsx(
                    'relative px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] transition-all rounded-xl',
                    isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600 hover:bg-white/60'
                  )}
                  style={{ color: isActive ? 'var(--primary)' : undefined }}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute inset-0 -z-10 rounded-xl"
                      style={{ background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.12)' }}
                      transition={navSpring}
                    />
                  )}
                </button>
              )
            })}
          </div>
  
          <div className="flex items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLangOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:bg-white"
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              aria-label="Change language"
            >
              <Globe size={16} />
            </motion.button>

            <Link to="/developers" className="hidden md:block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={navSpring}
                className="flex h-9 items-center gap-2 rounded-xl px-4 text-[10px] font-bold uppercase tracking-[0.1em] transition-all"
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-card)' }}
              >
                <Code size={13} />
                API
              </motion.button>
            </Link>
  
            <Link to="/dashboard" className="hidden md:block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={navSpring}
                className="btn-holographic flex items-center gap-2"
              >
                <Zap size={13} className="fill-white" />
                Workbench
              </motion.button>
            </Link>
  
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl md:hidden"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-base)' }}
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1800] bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={navSpring}
              className="fixed inset-x-4 top-20 z-[1900] overflow-hidden rounded-3xl p-8 shadow-2xl md:hidden"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div className="flex flex-col gap-5">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => {
                      navigate(link.path)
                      setIsOpen(false)
                    }}
                    className="text-left text-xl font-extrabold tracking-tight transition-colors py-1"
                    style={{ color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-base)' }}
                  >
                    {link.name}
                  </button>
                ))}
                <button
                  onClick={() => { navigate('/developers'); setIsOpen(false) }}
                  className="text-left text-xl font-extrabold tracking-tight transition-colors py-1"
                  style={{ color: location.pathname === '/developers' ? 'var(--primary)' : 'var(--text-base)' }}
                >
                  API Docs
                </button>
                <div className="h-px w-full" style={{ background: 'var(--border)' }} />
                <button
                  onClick={() => { navigate('/dashboard'); setIsOpen(false) }}
                  className="btn-holographic w-full py-4 text-center text-sm"
                >
                  Launch Workbench
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LanguagePicker isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} />
    </>
  )
}
