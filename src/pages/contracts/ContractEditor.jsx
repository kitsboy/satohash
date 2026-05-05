import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Sparkles,
  Layout,
  Settings,
  Globe,
  Layers,
  PlusCircle,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../../components/Button'
import { getTemplate } from '../../templates'
import { clsx } from 'clsx'
import { generateSHA256Hash } from '../../utils/crypto'

export default function ContractEditor() {
  const navigate = useNavigate()
  const { contractId, templateType } = useParams()

  const [contract, setContract] = useState({
    id: '',
    name: '',
    content: '',
    status: 'draft',
    signers: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
  const [isSaving, setIsSaving] = useState(false)
  const [placeholders, setPlaceholders] = useState([])
  const [activeTab, setActiveTab] = useState('editor')
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false)
  const [localHash, setLocalHash] = useState('')

  useEffect(() => {
    if (contract.content) {
      generateSHA256Hash(contract.content).then((hash) => setLocalHash(hash))
    } else {
      setLocalHash('')
    }
  }, [contract.content])

  useEffect(() => {
    if (contractId) {
      const savedContracts = localStorage.getItem('satohash_contracts')
      if (savedContracts) {
        const contracts = JSON.parse(savedContracts)
        const existingContract = contracts.find((c) => c.id === contractId)
        if (existingContract) {
          setContract(existingContract)
        }
      }
    } else if (templateType) {
      const template = getTemplate(templateType)
      if (template) {
        setContract((prev) => ({
          ...prev,
          id: `contract_${Date.now()}`,
          name: template.name,
          content: template.content,
          signers: [],
          templateType
        }))
      }
    }
  }, [contractId, templateType])

  useEffect(() => {
    const regex = /\[(.*?)\]/g
    const matches = [...contract.content.matchAll(regex)]
    const uniquePlaceholders = [...new Set(matches.map((m) => m[1]))]
    setPlaceholders(uniquePlaceholders)
  }, [contract.content])

  const handlePlaceholderChange = (placeholder, value) => {
    // We only replace if the value isn't empty to keep the tag visible for editing
    if (!value) return
    const newContent = contract.content.replaceAll(`[${placeholder}]`, value)
    setContract({ ...contract, content: newContent })
  }

  const handleSave = () => {
    setIsSaving(true)
    const updatedContract = {
      ...contract,
      updatedAt: new Date().toISOString()
    }

    const savedContracts = localStorage.getItem('satohash_contracts')
    let contracts = savedContracts ? JSON.parse(savedContracts) : []

    const existingIndex = contracts.findIndex((c) => c.id === updatedContract.id)
    if (existingIndex >= 0) {
      contracts[existingIndex] = updatedContract
    } else {
      contracts.push(updatedContract)
    }

    localStorage.setItem('satohash_contracts', JSON.stringify(contracts))

    setTimeout(() => {
      setIsSaving(false)
      navigate(`/contracts/${updatedContract.id}`)
    }, 800)
  }

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.03]" />
      {/* Top Navigation Bar */}
      <nav
        className="mesh-bg-light sticky top-0 z-50 flex h-14 items-center justify-between px-4 backdrop-blur-xl md:h-16 md:px-6"
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'color-mix(in srgb, var(--bg-secondary) 80%, transparent)'
        }}
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="small" onClick={() => navigate('/contracts')}>
            <ArrowLeft size={16} />
          </Button>
          <div className="hidden h-5 w-px sm:block" style={{ background: 'var(--border)' }} />
          <h1 className="text-noir-primary max-w-[180px] truncate text-sm font-black tracking-tight uppercase italic sm:max-w-none">
            {contract.name || 'Untitled Document'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="mr-2 hidden text-[10px] font-bold tracking-widest uppercase sm:block"
            style={{ color: 'var(--text-muted)' }}
          >
            Status:{' '}
            <span style={{ color: 'var(--accent-active)' }}>{contract.status}</span>
          </span>

          {/* Mobile panel toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl md:hidden"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            onClick={() => setIsMobilePanelOpen(true)}
          >
            <Layout size={16} />
          </button>

          <Button variant="primary" size="small" onClick={handleSave} loading={isSaving}>
            <Save size={14} /> <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Mini Sidebar — Hidden on mobile */}
        <div
          className="hidden w-14 flex-col items-center gap-4 py-4 md:flex"
          style={{ borderRight: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
        >
          <SidebarIcon
            icon={Layout}
            active={activeTab === 'editor'}
            onClick={() => setActiveTab('editor')}
            label="Inspector"
          />
          <SidebarIcon
            icon={Settings}
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            label="Settings"
          />
        </div>

        {/* Main Content Area */}
        <main
          className="relative flex-1 overflow-y-auto"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <div className="mx-auto max-w-[850px] px-4 py-8 md:px-8 md:py-12">
            {/* The Paper — cream background is intentional UX for legal documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="document-paper border-noir relative overflow-hidden shadow-2xl"
            >
              <div className="grid-pattern-slate pointer-events-none absolute inset-0 opacity-[0.02]" />
              {/* Watermark */}
              <div className="document-watermark">
                <img src="/logo.png" alt="Satohash Watermark" />
              </div>

              <textarea
                className="relative z-10 h-full min-h-[600px] w-full resize-none border-none bg-transparent pt-16 text-[16px] leading-[1.8] text-slate-800 outline-none placeholder:text-slate-300 md:min-h-[900px] md:pt-20 md:text-[18px]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                value={contract.content}
                onChange={(e) => setContract({ ...contract, content: e.target.value })}
                placeholder="Start drafting your legal document..."
              />
            </motion.div>
          </div>
        </main>

        {/* Right Panel — Desktop */}
        <AnimatePresence mode="wait">
          <motion.aside
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="hidden w-72 overflow-y-auto md:block lg:w-80"
            style={{ borderLeft: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
          >
            <SidebarContent
              activeTab={activeTab}
              contract={contract}
              setContract={setContract}
              placeholders={placeholders}
              handlePlaceholderChange={handlePlaceholderChange}
              templateType={templateType}
              localHash={localHash}
            />
          </motion.aside>
        </AnimatePresence>

        {/* Mobile Bottom Sheet Panel */}
        <AnimatePresence>
          {isMobilePanelOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm md:hidden"
                onClick={() => setIsMobilePanelOpen(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed inset-x-0 bottom-0 z-[101] max-h-[80vh] overflow-y-auto rounded-t-3xl shadow-2xl md:hidden"
                style={{
                  borderTop: '1px solid var(--border)',
                  background: 'var(--bg-secondary)'
                }}
              >
                <div
                  className="sticky top-0 flex items-center justify-between px-5 py-3"
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--bg-secondary)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="mx-auto h-1 w-10 rounded-full"
                      style={{ background: 'var(--border)' }}
                    />
                  </div>
                  <button
                    onClick={() => setIsMobilePanelOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <X size={16} />
                  </button>
                </div>
                {/* Tab selector for mobile */}
                <div
                  className="flex gap-2 px-5 py-3"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <button
                    onClick={() => setActiveTab('editor')}
                    className="rounded-xl px-4 py-2 text-xs font-bold transition-all"
                    style={
                      activeTab === 'editor'
                        ? {
                            border: '1px solid var(--accent-active)',
                            background: 'color-mix(in srgb, var(--accent-active) 10%, transparent)',
                            color: 'var(--accent-active)'
                          }
                        : { color: 'var(--text-secondary)' }
                    }
                  >
                    Inspector
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="rounded-xl px-4 py-2 text-xs font-bold transition-all"
                    style={
                      activeTab === 'settings'
                        ? {
                            border: '1px solid var(--accent-active)',
                            background: 'color-mix(in srgb, var(--accent-active) 10%, transparent)',
                            color: 'var(--accent-active)'
                          }
                        : { color: 'var(--text-secondary)' }
                    }
                  >
                    Settings
                  </button>
                </div>
                <SidebarContent
                  activeTab={activeTab}
                  contract={contract}
                  setContract={setContract}
                  placeholders={placeholders}
                  handlePlaceholderChange={handlePlaceholderChange}
                  templateType={templateType}
                  localHash={localHash}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Floating Save */}
      <div className="fixed right-6 bottom-6 z-50 md:hidden">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={isSaving}
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-xl"
          style={{
            background: 'var(--accent-active)',
            boxShadow: '0 8px 24px color-mix(in srgb, var(--accent-active) 30%, transparent)'
          }}
        >
          {isSaving ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Save size={20} />
          )}
        </motion.button>
      </div>
    </div>
  )
}

function SidebarIcon({ icon: Icon, active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300"
      style={
        active
          ? {
              background: 'var(--accent-active)',
              color: '#fff',
              boxShadow: '0 4px 12px color-mix(in srgb, var(--accent-active) 25%, transparent)'
            }
          : { color: 'var(--text-secondary)' }
      }
    >
      <Icon size={18} strokeWidth={active ? 2.5 : 2} />
      <div className="pointer-events-none absolute left-full z-[100] ml-3 rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-bold tracking-wide whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
        {label}
      </div>
    </button>
  )
}

function SidebarContent({
  activeTab,
  contract,
  setContract,
  placeholders,
  handlePlaceholderChange,
  templateType,
  localHash
}) {
  return (
    <>
      {activeTab === 'editor' && (
        <div className="p-5 md:p-6">
          <div
            className="mb-5 flex items-center gap-2 pb-4"
            style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <Layout size={16} style={{ color: 'var(--accent-active)' }} />
            <h3 className="text-sm font-extrabold tracking-tight">Inspector</h3>
          </div>

          <div className="space-y-6">
            {/* BASIC INFO */}
            <section className="space-y-3">
              <label
                className="block text-[10px] font-bold tracking-widest uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                Document Name
              </label>
              <input
                type="text"
                value={contract.name}
                onChange={(e) => setContract({ ...contract, name: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm font-bold transition-all outline-none"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)'
                }}
              />
            </section>

            {/* SMART FIELDS */}
            {placeholders.length > 0 && (
              <section
                className="space-y-4 pt-5"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <div
                  className="flex items-center gap-2"
                  style={{ color: 'var(--accent-active)' }}
                >
                  <Sparkles size={14} fill="currentColor" />
                  <h4 className="text-[10px] font-bold tracking-widest uppercase">
                    Document Variables
                  </h4>
                </div>
                <div className="edu-callout text-[12px]">
                  <span className="edu-callout-title">What are these?</span>
                  Variables in [brackets] are placeholders. Fill them in below and they&apos;ll be
                  automatically replaced in your document.
                </div>
                <div className="space-y-3">
                  {placeholders.map((p) => (
                    <div key={p}>
                      <label
                        className="mb-1.5 block text-[9px] font-bold tracking-widest uppercase"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {p.replace(/_/g, ' ')}
                      </label>
                      <input
                        type="text"
                        placeholder={`Value for [${p}]...`}
                        className="w-full rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none"
                        style={{
                          border: '1px solid var(--border)',
                          background: 'var(--bg-primary)',
                          color: 'var(--text-primary)'
                        }}
                        onChange={(e) => handlePlaceholderChange(p, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PROTOCOL EXTENSIONS */}
            <section className="space-y-3 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
              <label
                className="block text-[10px] font-bold tracking-widest uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                Protocol Extensions
              </label>
              <div className="space-y-2">
                {templateType === 'domain-notary' && (
                  <Button
                    variant="outline"
                    size="small"
                    fullWidth
                    onClick={() => {
                      const domains = prompt('Enter domains separated by commas:')
                      if (domains) {
                        const list = domains
                          .split(',')
                          .map((d) => d.trim())
                          .filter((d) => d)
                          .map((d) => `- ${d}: VERIFIED`)
                          .join('\n')
                        setContract({
                          ...contract,
                          content: contract.content + '\n\n### VERIFIED BATCH\n' + list
                        })
                      }
                    }}
                  >
                    <Layers size={14} /> Add Domain Batch
                  </Button>
                )}
                {templateType === 'web-archive' && (
                  <Button
                    variant="outline"
                    size="small"
                    fullWidth
                    onClick={() => {
                      const url = prompt('Enter URL to Snap:')
                      if (url) {
                        setContract({
                          ...contract,
                          name: `Snap: ${url}`,
                          content: `URL: ${url}\nSnapshot Date: ${new Date().toLocaleString()}\nHash: ${Math.random().toString(16).substring(2, 10)}\n\n[CONTENT ARCHIVED]`
                        })
                      }
                    }}
                  >
                    <Globe size={14} /> Simulate Snapshot
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="small"
                  fullWidth
                  onClick={() => {
                    setContract({
                      ...contract,
                      content:
                        contract.content +
                        '\n\n[CERTIFIED_ATTACHMENT_ID: ' +
                        Math.random().toString(36).substring(7).toUpperCase() +
                        ']'
                    })
                  }}
                >
                  <PlusCircle size={14} /> Append Proof Seal
                </Button>
              </div>
            </section>

            {/* METADATA */}
            <div
              className="space-y-3 rounded-2xl p-4"
              style={{
                border: '1px solid var(--border)',
                background: 'var(--surface-raised)'
              }}
            >
              <div className="flex items-center justify-between text-[10px] font-medium">
                <span
                  className="tracking-widest uppercase"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Created
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {new Date(contract.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-medium">
                <span
                  className="tracking-widest uppercase"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Protocol Type
                </span>
                <span
                  className="font-bold tracking-widest uppercase"
                  style={{ color: 'var(--accent-active)' }}
                >
                  {contract.templateType || 'Custom'}
                </span>
              </div>
              <div
                className="mt-1 flex flex-col gap-1 pt-3"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <span
                  className="text-[9px] font-bold tracking-widest uppercase"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Live Client Hashing (Zero-Knowledge)
                </span>
                <span className="truncate font-mono text-[9px] font-bold text-emerald-600">
                  {localHash || 'Awaiting content...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="p-5 md:p-6">
          <div
            className="mb-5 flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <Settings size={16} />
            <h3 className="text-sm font-extrabold tracking-tight">Settings</h3>
          </div>
          <div className="space-y-4">
            <div
              className="rounded-2xl p-6 text-center"
              style={{
                background: 'var(--surface-raised)',
                border: '1px solid var(--border)'
              }}
            >
              <p
                className="text-sm font-semibold"
                style={{ color: 'var(--text-secondary)' }}
              >
                Document settings coming soon.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
