// app/api/conversations/[conversationId]/messages/send/route.ts
import { User, withAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// ---------------- Zod schema ----------------
const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required').max(4000, 'Message too long'),
  type: z.enum(['TEXT', 'IMAGE', 'FILE']).default('TEXT'),
  replyToId: z.string().optional(),
});

// ---------------- POST handler ----------------
export const POST = withAuth(async (
  request: NextRequest,
  user: User,
  { params }: { params: { conversationId: string } }
) => {
  try {
    const { conversationId } = params;
    const body = await request.json();

    // Validate body with Zod
    const { content, type, replyToId } = sendMessageSchema.parse(body);

    // Verify user is a participant
    const participant = await prisma.participant.findUnique({
      where: { userId_conversationId: { userId: user.id, conversationId } }
    });

    if (!participant) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Verify reply-to message exists if provided
    if (replyToId) {
      const replyToMessage = await prisma.message.findFirst({
        where: { id: replyToId, conversationId }
      });

      if (!replyToMessage) {
        return NextResponse.json({ error: 'Reply-to message not found' }, { status: 400 });
      }
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        type,
        senderId: user.id,
        conversationId,
        replyToId: replyToId || null
      },
      include: {
        sender: { select: { id: true, name: true, email: true, avatar: true } },
        replyTo: { include: { sender: { select: { id: true, name: true } } } }
      }
    });

    // Update conversation's last message timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() }
    });

    // Create sender message status
    await prisma.messageStatus.create({
      data: { messageId: message.id, userId: user.id, status: 'SENT' }
    });

    // Create delivery status for other participants
    const otherParticipants = await prisma.participant.findMany({
      where: { conversationId, userId: { not: user.id } },
      select: { userId: true }
    });

    if (otherParticipants.length > 0) {
      await prisma.messageStatus.createMany({
        data: otherParticipants.map(p => ({
          messageId: message.id,
          userId: p.userId,
          status: 'DELIVERED' as const
        }))
      });
    }

    // Format message for response
    const formattedMessage = {
      id: message.id,
      content: message.content,
      type: message.type,
      senderId: message.senderId,
      senderName: message.sender.name,
      conversationId: message.conversationId,
      timestamp: message.createdAt,
      createdAt: message.createdAt,
      status: 'sent',
      isOwn: true
    };

    return NextResponse.json({ message: formattedMessage }, { status: 201 });

  } catch (error) {
    // Fix Zod error handling
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.flatten() },
        { status: 400 }
      );
    }

    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
});
