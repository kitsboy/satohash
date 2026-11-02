#!/usr/bin/env node
/**
 * Snapshot the stamp index (the API SQLite file) into the backup folder.
 * Run on THOR, from the repo root, after git pull. Does not print secrets.
 *
 *   node scripts/backup-stamp-index.mjs
 */
import { performBackup } from '../server/backup.js'

try {
  const out = await performBackup()
  if (!out) {
    console.error('Stamp index backup failed')
    process.exit(1)
  }
  console.log(out)
} catch (err) {
  console.error(err instanceof Error ? err.message : 'Stamp index backup failed')
  process.exit(1)
}
