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
