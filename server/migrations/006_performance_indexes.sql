-- Migration 006: Add performance indexes for common query patterns
-- idx_created_at: speeds up ORDER BY created_at DESC in /api/history
-- idx_status_created: composite index for filtered + sorted history queries

CREATE INDEX IF NOT EXISTS idx_created_at ON timestamps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_status_created ON timestamps(status, created_at DESC);
