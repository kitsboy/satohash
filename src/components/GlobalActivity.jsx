import React, { useState, useEffect, useRef } from 'react'
import { clientId, pickRotating, pseudoHash } from '../utils/id'
import { motion, AnimatePresence } from 'framer-motion'
import { Radio, Shield, Globe, Clock, Zap } from 'lucide-react'

export default function GlobalActivity() {
  const [activities, setActivities] = useState([
    { id: 1, type: 'anchor', hash: 'e3b0c442...', time: 'Just now', location: 'Frankfurt, DE' },
    { id: 2, type: 'signature', hash: '8f2a1b0c...', time: '2m ago', location: 'New York, US' },
    { id: 3, type: 'verify', hash: '0d3e5f7a...', time: '5m ago', location: 'Tokyo, JP' },
    { id: 4, type: 'anchor', hash: '9b8c7d6e...', time: '12m ago', location: 'London, UK' }
  ])

  const tick = useRef(0)
  useEffect(() => {
    const types = ['anchor', 'signature', 'verify']
    const locations = ['Paris, FR', 'Sydney, AU', 'Austin, TX', 'Seoul, KR', 'Dublin, IE']
    const interval = setInterval(() => {
      tick.current += 1
      const newActivity = {
        id: clientId('pulse'),
        type: pickRotating(types, tick.current),
        hash: `${pseudoHash(`pulse-${tick.current}`, 8)}...`,
        time: 'Just now',
        location: pickRotating(locations, tick.current)
      }
      setActivities((prev) => [newActivity, ...prev.slice(0, 3)])
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        padding: '24px',
        background: 'white',
        borderRadius: '32px',
        border: '1px solid #e2e8f0',
        shadow: '0 20px 50px -12px rgba(0,0,0,0.05)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#ef4444',
              animation: 'pulse 2s infinite'
            }}
          />
          <h4
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: '900',
              color: '#0f172a',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          >
            Global Proof Pulse
          </h4>
        </div>
        <Radio size={16} className="text-slate-400" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence initial={false}>
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '16px',
                border: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background:
                    activity.type === 'anchor'
                      ? 'rgba(99, 102, 241, 0.1)'
                      : 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activity.type === 'anchor' ? '#4f46e5' : '#10b981'
                }}
              >
                {activity.type === 'anchor' ? (
                  <Shield size={18} />
                ) : activity.type === 'signature' ? (
                  <Zap size={18} />
                ) : (
                  <Globe size={18} />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '800',
                      color: '#0f172a',
                      textTransform: 'uppercase'
                    }}
                  >
                    {activity.type === 'anchor'
                      ? 'Anchored'
                      : activity.type === 'signature'
                        ? 'Signed'
                        : 'Verified'}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8' }}>
                    {activity.time}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <code style={{ fontSize: '10px', color: '#64748b' }}>{activity.hash}</code>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8' }}>
                    {activity.location}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#4f46e5',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          View Live Topology →
        </button>
      </div>

      <style>{`
                @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(0.95); opacity: 0.8; }
                }
            `}</style>
    </div>
  )
}
