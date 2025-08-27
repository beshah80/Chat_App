// app/api/conversations/direct/route.ts
import { withAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Type for the authenticated user payload
interface UserPayload {
  id: string;
  email: string;
  name?: string;
}

const createDirectConversationSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
});

export const POST = withAuth(async (request: NextRequest, user: UserPayload) => {
  try {
    const body = await request.json();
    const { userId: otherUserId } = createDirectConversationSchema.parse(body);

    // Check if the other user exists
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: { id: true, name: true, email: true, avatar: true, isOnline: true, lastSeen: true }
    });

    if (!otherUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if a direct conversation already exists between these users
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        type: 'DIRECT',
        participants: {
          some: { userId: user.id },
        },
        AND: [
          { participants: { some: { userId: otherUserId } } },
        ],
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true, isOnline: true, lastSeen: true }
            }
          }
        }
      }
    });

    // Ensure conv is not null by using NonNullable
    const formatConversation = (conv: NonNullable<typeof existingConversation>) => ({
      id: conv.id,
      name: otherUser.name,
      type: conv.type,
      isGlobal: conv.isGlobal,
      avatar: otherUser.avatar ?? undefined,
      participants: conv.participants.map(p => ({
        id: p.user.id,
        name: p.user.name,
        email: p.user.email,
        avatar: p.user.avatar ?? undefined,
        isOnline: p.user.isOnline,
        lastSeen: p.user.lastSeen,
        role: p.role
      })),
      createdAt: conv.createdAt
    });

    if (existingConversation) {
      return NextResponse.json({
        conversation: formatConversation(existingConversation),
        isNew: false
      });
    }

    // Create new direct conversation
    const newConversation = await prisma.conversation.create({
      data: {
        type: 'DIRECT',
        participants: {
          create: [
            { userId: user.id, role: 'MEMBER' },
            { userId: otherUserId, role: 'MEMBER' }
          ]
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true, isOnline: true, lastSeen: true }
            }
          }
        }
      }
    });

    return NextResponse.json({
      conversation: formatConversation(newConversation),
      isNew: true
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      const flattened = error.flatten();
      return NextResponse.json(
        { error: 'Validation error', details: flattened.fieldErrors },
        { status: 400 }
      );
    }

    console.error('Error creating direct conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
});
