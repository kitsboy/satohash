import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Cpu,
  Database,
  Globe,
  Zap,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  BarChart3,
  TrendingDown
} from 'lucide-react'
import Card from '../components/Card'
import { getBlockHeight } from '../utils/mempool'

export default function ProtocolStats() {
  const [stats, setStats] = useState({
    network: 'Bitcoin Mainnet',
    height: 0,
    unconfirmedTxs: 12450,
    averageFee: 42, // sats/vB
    totalAnchored: '1,245,672',
    nodes: '18,450+',
    uptime: '99.999%',
    lastBlockTime: '8m 42s'
  })

  useEffect(() => {
    const fetchHeight = async () => {
      const height = await getBlockHeight()
      setStats((prev) => ({ ...prev, height }))
    }
    fetchHeight()

    // Mock live updates
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        unconfirmedTxs: prev.unconfirmedTxs + Math.floor(Math.random() * 20) - 5
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="page" style={{ background: '#f8fafc', paddingTop: '100px' }}>
      <div className="container">
        <div style={{ marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '8px 12px',
              background: 'rgba(99, 102, 241, 0.1)',
              borderRadius: '20px',
              color: '#4f46e5',
              fontSize: '12px',
              fontWeight: '800',
              marginBottom: '16px',
              border: '1px solid rgba(99, 102, 241, 0.2)'
            }}
          >
            <Activity size={14} style={{ marginRight: '6px' }} />
            NETWORK LIVE REPO
          </div>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: '950',
              letterSpacing: '-0.04em',
              marginBottom: '8px',
              color: '#0f172a'
            }}
          >
            Protocol Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '18px', fontWeight: '500' }}>
            Real-time health monitoring of the Satohash anchoring protocol and Bitcoin network.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}
        >
          <StatCard
            icon={Database}
            label="Blockchain Height"
            value={`#${stats.height}`}
            subValue="Confirmed Mainnet"
            color="#4f46e5"
          />
          <StatCard
            icon={TrendingDown}
            label="Median Network Fee"
            value={`${stats.averageFee} sat/vB`}
            subValue="Estimated Next Block"
            color="#10b981"
          />
          <StatCard
            icon={ShieldCheck}
            label="Total Claims Anchored"
            value={stats.totalAnchored}
            subValue="Verified Fingerprints"
            color="#0f172a"
          />
          <StatCard
            icon={Zap}
            label="Mempool Pressure"
            value={stats.unconfirmedTxs.toLocaleString()}
            subValue="Pending Transactions"
            color="#f59e0b"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          <Card style={{ padding: '32px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px'
              }}
            >
              <h3 style={{ margin: 0, fontWeight: '850', fontSize: '20px' }}>
                Protocol Efficiency
              </h3>
              <BarChart3 size={20} className="text-slate-400" />
            </div>

            <div
              style={{
                height: '300px',
                display: 'flex',
                alignItems: 'flex-end',
                gap: '12px',
                paddingBottom: '24px'
              }}
            >
              {[40, 65, 30, 85, 45, 90, 60, 75, 55, 80].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1, duration: 1 }}
                  style={{
                    flex: 1,
                    background: i === 5 ? '#4f46e5' : '#e2e8f0',
                    borderRadius: '8px 8px 4px 4px',
                    position: 'relative'
                  }}
                >
                  {i === 5 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#0f172a',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}
                    >
                      PEAK
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#94a3b8',
                fontSize: '12px',
                fontWeight: '700'
              }}
            >
              <span>12H AGO</span>
              <span>SNAPSHOT (LIVE)</span>
            </div>
          </Card>

          <Card style={{ padding: '32px', background: '#0f172a', color: 'white', border: 'none' }}>
            <h3
              style={{
                margin: 0,
                fontWeight: '850',
                fontSize: '20px',
                color: 'white',
                marginBottom: '24px'
              }}
            >
              System Health
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <HealthRow icon={Globe} label="Ots Calendar Nodes" value="Connected" />
              <HealthRow icon={Clock} label="Last Anchor Time" value={stats.lastBlockTime} />
              <HealthRow icon={Cpu} label="Hash Rate Support" value="685.2 EH/s" />

              <div
                style={{
                  marginTop: '16px',
                  padding: '20px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>
                  The Satohash protocol is currently utilizing <strong>3 independent</strong> OTS
                  calendars for maximum redundancy and faster confirmation.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, subValue, color }) {
  return (
    <Card style={{ padding: '24px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: `${color}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color
          }}
        >
          <Icon size={20} />
        </div>
        <ArrowUpRight size={16} className="text-slate-300" />
      </div>
      <h4
        style={{
          margin: '0 0 4px 0',
          fontSize: '13px',
          fontWeight: '800',
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        {label}
      </h4>
      <div
        style={{
          fontSize: '28px',
          fontWeight: '950',
          color: '#0f172a',
          letterSpacing: '-0.02em',
          marginBottom: '4px'
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>{subValue}</div>
    </Card>
  )
}

function HealthRow({ icon: Icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Icon size={18} className="text-slate-500" />
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8' }}>{label}</span>
      </div>
      <span style={{ fontSize: '14px', fontWeight: '800', color: 'white' }}>{value}</span>
    </div>
  )
}
