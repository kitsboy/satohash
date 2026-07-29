import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import Footer from '../../components/layout/Footer'
import usePageMeta from '../../hooks/usePageMeta'
import { parseHashLines } from '../../utils/hashUtils'
import { clientId } from '../../utils/id'
import { upsertLocalStamp } from '../../utils/vaultLocal'
import StaticModeBanner from '../../components/shared/StaticModeBanner'

function parseCsvHashes(text) {
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (!lines.length) return []
  const start = lines[0].toLowerCase().includes('hash') ? 1 : 0
  const hashes = []
  for (let i = start; i < lines.length; i++) {
    const col = lines[i].split(',')[0]?.trim()
    if (col && /^[a-f0-9]{64}$/i.test(col)) hashes.push(col.toLowerCase())
  }
  return hashes
}

export default function BatchHashStamp() {
  usePageMeta({ page: 'batchHash' })
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [rows, setRows] = useState([])
  const fileRef = useRef(null)

  const saveHashes = (hashes) => {
    if (!hashes.length) {
      toast.error(t('motopassVerifyPage.toastNeedHash'))
      return
    }
    const stamped = hashes.map((hash) => ({
      id: clientId('batch'),
      hash,
      filename: `batch-${hash.slice(0, 8)}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      source: 'batch-hash'
    }))
    stamped.forEach((r) => upsertLocalStamp(r))
    setRows(stamped)
    toast.success(`${stamped.length} hashes saved to vault`)
  }

  const process = () => saveHashes(parseHashLines(input))

  const importCsv = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const hashes = parseCsvHashes(String(e.target.result || ''))
      if (!hashes.length) {
        toast.error('No valid hashes in CSV')
        return
      }
      setInput(hashes.join('\n'))
      saveHashes(hashes)
    }
    reader.readAsText(file)
  }

  const exportCsv = () => {
    const csv = [
      'hash,id,verify_url',
      ...rows.map((r) => `${r.hash},${r.id},${window.location.origin}/verify/${r.hash}`)
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'satohash-batch-hashes.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <header className="border-b px-6 py-4" style={{ borderColor: 'var(--border)' }}>
        <Link
          to="/government"
          className="text-sm font-bold"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('governmentPage.backGovernment')}
        </Link>
      </header>
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-12">
        <StaticModeBanner compact />
        <h1 className="text-3xl font-black">{t('batchHashPage.title')}</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {t('batchHashPage.subtitle')}
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          className="w-full rounded-2xl border p-4 font-mono text-xs"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
          placeholder={t('batchHashPage.placeholder')}
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={process}
            className="rounded-xl px-6 py-3 text-xs font-black uppercase"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            {t('batchHashPage.register')}
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-xl border px-6 py-3 text-xs font-black uppercase"
            style={{ borderColor: 'var(--border)' }}
          >
            {t('batchHashPage.importCsv')}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) importCsv(f)
              e.target.value = ''
            }}
          />
          {rows.length > 0 && (
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-xl border px-6 py-3 text-xs font-black uppercase"
              style={{ borderColor: 'var(--border)' }}
            >
              {t('batchHashPage.exportCsv')}
            </button>
          )}
        </div>
        {rows.length > 0 && (
          <p className="text-xs" style={{ color: 'var(--accent-success)' }}>
            {rows.length} hashes in vault —{' '}
            <Link to="/vault" className="underline">
              open vault
            </Link>
          </p>
        )}
      </div>
      <Footer />
    </div>
  )
}
