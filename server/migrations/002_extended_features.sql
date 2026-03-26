CREATE TABLE IF NOT EXISTS webhooks (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    events TEXT, -- JSON array of events like 'confirmed', 'revoked'
    secret TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS signers (
    id TEXT PRIMARY KEY,
    timestamp_id TEXT NOT NULL,
    npub TEXT,
    signed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(timestamp_id) REFERENCES timestamps(id)
);

-- Item 19: Revocation support
ALTER TABLE timestamps ADD COLUMN is_revoked INTEGER DEFAULT 0;
ALTER TABLE timestamps ADD COLUMN revoked_at DATETIME;
ALTER TABLE timestamps ADD COLUMN revocation_reason TEXT;
ALTER TABLE timestamps ADD COLUMN superseded_by TEXT; -- ID of the new version
