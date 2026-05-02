-- Migration 004: Multi-tenancy support
CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    subdomain TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default tenant
INSERT OR IGNORE INTO tenants (id, subdomain, name) VALUES ('default', 'default', 'Default Tenant');

-- Add tenant_id to existing tables
ALTER TABLE timestamps ADD COLUMN tenant_id TEXT DEFAULT 'default' REFERENCES tenants(id);
ALTER TABLE git_stamps ADD COLUMN tenant_id TEXT DEFAULT 'default' REFERENCES tenants(id);
ALTER TABLE signers ADD COLUMN tenant_id TEXT DEFAULT 'default' REFERENCES tenants(id);
ALTER TABLE webhooks ADD COLUMN tenant_id TEXT DEFAULT 'default' REFERENCES tenants(id);
ALTER TABLE referrals ADD COLUMN tenant_id TEXT DEFAULT 'default' REFERENCES tenants(id);
ALTER TABLE forum_threads ADD COLUMN tenant_id TEXT DEFAULT 'default' REFERENCES tenants(id);
ALTER TABLE forum_posts ADD COLUMN tenant_id TEXT DEFAULT 'default' REFERENCES tenants(id);

-- Indexes for tenant isolation
CREATE INDEX IF NOT EXISTS idx_timestamps_tenant ON timestamps(tenant_id);
CREATE INDEX IF NOT EXISTS idx_git_stamps_tenant ON git_stamps(tenant_id);
CREATE INDEX IF NOT EXISTS idx_signers_tenant ON signers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_tenant ON webhooks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_referrals_tenant ON referrals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_forum_threads_tenant ON forum_threads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_tenant ON forum_posts(tenant_id);

-- Update existing records to default tenant
UPDATE timestamps SET tenant_id = 'default' WHERE tenant_id IS NULL;
UPDATE git_stamps SET tenant_id = 'default' WHERE tenant_id IS NULL;
-- Similarly for others...
