import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_ROOT = path.resolve(process.cwd(), 'uploads');
const JWT_SECRET = process.env.JWT_SECRET || 'researchmate_production_secret_key_8849204910';

if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

export function validatePdfMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 5) return false;
  const header = buffer.subarray(0, 5).toString('ascii');
  return header.startsWith('%PDF-');
}

export function savePrivatePdf(userId: string, originalFilename: string, buffer: Buffer): string {
  if (!validatePdfMagicBytes(buffer)) {
    throw new Error('Security Violation: File header does not match valid PDF magic bytes (%PDF-).');
  }

  const userDir = path.join(UPLOAD_ROOT, userId);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  const fileHash = crypto.randomBytes(16).toString('hex');
  const safeFilename = `${Date.now()}-${fileHash}.pdf`;
  const fullPath = path.join(userDir, safeFilename);

  fs.writeFileSync(fullPath, buffer);

  // Return relative path for database reference: "<userId>/<safeFilename>"
  return path.join(userId, safeFilename).replace(/\\/g, '/');
}

export function getSafeDiskPath(relativePath: string): string {
  const resolved = path.resolve(UPLOAD_ROOT, relativePath);
  if (!resolved.startsWith(UPLOAD_ROOT)) {
    throw new Error('Access Denied: Path traversal detected.');
  }
  return resolved;
}

export function generateSignedToken(paperId: string, userId: string, ttlSeconds = 300): string {
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${paperId}:${userId}:${expiresAt}`;
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
  return Buffer.from(JSON.stringify({ paperId, userId, expiresAt, signature })).toString('base64url');
}

export function verifySignedToken(token: string): { valid: boolean; paperId?: string; userId?: string; error?: string } {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf8');
    const { paperId, userId, expiresAt, signature } = JSON.parse(raw);

    if (Math.floor(Date.now() / 1000) > expiresAt) {
      return { valid: false, error: 'Download token has expired.' };
    }

    const payload = `${paperId}:${userId}:${expiresAt}`;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
    if (signature !== expectedSig) {
      return { valid: false, error: 'Invalid token signature.' };
    }

    return { valid: true, paperId, userId };
  } catch (err) {
    return { valid: false, error: 'Malformed token payload.' };
  }
}
