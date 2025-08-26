import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const payload = verifyToken(token);
      
      if (payload?.userId) {
        // Update user's online status
        await prisma.user.update({
          where: { id: payload.userId },
          data: {
            isOnline: false,
            lastSeen: new Date()
          }
        }).catch(err => {
          // Don't fail logout if user update fails
          console.warn('Failed to update user status on logout:', err);
        });
      }
    }

    // Create response
    const response = NextResponse.json(
      { 
        success: true,
        message: 'Logged out successfully' 
      },
      { status: 200 }
    );

    // Clear the auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // Expire immediately
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    
    // Still return success even if there's an error
    // The cookie will still be cleared on the client side
    const response = NextResponse.json(
      { 
        success: true,
        message: 'Logged out successfully' 
      },
      { status: 200 }
    );

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    return response;
  }
}