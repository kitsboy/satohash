import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Menu, X, Globe } from 'lucide-react'
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '72px',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--spacing-xl)',
          background: isScrolled ? 'var(--color-surface-elevated)' : 'var(--color-surface)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--color-border)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isScrolled ? '0 10px 40px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        {/* Logo & Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            padding: '6px 16px',
            background: 'rgba(99, 102, 241, 0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(99, 102, 241, 0.1)'
          }}
          onClick={() => navigate('/contracts')}
          className="group"
        >
          <img
            src={APP_CONFIG.LOGO}
            alt={`${APP_CONFIG.NAME} Logo`}
            style={{ height: '24px', width: 'auto' }}
            className="group-hover:rotate-12 transition-transform duration-300"
          />
          <span
            style={{
              fontWeight: '900',
              fontSize: '1.25rem',
              background: 'linear-gradient(to right, #000, #4f46e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.05em'
            }}
          >
            {APP_CONFIG.NAME}
          </span>
        </div>

        {/* Main Links */}
        <div className="hidden md:flex gap-1 items-center">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 20px',
                  borderRadius: '14px',
                  border: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  background: isActive ? 'var(--color-border-light)' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  fontWeight: isActive ? '950' : '800',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.15)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--color-border-light)'
                    e.currentTarget.style.color = 'var(--color-primary)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--color-text-primary)'
                  }
                }}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                  />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsLangOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              background: 'var(--color-surface-elevated)',
              border: '2px solid var(--color-border)',
              borderRadius: '12px',
              cursor: 'pointer',
              color: 'var(--color-text-primary)',
              fontWeight: '900',
              transition: 'all 0.2s ease'
            }}
          >
            <Globe size={20} />
          </button>

          <Link to="/welcome" className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-colors"
            >
              Launch App
            </motion.button>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              background: 'var(--color-surface-elevated)',
              border: '2px solid var(--color-border)',
              borderRadius: '12px',
              cursor: 'pointer',
              color: 'var(--color-text-primary)',
              transition: 'all 0.2s ease'
            }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="md:hidden absolute top-[72px] left-0 right-0 bg-white border-b border-slate-200 p-6 shadow-premium overflow-hidden z-[1050]"
          >
            <div className="flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={clsx(
                    'text-lg font-bold transition-colors',
                    location.pathname === link.path ? 'text-indigo-600' : 'text-slate-900'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/welcome"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-4 bg-indigo-600 text-white rounded-xl font-black shadow-lg shadow-indigo-100"
              >
                Launch App
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Picker Modal */}
      <LanguagePicker isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} />
    </>
  )
}
