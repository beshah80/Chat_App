import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createDirectConversationSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
});

export const POST = withAuth(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json();
    const { userId: otherUserId } = createDirectConversationSchema.parse(body);

    // Check if the other user exists
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: { id: true, name: true, email: true, avatar: true }
    });

    if (!otherUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if a direct conversation already exists between these users
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        type: 'DIRECT',
        participants: {
          every: {
            userId: {
              in: [user.id, otherUserId]
            }
          }
        },
        AND: [
          {
            participants: {
              some: { userId: user.id }
            }
          },
          {
            participants: {
              some: { userId: otherUserId }
            }
          }
        ]
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                isOnline: true,
                lastSeen: true
              }
            }
          }
        }
      }
    });

    if (existingConversation) {
      // Format existing conversation
      const formattedConversation = {
        id: existingConversation.id,
        name: otherUser.name,
        type: existingConversation.type,
        isGlobal: existingConversation.isGlobal,
        avatar: otherUser.avatar,
        participants: existingConversation.participants.map(p => ({
          id: p.user.id,
          name: p.user.name,
          email: p.user.email,
          avatar: p.user.avatar,
          isOnline: p.user.isOnline,
          lastSeen: p.user.lastSeen,
          role: p.role
        })),
        createdAt: existingConversation.createdAt
      };

      return NextResponse.json({
        conversation: formattedConversation,
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
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                isOnline: true,
                lastSeen: true
              }
            }
          }
        }
      }
    });

    // Format new conversation
    const formattedConversation = {
      id: newConversation.id,
      name: otherUser.name,
      type: newConversation.type,
      isGlobal: newConversation.isGlobal,
      avatar: otherUser.avatar,
      participants: newConversation.participants.map(p => ({
        id: p.user.id,
        name: p.user.name,
        email: p.user.email,
        avatar: p.user.avatar,
        isOnline: p.user.isOnline,
        lastSeen: p.user.lastSeen,
        role: p.role
      })),
      createdAt: newConversation.createdAt
    };

    return NextResponse.json({
      conversation: formattedConversation,
      isNew: true
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
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