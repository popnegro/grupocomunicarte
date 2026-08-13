import crypto from 'crypto';

/**
 * Hash a password using PBKDF2 with 100,000 iterations and a random salt.
 * Formats the output as: pbkdf2_sha256$100000$salt$hash
 */
export function hashPassword(password: string): string {
  if (password.length < 12) {
    throw new Error('La contraseña debe tener al menos 12 caracteres.');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100000;
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha256').toString('hex');
  return `pbkdf2_sha256$${iterations}$${salt}$${hash}`;
}

/**
 * Verify a password against a stored PBKDF2 hash using timing-safe comparison.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const parts = storedHash.split('$');
    if (parts.length !== 4 || parts[0] !== 'pbkdf2_sha256') {
      return false;
    }
    const iterations = parseInt(parts[1], 10);
    const salt = parts[2];
    const originalHashHex = parts[3];

    const originalHash = Buffer.from(originalHashHex, 'hex');
    const computedHash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha256');

    return crypto.timingSafeEqual(originalHash, computedHash);
  } catch (err) {
    return false;
  }
}
