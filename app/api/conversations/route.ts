import { withAuth } from '@/lib/auth';
import { getUserConversations, prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    // Get conversations with message count for unread badge
    const conversations = await getUserConversations(user.id);

    // Format conversations for frontend
    const formattedConversations = await Promise.all(conversations.map(async (conv) => {
      const otherParticipants = conv.participants.filter(p => p.userId !== user.id);
      const lastMessage = conv.messages[0];

      // Get unread message count - for now, count messages since last read
      // In a real app, this would be based on messageStatus table
      const participant = await prisma.participant.findFirst({
        where: {
          userId: user.id,
          conversationId: conv.id
        }
      });

      const unreadCount = await prisma.message.count({
        where: {
          conversationId: conv.id,
          senderId: { not: user.id },
          createdAt: {
            gt: participant?.lastReadAt || new Date(0)
          }
        }
      });

      let conversationName = conv.name;
      let conversationAvatar: string | null = null;

      // For direct messages, use the other user's name and avatar
      if (conv.type === 'DIRECT' && otherParticipants.length > 0) {
        const otherUser = otherParticipants[0].user;
        conversationName = otherUser.name;
        conversationAvatar = otherUser.avatar;
      }

      return {
        id: conv.id,
        name: conversationName,
        type: conv.type,
        isGlobal: conv.isGlobal,
        avatar: conversationAvatar,
        participants: conv.participants.map(p => ({
          id: p.user.id,
          name: p.user.name,
          email: p.user.email,
          avatar: p.user.avatar,
          isOnline: p.user.isOnline,
          lastSeen: p.user.lastSeen,
          role: p.role
        })),
        lastMessage: lastMessage ? {
          id: lastMessage.id,
          content: lastMessage.content,
          type: lastMessage.type,
          senderId: lastMessage.senderId,
          senderName: lastMessage.sender.name,
          conversationId: lastMessage.conversationId,
          timestamp: lastMessage.createdAt,
          createdAt: lastMessage.createdAt,
          status: 'delivered', // Default status for list view
          isOwn: lastMessage.senderId === user.id
        } : null,
        unreadCount: unreadCount,
        lastMessageAt: conv.lastMessageAt,
        createdAt: conv.createdAt
      };
    }));

    return NextResponse.json({
      success: true,
      conversations: formattedConversations
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch conversations'
      },
      { status: 500 }
    );
  }
});