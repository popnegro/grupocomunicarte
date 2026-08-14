import 'dotenv/config';
import crypto from 'crypto';

const jwtSecret = process.env.JWT_SECRET?.trim();

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET is required and must contain at least 32 characters. Configure it in the environment before starting the server.');
}

const JWT_SECRET: string = jwtSecret;

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

export function signToken(payload: Record<string, unknown>, expiresInSeconds = 7200): string {
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

export function verifyToken(token: string): Record<string, unknown> {
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

  const payload = JSON.parse(base64urlDecode(payloadStr)) as Record<string, unknown>;
  if (typeof payload.exp === 'number' && Date.now() / 1000 > payload.exp) {
    throw new Error('Token expirado.');
  }

  return payload;
}
