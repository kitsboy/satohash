/**
 * Satohash v5.0.0-ELITE — Sovereignty Ascension frontend surfaces
 * Consolidated pages for new routes (lazy-friendly single module).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { getApiUrl } from '../../config/constants'

const API = () => getApiUrl() || 'https://api.satohash.io'

function Shell({ title, children, subtitle }) {
  return (
    <div className="min-h-screen bg-[var(--void,#0a0c10)] text-[var(--ink,#e8e6e1)]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Link to="/" className="text-xs text-amber-500/80 hover:text-amber-400">
          ← Satohash
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm opacity-70">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  )
}

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-lg border border-white/10 bg-white/5 p-4 ${className}`}>
      {children}
    </div>
  )
}

/** 22 — Proof of existence explorer */
export function ProofOfExistencePage() {
  const [hash, setHash] = useState('')
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    setErr(null)
    setData(null)
    try {
      const h = hash.trim().toLowerCase()
      const res = await fetch(`${API()}/api/stamps/${h}/by-hash`)
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || res.statusText)
      setData(j)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Shell
      title="Proof of Existence"
      subtitle="Enter a SHA-256 hash to walk the OTS proof chain and custody timeline."
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className="flex-1 rounded border border-white/15 bg-black/40 px-3 py-2 font-mono text-sm"
          placeholder="64-char hex hash"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
        />
        <button
          type="button"
          onClick={run}
          disabled={loading || hash.length < 64}
          className="rounded bg-amber-600 px-4 py-2 font-semibold text-black hover:bg-amber-500 disabled:opacity-40"
        >
          {loading ? '…' : 'Trace'}
        </button>
      </div>
      {err && <p className="mt-4 text-sm text-red-400">{err}</p>}
      {data && (
        <div className="mt-6 space-y-3">
          {(data.stamps || []).map((s) => (
            <Card key={s.id}>
              <div className="font-mono text-xs break-all opacity-80">{s.hash}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-sm">
                <span className="rounded bg-white/10 px-2 py-0.5">{s.status}</span>
                <span>{s.created_at}</span>
                {s.bitcoin_block_height != null && <span>block {s.bitcoin_block_height}</span>}
              </div>
              <Link className="mt-2 inline-block text-sm text-amber-400" to={`/verify/${s.id}`}>
                Open verify →
              </Link>
            </Card>
          ))}
        </div>
      )}
    </Shell>
  )
}

/** 23 — Network dashboard */
export function NetworkPage() {
  const [stats, setStats] = useState(null)
  const [net, setNet] = useState(null)
  const [cals, setCals] = useState(null)
  const [recent, setRecent] = useState([])

  useEffect(() => {
    const base = API()
    Promise.all([
      fetch(`${base}/api/public/stats`)
        .then((r) => r.json())
        .catch(() => null),
      fetch(`${base}/api/public/network`)
        .then((r) => r.json())
        .catch(() => null),
      fetch(`${base}/api/public/calendar-status`)
        .then((r) => r.json())
        .catch(() => null),
      fetch(`${base}/api/stamps/recent`)
        .then((r) => r.json())
        .catch(() => null)
    ]).then(([s, n, c, rec]) => {
      setStats(s)
      setNet(n)
      setCals(c)
      setRecent(rec?.stamps || [])
    })
  }, [])

  const pins = useMemo(
    () => [
      { id: 'motopass', x: 22, y: 40 },
      { id: 'katoa', x: 48, y: 55 },
      { id: 'giveabit', x: 35, y: 28 },
      { id: 'tadbuy', x: 70, y: 42 },
      { id: 'stranded', x: 60, y: 70 }
    ],
    []
  )

  return (
    <Shell title="Network" subtitle="Live proof plane: stamps, calendars, Bitcoin fees.">
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Card>
          <div className="text-xs opacity-60">24h stamps</div>
          <div className="text-2xl font-bold">{stats?.stamps_created ?? '—'}</div>
        </Card>
        <Card>
          <div className="text-xs opacity-60">Block height</div>
          <div className="text-2xl font-bold">{net?.block_height ?? '—'}</div>
        </Card>
        <Card>
          <div className="text-xs opacity-60">Fastest fee</div>
          <div className="text-2xl font-bold">{net?.fees?.fastestFee ?? '—'} sat/vB</div>
        </Card>
      </div>
      <Card className="relative mb-6 h-48 overflow-hidden">
        <div className="mb-2 text-xs opacity-60">Client pins (suite)</div>
        <div className="absolute inset-6 rounded border border-dashed border-white/10">
          {pins.map((p) => (
            <div
              key={p.id}
              className="absolute h-2.5 w-2.5 rounded-full bg-amber-500 shadow"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              title={p.id}
            />
          ))}
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 font-semibold">OTS calendars</h3>
          <ul className="space-y-1 font-mono text-xs">
            {(cals?.calendars || []).map((c) => (
              <li key={c.url} className="flex justify-between gap-2">
                <span className="truncate opacity-70">{c.url.replace('https://', '')}</span>
                <span className={c.ok ? 'text-green-400' : 'text-red-400'}>
                  {c.ok ? `${c.response_time_ms}ms` : 'down'}
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="mb-2 font-semibold">Recent stamps</h3>
          <ul className="max-h-48 space-y-1 overflow-auto font-mono text-xs">
            {recent.map((s) => (
              <li key={s.id} className="flex justify-between gap-2">
                <span className="truncate">{s.hash?.slice(0, 16)}…</span>
                <span>{s.status}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Shell>
  )
}

/** 27 — Batch verify */
export function BatchVerifyPage() {
  const [text, setText] = useState('')
  const [rows, setRows] = useState([])
  const [busy, setBusy] = useState(false)

  const run = async () => {
    const hashes = text
      .split(/[\s,]+/)
      .map((h) => h.trim().toLowerCase())
      .filter((h) => /^[a-f0-9]{64}$/.test(h))
      .slice(0, 50)
    setBusy(true)
    const out = []
    for (const h of hashes) {
      try {
        const res = await fetch(`${API()}/api/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hash: h })
        })
        const j = await res.json()
        out.push({
          hash: h,
          ok: res.ok && (j.verified || j.status === 'confirmed'),
          status: j.status || j.error || res.status
        })
      } catch (e) {
        out.push({ hash: h, ok: false, status: e.message })
      }
    }
    setRows(out)
    setBusy(false)
  }

  const csv = () => {
    const body = ['hash,status,ok', ...rows.map((r) => `${r.hash},${r.status},${r.ok}`)].join('\n')
    const blob = new Blob([body], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'satohash-batch-verify.csv'
    a.click()
  }

  return (
    <Shell title="Batch Verify" subtitle="Paste up to 50 hashes. Export results as CSV.">
      <textarea
        className="h-40 w-full rounded border border-white/15 bg-black/40 p-3 font-mono text-xs"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="one hash per line"
      />
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={run}
          disabled={busy}
          className="rounded bg-amber-600 px-4 py-2 font-semibold text-black"
        >
          {busy ? 'Verifying…' : 'Verify all'}
        </button>
        {rows.length > 0 && (
          <button type="button" onClick={csv} className="rounded border border-white/20 px-4 py-2">
            Export CSV
          </button>
        )}
      </div>
      {rows.length > 0 && (
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="text-left opacity-60">
              <th className="py-1">Status</th>
              <th>Hash</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.hash} className="border-t border-white/10 font-mono text-xs">
                <td className="py-2">{r.ok ? '🟢' : '🔴'}</td>
                <td className="max-w-[12rem] truncate">{r.hash.slice(0, 20)}…</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Shell>
  )
}

/** 29 — Live stamp feed (SSE) */
export function StampLiveFeedPage() {
  const [items, setItems] = useState([])
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)
  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    const es = new EventSource(`${API()}/api/events/stamps`)
    es.onmessage = (ev) => {
      if (pausedRef.current) return
      try {
        const j = JSON.parse(ev.data)
        if (j.stamps) setItems(j.stamps)
      } catch {
        /* ignore */
      }
    }
    return () => es.close()
  }, [])

  return (
    <Shell title="Live stamp feed" subtitle="Server-Sent Events from the proof plane.">
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="mb-4 rounded border border-white/20 px-3 py-1.5 text-sm"
      >
        {paused ? 'Resume' : 'Pause'}
      </button>
      <ul className="max-h-[60vh] space-y-2 overflow-auto font-mono text-xs">
        {items.map((s) => (
          <li key={s.id} className="flex justify-between gap-2 rounded border border-white/10 p-2">
            <span className="truncate">{s.hash}</span>
            <span>{s.status}</span>
          </li>
        ))}
      </ul>
    </Shell>
  )
}

/** 33 — Compare two hashes */
export function CompareProofsPage() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [left, setLeft] = useState(null)
  const [right, setRight] = useState(null)

  const load = async () => {
    const fetchOne = async (h) => {
      const res = await fetch(`${API()}/api/stamps/${h.trim().toLowerCase()}/by-hash`)
      return res.json()
    }
    setLeft(await fetchOne(a).catch((e) => ({ error: e.message })))
    setRight(await fetchOne(b).catch((e) => ({ error: e.message })))
  }

  return (
    <Shell title="Compare proofs" subtitle="Side-by-side proof chains for two hashes.">
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          className="rounded border border-white/15 bg-black/40 px-3 py-2 font-mono text-xs"
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="Hash A"
        />
        <input
          className="rounded border border-white/15 bg-black/40 px-3 py-2 font-mono text-xs"
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="Hash B"
        />
      </div>
      <button
        type="button"
        onClick={load}
        className="mt-3 rounded bg-amber-600 px-4 py-2 font-semibold text-black"
      >
        Compare
      </button>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <pre className="overflow-auto text-xs whitespace-pre-wrap">
            {JSON.stringify(left, null, 2)}
          </pre>
        </Card>
        <Card>
          <pre className="overflow-auto text-xs whitespace-pre-wrap">
            {JSON.stringify(right, null, 2)}
          </pre>
        </Card>
      </div>
    </Shell>
  )
}

/** 36 — API playground */
export function DeveloperPlaygroundPage() {
  const [spec, setSpec] = useState(null)
  const [path, setPath] = useState('/api/public/status')
  const [out, setOut] = useState('')

  useEffect(() => {
    fetch(`${API()}/api/openapi.json`)
      .then((r) => r.json())
      .then(setSpec)
      .catch((e) => setSpec({ error: e.message }))
  }, [])

  const tryIt = async () => {
    try {
      const res = await fetch(`${API()}${path}`)
      const t = await res.text()
      setOut(`${res.status}\n${t.slice(0, 4000)}`)
    } catch (e) {
      setOut(e.message)
    }
  }

  return (
    <Shell title="API Playground" subtitle="Try public endpoints against the live proof plane.">
      <Card className="mb-4">
        <div className="mb-1 text-xs opacity-60">OpenAPI paths</div>
        <pre className="max-h-32 overflow-auto text-xs">
          {JSON.stringify(spec?.paths || spec, null, 2)}
        </pre>
      </Card>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded border border-white/15 bg-black/40 px-3 py-2 font-mono text-sm"
          value={path}
          onChange={(e) => setPath(e.target.value)}
        />
        <button
          type="button"
          onClick={tryIt}
          className="rounded bg-amber-600 px-4 py-2 font-semibold text-black"
        >
          Try
        </button>
      </div>
      <pre className="mt-4 max-h-80 overflow-auto rounded border border-white/10 bg-black/40 p-3 text-xs">
        {out}
      </pre>
    </Shell>
  )
}

/** 50 — Bitcoin education */
export function BitcoinExplainPage() {
  return (
    <Shell
      title="Bitcoin timestamps"
      subtitle="How OpenTimestamps locks a document fingerprint into Bitcoin without uploading the file."
    >
      <div className="prose prose-invert max-w-none space-y-4 text-sm opacity-90">
        <p>
          Satohash hashes your file in the browser (SHA-256). Only the hash is submitted to public
          OTS calendars, which aggregate many hashes into a Merkle tree and eventually anchor into a
          Bitcoin transaction.
        </p>
        <p>
          Verification re-checks the Merkle path and Bitcoin block inclusion. Your original file
          never needs to leave the device for hashing. The API stores proof metadata so family apps
          can share vault history.
        </p>
        <Card>
          <div className="py-6 text-center font-mono text-xs">
            file → SHA-256 → OTS calendars → Merkle root → Bitcoin block
          </div>
        </Card>
        <Link to="/network" className="text-amber-400">
          Open live network dashboard →
        </Link>
      </div>
    </Shell>
  )
}

/** 52 — Block explorer lite */
export function BlockPage() {
  const { height } = useParams()
  const [info, setInfo] = useState(null)
  useEffect(() => {
    if (!height) return
    fetch(`https://mempool.space/api/block-height/${height}`)
      .then((r) => r.text())
      .then(async (hash) => {
        const b = await fetch(`https://mempool.space/api/block/${hash}`).then((r) => r.json())
        setInfo(b)
      })
      .catch((e) => setInfo({ error: e.message }))
  }, [height])
  return (
    <Shell title={`Block ${height || ''}`} subtitle="Block metadata via mempool.space (public).">
      <pre className="overflow-auto rounded border border-white/10 bg-black/40 p-3 text-xs">
        {JSON.stringify(info, null, 2)}
      </pre>
    </Shell>
  )
}

/** 63 — Cross-chain verify */
export function CrossChainVerifyPage() {
  const [id, setId] = useState('')
  const [data, setData] = useState(null)
  const run = async () => {
    const res = await fetch(`${API()}/api/stamps/${id}/chains`)
    setData(await res.json())
  }
  return (
    <Shell title="Cross-chain verify" subtitle="Bitcoin OTS + bridge stubs + Nostr event id.">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded border border-white/15 bg-black/40 px-3 py-2 font-mono text-sm"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="stamp id"
        />
        <button
          type="button"
          onClick={run}
          className="rounded bg-amber-600 px-4 py-2 font-semibold text-black"
        >
          Check
        </button>
      </div>
      {data && (
        <div className="mt-6 grid gap-2">
          <Card>
            Bitcoin OTS: {data.bitcoin?.status === 'confirmed' ? '✅' : '⏳'} {data.bitcoin?.status}
          </Card>
          <Card>Bridges: {(data.bridges || []).length || 0}</Card>
          <Card>Nostr: {data.nostr_event_id ? '✅' : '—'}</Card>
          <pre className="overflow-auto text-xs">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </Shell>
  )
}

/** 73 / 76 / 79 AI Notary hub — live against API (key stays server-side) */
export function AiHubPage() {
  const [templateId, setTemplateId] = useState('nda')
  const [templateContent, setTemplateContent] = useState('')
  const [suggestOut, setSuggestOut] = useState(null)
  const [suggestErr, setSuggestErr] = useState(null)
  const [suggestLoading, setSuggestLoading] = useState(false)

  const [doc, setDoc] = useState('')
  const [standard, setStandard] = useState('GDPR')
  const [complianceOut, setComplianceOut] = useState(null)
  const [complianceErr, setComplianceErr] = useState(null)
  const [complianceLoading, setComplianceLoading] = useState(false)

  const [searchQ, setSearchQ] = useState('')
  const [searchHits, setSearchHits] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchErr, setSearchErr] = useState(null)

  const runSuggest = async () => {
    setSuggestLoading(true)
    setSuggestErr(null)
    setSuggestOut(null)
    try {
      const res = await fetch(`${API()}/api/templates/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: templateId.trim() || 'nda',
          content: templateContent,
          fields: {}
        })
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || res.statusText)
      setSuggestOut(j)
    } catch (e) {
      setSuggestErr(e.message || String(e))
    } finally {
      setSuggestLoading(false)
    }
  }

  const runCompliance = async () => {
    setComplianceLoading(true)
    setComplianceErr(null)
    setComplianceOut(null)
    try {
      const res = await fetch(`${API()}/api/compliance-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document: doc, standard })
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || res.statusText)
      setComplianceOut(j)
    } catch (e) {
      setComplianceErr(e.message || String(e))
    } finally {
      setComplianceLoading(false)
    }
  }

  const runSearch = async () => {
    setSearchLoading(true)
    setSearchErr(null)
    setSearchHits([])
    try {
      const q = searchQ.trim().toLowerCase()
      if (!q) throw new Error('Enter a hash fragment, id, or filename keyword')
      // Prefer exact-by-hash when query looks like sha256; else scan recent list client-side
      if (/^[a-f0-9]{64}$/.test(q)) {
        const res = await fetch(`${API()}/api/stamps/${q}/by-hash`)
        const j = await res.json()
        if (!res.ok) throw new Error(j.error || res.statusText)
        setSearchHits(j.stamps || (j.id ? [j] : []))
      } else {
        const res = await fetch(`${API()}/api/stamps/recent?limit=100`)
        const j = await res.json()
        if (!res.ok) throw new Error(j.error || res.statusText)
        const stamps = j.stamps || []
        setSearchHits(
          stamps.filter((s) => {
            const blob =
              `${s.id || ''} ${s.hash || ''} ${s.filename || ''} ${s.client || ''} ${s.ai_summary || ''}`.toLowerCase()
            return blob.includes(q)
          })
        )
      }
    } catch (e) {
      setSearchErr(e.message || String(e))
    } finally {
      setSearchLoading(false)
    }
  }

  return (
    <Shell
      title="AI Notary"
      subtitle="Calls the proof API only. Anthropic keys stay on the API host — never in this SPA."
    >
      <div className="grid gap-4">
        <Card>
          <h3 className="font-semibold">Template suggestions</h3>
          <p className="mt-1 text-sm opacity-70">
            POST /api/templates/suggest — fills notary placeholders (mock or Claude when key set).
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-[140px_1fr]">
            <input
              className="rounded border border-white/15 bg-black/40 px-3 py-2 font-mono text-sm"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              placeholder="templateId"
            />
            <textarea
              className="min-h-[72px] rounded border border-white/15 bg-black/40 px-3 py-2 text-sm"
              value={templateContent}
              onChange={(e) => setTemplateContent(e.target.value)}
              placeholder="Optional draft content / fields context"
            />
          </div>
          <button
            type="button"
            onClick={runSuggest}
            disabled={suggestLoading}
            className="mt-3 rounded bg-amber-600 px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
          >
            {suggestLoading ? 'Suggesting…' : 'Suggest fields'}
          </button>
          {suggestErr && <p className="mt-2 text-sm text-red-400">{suggestErr}</p>}
          {suggestOut && (
            <pre className="mt-3 max-h-64 overflow-auto rounded bg-black/50 p-3 text-xs">
              {JSON.stringify(suggestOut, null, 2)}
            </pre>
          )}
        </Card>

        <Card>
          <h3 className="font-semibold">Compliance scan</h3>
          <p className="mt-1 text-sm opacity-70">
            POST /api/compliance-check — GDPR/SOX flags (requires ANTHROPIC_API_KEY on API).
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <select
              className="rounded border border-white/15 bg-black/40 px-3 py-2 text-sm"
              value={standard}
              onChange={(e) => setStandard(e.target.value)}
            >
              <option value="GDPR">GDPR</option>
              <option value="SOX">SOX</option>
            </select>
          </div>
          <textarea
            className="mt-2 min-h-[100px] w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm"
            value={doc}
            onChange={(e) => setDoc(e.target.value)}
            placeholder="Paste document text to scan…"
          />
          <button
            type="button"
            onClick={runCompliance}
            disabled={complianceLoading || !doc.trim()}
            className="mt-3 rounded bg-amber-600 px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
          >
            {complianceLoading ? 'Scanning…' : 'Scan document'}
          </button>
          {complianceErr && <p className="mt-2 text-sm text-red-400">{complianceErr}</p>}
          {complianceOut && (
            <pre className="mt-3 max-h-64 overflow-auto rounded bg-black/50 p-3 text-xs">
              {JSON.stringify(complianceOut, null, 2)}
            </pre>
          )}
        </Card>

        <Card>
          <h3 className="font-semibold">Proof search</h3>
          <p className="mt-1 text-sm opacity-70">
            Full SHA-256 → by-hash. Otherwise filters recent stamps by id/hash/filename/ai_summary.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              className="flex-1 rounded border border-white/15 bg-black/40 px-3 py-2 font-mono text-sm"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="hash, id fragment, or filename"
            />
            <button
              type="button"
              onClick={runSearch}
              disabled={searchLoading}
              className="rounded bg-amber-600 px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
            >
              {searchLoading ? '…' : 'Search'}
            </button>
          </div>
          {searchErr && <p className="mt-2 text-sm text-red-400">{searchErr}</p>}
          {searchHits.length > 0 && (
            <ul className="mt-3 space-y-2 font-mono text-xs">
              {searchHits.slice(0, 20).map((s) => (
                <li key={s.id || s.hash} className="rounded border border-white/10 px-3 py-2">
                  <div className="opacity-50">{s.created_at || s.status}</div>
                  <div className="truncate">{s.hash || s.id}</div>
                  {s.filename && <div className="opacity-70">{s.filename}</div>}
                </li>
              ))}
            </ul>
          )}
          {!searchLoading && searchHits.length === 0 && searchQ && !searchErr && (
            <p className="mt-2 text-sm opacity-60">No matches in recent window.</p>
          )}
        </Card>

        <Card className="text-sm opacity-70">
          <p>
            <strong className="text-[var(--ink,#e8e6e1)]">Ops notes:</strong> paywall (
            <code className="text-xs">REQUIRE_LIGHTNING</code>) and{' '}
            <code className="text-xs">BITCOIN_RPC_URL</code> are THOR env — leave free-tier off
            until Cam flips the switch. Vault v2 (export/import, forensic, revoke) lives at{' '}
            <Link to="/vault" className="text-amber-500/90 hover:text-amber-400">
              /vault
            </Link>
            .
          </p>
        </Card>
      </div>
    </Shell>
  )
}

export function ProofWallPage() {
  const [stamps, setStamps] = useState([])
  useEffect(() => {
    fetch(`${API()}/api/stamps/recent`)
      .then((r) => r.json())
      .then((j) => setStamps(j.stamps || []))
      .catch(() => {})
  }, [])
  return (
    <Shell title="Proof wall" subtitle="Public gallery of recent notarizations (hash only).">
      <div className="grid gap-2 sm:grid-cols-2">
        {stamps.map((s) => (
          <Card key={s.id} className="font-mono text-xs">
            <div className="opacity-50">{s.created_at}</div>
            <div className="mt-1 truncate">{s.hash}</div>
            <div className="mt-1">{s.status === 'confirmed' ? '● confirmed' : '○ pending'}</div>
          </Card>
        ))}
      </div>
    </Shell>
  )
}

export function LeaderboardPage() {
  const [rows, setRows] = useState([])
  useEffect(() => {
    fetch(`${API()}/api/stamps?limit=100`)
      .then((r) => r.json())
      .then((j) => {
        const map = {}
        for (const s of j.stamps || []) {
          const k = (s.client || 'anon').slice(0, 12)
          map[k] = (map[k] || 0) + 1
        }
        setRows(
          Object.entries(map)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
        )
      })
      .catch(() => {})
  }, [])
  return (
    <Shell
      title="Leaderboard"
      subtitle="Anonymized client prefixes by stamp count (sample window)."
    >
      <ol className="space-y-2">
        {rows.map(([k, n], i) => (
          <li
            key={k}
            className="flex justify-between rounded border border-white/10 px-3 py-2 text-sm"
          >
            <span>
              #{i + 1} {k}
            </span>
            <span className="font-mono">{n}</span>
          </li>
        ))}
      </ol>
    </Shell>
  )
}

/** 26 — embeddable proof widget */
export function ProofWidgetPage() {
  const { hash } = useParams()
  const [status, setStatus] = useState('…')
  useEffect(() => {
    if (!hash) return
    fetch(`${API()}/api/stamps/${hash}/by-hash`)
      .then((r) => r.json())
      .then((j) => setStatus(j.stamps?.[0]?.status || 'not_found'))
      .catch(() => setStatus('offline'))
  }, [hash])
  return (
    <div className="min-h-[120px] bg-[#0a0c10] p-3 font-sans text-sm text-[#e8e6e1]">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-amber-500">Satohash</span>
        <span className="rounded bg-white/10 px-2 py-0.5 text-xs">{status}</span>
      </div>
      <div className="mt-2 font-mono text-[10px] break-all opacity-70">{hash}</div>
      <a
        className="mt-3 inline-block text-xs text-amber-400"
        href={`https://satohash.io/verify/${hash}`}
        target="_blank"
        rel="noreferrer"
      >
        Verify →
      </a>
    </div>
  )
}

/** 39 — printable report */
export function StampReportPage() {
  const { id } = useParams()
  const [pkg, setPkg] = useState(null)
  useEffect(() => {
    fetch(`${API()}/api/stamps/${id}/proof-package`)
      .then((r) => r.json())
      .then(setPkg)
      .catch((e) => setPkg({ error: e.message }))
  }, [id])
  return (
    <div className="mx-auto min-h-screen max-w-3xl bg-white p-8 text-black print:p-0">
      <style>{`@media print { .no-print { display: none } }`}</style>
      <button
        type="button"
        className="no-print mb-4 text-sm underline"
        onClick={() => window.print()}
      >
        Print
      </button>
      <h1 className="text-2xl font-bold">Satohash Proof Report</h1>
      <p className="text-sm opacity-70">Chain of custody package</p>
      <pre className="mt-6 border p-4 text-xs whitespace-pre-wrap">
        {JSON.stringify(pkg, null, 2)}
      </pre>
    </div>
  )
}

/** 34 — Wizard pro (compact) */
export function StampWizardProPage() {
  const [step, setStep] = useState(1)
  const [hash, setHash] = useState('')
  const [fileName, setFileName] = useState('')
  const [result, setResult] = useState(null)

  const onFile = async (file) => {
    setFileName(file.name)
    const buf = await file.arrayBuffer()
    const dig = await crypto.subtle.digest('SHA-256', buf)
    const h = [...new Uint8Array(dig)].map((b) => b.toString(16).padStart(2, '0')).join('')
    setHash(h)
    setStep(2)
  }

  const stamp = async () => {
    const res = await fetch(`${API()}/api/stamp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Satohash-Client': 'wizard-pro' },
      body: JSON.stringify({ hash, filename: fileName || 'wizard' })
    })
    setResult(await res.json())
    setStep(4)
  }

  return (
    <Shell title="Stamp wizard" subtitle="File → hash → review → stamp.">
      <div className="mb-4 flex gap-2 text-xs">
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className={`rounded px-2 py-1 ${step === n ? 'bg-amber-600 text-black' : 'bg-white/10'}`}
          >
            Step {n}
          </span>
        ))}
      </div>
      {step === 1 && (
        <input type="file" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      )}
      {step >= 2 && (
        <Card className="mb-3 font-mono text-xs break-all">
          {fileName} · {hash}
        </Card>
      )}
      {step === 2 && (
        <button type="button" className="rounded bg-white/10 px-4 py-2" onClick={() => setStep(3)}>
          Continue
        </button>
      )}
      {step === 3 && (
        <button
          type="button"
          className="rounded bg-amber-600 px-4 py-2 font-semibold text-black"
          onClick={stamp}
        >
          Confirm stamp
        </button>
      )}
      {step === 4 && result && (
        <Card>
          <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
          {result.id && (
            <Link className="text-sm text-amber-400" to={`/verify/${result.id}`}>
              View proof →
            </Link>
          )}
        </Card>
      )}
    </Shell>
  )
}

/** Particle hero canvas for Landing embed (item 21) */
export function ParticleStampCanvas({ className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = (canvas.width = canvas.offsetWidth * devicePixelRatio)
    let h = (canvas.height = canvas.offsetHeight * devicePixelRatio)
    const parts = Array.from({ length: 48 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      conf: Math.random() > 0.55
    }))
    let raf
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2.2 * devicePixelRatio, 0, Math.PI * 2)
        ctx.fillStyle = p.conf ? '#d4a017' : '#3b82f6'
        ctx.fill()
      }
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const a = parts[i]
          const b = parts[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 90 * devicePixelRatio) {
            ctx.strokeStyle = `rgba(212,160,23,${0.15 * (1 - d / (90 * devicePixelRatio))})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} className={`h-full w-full ${className}`} aria-hidden />
}

/** 35-ish command palette helper hook export */
export function useCommandPalette(commands) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  const filtered = useMemo(() => {
    const s = q.toLowerCase()
    return (commands || []).filter((c) => c.label.toLowerCase().includes(s)).slice(0, 12)
  }, [commands, q])
  return { open, setOpen, q, setQ, filtered }
}
