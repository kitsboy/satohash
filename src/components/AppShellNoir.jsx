import React from 'react'
import { motion } from 'framer-motion'
import LeftRailNav from './LeftRailNav'
import TopSignalBar from './TopSignalBar'
import MobileBottomNav from './MobileBottomNav'

/**
 * AppShellNoir - The flagship layout shell for Satohash v4.0.0-ELITE+.
 * Implements the "Institutional Noir" aesthetic with a persistent left rail on desktop
 * and a bottom navigation bar on mobile.
 */
export default function AppShellNoir({ children }) {
  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Desktop Left Rail */}
      <div className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-[var(--border)] bg-[var(--bg-secondary)] md:block">
        <LeftRailNav />
      </div>

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-1 flex-col pb-20 md:ml-64 md:pb-0">
        {/* Top Signal Bar */}
        <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-primary)]/80 px-6 backdrop-blur-md">
          <TopSignalBar />
        </div>

        {/* Dynamic Screen Content */}
        <main className="animate-fade-in flex-1 p-6 md:p-8">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed inset-x-0 bottom-0 z-50 h-16 border-t border-[var(--border)] bg-[var(--bg-secondary)]/95 backdrop-blur-md md:hidden">
        <MobileBottomNav />
      </div>
    </div>
  )
}
