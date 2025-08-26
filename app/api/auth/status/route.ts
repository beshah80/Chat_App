import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { isOnline } = body;

    if (typeof isOnline !== 'boolean') {
      return NextResponse.json({ error: 'Invalid isOnline value' }, { status: 400 });
    }

    // Update user's online status
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        isOnline,
        lastSeen: new Date(),
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

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Status updated successfully'
    });

  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle beacon requests for page unload
export async function POST(request: NextRequest) {
  try {
    // For beacon requests, we might not have proper headers
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (token) {
      const payload = verifyToken(token);
      if (payload?.userId) {
        // Update user to offline
        await prisma.user.update({
          where: { id: payload.userId },
          data: {
            isOnline: false,
            lastSeen: new Date(),
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Beacon status update error:', error);
    return NextResponse.json({ success: false });
  }
}