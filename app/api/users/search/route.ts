import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { searchUsers } from '@/lib/prisma';

export const GET = withAuth(async (request: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        users: [],
        message: 'Query must be at least 2 characters long'
      });
    }

    const users = await searchUsers(query.trim(), user.id);

    return NextResponse.json({
      users
    });

  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    );
  }
});