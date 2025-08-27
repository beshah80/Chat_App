'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChatInterface } from '../../components/chat/ChatInterface';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import type { User as ChatUser, Conversation } from '../../types/chat';

// Incoming user type from API / context
type IncomingUser = Partial<ChatUser> & { avatar?: string | null };

// Normalize user: convert null avatar to undefined
function normalizeUser(user: IncomingUser): ChatUser {
  return {
    id: user.id!,
    name: user.name!,
    email: user.email!,
    avatar: user.avatar ?? undefined,
    bio: user.bio ?? undefined,
    isOnline: user.isOnline ?? false,
    lastSeen: user.lastSeen ?? new Date(),
    createdAt: user.createdAt ?? new Date(),
    updatedAt: user.updatedAt ?? new Date(),
  };
}

export default function ChatPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { joinGlobalChat } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasJoinedGlobalRef = useRef(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/');
  }, [authLoading, isAuthenticated, router]);

  // Join global chat once
  useEffect(() => {
    if (user && isAuthenticated && !hasJoinedGlobalRef.current) {
      const normalized = normalizeUser(user as IncomingUser);
      joinGlobalChat(normalized.id);
      hasJoinedGlobalRef.current = true;
    }
  }, [user, isAuthenticated, joinGlobalChat]);

  // Reset join flag if user changes
  useEffect(() => {
    if (!user || !isAuthenticated) hasJoinedGlobalRef.current = false;
  }, [user, isAuthenticated]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user || !isAuthenticated) return;

      try {
        setIsLoadingConversations(true);
        const token = localStorage.getItem('auth-token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await fetch('/api/conversations', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setConversations(data.conversations || []);
          setError(null);
        } else {
          try {
            const errorData = await response.json();
            setError(errorData.error || 'Failed to fetch conversations');
          } catch {
            setError('Failed to fetch conversations');
          }
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setConversations([]);
        setError(null);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    if (user && isAuthenticated) fetchConversations();
  }, [user, isAuthenticated]);

  const handleLogout = async () => {
    try {
      await logout();
      hasJoinedGlobalRef.current = false;
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
      hasJoinedGlobalRef.current = false;
      router.push('/');
    }
  };

  // Loading / redirect UI
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">{authLoading ? 'Authenticating...' : 'Redirecting...'}</p>
        </div>
      </div>
    );
  }

  if (isLoadingConversations && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading your chats...</p>
        </div>
      </div>
    );
  }

  if (error && error.includes('authentication')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              handleLogout();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }

  const normalizedUser = normalizeUser(user as IncomingUser);

  return (
    <ChatInterface
      user={normalizedUser}
      conversations={conversations}
      onLogout={handleLogout}
    />
  );
}
