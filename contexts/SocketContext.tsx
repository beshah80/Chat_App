'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinGlobalChat: (userId: string) => void;
  joinPrivateChat: (conversationId: string) => void;
  sendMessage: (data: any) => void;
  onlineUsers: Set<string>;
  goOffline: (userId: string) => void;
  startTyping: (conversationId: string, userId: string, name: string) => void;
  stopTyping: (conversationId: string, userId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  joinGlobalChat: () => {},
  joinPrivateChat: () => {},
  sendMessage: () => {},
  onlineUsers: new Set(),
  goOffline: () => {},
  startTyping: () => {},
  stopTyping: () => {},
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const socketRef = useRef<Socket | null>(null);
  const joinedRoomsRef = useRef<Set<string>>(new Set());
  const sessionIdRef = useRef<string>('');
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const heartbeatIntervalRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptRef = useRef<number>(0);

  // Generate unique session ID for this browser session
  const getSessionId = useCallback((): string => {
    if (sessionIdRef.current) return sessionIdRef.current;

    let sessionId = sessionStorage.getItem('socket-session-id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      sessionStorage.setItem('socket-session-id', sessionId);
    }
    sessionIdRef.current = sessionId;
    return sessionId;
  }, []);

  const initializeSocket = useCallback(async () => {
    try {
      if (socketRef.current?.connected) {
        return socketRef.current;
      }

      // Ensure server is initialized
      await fetch('/api/socket', { method: 'POST' });

      const sessionId = getSessionId();

      const socketInstance: Socket = io(window.location.origin, {
        path: '/api/socket',
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        query: { sessionId },
      });

      socketRef.current = socketInstance;

      // Connected
      socketInstance.on('connect', () => {
        console.log(`Connected with session: ${sessionId}`);
        setIsConnected(true);
        reconnectAttemptRef.current = 0;

        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
        heartbeatIntervalRef.current = setInterval(() => {
          if (socketInstance.connected) {
            socketInstance.emit('ping');
          }
        }, 30000);
      });

      // Disconnected
      socketInstance.on('disconnect', (reason) => {
        console.log(`Disconnected: ${reason}`);
        setIsConnected(false);
        joinedRoomsRef.current.clear();

        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
      });

      // Connection error
      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);

        reconnectAttemptRef.current += 1;
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current), 30000);

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          if (!socketInstance.connected) {
            console.log('Attempting to reconnect...');
            socketInstance.connect();
          }
        }, delay);
      });

      socketInstance.on('error', (error) => {
        console.error('Socket error:', error);
      });

      // Track online users
      socketInstance.on('userStatus', (data: { userId: string; online: boolean }) => {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          if (data.online) {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      });

      socketInstance.on('pong', () => {
        // Heartbeat OK
      });

      setSocket(socketInstance);
      return socketInstance;
    } catch (error) {
      console.error('Failed to initialize socket:', error);
      setIsConnected(false);
      return null;
    }
  }, [getSessionId]);

  useEffect(() => {
    initializeSocket();

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      joinedRoomsRef.current.clear();
    };
  }, [initializeSocket]);

  // API methods
  const joinGlobalChat = useCallback(
    (userId: string) => {
      if (socket && isConnected && userId && !joinedRoomsRef.current.has(`global-${userId}`)) {
        socket.emit('joinGlobal', userId);
        joinedRoomsRef.current.add(`global-${userId}`);
      }
    },
    [socket, isConnected]
  );

  const joinPrivateChat = useCallback(
    (conversationId: string) => {
      if (
        socket &&
        isConnected &&
        conversationId &&
        !joinedRoomsRef.current.has(`private-${conversationId}`)
      ) {
        socket.emit('joinPrivate', conversationId);
        joinedRoomsRef.current.add(`private-${conversationId}`);
      }
    },
    [socket, isConnected]
  );

  const sendMessage = useCallback(
    (data: any) => {
      if (socket && isConnected && data) {
        socket.emit('sendMessage', data);
      }
    },
    [socket, isConnected]
  );

  const goOffline = useCallback(
    (userId: string) => {
      if (socket && userId) {
        socket.emit('goOffline', userId);
      }
    },
    [socket]
  );

  const startTyping = useCallback(
    (conversationId: string, userId: string, name: string) => {
      if (socket && isConnected && conversationId && userId && name) {
        socket.emit('typing', { conversationId, userId, name });
      }
    },
    [socket, isConnected]
  );

  const stopTyping = useCallback(
    (conversationId: string, userId: string) => {
      if (socket && isConnected && conversationId && userId) {
        socket.emit('stopTyping', { conversationId, userId });
      }
    },
    [socket, isConnected]
  );

  // Handle page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page hidden, keeping socket alive');
      } else if (!document.hidden && socket && !socket.connected) {
        console.log('Page visible, reconnecting...');
        initializeSocket();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [socket, initializeSocket]);

  const value: SocketContextType = {
    socket,
    isConnected,
    joinGlobalChat,
    joinPrivateChat,
    sendMessage,
    onlineUsers,
    goOffline,
    startTyping,
    stopTyping,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
