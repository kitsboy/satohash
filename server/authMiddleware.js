import jwt from 'jsonwebtoken';
import { generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server';
import logger from './logger.js';
import db from './db.js';
import redis from './cache.js';

// Mock WebAuthn keys for local testing
const MOCK_EXPECTED_CHALLENGE = 'mock-challenge-' + Date.now();
const MOCK_RP_ID = process.env.NODE_ENV === 'production' ? 'satohash.com' : 'localhost:3001';

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

// WebAuthn mock verifier (local calc, always pass for mock)
const verifyWebAuthnMock = async (req, res) => {
  // In real, use verifyAuthenticationResponse
  // For mock, check if response has expectedChallenge
  const { verification } = req.body;
  if (verification && verification.response && verification.response.challenge === MOCK_EXPECTED_CHALLENGE.replace(/[^a-z0-9]/gi, '')) {
    return { verified: true, session: 'mock-session' };
  }
  return { verified: false };
};

// Auth middleware: Sets req.tenantId, verifies WebAuthn if required
export const authMiddleware = async (req, res, next) => {
  req.tenantId = getTenantId(req);

  // Zero-trust: Require WebAuthn for sensitive routes (mock)
  if (req.path.startsWith('/api/admin') || req.path.startsWith('/admin')) {
    const verification = await verifyWebAuthnMock(req, res);
    if (!verification.verified) {
      return res.status(401).json({ error: 'WebAuthn verification failed' });
    }
    req.webauthnSession = verification.session;
  }

  // Filter DB queries? Done in route handlers
  next();
};

// DB query wrapper for tenant isolation
export const withTenantFilter = (query, tenantId) => {
  if (tenantId && tenantId !== 'default') {
    if (query.includes('WHERE') || query.includes('where')) {
      return query + ` AND tenant_id = '${tenantId}'`;
    }
    return query + ` WHERE tenant_id = '${tenantId}'`;
  }
  return query;
};

export default authMiddleware;