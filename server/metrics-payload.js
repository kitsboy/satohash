/**
 * Build gab.product-metrics.v1 envelope for HQ (hq.giveabit.io).
 * Secret-free. Prefer live DB aggregates; fall back gracefully.
 *
 * Directory + offers + links are intentionally rich so HQ can
 * inventory every public plane Satohash exposes.
 */

const FAMILY_CLIENTS = [
  { id: 'sherpacarta', label: 'SherpaCarta', meta: { offer: 'governance docs / charter' } },
  {
    id: 'sherpacarta-canada',
    label: 'SherpaCarta Canada',
    meta: { offer: 'campaign / referendum proofs' }
  },
  { id: 'motopass', label: 'MotoPass', meta: { offer: 'passport/docs proofs' } },
  { id: 'katoa', label: 'Katoa', meta: { offer: 'creator attestations' } },
  { id: 'giveabit', label: 'Give A Bit', meta: { offer: 'education demos' } },
  { id: 'tadbuy', label: 'TadBuy', meta: { offer: 'ad / campaign receipts' } },
  { id: 'stranded', label: 'Stranded', meta: { offer: 'energy map attestations' } },
  { id: 'openstrata', label: 'OpenStrata', meta: { offer: 'protocol docs' } },
  { id: 'spa', label: 'Satohash SPA', meta: { offer: 'direct web stamps' } },
  { id: 'cli', label: 'CLI', meta: { offer: 'developer tooling' } },
  { id: 'hq', label: 'HQ', meta: { offer: 'ops smoke / suite' } }
]

/** Public directory HQ can index (no secrets). */
export function buildPublicDirectory() {
  return {
    productId: 'satohash',
    name: 'Satohash',
    role: 'Give A Bit shared OpenTimestamps / Bitcoin proof plane',
    hosts: {
      spa: ['https://satohash.io', 'https://satohash.giveabit.io'],
      api: ['https://api.satohash.io']
    },
    deepLinks: {
      stamp: 'https://satohash.io/stamp?hash=<64hex>&ref=<productId>',
      stampHomeRedirect: 'https://satohash.io/?hash=<64hex>&ref=<productId>',
      verify: 'https://satohash.io/verify/<id-or-hash>'
    },
    endpoints: [
      { method: 'GET', path: '/health', purpose: 'Liveness' },
      { method: 'GET', path: '/metrics.json', purpose: 'HQ product metrics v1' },
      { method: 'GET', path: '/api/public/status', purpose: 'Suite heartbeat' },
      { method: 'GET', path: '/api/public/stats', purpose: 'Public stamp stats' },
      { method: 'GET', path: '/api/public/network', purpose: 'Network surface' },
      { method: 'GET', path: '/api/public/version', purpose: 'API version' },
      { method: 'GET', path: '/api/stamps/recent', purpose: 'Recent public stamps' },
      { method: 'GET', path: '/api/stamps/:id', purpose: 'Stamp metadata' },
      { method: 'GET', path: '/api/stamps/:hash/by-hash', purpose: 'Stamps by SHA-256' },
      { method: 'GET', path: '/api/stamps/:id/ots', purpose: 'OTS binary download' },
      { method: 'GET', path: '/api/stamps/:id/proof-package', purpose: 'Proof package JSON' },
      {
        method: 'POST',
        path: '/api/stamp',
        purpose: 'Create OTS stamp',
        headers: ['X-Satohash-Client']
      },
      { method: 'GET', path: '/api/openapi.json', purpose: 'OpenAPI stub' }
    ],
    spaRoutes: [
      '/stamp',
      '/verify/:id',
      '/vault',
      '/templates',
      '/integrations',
      '/trust',
      '/docs'
    ],
    clientsExpected: FAMILY_CLIENTS.map((c) => c.id),
    attribution: {
      header: 'X-Satohash-Client',
      query: 'ref | source',
      storedAs: 'timestamps.client_id'
    },
    docs: [
      { label: 'Family API', url: 'https://satohash.io/docs/family-api' },
      {
        label: 'OTS deep learn',
        url: 'https://github.com/kitsboy/satohash/blob/main/docs/OTS-DEEP-LEARN.md'
      },
      { label: 'HQ feed (this envelope)', url: 'https://api.satohash.io/metrics.json' }
    ]
  }
}

function safeQuery(db, sql, params = []) {
  try {
    return db.prepare(sql).all(...params)
  } catch {
    return null
  }
}

function safeGet(db, sql, params = []) {
  try {
    return db.prepare(sql).get(...params)
  } catch {
    return null
  }
}

function buildDailySeries(db, now, days = 15) {
  const rows =
    safeQuery(
      db,
      `SELECT date(created_at) AS d,
              COUNT(*) AS total,
              SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed,
              SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending
       FROM timestamps
       WHERE created_at >= datetime('now', ?)
       GROUP BY date(created_at)
       ORDER BY d ASC`,
      [`-${days - 1} days`]
    ) || []

  const byDay = new Map(rows.map((r) => [r.d, r]))
  const stamps = []
  const confirmed = []
  const pendingDepth = []

  for (let i = days - 1; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 86400000)
    const d = t.toISOString().slice(0, 10)
    const row = byDay.get(d)
    const iso = new Date(`${d}T12:00:00.000Z`).toISOString()
    stamps.push({ t: iso, v: Number(row?.total || 0) })
    confirmed.push({ t: iso, v: Number(row?.confirmed || 0) })
    pendingDepth.push({ t: iso, v: Number(row?.pending || 0) })
  }

  return { stamps, confirmed, pendingDepth, hasRealData: rows.length > 0 }
}

function buildClientSegments(db) {
  const counts =
    safeQuery(
      db,
      `SELECT COALESCE(NULLIF(trim(client_id), ''), 'public') AS cid, COUNT(*) AS n
       FROM timestamps
       GROUP BY cid
       ORDER BY n DESC`
    ) || []

  const map = new Map(counts.map((r) => [String(r.cid).toLowerCase(), Number(r.n) || 0]))
  const knownIds = new Set(FAMILY_CLIENTS.map((c) => c.id))
  const rows = FAMILY_CLIENTS.map((c) => ({
    id: c.id,
    label: c.label,
    value: map.get(c.id) || 0,
    meta: c.meta
  }))

  let publicN = map.get('public') || 0
  for (const [cid, n] of map) {
    if (!knownIds.has(cid) && cid !== 'public') {
      rows.push({
        id: cid,
        label: cid,
        value: n,
        meta: { offer: 'attributed client' }
      })
    }
  }
  // Fold unattributed into public if no explicit public
  if (!map.has('public')) {
    const attributed = rows.reduce((s, r) => s + r.value, 0)
    const total = safeGet(db, 'SELECT COUNT(*) AS n FROM timestamps')?.n || 0
    publicN = Math.max(0, total - attributed)
  }
  const publicRow = rows.find((r) => r.id === 'public')
  if (publicRow) publicRow.value = Math.max(publicRow.value, publicN)
  else
    rows.push({
      id: 'public',
      label: 'Public / unattributed',
      value: publicN,
      meta: { offer: 'open stamping or pre-attribution stamps' }
    })

  return rows.sort((a, b) => b.value - a.value)
}

/**
 * @param {import('better-sqlite3').Database} db
 * @param {{ version?: string, uptimeSec?: number }} [opts]
 */
export function buildMetricsPayload(db, opts = {}) {
  const now = new Date()
  const t0 = Date.now()

  let stampsTotal = 0
  let stamps24h = 0
  let stamps7d = 0
  let pending = 0
  let confirmed = 0
  let confirmed7d = 0
  let failed = 0
  let failed7d = 0

  stampsTotal = safeGet(db, 'SELECT COUNT(*) AS n FROM timestamps')?.n || 0
  stamps24h =
    safeGet(
      db,
      "SELECT COUNT(*) AS n FROM timestamps WHERE created_at >= datetime('now', '-1 day')"
    )?.n || 0
  stamps7d =
    safeGet(
      db,
      "SELECT COUNT(*) AS n FROM timestamps WHERE created_at >= datetime('now', '-7 days')"
    )?.n || 0
  pending = safeGet(db, "SELECT COUNT(*) AS n FROM timestamps WHERE status = 'pending'")?.n || 0
  confirmed = safeGet(db, "SELECT COUNT(*) AS n FROM timestamps WHERE status = 'confirmed'")?.n || 0
  confirmed7d =
    safeGet(
      db,
      "SELECT COUNT(*) AS n FROM timestamps WHERE status = 'confirmed' AND created_at >= datetime('now', '-7 days')"
    )?.n || 0
  failed = safeGet(db, "SELECT COUNT(*) AS n FROM timestamps WHERE status = 'failed'")?.n || 0
  failed7d =
    safeGet(
      db,
      "SELECT COUNT(*) AS n FROM timestamps WHERE status = 'failed' AND created_at >= datetime('now', '-7 days')"
    )?.n || 0

  const clientRows = buildClientSegments(db)
  const familyIds = new Set(
    FAMILY_CLIENTS.filter((c) => !['spa', 'cli', 'public', 'hq'].includes(c.id)).map((c) => c.id)
  )
  const familyFree = clientRows
    .filter((r) => familyIds.has(r.id) || String(r.id).startsWith('sherpacarta'))
    .reduce((s, r) => s + r.value, 0)
  const distinctClients =
    safeGet(
      db,
      `SELECT COUNT(DISTINCT client_id) AS n FROM timestamps
       WHERE client_id IS NOT NULL AND trim(client_id) != ''`
    )?.n || 0

  const totalAttempted = confirmed + failed
  const confirmRate =
    totalAttempted > 0
      ? Number(((confirmed / totalAttempted) * 100).toFixed(1))
      : stampsTotal > 0
        ? 100
        : 0

  const seriesData = buildDailySeries(db, now, 15)
  const familySharePct = stampsTotal > 0 ? Number(((familyFree / stampsTotal) * 100).toFixed(1)) : 0

  // Health: green if API serving; amber if high pending backlog
  let healthStatus = 'green'
  let healthMessage = 'API healthy — live stamp aggregates for HQ'
  if (stampsTotal === 0) {
    healthMessage = 'API healthy — waiting for first stamps'
  } else if (pending > 50 && pending > confirmed) {
    healthStatus = 'amber'
    healthMessage = 'Elevated pending queue — OTS upgrade may be lagging'
  } else if (confirmRate > 0 && confirmRate < 90 && totalAttempted >= 5) {
    healthStatus = 'amber'
    healthMessage = `Confirm rate ${confirmRate}% below target`
  }

  const latencyMs = Date.now() - t0
  const directory = buildPublicDirectory()
  const monthlyCapacity = Math.round((stamps7d / 7) * 30)

  const payload = {
    schema: 'gab.product-metrics.v1',
    productId: 'satohash',
    name: 'Satohash',
    updatedAt: now.toISOString(),
    window: {
      label: '7d',
      from: new Date(now.getTime() - 7 * 86400000).toISOString(),
      to: now.toISOString()
    },
    health: {
      status: healthStatus,
      message: healthMessage,
      latencyMs,
      // Do not invent uptime % — HQ prefers null over fake 99.9
      uptimePct24h: null,
      dependencies: [
        {
          id: 'opentimestamps-calendars',
          status: 'green',
          detail: 'alice + bob calendars; finney may be flaky'
        },
        {
          id: 'bitcoin-anchor',
          status: pending > 0 ? 'amber' : 'green',
          detail: pending > 0 ? `${pending} pending Bitcoin confirmation(s)` : 'No pending anchors'
        },
        {
          id: 'api.satohash.io',
          status: 'green',
          detail: opts.version ? `version ${opts.version}` : 'API serving'
        },
        {
          id: 'client-attribution',
          status: distinctClients > 0 ? 'green' : 'amber',
          detail:
            distinctClients > 0
              ? `${distinctClients} distinct X-Satohash-Client id(s)`
              : 'No client_id rows yet — stamp with header for HQ segments'
        }
      ]
    },
    kpis: [
      {
        key: 'stamps_total',
        label: 'Stamps (all time)',
        value: stampsTotal,
        unit: 'proofs',
        format: 'number',
        priority: 1,
        hint: 'Total OpenTimestamps receipts issued through Satohash plane.'
      },
      {
        key: 'stamps_24h',
        label: 'Stamps 24h',
        value: stamps24h,
        unit: 'proofs',
        delta: 0,
        deltaUnit: '%',
        format: 'number',
        priority: 1,
        hint: 'Daily stamping velocity.'
      },
      {
        key: 'stamps_7d',
        label: 'Stamps 7d',
        value: stamps7d,
        unit: 'proofs',
        format: 'number',
        priority: 2,
        hint: 'Weekly velocity window.'
      },
      {
        key: 'monthly_capacity',
        label: 'Monthly capacity (est.)',
        value: monthlyCapacity,
        unit: 'proofs',
        format: 'number',
        priority: 2,
        hint: 'stamps_7d/7 × 30 — mold into pitch capacity.'
      },
      {
        key: 'pending',
        label: 'Pending confirm',
        value: pending,
        unit: 'proofs',
        format: 'number',
        priority: 2,
        hint: 'Waiting on calendar → Bitcoin confirmation.'
      },
      {
        key: 'confirmed',
        label: 'Confirmed (all time)',
        value: confirmed,
        unit: 'proofs',
        format: 'number',
        priority: 2,
        hint: 'Fully Bitcoin-anchored proofs.'
      },
      {
        key: 'confirmed_7d',
        label: 'Confirmed 7d',
        value: confirmed7d,
        unit: 'proofs',
        format: 'number',
        priority: 2,
        hint: 'Confirmed in last 7 days.'
      },
      {
        key: 'confirm_rate',
        label: 'Confirm rate',
        value: confirmRate,
        unit: '%',
        format: 'percent',
        priority: 1,
        hint: 'confirmed / (confirmed+failed). Target ≥ 95%.'
      },
      {
        key: 'family_free',
        label: 'Family free stamps',
        value: familyFree,
        unit: 'proofs',
        format: 'number',
        priority: 3,
        hint: 'Attributed to suite clients via X-Satohash-Client / client_id.'
      },
      {
        key: 'api_clients',
        label: 'Active API clients',
        value: distinctClients,
        unit: 'clients',
        format: 'number',
        priority: 3,
        hint: 'Distinct client_id values stored on stamps.'
      },
      {
        key: 'family_share_pct',
        label: 'Family share',
        value: familySharePct,
        unit: '%',
        format: 'percent',
        priority: 3,
        hint: 'Share of stamps from suite family clients.'
      },
      {
        key: 'failed',
        label: 'Failed',
        value: failed,
        unit: 'proofs',
        format: 'number',
        priority: 4,
        hint: 'Terminal failures (all time).'
      },
      {
        key: 'p50_ms',
        label: 'Metrics build p50',
        value: latencyMs,
        unit: 'ms',
        format: 'duration',
        priority: 5,
        hint: 'Time to assemble this metrics envelope (proxy for API snappiness).'
      },
      {
        key: 'fee_sat_vb',
        label: 'Mempool fee hint',
        value: 4,
        unit: 'sat/vB',
        format: 'number',
        priority: 5,
        hint: 'Context for anchoring cost narrative (static hint).'
      }
    ],
    series: [
      {
        key: 'stamps_daily',
        label: 'Stamps / day',
        unit: 'proofs',
        color: '#8a5a00',
        points: seriesData.stamps
      },
      {
        key: 'confirmed_daily',
        label: 'Confirmed / day',
        unit: 'proofs',
        color: '#1f6b3a',
        points: seriesData.confirmed
      },
      {
        key: 'pending_depth',
        label: 'Pending depth',
        unit: 'proofs',
        color: '#c45f00',
        points: seriesData.pendingDepth
      },
      {
        key: 'family_share',
        label: 'Family free %',
        unit: '%',
        color: '#1a5f7a',
        points: seriesData.stamps.map((p) => ({
          t: p.t,
          v: familySharePct
        }))
      }
    ],
    funnels: [
      {
        id: 'stamp_journey',
        label: 'Stamp journey',
        steps: [
          {
            id: 'hash_local',
            label: 'Local hash',
            count: Math.max(stamps24h, stampsTotal),
            hint: 'File never leaves device'
          },
          {
            id: 'submit',
            label: 'Submit stamp',
            count: Math.max(0, stamps24h || stampsTotal),
            hint: 'API or SPA'
          },
          {
            id: 'calendar',
            label: 'Calendar attested',
            count: Math.max(0, stampsTotal - failed),
            hint: 'OTS calendars accepted'
          },
          {
            id: 'bitcoin',
            label: 'Bitcoin confirmed',
            count: confirmed,
            hint: 'On-chain anchor'
          },
          {
            id: 'pending_queue',
            label: 'Still pending',
            count: pending,
            hint: 'Upgrade daemon queue'
          }
        ]
      }
    ],
    segments: [
      {
        id: 'by_client',
        label: 'By suite client_id (X-Satohash-Client)',
        rows: clientRows
      },
      {
        id: 'by_status',
        label: 'By stamp status',
        rows: [
          { id: 'pending', label: 'Pending', value: pending, meta: { offer: 'awaiting BTC' } },
          {
            id: 'confirmed',
            label: 'Confirmed',
            value: confirmed,
            meta: { offer: 'Bitcoin anchored' }
          },
          { id: 'failed', label: 'Failed', value: failed, meta: { offer: 'retry / investigate' } }
        ]
      }
    ],
    offers: [
      {
        id: 'ots_stamp',
        title: 'OpenTimestamps stamp API',
        for: FAMILY_CLIENTS.map((c) => c.id),
        status: 'ga',
        endpoint: 'POST /api/stamp',
        hint: 'Send X-Satohash-Client for HQ attribution'
      },
      {
        id: 'ots_verify',
        title: 'Proof verify',
        for: ['*'],
        status: 'ga',
        endpoint: 'GET /verify/:id',
        hint: 'Cold-load UUID or SHA-256'
      },
      {
        id: 'deep_link_stamp',
        title: 'SPA stamp deep-link',
        for: ['sherpacarta', 'motopass', 'hq'],
        status: 'ga',
        endpoint: '/stamp?hash=&ref=',
        hint: 'Family handoff; home /?hash= redirects'
      },
      {
        id: 'public_status',
        title: 'Public status',
        for: ['hq'],
        status: 'ga',
        endpoint: 'GET /api/public/status',
        hint: 'Suite heartbeat'
      },
      {
        id: 'metrics_v1',
        title: 'Product metrics v1',
        for: ['hq'],
        status: 'live',
        endpoint: 'GET /metrics.json',
        hint: 'This envelope'
      },
      {
        id: 'stamps_recent',
        title: 'Recent stamps',
        for: ['hq'],
        status: 'live',
        endpoint: 'GET /api/stamps/recent',
        hint: 'Live feed for HQ intel'
      },
      {
        id: 'directory',
        title: 'Public directory',
        for: ['hq'],
        status: 'live',
        endpoint: 'raw.directory in metrics.json',
        hint: 'Hosts, endpoints, SPA routes, clients'
      }
    ],
    education: [
      {
        id: 'mold_velocity',
        title: 'Mold stamps/day into capacity',
        body: 'Use monthly_capacity KPI (7d avg × 30) for diligence packs.',
        action: 'Surface monthly_capacity on HQ card',
        severity: 'plan'
      },
      {
        id: 'mold_confirm',
        title: 'Confirm rate is trust',
        body: 'If confirm_rate < 95%, lead with calendar redundancy + upgrade daemon.',
        action: 'Alert HQ when confirm_rate drops below 92%',
        severity: 'risk'
      },
      {
        id: 'mold_family',
        title: 'Family free = suite moat',
        body: 'by_client segment proves Satohash is infrastructure, not a silo.',
        action: 'Pitch: Shared OTS backbone',
        severity: 'opportunity'
      },
      {
        id: 'mold_attribution',
        title: 'Always send X-Satohash-Client',
        body: 'Without the header, stamps land as public/unattributed.',
        action: 'Sherpa/MotoPass/CLI must set client id',
        severity: 'info'
      }
    ],
    links: [
      { label: 'Satohash live', url: 'https://satohash.io' },
      { label: 'Stamp deep-link', url: 'https://satohash.io/stamp' },
      { label: 'API', url: 'https://api.satohash.io' },
      { label: 'Metrics (live)', url: 'https://api.satohash.io/metrics.json' },
      { label: 'Public status', url: 'https://api.satohash.io/api/public/status' },
      { label: 'Recent stamps', url: 'https://api.satohash.io/api/stamps/recent' },
      { label: 'HQ glass', url: 'https://hq.giveabit.io' },
      {
        label: 'Schema',
        url: 'https://hq.giveabit.io/schemas/product-metrics.v1.schema.json'
      }
    ],
    raw: {
      demo: stampsTotal === 0,
      seriesFromDb: seriesData.hasRealData,
      note:
        stampsTotal === 0
          ? 'Live endpoint with empty stamp table.'
          : 'Live metrics from satohash API DB',
      version: opts.version || null,
      uptimeSec: opts.uptimeSec ?? null,
      requireLightning: process.env.REQUIRE_LIGHTNING !== 'false',
      familyFreeTier: Boolean(process.env.FAMILY_API_KEYS || process.env.FAMILY_API_KEY),
      directory,
      counts: {
        stampsTotal,
        stamps24h,
        stamps7d,
        pending,
        confirmed,
        confirmed7d,
        failed,
        failed7d,
        familyFree,
        distinctClients
      }
    }
  }

  return payload
}
