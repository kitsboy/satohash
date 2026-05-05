import Database from 'better-sqlite3';
import logger from './logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../data/satohash.db');

// Ensure data directory exists
import fs from 'fs';
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL'); // Performance refinement

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
`);

logger.info(`🗄️ Database initialized at ${dbPath}`);

export default db;
