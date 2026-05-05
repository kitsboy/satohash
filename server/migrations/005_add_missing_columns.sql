-- Migration 005: Add missing columns for IPFS archiving
-- These are safe to run on existing databases.
-- The migrations runner in migrations.js handles "duplicate column name" errors gracefully
-- by marking the migration as applied and continuing.

ALTER TABLE timestamps ADD COLUMN ipfs_cid TEXT;
ALTER TABLE timestamps ADD COLUMN archived_at DATETIME;
