import path from 'path';
import jwt from 'jsonwebtoken';

const PRIVATE_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^0\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
];

export function isPrivateHost(hostname) {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal')) return true;
  return PRIVATE_IP_PATTERNS.some((re) => re.test(h));
}

export function validateWebhookUrl(urlString) {
  let parsed;
  try {
    parsed = new URL(urlString);
  } catch {
    return { ok: false, error: 'Invalid URL' };
  }
  if (parsed.protocol !== 'https:') {
    return { ok: false, error: 'Webhook URL must use HTTPS' };
  }
  if (isPrivateHost(parsed.hostname)) {
    return { ok: false, error: 'Webhook URL cannot target private networks' };
  }
  return { ok: true, url: parsed.href };
}

export function sanitizeGitPath(requestedPath, baseDir = process.cwd()) {
  const resolved = path.resolve(baseDir, requestedPath || '.');
  const base = path.resolve(baseDir);
  if (!resolved.startsWith(base + path.sep) && resolved !== base) {
    return { ok: false, error: 'Path outside allowed directory' };
  }
  return { ok: true, path: resolved };
}

export function requireBearerAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const adminKey = process.env.ADMIN_KEY;
  if (!token) return res.status(401).json({ error: 'Authorization required' });
  if (adminKey && token === adminKey) return next();
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'satohash-jwt-32chars-change-in-prod');
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireNpub(req, res, next) {
  const npub = req.headers['x-npub'];
  if (!npub || !npub.startsWith('npub1')) {
    return res.status(401).json({ error: 'Valid x-npub header required' });
  }
  req.npub = npub;
  next();
}