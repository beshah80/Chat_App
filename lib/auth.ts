import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export interface JWTPayload {
  userId: string;
  email: string;
  sessionId?: string;
  iat?: number;
  exp?: number;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResult {
  user: any;
  token: string;
  refreshToken: string;
}

// Generate JWT token
export function generateToken(payload: { userId: string; email: string; sessionId?: string }): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Compare password with hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

// Middleware function to verify authentication
export function requireAuth(token: string | null): JWTPayload {
  if (!token) {
    throw new Error('Authentication required');
  }

  const payload = verifyToken(token);
  if (!payload) {
    throw new Error('Invalid or expired token');
  }

  return payload;
}

// Higher-order function for API route authentication
export function withAuth<T extends any[]>(
  handler: (request: NextRequest, user: any, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      // Extract token from Authorization header
      const authHeader = request.headers.get('authorization');
      const token = extractTokenFromHeader(authHeader);

      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Verify token
      const payload = verifyToken(token);
      if (!payload) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Get user from database
      const user = await prisma.user.findUnique({
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

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Call the original handler with user data
      return handler(request, user, ...args);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

// Generate a secure random string (for password reset tokens, etc.)
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    if (!decoded || !decoded.exp) {
      return true;
    }
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}

// Refresh token (generate new token with same payload but extended expiry)
export function refreshToken(token: string): string | null {
  try {
    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }

    // Generate new token with same payload
    return generateToken({
      userId: payload.userId,
      email: payload.email,
      sessionId: payload.sessionId
    });
  } catch {
    return null;
  }
}

// Hash email for consistent user identification
export function hashEmail(email: string): string {
  return bcrypt.hashSync(email.toLowerCase().trim(), 10);
}

// Sanitize user data for API responses
export function sanitizeUser(user: any) {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
}

export const authenticateUser = async (credentials: LoginCredentials): Promise<AuthResult> => {
  const { email, password } = credentials;
  const user = await prisma.user.findUnique({
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
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error('Invalid password');
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    sessionId: 'session-id'
  });

  const refreshToken = refreshToken(token);

  return {
    user,
    token,
    refreshToken
  };
};

export const createUser = async (credentials: RegisterCredentials): Promise<AuthResult> => {
  const { name, email, password } = credentials;
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
    },
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

  const token = generateToken({
    userId: user.id,
    email: user.email,
    sessionId: 'session-id'
  });

  const refreshToken = refreshToken(token);

  return {
    user,
    token,
    refreshToken
  };
};

export default {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  extractTokenFromHeader,
  requireAuth,
  withAuth,
  generateSecureToken,
  isTokenExpired,
  refreshToken,
  hashEmail,
  sanitizeUser
};