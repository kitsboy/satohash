import { createContext, useContext, useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check localStorage (canonical key: satohash_theme) or system preference
    const saved = localStorage.getItem('satohash_theme') || localStorage.getItem('satohash-theme')
    if (saved === 'elite') {
      setTheme('light')
      document.documentElement.setAttribute('data-theme', 'elite')
    } else if (saved === 'dark') {
      setTheme('dark')
      document.documentElement.removeAttribute('data-theme')
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light')
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('satohash_theme', theme === 'light' ? 'elite' : 'dark')
      if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'elite')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  if (!mounted) return null

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg border border-gray-700 bg-gray-800/50 p-2 transition-colors hover:bg-gray-700/50"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-blue-400" />
      )}
    </button>
  )
}
