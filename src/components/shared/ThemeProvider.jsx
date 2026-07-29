import { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

const ThemeContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}

function getInitialTheme() {
  const saved = localStorage.getItem('satohash_theme')
  if (saved === 'elite') return 'light'
  if (saved === 'dark') return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme)

  useLayoutEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'elite')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [theme])

  useEffect(() => {
    localStorage.setItem('satohash_theme', theme === 'light' ? 'elite' : 'dark')
  }, [theme])

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`flex h-10 min-h-[44px] w-10 min-w-[44px] items-center justify-center rounded-xl border transition-colors hover:bg-white/5 ${className}`}
      style={{
        borderColor: 'var(--border)',
        background: 'var(--bg-secondary)',
        color: theme === 'dark' ? 'var(--accent-gold)' : 'var(--accent-active)'
      }}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
