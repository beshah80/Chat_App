import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const GET = withAuth(async (
  request: NextRequest,
  user: any,
  { params }: { params: { conversationId: string } }
) => {
  try {
    const { conversationId } = params;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Verify user is a participant in this conversation
    const participant = await prisma.participant.findUnique({
      where: {
        userId_conversationId: {
          userId: user.id,
          conversationId
        }
      }
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Build query conditions
    const whereConditions: any = {
      conversationId,
      isDeleted: false
    };

    if (cursor) {
      whereConditions.id = {
        lt: cursor
      };
    }

    // Fetch messages
    const messages = await prisma.message.findMany({
      where: whereConditions,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        replyTo: {
          include: {
            sender: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        messageStatus: {
          where: {
            userId: user.id
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    // Mark messages as delivered if they haven't been already
    const undeliveredMessages = messages.filter(msg => 
      msg.senderId !== user.id && 
      !msg.messageStatus.some(status => status.status === 'DELIVERED')
    );

    if (undeliveredMessages.length > 0) {
      await Promise.all(
        undeliveredMessages.map(msg =>
          prisma.messageStatus.upsert({
            where: {
              messageId_userId: {
                messageId: msg.id,
                userId: user.id
              }
            },
            update: {
              status: 'DELIVERED',
              timestamp: new Date()
            },
            create: {
              messageId: msg.id,
              userId: user.id,
              status: 'DELIVERED'
            }
          })
        )
      );
    }

    // Format messages for frontend
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      type: msg.type,
      senderId: msg.senderId,
      senderName: msg.sender.name,
      conversationId: msg.conversationId,
      timestamp: msg.createdAt,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      status: msg.messageStatus[0]?.status === 'READ' ? 'read' : 
              msg.messageStatus[0]?.status === 'DELIVERED' ? 'delivered' : 'sent',
      isOwn: msg.senderId === user.id
    })).reverse(); // Reverse to show oldest first

    // Update participant's last read timestamp
    await prisma.participant.update({
      where: {
        userId_conversationId: {
          userId: user.id,
          conversationId
        }
      },
      data: {
        lastReadAt: new Date()
      }
    });

    return NextResponse.json({
      messages: formattedMessages,
      hasMore: messages.length === limit,
      nextCursor: messages.length > 0 ? messages[messages.length - 1].id : null
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
});