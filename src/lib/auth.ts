import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_girls_pg_jwt_key_2026_luxury';

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch (error) {
    return null;
  }
}

export function getAdminFromRequest(req: NextRequest): AdminPayload | null {
  const token = req.cookies.get('admin_token')?.value || 
                req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  return verifyAdminToken(token);
}
