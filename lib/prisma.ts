import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Helper function to add user to global chat
export async function addUserToGlobalChat(userId: string) {
  try {
    // First, find or create the global chat
    let globalChat = await prisma.conversation.findFirst({
      where: {
        isGlobal: true,
        type: 'GLOBAL'
      }
    });

    // Create global chat if it doesn't exist (without any welcome messages)
    if (!globalChat) {
      globalChat = await prisma.conversation.create({
        data: {
          name: 'Global Chat',
          type: 'GLOBAL',
          isGlobal: true
        }
      });
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.participant.findUnique({
      where: {
        userId_conversationId: {
          userId: userId,
          conversationId: globalChat.id
        }
      }
    });

    // Add user to global chat if not already added (without join messages)
    if (!existingParticipant) {
      await prisma.participant.create({
        data: {
          userId: userId,
          conversationId: globalChat.id,
          role: 'MEMBER'
        }
      });
    }

    return globalChat;
  } catch (error) {
    console.error('Error adding user to global chat:', error);
    throw error;
  }
}

// Helper function to get user conversations
export async function getUserConversations(userId: string) {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: userId
          }
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
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: [
        {
          isGlobal: 'desc' // Global chat first
        },
        {
          lastMessageAt: 'desc'
        },
        {
          createdAt: 'desc'
        }
      ]
    });

    return conversations;
  } catch (error) {
    console.error('Error getting user conversations:', error);
    throw error;
  }
}

// Helper function to create direct conversation
export async function createDirectConversation(userId1: string, userId2: string) {
  try {
    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        type: 'DIRECT',
        AND: [
          {
            participants: {
              some: {
                userId: userId1
              }
            }
          },
          {
            participants: {
              some: {
                userId: userId2
              }
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
      return existingConversation;
    }

    // Create new direct conversation
    const conversation = await prisma.conversation.create({
      data: {
        type: 'DIRECT',
        participants: {
          create: [
            {
              userId: userId1,
              role: 'MEMBER'
            },
            {
              userId: userId2,
              role: 'MEMBER'
            }
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

    return conversation;
  } catch (error) {
    console.error('Error creating direct conversation:', error);
    throw error;
  }
}

// Helper function to search users by name or email
export async function searchUsers(query: string, currentUserId: string) {
  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            // Exclude current user from search results
            id: {
              not: currentUserId
            }
          },
          {
            // Search by name or email (case insensitive)
            OR: [
              {
                name: {
                  contains: query,
                  mode: 'insensitive'
                }
              },
              {
                email: {
                  contains: query,
                  mode: 'insensitive'
                }
              }
            ]
          }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true
      },
      orderBy: [
        {
          isOnline: 'desc' // Online users first
        },
        {
          name: 'asc' // Then alphabetically by name
        }
      ],
      take: 20 // Limit results
    });

    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
}

export default prisma;