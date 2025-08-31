// lib/auth.ts
import type { User } from '@/types/chat';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';

export type { User };

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// ---------------- JWT Payload ----------------
export interface JWTPayload {
  userId: string;
  email: string;
  sessionId?: string;
  iat?: number;
  exp?: number;
}

// ---------------- Credentials ----------------
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// ---------------- Auth Result ----------------
export interface AuthResult {
  user: User;
  token: string;
  refreshToken: string | null;
}

// ------------------ Helpers ------------------
export function generateToken(payload: { userId: string; email: string; sessionId?: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.substring(7);
}

export function requireAuth(token: string | null): JWTPayload {
  if (!token) throw new Error('Authentication required');
  const payload = verifyToken(token);
  if (!payload) throw new Error('Invalid or expired token');
  return payload;
}

// ------------------ Normalize Prisma User ------------------
function normalizeUser(user: {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  isOnline: boolean;
  lastSeen: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}): User {
  return {
    ...user,
    avatar: user.avatar ?? undefined,
    bio: user.bio ?? undefined,
    lastSeen: user.lastSeen instanceof Date ? user.lastSeen : new Date(user.lastSeen),
    createdAt: user.createdAt instanceof Date ? user.createdAt : new Date(user.createdAt),
    updatedAt: user.updatedAt instanceof Date ? user.updatedAt : new Date(user.updatedAt),
  };
}

// ------------------ Middleware wrapper that preserves Next signature ------------------
/**
 * withAuth:
 *  - Accepts a handler: (req, user, context?) => Promise<Response|NextResponse>
 *  - Returns a function compatible with Next App Router route handlers:
 *      (req: NextRequest, context?: { params?: Record<string,string> }) => Promise<Response|NextResponse>
 *
 * Preserving that signature is critical so Next's generated type-checks won't detect mismatched param shapes.
 */
export function withAuth<
  Ctx extends { params?: Record<string, string> } = { params?: Record<string, string> }
>(
  handler: (req: NextRequest, user: User, context: Ctx) => Promise<Response | NextResponse>
) {
  return async (req: NextRequest, context: Ctx): Promise<Response | NextResponse> => {
    try {
      const authHeader = req.headers.get('authorization');
      const token = extractTokenFromHeader(authHeader);
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const payload = verifyToken(token);
      if (!payload) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
      }

      const prismaUser = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          bio: true,
          isOnline: true,
          lastSeen: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!prismaUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return handler(req, normalizeUser(prismaUser), context);
    } catch (err) {
      console.error('Auth wrapper error:', err);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
  };
}

// ------------------ Auth Flows ------------------
export const authenticateUser = async (credentials: LoginCredentials): Promise<AuthResult> => {
  const { email, password } = credentials;

  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      bio: true,
      isOnline: true,
      lastSeen: true,
      createdAt: true,
      updatedAt: true,
      password: true,
    },
  });

  if (!userWithPassword) throw new Error('User not found');

  const isValid = await comparePassword(password, userWithPassword.password!);
  if (!isValid) throw new Error('Invalid password');

  const token = generateToken({ userId: userWithPassword.id, email: userWithPassword.email });
  const refresh = token;

  return { user: normalizeUser(userWithPassword), token, refreshToken: refresh };
};

export const createUser = async (credentials: RegisterCredentials): Promise<AuthResult> => {
  const hashedPassword = await hashPassword(credentials.password);
  const user = await prisma.user.create({
    data: { name: credentials.name, email: credentials.email, password: hashedPassword },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      bio: true,
      isOnline: true,
      lastSeen: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const token = generateToken({ userId: user.id, email: user.email });
  const refresh = token;

  return { user: normalizeUser(user), token, refreshToken: refresh };
};

// ------------------ Other Helpers ------------------
export function sanitizeUser(user: User & { password?: string }): User {
  // Remove password in a way that doesn't create unused variable warnings
  const copy = { ...user };
  if (copy.password !== undefined) delete copy.password;
  return copy as User;
}

export function generateSecureToken(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JWTPayload | null;
    return !decoded || !decoded.exp || Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}

export function refreshToken(token: string): string | null {
  const payload = verifyToken(token);
  if (!payload) return null;
  return generateToken({ userId: payload.userId, email: payload.email, sessionId: payload.sessionId });
}
