import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { addUserToGlobalChat, prisma } from './prisma';

interface SocketData {
  userId?: string;
  username?: string;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  userId?: string;
  username?: string;
}

declare global {
  namespace NodeJS {
    interface Global {
      io: SocketIOServer | undefined;
    }
  }
}

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

// Track users with session support to prevent duplicates
const userSessions = new Map<string, { userId: string; socketId: string; sessionId: string; rooms: Set<string> }>();
const activeUserSessions = new Map<string, Set<string>>(); // userId -> set of session IDs

// Create or get global chat
export async function createGlobalChat() {
  let globalChat = await prisma.conversation.findFirst({
    where: {
      isGlobal: true,
      type: 'GLOBAL'
    }
  });

  if (!globalChat) {
    globalChat = await prisma.conversation.create({
      data: {
        name: 'Global Chat',
        type: 'GLOBAL',
        isGlobal: true
      }
    });
  }

  return globalChat;
}

export const initSocket = (res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log('Starting Socket.IO server...');

    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_APP_URL 
          : ["http://localhost:3000", "http://127.0.0.1:3000"],
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // Enhanced global chat join with session support
      socket.on('joinGlobal', async (userId: string) => {
        try {
          if (!userId) {
            console.warn('Invalid userId for global join');
            return;
          }

          const sessionId = socket.handshake.query.sessionId?.toString() || `session_${socket.id}`;
          const globalChat = await createGlobalChat();
          const roomId = `global-${globalChat.id}`;

          // Check if this specific session is already in the room
          const existingSession = userSessions.get(`${userId}-${sessionId}`);
          if (existingSession && existingSession.rooms.has(roomId)) {
            console.log(`User ${userId} session ${sessionId} already in global chat`);
            return;
          }

          // Update user status - only if they don't have any active sessions
          if (!activeUserSessions.has(userId)) {
            await prisma.user.update({
              where: { id: userId },
              data: { lastSeen: new Date(), isOnline: true },
            });
          }

          // Add user to global chat in database
          await addUserToGlobalChat(userId);

          // Join socket to global chat room
          socket.join(globalChat.id);
          
          // Track this session
          const sessionData = userSessions.get(`${userId}-${sessionId}`) || {
            userId,
            socketId: socket.id,
            sessionId,
            rooms: new Set()
          };
          sessionData.rooms.add(roomId);
          userSessions.set(`${userId}-${sessionId}`, sessionData);

          // Track active sessions for this user
          if (!activeUserSessions.has(userId)) {
            activeUserSessions.set(userId, new Set());
          }
          activeUserSessions.get(userId)?.add(sessionId);

          // Store session info in socket for cleanup
          socket.data.userId = userId;
          socket.data.sessionId = sessionId;

          // Only emit user status if this is their first session
          if (activeUserSessions.get(userId)?.size === 1) {
            io.emit('userStatus', { userId, online: true });
          }

          console.log(`User ${userId} session ${sessionId} joined global chat ${globalChat.id}`);
        } catch (error) {
          console.error('Error joining global chat:', error);
          socket.emit('error', { 
            message: 'Failed to join global chat',
            type: 'JOIN_ERROR'
          });
        }
      });

      // Enhanced private conversation join
      socket.on('joinPrivate', (conversationId: string) => {
        try {
          const userId = socket.data.userId;
          const sessionId = socket.data.sessionId;
          
          if (!userId || !sessionId) {
            console.warn('No userId or sessionId found in socket data for private join');
            return;
          }

          const sessionKey = `${userId}-${sessionId}`;
          const sessionData = userSessions.get(sessionKey) || {
            userId,
            socketId: socket.id,
            sessionId,
            rooms: new Set()
          };
          
          const roomId = `private-${conversationId}`;
          
          if (sessionData.rooms.has(roomId)) {
            console.log(`User ${userId} session ${sessionId} already in private conversation ${conversationId}`);
            return;
          }

          socket.join(conversationId);
          sessionData.rooms.add(roomId);
          userSessions.set(sessionKey, sessionData);

          console.log(`User ${userId} session ${sessionId} joined private conversation ${conversationId}`);
        } catch (error) {
          console.error('Error joining private conversation:', error);
          socket.emit('error', { 
            message: 'Failed to join private conversation',
            type: 'JOIN_ERROR'
          });
        }
      });

      // Enhanced message sending with better error handling
      socket.on('sendMessage', async (data: any) => {
        try {
          const { conversationId, senderId, content, type = 'TEXT', replyToId, tempId } = data;

          // Validate required fields
          if (!conversationId || !senderId || !content?.trim()) {
            socket.emit('error', { 
              message: 'Missing required fields',
              type: 'VALIDATION_ERROR'
            });
            return;
          }

          // Validate user authorization
          const userId = socket.data.userId;
          if (userId !== senderId) {
            socket.emit('error', { 
              message: 'Unauthorized to send message',
              type: 'AUTH_ERROR'
            });
            return;
          }

          // Save message in database
          const message = await prisma.message.create({
            data: {
              content: content.trim(),
              type,
              senderId,
              conversationId,
              replyToId,
            },
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                }
              }
            }
          });

          // Update conversation lastMessageAt
          await prisma.conversation.update({
            where: { id: conversationId },
            data: { lastMessageAt: new Date() }
          });

          // Emit message to all in room
          const messageData = {
            id: message.id,
            content: message.content,
            type: message.type,
            senderId: message.senderId,
            senderName: message.sender.name,
            conversationId: message.conversationId,
            timestamp: message.createdAt,
            createdAt: message.createdAt,
            status: 'sent',
            tempId
          };

          io.to(conversationId).emit('message', messageData);

          // Enhanced status updates with realistic timing
          setTimeout(() => {
            io.to(conversationId).emit('messageStatus', {
              messageId: message.id,
              tempId,
              status: 'delivered',
            });
          }, 200 + Math.random() * 300); // 200-500ms

          setTimeout(() => {
            io.to(conversationId).emit('messageStatus', {
              messageId: message.id,
              tempId,
              status: 'read',
            });
          }, 1000 + Math.random() * 2000); // 1-3 seconds

        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { 
            message: 'Failed to send message',
            type: 'MESSAGE_ERROR'
          });
        }
      });

      // Enhanced typing indicators with conversation-specific tracking
      socket.on('typing', (data: { conversationId: string; userId: string; name: string }) => {
        try {
          const { conversationId, userId, name } = data;
          if (!conversationId || !userId || !name) {
            return;
          }

          // Only send to other users in the conversation
          socket.to(conversationId).emit('userTyping', {
            userId,
            name,
            conversationId
          });
        } catch (error) {
          console.error('Error handling typing:', error);
        }
      });

      socket.on('stopTyping', (data: { conversationId: string; userId: string }) => {
        try {
          const { conversationId, userId } = data;
          if (!conversationId || !userId) {
            return;
          }

          socket.to(conversationId).emit('userStoppedTyping', {
            userId,
            conversationId
          });
        } catch (error) {
          console.error('Error handling stop typing:', error);
        }
      });

      // Enhanced offline handling with session awareness
      socket.on('goOffline', async (userId: string) => {
        try {
          const sessionId = socket.data.sessionId;
          if (!sessionId) return;

          // Remove this session
          const sessionKey = `${userId}-${sessionId}`;
          userSessions.delete(sessionKey);
          
          // Remove from active sessions
          if (activeUserSessions.has(userId)) {
            activeUserSessions.get(userId)?.delete(sessionId);
            
            // Only mark user offline if no other sessions exist
            if (activeUserSessions.get(userId)?.size === 0) {
              await prisma.user.update({
                where: { id: userId },
                data: { 
                  isOnline: false,
                  lastSeen: new Date() 
                },
              });

              io.emit('userStatus', { userId, online: false });
              activeUserSessions.delete(userId);
            }
          }
          
          console.log(`User ${userId} session ${sessionId} went offline`);
        } catch (error) {
          console.error('Error updating offline status:', error);
        }
      });

      // Enhanced disconnect handling
      socket.on('disconnect', async () => {
        console.log(`Socket disconnected: ${socket.id}`);
        
        try {
          const userId = socket.data.userId;
          const sessionId = socket.data.sessionId;
          
          if (userId && sessionId) {
            // Clean up this session
            const sessionKey = `${userId}-${sessionId}`;
            userSessions.delete(sessionKey);
            
            // Handle user status
            if (activeUserSessions.has(userId)) {
              activeUserSessions.get(userId)?.delete(sessionId);
              
              // Only mark offline if no other sessions exist
              if (activeUserSessions.get(userId)?.size === 0) {
                await prisma.user.update({
                  where: { id: userId },
                  data: { 
                    isOnline: false,
                    lastSeen: new Date() 
                  },
                });

                io.emit('userStatus', { userId, online: false });
                activeUserSessions.delete(userId);
                
                console.log(`User ${userId} marked offline (all sessions disconnected)`);
              } else {
                console.log(`User ${userId} still has ${activeUserSessions.get(userId)?.size} active sessions`);
              }
            }
          }
        } catch (error) {
          console.error('Error handling disconnect:', error);
        }
      });

      // Connection heartbeat for better connection monitoring
      socket.on('ping', () => {
        socket.emit('pong');
      });
    });

    res.socket.server.io = io;
  }

  return res.socket.server.io;
};