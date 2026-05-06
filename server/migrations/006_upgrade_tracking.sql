ALTER TABLE timestamps ADD COLUMN retry_count INTEGER DEFAULT 0;
ALTER TABLE timestamps ADD COLUMN upgrade_failed_at DATETIME;
ALTER TABLE timestamps ADD COLUMN nostr_event_id TEXT;
