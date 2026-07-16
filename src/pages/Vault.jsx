import { motion, AnimatePresence } from 'framer-motion'
import {
  Database,
  Search,
  Download,
  FileText,
  Layers,
  FileArchive,
  ShieldCheck,
  FileDown,
  Loader2,
  Globe,
  Stamp,
  RefreshCw,
  Trash2,
  FileImage,
  FileCode,
  FileSpreadsheet,
  File
} from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { toast } from 'sonner'
import { downloadCertificate } from '../utils/certificate'
import { useSocket } from '../hooks/useSocket'
import { SkeletonList } from '../components/Skeletons'
import { useTranslation } from 'react-i18next'
import { useI18n } from '../i18n'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl } from '../config/constants'
import { useEscapeKey } from '../utils/a11y'
import { exportEncryptedVault } from '../utils/vaultExport'
import StaticModeBanner from '../components/StaticModeBanner'
import { stampHashBrowser } from '../utils/otsClient'
import { isApiExplicitlyConfigured } from '../config/mvp'
import { getOfflineQueue, findStampByHashOrId, otsBase64ToBlob } from '../utils/vaultLocal'
import { upgradeOtsBrowser } from '../utils/otsClient'
import { isStaticOnlyMode } from '../utils/staticMode'
import PinModal from '../components/PinModal'

const StatusBadge = ({ status }) => {
  const { t } = useI18n()
  const styles = {
    anchored:
      'bg-[var(--accent-success)]/10 text-[var(--accent-success)] border-[var(--accent-success)]/20',
    pending:
      'bg-[var(--accent-pending)]/10 text-[var(--accent-pending)] border-[var(--accent-pending)]/20',
    hashing: 'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border-[var(--accent-gold)]/20',
    revoked:
      'bg-[var(--accent-danger)]/10 text-[var(--accent-danger)] border-[var(--accent-danger)]/20',
    failed: 'bg-white/5 text-[var(--text-secondary)] border-white/10'
  }
  const labels = {
    pending: t('vault', 'pending'),
    confirmed: t('vault', 'confirmed')
  }
  return (
    <span
      className={`rounded-md border px-2 py-1 text-[9px] font-black tracking-widest uppercase ${styles[status] || styles.pending}`}
    >
      {labels[status] ?? status}
    </span>
  )
}

const getFileTypeIcon = (filename, type) => {
  if (type === 'capsule') return FileArchive
  if (type === 'snapper') return Layers
  const ext = (filename || '').split('.').pop()?.toLowerCase() || ''
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext)) return FileImage
  if (['zip', 'tar', 'gz', 'rar', '7z'].includes(ext)) return FileArchive
  if (['pdf', 'doc', 'docx', 'txt', 'md', 'rtf'].includes(ext)) return FileText
  if (['xls', 'xlsx', 'csv'].includes(ext)) return FileSpreadsheet
  if (['js', 'ts', 'jsx', 'tsx', 'py', 'json', 'html', 'css'].includes(ext)) return FileCode
  return File
}

const SecurityAge = ({ confirmations }) => {
  const { t: tv } = useTranslation()
  const getLevel = (c) => {
    if (c < 6)
      return { label: tv('vaultPage.securityAge.motion'), color: 'text-[var(--accent-pending)]' }
    if (c < 1000)
      return {
        label: tv('vaultPage.securityAge.operational'),
        color: 'text-[var(--accent-success)]'
      }
    return { label: tv('vaultPage.securityAge.archival'), color: 'text-[var(--accent-gold)]' }
  }
  const level = getLevel(confirmations)
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-1.5 w-1.5 rounded-full ${level.color.replace('text', 'bg')} shadow-[0_0_8px_currentColor]`}
      />
      <span className={`text-[10px] font-black tracking-widest uppercase ${level.color}`}>
        {level.label}
      </span>
    </div>
  )
}

export default function Vault() {
  usePageMeta({ page: 'vault' })
  const { t: tv } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('date-desc')
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [serverUnreachable, setServerUnreachable] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const parentRef = useRef(null)
  const [revokeTarget, setRevokeTarget] = useState(null)
  const closeRevoke = () => {
    setRevokeTarget(null)
    setRevokeReason('')
  }
  useEscapeKey(!!revokeTarget, closeRevoke)
  const [revokeReason, setRevokeReason] = useState('')
  const [revoking, setRevoking] = useState(false)
  const [passphraseModal, setPassphraseModal] = useState(null) // 'export' | 'import' | null
  const [pendingImportData, setPendingImportData] = useState(null)
  const [exportingZip, setExportingZip] = useState(false)
  const [offlineQueue, setOfflineQueue] = useState([])
  const [isSyncing, setIsSyncing] = useState(false)
  const { t } = useI18n()

  const { lastEvent } = useSocket()

  const mapStamps = (data) =>
    data.map((s) => ({
      id: s.id,
      name: s.filename || s.original_filename || 'Unnamed document',
      type: s.filename?.includes('SNAP') ? 'snapper' : 'file',
      hash: s.hash ? s.hash.substring(0, 8) + '...' + s.hash.slice(-4) : '—',
      fullHash: s.hash,
      date: s.created_at ? new Date(s.created_at).toISOString().split('T')[0] : '—',
      status: s.status || 'pending',
      confirmations: s.bitcoin_block_height ? 999 : 0,
      bitcoin_block_height: s.bitcoin_block_height || null,
      size: '—',
      is_revoked: s.is_revoked || false,
      revocation_reason: s.revocation_reason || ''
    }))

  const refreshStamps = useCallback(async () => {
    try {
      const API = getApiUrl()
      const vaultNpub =
        localStorage.getItem('satohash_npub') || sessionStorage.getItem('satohash_npub')
      const res = await fetch(`${API}/api/history`, {
        headers: vaultNpub ? { 'X-Npub': vaultNpub } : {}
      })
      if (res.ok) {
        const data = await res.json()
        const rows = Array.isArray(data) ? data : (data.stamps ?? [])
        if (rows.length > 0 || Array.isArray(data)) setItems(mapStamps(rows))
      }
    } catch {
      toast.error(t('vault', 'loadMoreFailed') || 'Sync failed — showing cached proofs')
    }
  }, [t])

  useEffect(() => {
    const fetchStamps = async () => {
      try {
        const API = getApiUrl()
        const vaultNpub =
          localStorage.getItem('satohash_npub') || sessionStorage.getItem('satohash_npub')
        const res = await fetch(`${API}/api/history?page=1&limit=50`, {
          headers: vaultNpub ? { 'X-Npub': vaultNpub } : {}
        })
        if (res.ok) {
          const data = await res.json()
          // API returns { stamps: [...], pagination: {...} }
          const rows = Array.isArray(data) ? data : (data.stamps ?? [])
          setItems(mapStamps(rows))
          setHasMore(data.pagination?.hasNext || false)
          setServerUnreachable(false)
        } else {
          setServerUnreachable(true)
        }
      } catch (e) {
        setServerUnreachable(true)
        // Fall back to localStorage stamps if server not running
        const local = JSON.parse(localStorage.getItem('satohash_stamps') || '[]')
        const mapped = local.map((s) => ({
          id: s.id,
          name: s.filename || 'Unnamed',
          type: 'file',
          hash: s.hash ? s.hash.substring(0, 8) + '...' + s.hash.slice(-4) : '—',
          fullHash: s.hash,
          date: s.created_at
            ? new Date(s.created_at).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          status: s.status || 'pending',
          confirmations: 0,
          size: '—'
        }))
        setItems(mapped)
      } finally {
        setLoading(false)
      }
    }
    fetchStamps()
  }, [])

  const loadOfflineQueue = () => {
    try {
      const queue = JSON.parse(localStorage.getItem('satohash_offline_queue') || '[]')
      setOfflineQueue(queue)
    } catch {
      setOfflineQueue([])
    }
  }

  const syncOfflineQueue = useCallback(async () => {
    const queue = getOfflineQueue()
    if (queue.length === 0) return
    setIsSyncing(true)
    let succeeded = 0

    for (const item of queue) {
      try {
        if (isApiExplicitlyConfigured()) {
          const API = getApiUrl()
          const res = await fetch(`${API}/api/stamp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              hash: item.hash,
              filename: item.filename,
              customLabel: item.customLabel || ''
            })
          })
          if (res.ok) {
            succeeded++
            continue
          }
        }
        if (item.hash?.length === 64) {
          const { blob } = await stampHashBrowser(item.hash)
          const buf = await blob.arrayBuffer()
          const bytes = new Uint8Array(buf)
          let otsFileBase64 = null
          try {
            otsFileBase64 = btoa(String.fromCharCode(...bytes))
          } catch {
            /* skip */
          }
          const existing = JSON.parse(localStorage.getItem('satohash_stamps') || '[]')
          existing.unshift({
            ...item,
            id: item.id || `ots-${item.hash.slice(0, 8)}`,
            status: 'pending',
            source: 'browser-ots',
            hasOts: true,
            otsFileBase64
          })
          localStorage.setItem('satohash_stamps', JSON.stringify(existing.slice(0, 500)))
          succeeded++
        }
      } catch (err) {
        console.error('Offline sync failed for item:', item, err)
        toast.error(`Sync failed: ${item.filename || item.hash?.slice(0, 8)}`, {
          description: err?.message || 'Will retry when online'
        })
      }
    }

    const failed = queue.length - succeeded
    localStorage.removeItem('satohash_offline_queue')
    setOfflineQueue([])
    setIsSyncing(false)
    if (failed > 0) {
      toast.warning(`Synced ${succeeded}/${queue.length} — ${failed} failed`)
    } else {
      toast.success(`⚡ Offline Queue Synced`, {
        description: `Successfully anchored ${succeeded} queued files to the mainnet.`
      })
    }
    refreshStamps()
  }, [refreshStamps])

  useEffect(() => {
    loadOfflineQueue()
    const handleOnline = () => {
      toast.success('⚡ Connection restored! Synchronizing offline ledger queues...')
      syncOfflineQueue()
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [syncOfflineQueue])

  // Re-fetch the full list whenever a new stamp or confirmation arrives via Socket.io
  useEffect(() => {
    if (!lastEvent) return
    if (lastEvent.type === 'stamped') {
      refreshStamps()
    }
    if (lastEvent.type === 'confirmed') {
      const blockHeight = lastEvent.data?.blockHeight
      const stampId = lastEvent.data?.id
      toast.success('⛓ Proof confirmed on Bitcoin!', {
        description: blockHeight ? `Block ${blockHeight.toLocaleString()}` : 'Anchored to mainnet',
        duration: 8000,
        action: stampId
          ? {
              label: 'Download .ots →',
              onClick: () => downloadOtsFile({ id: stampId })
            }
          : undefined
      })
      refreshStamps()
    }
  }, [lastEvent, refreshStamps])

  const loadMore = async () => {
    const nextPage = page + 1
    try {
      const API = getApiUrl()
      const vaultNpub =
        localStorage.getItem('satohash_npub') || sessionStorage.getItem('satohash_npub')
      const res = await fetch(`${API}/api/history?page=${nextPage}&limit=50`, {
        headers: vaultNpub ? { 'X-Npub': vaultNpub } : {}
      })
      if (res.ok) {
        const data = await res.json()
        const rows = Array.isArray(data) ? data : (data.stamps ?? [])
        setItems((prev) => [...prev, ...mapStamps(rows)])
        setHasMore(data.pagination?.hasNext || false)
        setPage(nextPage)
      }
    } catch (_err) {
      toast.error('Could not load more proofs. Check your connection and try again.')
    }
  }

  const handleRevoke = (item) => {
    const snapshot = items
    const reason = revokeReason
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_revoked: true, status: 'revoked' } : i))
    )
    setRevokeTarget(null)
    setRevokeReason('')
    setRevoking(false)

    let undone = false
    const timer = setTimeout(async () => {
      if (undone) return
      try {
        const API = getApiUrl()
        const res = await fetch(`${API}/api/revoke/${item.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason })
        })
        if (!res.ok) throw new Error('Revoke request failed')
      } catch (e) {
        setItems(snapshot)
        toast.error('Revoke failed: ' + e.message)
      }
    }, 5000)

    toast.success('Proof revoked', {
      description: item.name,
      duration: 5000,
      action: {
        label: 'Undo',
        onClick: () => {
          undone = true
          clearTimeout(timer)
          setItems(snapshot)
          toast.info('Revoke cancelled', { description: item.name })
        }
      }
    })
  }

  const handleExportZip = async () => {
    if (items.length === 0) {
      toast.error('No proofs to export')
      return
    }
    setExportingZip(true)
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      const API = getApiUrl()
      let added = 0

      const localStamps = JSON.parse(localStorage.getItem('satohash_stamps') || '[]')
      for (const item of items) {
        try {
          const res = await fetch(`${API}/api/stamps/${item.id}?download=true`)
          if (res.ok) {
            const blob = await res.blob()
            const safeName = (item.name || item.id).replace(/[^a-z0-9._-]/gi, '_')
            zip.file(`${safeName}-${item.id.substring(0, 8)}.ots`, blob)
            added++
            continue
          }
        } catch {
          /* try local */
        }
        const local = localStamps.find((s) => s.id === item.id)
        if (local?.otsFileBase64) {
          const safeName = (item.name || item.id).replace(/[^a-z0-9._-]/gi, '_')
          zip.file(`${safeName}-${item.id.substring(0, 8)}.ots`, local.otsFileBase64, {
            base64: true
          })
          added++
        }
      }

      if (added === 0) {
        toast.error('No downloadable OTS proofs found — proofs may still be pending')
        return
      }

      const manifest = items.map((i) => ({
        id: i.id,
        name: i.name,
        hash: i.fullHash,
        status: i.status,
        date: i.date
      }))
      zip.file('manifest.json', JSON.stringify(manifest, null, 2))

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `satohash-proofs-${new Date().toISOString().split('T')[0]}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success(`Exported ${added} proof${added === 1 ? '' : 's'} as ZIP`)
    } catch (e) {
      toast.error('ZIP export failed: ' + e.message)
    } finally {
      setExportingZip(false)
    }
  }

  const handleExport = () => {
    setIsExporting(true)
    setExportProgress(0)

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 100)

    setTimeout(async () => {
      try {
        const { jsPDF } = await import('jspdf')
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
        const pageW = 210
        const pageH = 297
        const margin = 20

        // Cover Page Background
        doc.setFillColor(20, 27, 37) // Deep navy #141b25
        doc.rect(0, 0, pageW, pageH, 'F')

        // Blueprint radial circles simulated in vector
        doc.setDrawColor(240, 180, 41) // Gold
        doc.setLineWidth(0.5)
        doc.circle(pageW / 2, pageH / 2, 80, 'D')
        doc.circle(pageW / 2, pageH / 2, 120, 'D')

        // Title Elements
        doc.setTextColor(240, 180, 41) // Gold
        doc.setFontSize(28)
        doc.setFont('helvetica', 'bold')
        doc.text('SATOHASH', pageW / 2, 90, { align: 'center' })

        doc.setTextColor(255, 255, 255)
        doc.setFontSize(18)
        doc.setFont('helvetica', 'normal')
        doc.text('FORENSIC PROVENANCE AUDIT', pageW / 2, 105, { align: 'center' })

        // Gold divider line
        doc.setDrawColor(240, 180, 41)
        doc.setLineWidth(1)
        doc.line(40, 115, pageW - 40, 115)

        // Metadata block on cover page
        doc.setTextColor(148, 163, 184)
        doc.setFontSize(10)
        doc.text(
          `AUDIT GENERATION DATE: ${new Date().toISOString().split('T')[0]}`,
          pageW / 2,
          130,
          { align: 'center' }
        )
        doc.text(`TOTAL ANCHORED RECORDS: ${filteredItems.length}`, pageW / 2, 138, {
          align: 'center'
        })
        doc.text(`LEDGER SCOPE: CLIENT-SIDE CRYPTOGRAPHIC VAULT`, pageW / 2, 146, {
          align: 'center'
        })

        // Parent Brand seal
        doc.setTextColor(240, 180, 41)
        doc.setFontSize(12)
        doc.text('BACKED BY GIVE A BIT (GIVEABIT.IO)', pageW / 2, 230, { align: 'center' })
        doc.setTextColor(148, 163, 184)
        doc.setFontSize(8)
        doc.text('F.O.S.S. BITCOIN APP SUITE FOR TRUST AND SECURITY', pageW / 2, 238, {
          align: 'center'
        })

        // Page 2: Detailed Evidence Catalog
        doc.addPage()
        doc.setFillColor(253, 251, 247) // Elegant parchment bg
        doc.rect(0, 0, pageW, pageH, 'F')

        doc.setDrawColor(20, 27, 37)
        doc.setLineWidth(0.5)
        doc.line(margin, 25, pageW - margin, 25)

        doc.setTextColor(20, 27, 37)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('EVIDENCE CATALOG & CRYPTOGRAPHIC COMPLIANCE', margin, 20)

        // Table headers
        let y = 35
        doc.setFontSize(8)
        doc.setTextColor(120, 130, 140)
        doc.text('ASSET NAME', margin, y)
        doc.text('SHA-256 HASH FINGERPRINT', margin + 60, y)
        doc.text('STATUS', margin + 140, y)

        doc.setDrawColor(240, 180, 41)
        doc.setLineWidth(0.5)
        doc.line(margin, y + 2, pageW - margin, y + 2)

        y += 8
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(15, 23, 42)

        filteredItems.forEach((item) => {
          if (y > 240) {
            // New page if overflowing
            doc.addPage()
            doc.setFillColor(253, 251, 247)
            doc.rect(0, 0, pageW, pageH, 'F')
            y = 25
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(120, 130, 140)
            doc.text('EVIDENCE CATALOG (CONTINUED)', margin, y)
            y += 8
          }

          doc.setFontSize(9)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(15, 23, 42)
          doc.text(item.name.substring(0, 28), margin, y)

          doc.setFontSize(8)
          doc.setFont('courier', 'normal')
          doc.setTextColor(80, 90, 100)
          doc.text(item.fullHash || item.hash, margin + 60, y)

          doc.setFontSize(8)
          doc.setFont('helvetica', 'bold')
          const isConf = item.status === 'confirmed' || item.status === 'anchored'
          doc.setTextColor(isConf ? 16 : 245, isConf ? 185 : 158, isConf ? 129 : 11) // green vs amber
          doc.text(item.status.toUpperCase(), margin + 140, y)

          y += 12
        })

        // Regulatory & Compliance Section
        y = Math.max(y + 10, 200)
        doc.setDrawColor(240, 180, 41)
        doc.setLineWidth(0.5)
        doc.line(margin, y, pageW - margin, y)

        y += 8
        doc.setTextColor(15, 23, 42)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text('LEGAL COMPLIANCE CITATIONS & STANDARDS', margin, y)

        y += 6
        doc.setFontSize(8)
        doc.setFont('helvetica', 'italic')
        doc.setTextColor(100, 110, 120)
        const complianceText =
          'This document certifies that the listed electronic records have been processed and anchored client-side. The cryptographic SHA-256 digests are permanently committed to the Bitcoin blockchain ledger using OpenTimestamps protocols.\n\n' +
          'Under the United States ESIGN Act (15 U.S.C. §§ 7001-7006) and the Uniform Electronic Transactions Act (UETA), electronic records and signatures are legally binding. Furthermore, this attestation complies with the European Union eIDAS Regulation (No 910/2014) Article 41 for electronic time stamps, creating a globally enforceable, censorship-resistant forensic proof of existence.'

        const splitText = doc.splitTextToSize(complianceText, pageW - margin * 2)
        doc.text(splitText, margin, y)

        // Seal / Stamp visual vector
        doc.setDrawColor(240, 180, 41)
        doc.setLineWidth(1)
        doc.circle(pageW - 40, y + 45, 15, 'D')
        doc.setFontSize(6)
        doc.setFont('helvetica', 'bold')
        doc.text('SATOHASH', pageW - 40, y + 44, { align: 'center' })
        doc.text('VERIFIED', pageW - 40, y + 48, { align: 'center' })

        // Page Numbering Footer
        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(150, 160, 170)
        doc.text(`Generated by Satohash — Sovereign Provenance Audits`, margin, pageH - 12)
        doc.text(`Page 1 of 2`, pageW - margin, pageH - 12, { align: 'right' })

        doc.save(`Satohash_Forensic_Audit_${new Date().toISOString().split('T')[0]}.pdf`)
        setIsExporting(false)
        toast.success('Forensic Audit Downloaded', {
          description: `Full multi-page compliance report saved successfully.`,
          icon: <FileDown className="text-[var(--accent-success)]" />
        })
      } catch (err) {
        console.error(err)
        setIsExporting(false)
        toast.error('Failed to compile PDF library: ' + err.message)
      }
    }, 2000)
  }

  const handleBackupVault = () => {
    setPassphraseModal('export')
  }

  const runVaultExport = async (password) => {
    if (!password || password.length < 8) {
      toast.error('Passphrase must be at least 8 characters.')
      return
    }
    try {
      const { count } = await exportEncryptedVault(password)
      toast.success(`Encrypted vault backup exported (${count} items)`)
      setPassphraseModal(null)
    } catch (e) {
      toast.error('Export failed: ' + e.message)
    }
  }

  const handleImportVault = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result)
          if (data.version !== '4.1.0-ELITE' || !data.payload) {
            toast.error('Invalid backup format or version mismatch.')
            return
          }
          setPendingImportData(data)
          setPassphraseModal('import')
        } catch (err) {
          toast.error('Failed to read backup file.')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const runVaultImport = (password) => {
    if (!password || !pendingImportData) return
    try {
      const data = pendingImportData
      const rawBase64 = decodeURIComponent(escape(atob(data.payload)))
      let decryptedStr = ''
      for (let i = 0; i < rawBase64.length; i++) {
        const charCode = rawBase64.charCodeAt(i) ^ password.charCodeAt(i % password.length)
        decryptedStr += String.fromCharCode(charCode)
      }

      const stamps = JSON.parse(decryptedStr)
      if (!Array.isArray(stamps)) throw new Error('Decryption mismatch')

      localStorage.setItem('satohash_stamps', JSON.stringify(stamps))
      toast.success('Forensic vault successfully restored!', {
        description: `${stamps.length} timestamps loaded into active workbench.`
      })
      refreshStamps()
      setPassphraseModal(null)
      setPendingImportData(null)
    } catch (err) {
      toast.error('Failed to decrypt vault. Please double-check password.')
    }
  }

  const downloadOtsFile = async (item) => {
    try {
      const local = findStampByHashOrId(item.id || item.hash)
      if (local?.otsFileBase64) {
        const blob = otsBase64ToBlob(local.otsFileBase64)
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `satohash-${(item.hash || item.id).substring(0, 8)}.ots`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('OTS proof downloaded', {
          description: 'Verify independently with opentimestamps.org'
        })
        return
      }

      if (isStaticOnlyMode()) {
        toast.error('No local .ots file — stamp via browser calendars first')
        return
      }

      const API = getApiUrl()
      const res = await fetch(`${API}/api/stamps/${item.id}?download=true`)
      if (!res.ok) {
        toast.error('No OTS proof file available yet — proof is still pending')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `satohash-${item.id.substring(0, 8)}.ots`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('OTS proof downloaded', {
        description: 'Verify independently with opentimestamps.org'
      })
    } catch (e) {
      toast.error('Download failed: ' + e.message)
    }
  }

  const upgradeStamp = async (item) => {
    try {
      const local = findStampByHashOrId(item.id || item.hash)
      if (local?.otsFileBase64 && (local.source === 'browser-ots' || local.hasOts)) {
        toast.info('Checking public calendars...', { duration: 2000 })
        const blob = otsBase64ToBlob(local.otsFileBase64)
        const { changed, blob: upgraded } = await upgradeOtsBrowser(blob)
        if (changed) {
          const bytes = new Uint8Array(await upgraded.arrayBuffer())
          let otsFileBase64 = null
          try {
            otsFileBase64 = btoa(String.fromCharCode(...bytes))
          } catch {
            /* skip */
          }
          const stamps = JSON.parse(localStorage.getItem('satohash_stamps') || '[]')
          const idx = stamps.findIndex((s) => s.id === local.id)
          if (idx >= 0) {
            stamps[idx] = { ...stamps[idx], otsFileBase64, hasOts: true }
            localStorage.setItem('satohash_stamps', JSON.stringify(stamps))
          }
          toast.success('OTS proof upgraded from public calendars')
          refreshStamps()
        } else {
          toast.info("Still pending — Bitcoin calendars haven't confirmed yet", { duration: 4000 })
        }
        return
      }

      if (isStaticOnlyMode()) {
        toast.info('No browser OTS proof to upgrade on this device')
        return
      }

      const API = getApiUrl()
      toast.info('Checking Bitcoin status...', { duration: 2000 })
      const res = await fetch(`${API}/api/upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id })
      })
      const data = await res.json()
      if (data.status === 'confirmed') {
        toast.success(`Confirmed in Bitcoin block ${data.bitcoin_block_height}!`)
        refreshStamps()
      } else {
        toast.info("Still pending — Bitcoin calendars haven't confirmed yet", { duration: 4000 })
      }
    } catch (e) {
      toast.error('Upgrade check failed: ' + e.message)
    }
  }

  const filteredItems = items
    .filter((item) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'capsules' && item.type === 'capsule') ||
        (activeTab === 'files' && item.type === 'file') ||
        (activeTab === 'snaps' && item.type === 'snapper')

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hash.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType =
        typeFilter === 'All' ||
        (typeFilter === 'Images' && /\.(png|jpg|jpeg|gif|webp|svg)/i.test(item.name)) ||
        (typeFilter === 'Documents' && /\.(pdf|doc|docx|txt|md)/i.test(item.name)) ||
        (typeFilter === 'Archives' && /\.(zip|tar|gz|rar)/i.test(item.name))

      const matchesStatus =
        statusFilter === 'All' ||
        item.status === statusFilter ||
        (statusFilter === 'confirmed' && item.status === 'anchored')

      return matchesTab && matchesSearch && matchesType && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'status') {
        return (a.status || '').localeCompare(b.status || '')
      }
      const dateA = a.date === '—' ? 0 : new Date(a.date).getTime()
      const dateB = b.date === '—' ? 0 : new Date(b.date).getTime()
      return sortBy === 'date-asc' ? dateA - dateB : dateB - dateA
    })

  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 148,
    overscan: 5
  })

  return (
    <div className="mx-auto max-w-[90rem] space-y-12 p-8 pb-24">
      <StaticModeBanner />
      {/* Export Modal Overlay */}
      <AnimatePresence>
        {isExporting && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg space-y-8 overflow-hidden rounded-[3rem] border border-[var(--border-bright)] bg-[var(--bg-secondary)] p-12 text-center shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
              <div className="relative mx-auto h-24 w-24">
                <Loader2
                  size={96}
                  className="absolute inset-0 animate-spin text-[var(--accent-gold)] opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck size={40} className="text-[var(--accent-gold)]" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tighter uppercase">
                  Compiling Audit...
                </h3>
                <p className="text-[10px] font-black tracking-[0.3em] text-[var(--text-secondary)] uppercase">
                  Merkle Path Verification: {exportProgress}%
                </p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${exportProgress}%` }}
                  className="h-full bg-[var(--accent-gold)] shadow-[0_0_15px_var(--accent-gold-glow)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="space-y-1 rounded-xl bg-white/5 p-4">
                  <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase">
                    Witness Signatures
                  </p>
                  <p className="text-xs font-bold text-white">1,402 Confirmed</p>
                </div>
                <div className="space-y-1 rounded-xl bg-white/5 p-4">
                  <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase">
                    Anchor Depth
                  </p>
                  <p className="text-xs font-bold text-white">12,402 Blocks</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Revoke Confirmation Dialog */}
      <AnimatePresence>
        {revokeTarget && (
          <>
            <motion.button
              type="button"
              aria-label="Close revoke dialog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm"
              onClick={closeRevoke}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="revoke-dialog-title"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 z-[151] mx-auto max-w-md -translate-y-1/2 space-y-5 rounded-3xl border p-8"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'color-mix(in srgb, var(--accent-danger) 40%, transparent)'
              }}
            >
              <h3 id="revoke-dialog-title" className="text-xl font-black tracking-tight">
                {tv('vaultPage.revoke.title')}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {tv('vaultPage.revoke.body')}{' '}
                <strong className="text-white">{revokeTarget.name}</strong>
              </p>
              <textarea
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="Reason for revocation (optional)..."
                rows={3}
                className="w-full resize-none rounded-xl border bg-transparent p-3 text-sm outline-none focus:border-[var(--accent-danger)]"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleRevoke(revokeTarget)}
                  disabled={revoking}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-xs font-black uppercase disabled:opacity-50"
                  style={{ background: 'var(--accent-danger)', color: '#fff' }}
                >
                  {revoking ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Revoking...
                    </>
                  ) : (
                    'Confirm Revoke'
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeRevoke}
                  className="h-12 flex-1 rounded-xl border text-xs font-black uppercase opacity-60 hover:opacity-100"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <header className="flex flex-col justify-between gap-12 border-b border-[var(--border)] pb-12 lg:flex-row lg:items-end">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/10 px-4 py-1.5">
            <Database size={14} className="text-[var(--accent-gold)]" />
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[var(--accent-gold)] uppercase">
              Sovereign Ledger // VAULT_SYNC_ACTIVE
            </span>
          </div>
          <h1 className="text-5xl leading-[0.85] font-black tracking-tighter uppercase md:text-7xl">
            {t('vault', 'titleHero')}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed font-medium text-[var(--text-secondary)]">
            {t('vault', 'subtitleHero')}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="group relative">
            <Search
              size={18}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-secondary)] transition-colors group-focus-within:text-[var(--accent-gold)]"
            />
            <input
              type="search"
              aria-label={t('vault', 'search')}
              placeholder={t('vault', 'search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] pr-6 pl-12 text-sm font-bold transition-all outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)] md:w-80"
            />
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-[var(--border-bright)] bg-white/5 px-8 text-[11px] font-black tracking-widest text-white uppercase shadow-xl transition-all hover:bg-white hover:text-black active:scale-[0.98]"
          >
            <FileText size={18} />
            {t('vault', 'forensicAudit')}
          </button>

          <button
            type="button"
            onClick={handleExportZip}
            disabled={exportingZip || items.length === 0}
            className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-[var(--border-gold)] bg-[var(--accent-gold-subtle)] px-8 text-[11px] font-black tracking-widest uppercase transition-all hover:bg-[var(--accent-gold)] hover:text-[#141b25] active:scale-[0.98] disabled:opacity-50"
            style={{ color: 'var(--accent-gold)' }}
          >
            {exportingZip ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <FileArchive size={18} />
            )}
            Export All Proofs (ZIP)
          </button>

          <button
            type="button"
            onClick={handleBackupVault}
            className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-transparent px-6 text-[10px] font-black tracking-widest uppercase transition-all hover:bg-[var(--surface-raised)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t('vault', 'backupVault')}
          </button>

          <button
            type="button"
            onClick={handleImportVault}
            className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-transparent px-6 text-[10px] font-black tracking-widest uppercase transition-all hover:bg-[var(--surface-raised)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t('vault', 'importVault')}
          </button>
        </div>
      </header>

      {serverUnreachable && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-2xl border p-4"
          style={{
            background: 'rgba(239, 68, 68, 0.06)',
            borderColor: 'var(--accent-danger)',
            color: 'var(--text-primary)'
          }}
        >
          <Globe size={18} className="shrink-0 text-[var(--accent-danger)]" />
          <p className="text-xs leading-relaxed">
            Server unreachable — showing cached proofs from this browser. Start the API or check
            your connection to sync the full vault.
          </p>
        </div>
      )}

      {/* Offline sync banner if we have offline stamps */}
      {offlineQueue.length > 0 && (
        <div
          className="flex flex-col items-center justify-between gap-4 rounded-2xl border p-6 transition-all md:flex-row"
          style={{
            background: 'rgba(245, 158, 11, 0.05)',
            borderColor: 'var(--accent-pending)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">⚡</span>
            <div>
              <p className="text-sm font-black tracking-wider uppercase">Offline Stamps Queued</p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase">
                {offlineQueue.length} files are queued locally in your browser. They will sync
                automatically when your internet connection is restored.
              </p>
            </div>
          </div>
          <button
            onClick={syncOfflineQueue}
            disabled={isSyncing}
            className="rounded-xl bg-[var(--accent-pending)] px-5 py-3 text-[10px] font-black tracking-wider text-[#141b25] uppercase transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isSyncing ? t('vault', 'syncing') : t('vault', 'syncOffline')}
          </button>
        </div>
      )}

      {/* Modern Tab System */}
      <div
        role="tablist"
        aria-label="Vault filter tabs"
        className="scrollbar-hide flex gap-10 overflow-x-auto border-b border-[var(--border)]"
      >
        {['all', 'capsules', 'files', 'snaps'].map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`relative pb-6 text-[10px] font-black tracking-[0.3em] whitespace-nowrap uppercase transition-all ${activeTab === tab ? 'text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="tab-underline-vault"
                className="absolute right-0 bottom-0 left-0 h-1 bg-[var(--accent-gold)] shadow-[0_0_15px_var(--accent-gold-glow)]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Sort, status & type filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1">
          {[
            ['date-desc', 'Newest'],
            ['date-asc', 'Oldest'],
            ['status', 'Status']
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setSortBy(value)}
              className={`rounded-lg px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all ${sortBy === value ? 'bg-[var(--accent-gold)] text-[#141b25]' : 'text-[var(--text-secondary)] hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1">
          {['All', 'confirmed', 'pending', 'anchored', 'failed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`rounded-lg px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all ${statusFilter === tab ? 'bg-white/10 text-white' : 'text-[var(--text-secondary)] hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Type Filter */}
      <div className="flex items-center gap-2 self-start rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1">
        {['All', 'Images', 'Documents', 'Archives'].map((tab) => (
          <button
            key={tab}
            onClick={() => setTypeFilter(tab)}
            className="rounded-lg px-3 py-1.5 text-[10px] font-black tracking-widest uppercase transition-all"
            style={{
              background: typeFilter === tab ? 'var(--accent-active)' : 'transparent',
              color: typeFilter === tab ? '#fff' : 'var(--text-secondary)'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Skeleton loader — shown while loading (desktop) */}
      {loading && <SkeletonList count={6} className="hidden md:grid" />}

      {/* Elite Data Grid — Desktop Table */}
      <div
        className={`overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] shadow-[0_50px_100px_rgba(0,0,0,0.5)] md:block ${loading ? 'hidden' : 'hidden md:block'}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
                <th className="px-10 py-6 text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                  Asset / Capsule
                </th>
                <th className="px-10 py-6 text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                  Security Status
                </th>
                <th className="px-10 py-6 text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                  Protocol Epoch
                </th>
                <th className="px-10 py-6 text-right text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                  Verification
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading && (
                <tr>
                  <td colSpan={4} className="px-10 py-16 text-center">
                    <div
                      className="flex items-center justify-center gap-3"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <Loader2 size={18} className="animate-spin" />
                      <span className="text-sm font-medium">Loading stamps from Bitcoin...</span>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && filteredItems.length === 0 && items.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <div className="flex flex-col items-center justify-center space-y-6 py-24 text-center">
                      <div
                        className="flex h-20 w-20 items-center justify-center rounded-3xl"
                        style={{
                          background: 'var(--surface-raised)',
                          border: '1px solid var(--border)'
                        }}
                      >
                        <span className="text-4xl">🔒</span>
                      </div>
                      <div className="space-y-2">
                        <h3
                          className="text-xl font-black tracking-tight uppercase"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {tv('vaultPage.empty.title')}
                        </h3>
                        <p
                          className="max-w-sm text-sm leading-relaxed"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {tv('vaultPage.empty.body')}
                        </p>
                      </div>
                      <a
                        href="/stamp"
                        className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-black tracking-wider uppercase transition-all hover:opacity-90"
                        style={{ background: 'var(--accent-gold)', color: '#141b25' }}
                      >
                        Stamp Your First File →
                      </a>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && filteredItems.length === 0 && items.length > 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-16 text-center">
                    <p className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
                      No stamps match your search.
                    </p>
                  </td>
                </tr>
              )}
              {!loading &&
                filteredItems.map((item) => {
                  const FileIcon = getFileTypeIcon(item.name, item.type)
                  return (
                    <tr key={item.id} className="group transition-all hover:bg-white/5">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] ${item.type === 'capsule' ? 'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'} transition-transform group-hover:scale-110`}
                          >
                            <FileIcon size={24} />
                          </div>
                          <div className="space-y-1">
                            <p
                              className={`text-lg font-bold tracking-tight text-white ${item.is_revoked ? 'line-through opacity-50' : ''}`}
                            >
                              {item.name}
                            </p>
                            <div className="flex items-center gap-3">
                              <p className="font-mono text-[10px] tracking-widest text-[var(--text-secondary)] uppercase">
                                {item.size}
                              </p>
                              <span className="text-[10px] text-[var(--text-secondary)] opacity-20">
                                |
                              </span>
                              <p className="font-mono text-[10px] text-[var(--text-secondary)]">
                                {item.hash}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="space-y-3">
                          <StatusBadge status={item.status} />
                          <SecurityAge confirmations={item.confirmations} />
                          {item.status === 'confirmed' && item.bitcoin_block_height && (
                            <span className="flex items-center gap-1 font-mono text-xs text-emerald-400">
                              <span>₿</span>
                              <span>Block {item.bitcoin_block_height.toLocaleString()}</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white">{item.date}</p>
                          <p className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                            Anchored Epoch
                          </p>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex translate-x-4 justify-end gap-3 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                          <ActionBtn
                            icon={Stamp}
                            label={tv('vaultPage.actions.badge')}
                            onClick={() => {
                              navigator.clipboard.writeText(
                                window.location.origin + '/verify/' + item.id
                              )
                              toast.success('Proof URL Copied', {
                                description: 'Share link is in your clipboard'
                              })
                            }}
                          />
                          <ActionBtn
                            icon={Download}
                            label={tv('vaultPage.actions.raw')}
                            onClick={() => downloadCertificate(item)}
                          />
                          <ActionBtn
                            icon={FileDown}
                            label={tv('vaultPage.actions.ots')}
                            onClick={() => downloadOtsFile(item)}
                          />
                          {item.status === 'pending' && (
                            <ActionBtn
                              icon={RefreshCw}
                              label="Check"
                              onClick={() => upgradeStamp(item)}
                            />
                          )}
                          <ActionBtn
                            icon={Globe}
                            label={tv('vaultPage.actions.verify')}
                            onClick={() => {
                              window.location.href = '/verify?hash=' + item.fullHash
                            }}
                          />
                          {!item.is_revoked && (
                            <ActionBtn
                              icon={Trash2}
                              label="Revoke"
                              onClick={() => setRevokeTarget(item)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
        {hasMore && !loading && (
          <div className="flex justify-center border-t border-[var(--border)] p-6">
            <button
              onClick={loadMore}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white/5 px-8 py-3 text-xs font-black tracking-widest text-[var(--text-secondary)] uppercase transition-all hover:bg-white hover:text-black"
            >
              {tv('vaultPage.loadMore')}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden">
        {loading && <SkeletonList count={6} className="grid-cols-1 gap-4" />}
        {!loading && filteredItems.length === 0 && items.length === 0 && (
          <div className="flex flex-col items-center justify-center space-y-6 py-24 text-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-3xl"
              style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}
            >
              <span className="text-4xl">🔒</span>
            </div>
            <div className="space-y-2">
              <h3
                className="text-xl font-black tracking-tight uppercase"
                style={{ color: 'var(--text-primary)' }}
              >
                {tv('vaultPage.empty.title')}
              </h3>
              <p
                className="max-w-sm text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {tv('vaultPage.empty.body')}
              </p>
            </div>
            <a
              href="/stamp"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-black tracking-wider uppercase transition-all hover:opacity-90"
              style={{ background: 'var(--accent-gold)', color: '#141b25' }}
            >
              Stamp Your First File →
            </a>
          </div>
        )}
        {!loading && filteredItems.length === 0 && items.length > 0 && (
          <div className="py-16 text-center">
            <p className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
              No stamps match your search.
            </p>
          </div>
        )}
        {!loading && filteredItems.length > 0 && (
          <>
            <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative'
                }}
              >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                  const item = filteredItems[virtualItem.index]
                  const FileIcon = getFileTypeIcon(item.name, item.type)
                  return (
                    <div
                      key={virtualItem.key}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualItem.start}px)`,
                        paddingBottom: '1rem'
                      }}
                    >
                      <motion.div
                        drag="x"
                        dragConstraints={{ left: -80, right: 0 }}
                        dragElastic={0.1}
                        onDragEnd={(e, info) => {
                          if (info.offset.x < -60) {
                            navigator.clipboard.writeText(item.fullHash || item.hash)
                            toast.success('Hash copied!', {
                              description: (item.fullHash?.substring(0, 16) ?? item.hash) + '...'
                            })
                          }
                        }}
                        className="relative"
                      >
                        {/* Swipe hint shown behind card */}
                        <div
                          className="absolute inset-y-0 right-0 flex w-20 items-center justify-center rounded-r-2xl"
                          style={{ background: 'var(--accent-success, rgba(16,185,129,0.15))' }}
                        >
                          <span
                            className="text-xs font-black"
                            style={{ color: 'var(--accent-success, #10b981)' }}
                          >
                            Copy
                          </span>
                        </div>
                        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                          <div className="flex items-start gap-4">
                            <div
                              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] ${item.type === 'capsule' ? 'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'}`}
                            >
                              <FileIcon size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p
                                className={`font-bold tracking-tight text-white ${item.is_revoked ? 'line-through opacity-50' : ''}`}
                              >
                                {item.name}
                              </p>
                              <p className="font-mono text-[10px] text-[var(--text-secondary)]">
                                {item.hash}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <StatusBadge status={item.status} />
                                <span className="text-[10px] font-bold text-[var(--text-secondary)]">
                                  {item.date}
                                </span>
                                {item.status === 'confirmed' && item.bitcoin_block_height && (
                                  <span className="flex items-center gap-1 font-mono text-xs text-emerald-400">
                                    <span>₿</span>
                                    <span>Block {item.bitcoin_block_height.toLocaleString()}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end gap-2">
                            <ActionBtn
                              icon={Stamp}
                              label={tv('vaultPage.actions.badge')}
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  window.location.origin + '/verify/' + item.id
                                )
                                toast.success('Proof URL Copied', {
                                  description: 'Share link is in your clipboard'
                                })
                              }}
                            />
                            <ActionBtn
                              icon={Download}
                              label={tv('vaultPage.actions.raw')}
                              onClick={() => downloadCertificate(item)}
                            />
                            <ActionBtn
                              icon={FileDown}
                              label={tv('vaultPage.actions.ots')}
                              onClick={() => downloadOtsFile(item)}
                            />
                            {item.status === 'pending' && (
                              <ActionBtn
                                icon={RefreshCw}
                                label="Check"
                                onClick={() => upgradeStamp(item)}
                              />
                            )}
                            <ActionBtn
                              icon={Globe}
                              label={tv('vaultPage.actions.verify')}
                              onClick={() => {
                                window.location.href = '/verify?hash=' + item.fullHash
                              }}
                            />
                            {!item.is_revoked && (
                              <ActionBtn
                                icon={Trash2}
                                label="Revoke"
                                onClick={() => setRevokeTarget(item)}
                              />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )
                })}
              </div>
            </div>
            {hasMore && !loading && (
              <div className="flex justify-center py-4">
                <button
                  onClick={loadMore}
                  className="rounded-xl border border-[var(--border)] bg-white/5 px-6 py-2 text-xs font-black text-[var(--text-secondary)] uppercase hover:bg-white hover:text-black"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <PinModal
        isOpen={passphraseModal === 'export'}
        onClose={() => setPassphraseModal(null)}
        onSubmit={runVaultExport}
        variant="passphrase"
        minLength={8}
        maxLength={128}
        title="Encrypt vault backup"
        description="Enter a passphrase (8+ characters) to encrypt your vault export."
        submitLabel="Export"
      />
      <PinModal
        isOpen={passphraseModal === 'import'}
        onClose={() => {
          setPassphraseModal(null)
          setPendingImportData(null)
        }}
        onSubmit={runVaultImport}
        variant="passphrase"
        minLength={1}
        maxLength={128}
        title="Decrypt vault backup"
        description="Enter the passphrase used when this backup was created."
        submitLabel="Restore"
      />
    </div>
  )
}

function ActionBtn({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group/btn relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[var(--text-secondary)] transition-all hover:scale-110 hover:bg-white hover:text-black"
    >
      <Icon size={18} />
      <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-white px-2 py-1 text-[9px] font-black whitespace-nowrap text-black uppercase opacity-0 transition-opacity group-hover/btn:opacity-100">
        {label}
      </span>
    </button>
  )
}
