import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import net from 'net'
import { spawn, execFile } from 'child_process'
import { fileURLToPath, pathToFileURL } from 'url'
import Database from 'better-sqlite3'
import { performBackup, decryptBackup } from './backup.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

const STRONG_KEY_64HEX = 'ab'.repeat(32) // 64 hex chars
const STRONG_SECRET = 'x'.repeat(40)

const SEED_HELPER = `import fs from 'fs';
process.env.SATOHASH_DB_PATH = process.argv[2];
const dbPath = process.argv[2];
const rows = Number(process.argv[3] || 0);
if (fs.existsSync(dbPath)) fs.rmSync(dbPath);
const { default: db } = await import(${JSON.stringify(pathToFileURL(path.join(repoRoot, 'server/db.js')).href)});
const ins = db.prepare('INSERT INTO timestamps (id, hash, original_filename, ots_binary, status, created_at) VALUES (?,?,?,?,?,datetime(\\'now\\'))');
db.transaction(() => {
  for (let i = 0; i < rows; i++) {
    ins.run('seed-' + i, 'f'.repeat(64), 'seed', Buffer.from('x'.repeat(200)), 'confirmed');
  }
})();
console.log('SEEDED ' + db.prepare('SELECT count(*) c FROM timestamps').get().c + ' rows');
db.close();
`

/**
 * A REAL sqlite DB (full db.js schema + N rows) at dbPath. The schema matters:
 * the boot child runs the migration suite against this DB, so a hand-minimal
 * table would make migrations fail. Rows matter: the old bug (unawaited backup
 * + immediate close) only crashes when the backup spans async steps — a tiny
 * DB finishes before close() and hides the defect.
 */
async function makeSeedDb(dbPath, rows = 12000) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })
  const helper = path.join(path.dirname(dbPath), 'seed-helper.mjs')
  fs.writeFileSync(helper, SEED_HELPER)
  const res = await spawnSyncNode(process.execPath, [helper, dbPath, String(rows)], repoRoot)
  if (!res.ok) throw new Error(`seed helper failed: ${res.out}`)
  return rows
}

function spawnSyncNode(cmd, args, cwd) {
  return new Promise((resolve) => {
    execFile(cmd, args, { cwd, timeout: 90000 }, (err, stdout, stderr) => {
      const out = `${stdout || ''}${stderr || ''}`
      resolve({ ok: !err, code: err ? err.code : 0, out })
    })
  })
}

function freePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer()
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address()
      srv.close(() => resolve(port))
    })
    srv.on('error', reject)
  })
}

/** Wait until child output contains `needle` (string or RegExp) or timeout. */
function waitForOutput(child, needle, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    let acc = ''
    const matcher =
      needle instanceof RegExp ? needle : new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    const onData = (chunk) => {
      acc += chunk.toString()
      if (matcher.test(acc)) {
        cleanup()
        resolve(acc)
      }
    }
    const onExit = (code) => {
      cleanup()
      reject(
        new Error(
          `child exited (code=${code}) before '${needle}' was seen. Output so far:\n${acc.slice(-4000)}`
        )
      )
    }
    const onTimeout = () => {
      cleanup()
      reject(new Error(`timed out waiting for '${needle}'. Output so far:\n${acc.slice(-4000)}`))
    }
    const timer = setTimeout(onTimeout, timeoutMs)
    const cleanup = () => {
      clearTimeout(timer)
      child.stdout?.off('data', onData)
      child.stderr?.off('data', onData)
      child.off('exit', onExit)
    }
    child.stdout?.on('data', onData)
    child.stderr?.on('data', onData)
    child.on('exit', onExit)
  })
}

function killGracefully(child) {
  return new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) return resolve()
    child.once('exit', () => resolve())
    child.kill('SIGTERM')
    setTimeout(() => {
      try {
        child.kill('SIGKILL')
      } catch {
        /* gone */
      }
      resolve()
    }, 5000)
  })
}

describe('backup.js', () => {
  let tmp
  let dbPath
  let backupDir
  let originalBackupKey

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'satohash-backup-'))
    dbPath = path.join(tmp, 'src', 'satohash.db')
    backupDir = path.join(tmp, 'backups')
    originalBackupKey = process.env.BACKUP_KEY
    process.env.BACKUP_KEY = STRONG_KEY_64HEX
  })

  afterEach(() => {
    if (originalBackupKey === undefined) delete process.env.BACKUP_KEY
    else process.env.BACKUP_KEY = originalBackupKey
    try {
      fs.rmSync(tmp, { recursive: true, force: true })
    } catch {
      /* ok */
    }
  })

  it(
    'produces exactly one restorable backup and resolves to an existing file',
    { timeout: 90000 },
    async () => {
      await makeSeedDb(dbPath, 4000)

      const artifact = await performBackup({ dbPath, backupDir })

      expect(artifact).toBeTruthy()
      expect(fs.existsSync(artifact)).toBe(true)
      expect(fs.statSync(artifact).size).toBeGreaterThan(0)

      const artifacts = fs.readdirSync(backupDir).filter((f) => !f.startsWith('.snap'))
      expect(artifacts).toHaveLength(1)
      expect(artifacts[0]).toBe(path.basename(artifact))

      // The source DB must survive untouched.
      const src = new Database(dbPath, { readonly: true })
      expect(src.prepare('SELECT count(*) c FROM timestamps').get().c).toBe(4000)
      src.close()

      // Encrypted artifacts must decrypt back to a valid, complete DB.
      if (artifact.endsWith('.enc')) {
        const dec = decryptBackup(artifact, Buffer.from(STRONG_KEY_64HEX, 'hex'))
        const decPath = path.join(tmp, 'decrypted.db')
        fs.writeFileSync(decPath, dec)
        const restored = new Database(decPath, { readonly: true })
        expect(restored.prepare('SELECT count(*) c FROM timestamps').get().c).toBe(4000)
        restored.close()
      }
    }
  )

  it(
    'boots the real server and stays alive after the boot backup completes (regression: unawaited backup + immediate close)',
    { timeout: 180000 },
    async () => {
      await makeSeedDb(dbPath, 12000)
      const port = await freePort()
      const child = spawn(process.execPath, ['server/index.js'], {
        cwd: repoRoot,
        env: {
          ...process.env,
          NODE_ENV: 'production',
          PORT: String(port),
          ADMIN_KEY: STRONG_SECRET,
          JWT_SECRET: STRONG_SECRET,
          SNAPPER_KEY: STRONG_SECRET,
          BACKUP_KEY: STRONG_KEY_64HEX,
          SATOHASH_DB_PATH: dbPath,
          SATOHASH_BACKUP_DIR: backupDir,
          SENTRY_DSN: '',
          REDIS_URL: 'redis://127.0.0.1:6399' // dead port: CI host has no redis
        },
        stdio: ['ignore', 'pipe', 'pipe']
      })
      let out = ''
      child.stdout.on('data', (c) => {
        out += c
      })
      child.stderr.on('data', (c) => {
        out += c
      })

      try {
        // The old code died ~200ms AFTER this exact log line — wait for it, then
        // give the (formerly unhandled) backup rejection room to fire.
        await waitForOutput(child, 'v5 jobs: pending-stamp prune scheduled', 90000)
        await new Promise((r) => setTimeout(r, 3500))

        expect(child.exitCode).toBeNull()
        expect(child.signalCode).toBeNull()
        expect(out).not.toMatch(/TypeError/)
        expect(out).not.toMatch(/The database connection is not open/)
        expect(out.match(/Boot DB backup complete/g) || []).toHaveLength(1)
        expect(out.match(/Backup failed/g) || []).toHaveLength(0)

        const artifacts = fs.readdirSync(backupDir).filter((f) => !f.startsWith('.snap'))
        expect(artifacts).toHaveLength(1)
        expect(fs.statSync(path.join(backupDir, artifacts[0])).size).toBeGreaterThan(0)
      } finally {
        await killGracefully(child)
      }
    }
  )
})
