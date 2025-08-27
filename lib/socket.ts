import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import { Socket, Server as SocketIOServer } from 'socket.io';
import { addUserToGlobalChat, prisma } from './prisma';

interface SocketSendMessageData {
  conversationId: string;
  senderId: string;
  content: string;
  type?: 'TEXT' | 'IMAGE' | 'FILE';
  replyToId?: string;
  tempId?: string;
}

declare global {
  var io: SocketIOServer | undefined;
}

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

// Track users with session support
const userSessions = new Map<string, { userId: string; socketId: string; sessionId: string; rooms: Set<string> }>();
const activeUserSessions = new Map<string, Set<string>>(); // userId -> set of session IDs

// Create or get global chat
export async function createGlobalChat() {
  let globalChat = await prisma.conversation.findFirst({
    where: { isGlobal: true, type: 'GLOBAL' }
  });

  if (!globalChat) {
    globalChat = await prisma.conversation.create({
      data: { name: 'Global Chat', type: 'GLOBAL', isGlobal: true }
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
        origin:
          process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_APP_URL
            : ['http://localhost:3000', 'http://127.0.0.1:3000'],
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    io.on('connection', (socket: Socket) => {
      console.log(`Socket connected: ${socket.id}`);

      socket.on('joinGlobal', async (userId: string) => {
        try {
          if (!userId) return;

          const sessionId = socket.handshake.query.sessionId?.toString() || `session_${socket.id}`;
          const globalChat = await createGlobalChat();
          const roomId = `global-${globalChat.id}`;

          const existingSession = userSessions.get(`${userId}-${sessionId}`);
          if (existingSession && existingSession.rooms.has(roomId)) return;

          if (!activeUserSessions.has(userId)) {
            await prisma.user.update({
              where: { id: userId },
              data: { lastSeen: new Date(), isOnline: true }
            });
          }

          await addUserToGlobalChat(userId);

          socket.join(globalChat.id);

          const sessionData = userSessions.get(`${userId}-${sessionId}`) || {
            userId,
            socketId: socket.id,
            sessionId,
            rooms: new Set()
          };
          sessionData.rooms.add(roomId);
          userSessions.set(`${userId}-${sessionId}`, sessionData);

          if (!activeUserSessions.has(userId)) activeUserSessions.set(userId, new Set());
          activeUserSessions.get(userId)?.add(sessionId);

          socket.data.userId = userId;
          socket.data.sessionId = sessionId;

          if (activeUserSessions.get(userId)?.size === 1) {
            io.emit('userStatus', { userId, online: true });
          }
        } catch (error) {
          console.error('Error joining global chat:', error);
          socket.emit('error', { message: 'Failed to join global chat', type: 'JOIN_ERROR' });
        }
      });

      socket.on('joinPrivate', (conversationId: string) => {
        try {
          const userId = socket.data.userId;
          const sessionId = socket.data.sessionId;
          if (!userId || !sessionId) return;

          const sessionKey = `${userId}-${sessionId}`;
          const sessionData = userSessions.get(sessionKey) || {
            userId,
            socketId: socket.id,
            sessionId,
            rooms: new Set()
          };

          const roomId = `private-${conversationId}`;
          if (sessionData.rooms.has(roomId)) return;

          socket.join(conversationId);
          sessionData.rooms.add(roomId);
          userSessions.set(sessionKey, sessionData);
        } catch (error) {
          console.error('Error joining private conversation:', error);
          socket.emit('error', { message: 'Failed to join private conversation', type: 'JOIN_ERROR' });
        }
      });

      socket.on('sendMessage', async (data: SocketSendMessageData) => {
        try {
          const { conversationId, senderId, content, type = 'TEXT', replyToId, tempId } = data;
          if (!conversationId || !senderId || !content?.trim()) {
            socket.emit('error', { message: 'Missing required fields', type: 'VALIDATION_ERROR' });
            return;
          }

          const userId = socket.data.userId;
          if (userId !== senderId) {
            socket.emit('error', { message: 'Unauthorized to send message', type: 'AUTH_ERROR' });
            return;
          }

          const message = await prisma.message.create({
            data: { content: content.trim(), type, senderId, conversationId, replyToId },
            include: { sender: { select: { id: true, name: true, email: true, avatar: true } } }
          });

          await prisma.conversation.update({ where: { id: conversationId }, data: { lastMessageAt: new Date() } });

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

          setTimeout(() => io.to(conversationId).emit('messageStatus', { messageId: message.id, tempId, status: 'delivered' }), 200 + Math.random() * 300);
          setTimeout(() => io.to(conversationId).emit('messageStatus', { messageId: message.id, tempId, status: 'read' }), 1000 + Math.random() * 2000);
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message', type: 'MESSAGE_ERROR' });
        }
      });

      socket.on('typing', (data: { conversationId: string; userId: string; name: string }) => {
        if (!data.conversationId || !data.userId || !data.name) return;
        socket.to(data.conversationId).emit('userTyping', data);
      });

      socket.on('stopTyping', (data: { conversationId: string; userId: string }) => {
        if (!data.conversationId || !data.userId) return;
        socket.to(data.conversationId).emit('userStoppedTyping', data);
      });

      socket.on('goOffline', async (userId: string) => {
        try {
          const sessionId = socket.data.sessionId;
          if (!sessionId) return;

          const sessionKey = `${userId}-${sessionId}`;
          userSessions.delete(sessionKey);

          if (activeUserSessions.has(userId)) {
            activeUserSessions.get(userId)?.delete(sessionId);
            if (activeUserSessions.get(userId)?.size === 0) {
              await prisma.user.update({ where: { id: userId }, data: { isOnline: false, lastSeen: new Date() } });
              io.emit('userStatus', { userId, online: false });
              activeUserSessions.delete(userId);
            }
          }
        } catch (error) {
          console.error('Error updating offline status:', error);
        }
      });

      socket.on('disconnect', async () => {
        const userId = socket.data.userId;
        const sessionId = socket.data.sessionId;
        if (userId && sessionId) {
          const sessionKey = `${userId}-${sessionId}`;
          userSessions.delete(sessionKey);
          if (activeUserSessions.has(userId)) {
            activeUserSessions.get(userId)?.delete(sessionId);
            if (activeUserSessions.get(userId)?.size === 0) {
              await prisma.user.update({ where: { id: userId }, data: { isOnline: false, lastSeen: new Date() } });
              io.emit('userStatus', { userId, online: false });
              activeUserSessions.delete(userId);
            }
          }
        }
      });

      socket.on('ping', () => socket.emit('pong'));
    });

    res.socket.server.io = io;
  }

  return res.socket.server.io;
};
