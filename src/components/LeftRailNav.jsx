import { NavLink, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../config/constants'
import * as Icons from 'lucide-react'
import { useState, useEffect } from 'react'
import HelpOverlay from './HelpOverlay'

export default function LeftRailNav() {
  const location = useLocation()
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('satohash_intro_seen')
    if (!hasSeenIntro) {
      setShowHelp(true)
      localStorage.setItem('satohash_intro_seen', 'true')
    }
  }, [])

  const groups = NAV_LINKS.reduce((acc, link) => {
    if (!acc[link.group]) acc[link.group] = []
    acc[link.group].push(link)
    return acc
  }, {})

  return (
    <nav className="flex h-full w-64 flex-col border-r border-[var(--border)] bg-[var(--bg-primary)] pt-6">
      <div className="mb-10 flex flex-col gap-6 px-6">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rotate-45 rounded-sm bg-[var(--accent-active)] shadow-[0_0_15px_var(--accent-active)]" />
          <span className="text-xl font-bold tracking-tighter uppercase">Satohash</span>
        </div>

        <button
          onClick={() => setShowHelp(true)}
          className="group flex w-full items-center gap-3 rounded-xl border border-[var(--accent-active)]/20 bg-[var(--accent-active)]/10 p-3 text-[var(--accent-active)] transition-all hover:bg-[var(--accent-active)]/20"
        >
          <Icons.HelpCircle size={18} className="transition-transform group-hover:rotate-12" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Protocol Guide</span>
        </button>
      </div>

      <div className="scrollbar-hide flex-1 space-y-8 overflow-y-auto px-4">
        {Object.entries(groups).map(([groupName, links]) => (
          <div key={groupName} className="space-y-2">
            <h4 className="mb-3 px-2 text-[10px] font-bold tracking-[0.3em] text-[var(--text-secondary)] uppercase">
              {groupName}
            </h4>
            <div className="space-y-1">
              {links.map((link) => {
                const Icon = Icons[link.icon] || Icons.Circle
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                        isActive
                          ? 'border border-[var(--border-bright)] bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-lg shadow-black/50'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]/50 hover:text-[var(--text-primary)]'
                      } `
                    }
                  >
                    <Icon size={18} className="transition-transform group-hover:scale-110" />
                    <span className="text-sm font-medium tracking-tight">{link.name}</span>
                    {link.path === '/stamp' && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent-active)] shadow-[0_0_5px_var(--accent-active)]" />
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 border-t border-[var(--border)] p-4">
        <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-widest text-[var(--text-secondary)] uppercase">
              Mesh Identity
            </span>
            <div className="h-2 w-2 rounded-full bg-[var(--accent-success)]" />
          </div>
          <p className="truncate text-[11px] font-bold">counsel@satohash.nip05</p>
        </div>
      </div>
      <HelpOverlay isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </nav>
  )
}
