ALTER TABLE timestamps ADD COLUMN user_npub TEXT;
CREATE INDEX IF NOT EXISTS idx_timestamps_user_npub ON timestamps(user_npub);
