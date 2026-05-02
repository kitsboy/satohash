-- Add tenant_id to timestamps table
ALTER TABLE timestamps ADD COLUMN tenant_id TEXT DEFAULT 'default';

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  subdomain TEXT UNIQUE,
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default tenant
INSERT OR IGNORE INTO tenants (id, subdomain, name) VALUES ('default', 'default', 'Main Tenant');