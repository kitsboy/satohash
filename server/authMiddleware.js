import jwt from 'jsonwebtoken';
import logger from './logger.js';
import db from './db.js';

// Tenant resolution
const getTenantId = (req) => {
  // From subdomain
  const host = req.headers.host || '';
  const subdomain = host.split('.')[0];
  if (subdomain !== 'www' && subdomain !== 'localhost') {
    const tenant = db.prepare('SELECT id FROM tenants WHERE subdomain = ?').get(subdomain);
    if (tenant) return tenant.id;
  }
  // Fallback to JWT
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mock-secret');
      return decoded.sub || 'default';
    } catch (e) {
      logger.warn('Invalid JWT:', e.message);
    }
  }
  return 'default';
};

// Auth middleware: Sets req.tenantId
export const authMiddleware = async (req, res, next) => {
  req.tenantId = getTenantId(req);

  // NOTE: the legacy WebAuthn mock admin gate was removed 2026-09-12 (t_2fed7832).
  // It only ever fired for unmatched /api/admin/* and /admin/* paths (real admin
  // routes are served earlier by adminRouter's own Bearer-ADMIN_KEY `adminAuth`),
  // it crashed on body-less requests (`Cannot destructure 'verification' of
  // req.body`) turning removed routes into 500s, and it was an always-reject mock.
  // Removing it lets unmatched admin paths return the normal Express 404 like any
  // other removed route. `withTenantFilter` (below) is the surviving tenant helper.

  next();
};

// DB query wrapper for tenant isolation
export const withTenantFilter = (query, tenantId, params = []) => {
  if (!tenantId || tenantId === 'default') return { query, params };
  const clause = query.match(/where/i) ? ' AND tenant_id = ?' : ' WHERE tenant_id = ?';
  return { query: query + clause, params: [...params, tenantId] };
};

export default authMiddleware;