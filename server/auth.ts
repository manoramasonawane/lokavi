import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { getDb, persistDb, UserProfile } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'researchmate_production_secret_key_8849204910';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  exp: number;
}

export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  const hashBuf = Buffer.from(hash, 'hex');
  const expBuf = Buffer.from(expectedHash, 'hex');
  if (hashBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(hashBuf, expBuf);
}

export function createToken(userId: string, email: string, expiresInHours = 24 * 7): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInHours * 3600;
  const payload: AuthTokenPayload = { userId, email, exp };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) return null;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(payloadB64).digest('base64url');
    if (signature !== expectedSig) return null;

    const payload: AuthTokenPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (Math.floor(Date.now() / 1000) > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch (err) {
    return null;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: UserProfile;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired authorization token' });
  }

  const db = getDb();
  const user = db.profiles.find((p) => p.id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User associated with token no longer exists' });
  }

  req.user = user;
  next();
}

export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (payload) {
      const db = getDb();
      req.user = db.profiles.find((p) => p.id === payload.userId);
    }
  }
  next();
}
