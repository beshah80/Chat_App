import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken, comparePassword, sanitizeUser } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    // Get session ID from headers for multi-user support
    const sessionId = request.headers.get('x-session-id') || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim()
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update user's online status and last seen - allow multiple sessions
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isOnline: true,
        lastSeen: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        lastSeen: true,
        isOnline: true
      }
    });

    // Generate JWT token with session ID for uniqueness
    const token = generateToken({ 
      userId: user.id, 
      email: user.email,
      sessionId: sessionId
    });

    // Return response with multiple session support
    const response = NextResponse.json(
      { 
        success: true,
        user: updatedUser, 
        token, 
        sessionId,
        message: 'Login successful' 
      },
      { status: 200 }
    );

    // Set HTTP-only cookie with session-specific name to allow multiple sessions
    response.cookies.set(`auth-token-${sessionId.slice(-8)}`, token, {
      httpOnly: false, // Allow client-side access for multiple sessions
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // More permissive for multiple browser sessions
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Also set a general token for compatibility
    response.cookies.set('auth-token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}