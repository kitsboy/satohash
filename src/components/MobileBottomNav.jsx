import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Database, Stamp, ShieldCheck, Globe, MoreHorizontal } from 'lucide-react'

const MOBILE_LINKS = [
  { name: 'Vault', path: '/vault', icon: Database },
  { name: 'Stamp', path: '/stamp', icon: Stamp },
  { name: 'Verify', path: '/verify', icon: ShieldCheck },
  { name: 'Atlas', path: '/atlas', icon: Globe },
  { name: 'More', path: '/more', icon: MoreHorizontal }
]

export default function MobileBottomNav() {
  return (
    <nav className="flex h-full items-center justify-around px-2">
      {MOBILE_LINKS.map((link) => {
        const Icon = link.icon
        return (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center gap-1 py-1 transition-all ${isActive ? 'text-[var(--accent-active)]' : 'text-[var(--text-secondary)]'} `
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute inset-x-4 -top-3 h-1 rounded-full bg-[var(--accent-active)]"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold tracking-widest uppercase">{link.name}</span>
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
