CREATE TABLE IF NOT EXISTS applied_migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, applied_at DATETIME DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS timestamps (
    id TEXT PRIMARY KEY,
    hash TEXT NOT NULL,
    original_filename TEXT,
    ots_binary BLOB NOT NULL,
    upgraded_binary BLOB,
    status TEXT DEFAULT 'pending', 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    confirmed_at DATETIME,
    merkle_root TEXT,
    bitcoin_block_height INTEGER
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
