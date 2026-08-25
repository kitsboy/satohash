import Database from 'better-sqlite3'
import logger from './logger.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.resolve(__dirname, '../data/satohash.db')

// Ensure data directory exists
import fs from 'fs'
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })
}

const db = new Database(dbPath)
db.pragma('journal_mode = WAL') // Performance refinement

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS timestamps (
    id TEXT PRIMARY KEY,
    hash TEXT NOT NULL,
    original_filename TEXT,
    ots_binary BLOB NOT NULL,
    upgraded_binary BLOB,
    status TEXT DEFAULT 'pending', -- pending, confirmed, failed
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    confirmed_at DATETIME,
    merkle_root TEXT,
    bitcoin_block_height INTEGER,
    ipfs_cid TEXT,
    archived_at DATETIME
  );

  CREATE INDEX IF NOT EXISTS idx_hash ON timestamps(hash);
  CREATE INDEX IF NOT EXISTS idx_status ON timestamps(status);
  CREATE INDEX IF NOT EXISTS idx_created_at ON timestamps(created_at);
`)

// Optional columns for HQ attribution + multi-user (idempotent)
try {
  db.exec(`ALTER TABLE timestamps ADD COLUMN client_id TEXT`)
} catch {
  /* exists */
}
try {
  db.exec(`CREATE INDEX IF NOT EXISTS idx_client_id ON timestamps(client_id)`)
} catch {
  /* ok */
}
try {
  db.exec(`ALTER TABLE timestamps ADD COLUMN user_npub TEXT`)
} catch {
  /* exists */
}

db.exec(`
  /* keep rest of schema in same transaction style */

  CREATE TABLE IF NOT EXISTS git_stamps (
    id TEXT PRIMARY KEY,
    timestamp_id TEXT NOT NULL,
    repo_name TEXT,
    repo_path TEXT,
    branch TEXT,
    commit_hash TEXT NOT NULL,
    tree_hash TEXT,
    author TEXT,
    message TEXT,
    FOREIGN KEY(timestamp_id) REFERENCES timestamps(id)
  );

  CREATE TABLE IF NOT EXISTS forum_threads (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS forum_posts (
    id TEXT PRIMARY KEY,
    thread_id TEXT NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(thread_id) REFERENCES forum_threads(id)
  );

  CREATE INDEX IF NOT EXISTS idx_forum_threads_created ON forum_threads(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_forum_posts_thread ON forum_posts(thread_id);

  CREATE TABLE IF NOT EXISTS push_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint TEXT UNIQUE NOT NULL,
    keys TEXT,
    npub TEXT,
    created_at DATETIME DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS webhooks (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    events TEXT DEFAULT '["stamp.confirmed"]',
    active INTEGER DEFAULT 1,
    secret TEXT,
    created_at DATETIME DEFAULT (datetime('now')),
    last_triggered DATETIME
  );
`)

// Donation → receipt → OTS pipeline (Ziggy 2026-08-25, Giving Week critical path)
db.exec(`
  CREATE TABLE IF NOT EXISTS donations (
    receipt_id TEXT PRIMARY KEY,
    payment_hash TEXT UNIQUE NOT NULL,
    amount_msat INTEGER,
    amount_sats INTEGER,
    donor_comment TEXT,
    donor_lud16 TEXT,
    paylink_id TEXT,
    receipt_json TEXT,
    receipt_hash TEXT,
    receipt_pdf BLOB,
    timestamp_id TEXT,
    status TEXT DEFAULT 'pending',
    received_at DATETIME DEFAULT (datetime('now')),
    UNIQUE(timestamp_id)
  );
  CREATE INDEX IF NOT EXISTS idx_donations_received ON donations(received_at DESC);
  CREATE INDEX IF NOT EXISTS idx_donations_hash ON donations(payment_hash);
`)

logger.info(`🗄️ Database initialized at ${dbPath}`)

export default db
