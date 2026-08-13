import crypto from 'crypto';

// Dynamically generate a secure key on startup if not provided
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

function base64urlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

export function signToken(payload: any, expiresInSeconds = 7200): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload = { ...payload, exp };

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(fullPayload));

  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(signatureInput)
    .digest('base64url');

  return `${signatureInput}.${signature}`;
}

export function verifyToken(token: string): any {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Token corrupto u inválido.');
  }

  const [headerStr, payloadStr, signature] = parts;
  const signatureInput = `${headerStr}.${payloadStr}`;
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(signatureInput)
    .digest('base64url');

  if (signature !== expectedSignature) {
    throw new Error('Firma de token inválida.');
  }

  const payload = JSON.parse(base64urlDecode(payloadStr));
  if (payload.exp && Date.now() / 1000 > payload.exp) {
    throw new Error('Token expirado.');
  }

  return payload;
}
