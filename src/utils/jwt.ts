import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'gym_mgmt_super_secret_key_2026';

export interface TokenPayload {
  id: number;
  email: string;
  role: 'owner' | 'staff';
  gym_id?: number | null;
}

export const signToken = (payload: TokenPayload): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');
    
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');
      
    if (signature !== expectedSignature) return null;
    
    const payloadStr = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    return JSON.parse(payloadStr) as TokenPayload;
  } catch (error) {
    return null;
  }
};
