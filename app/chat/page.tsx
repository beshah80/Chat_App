'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { ChatInterface } from '../../components/chat/ChatInterface';
import { Loader2 } from 'lucide-react';
import type { Conversation } from '../../types/chat';

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
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  // Join global chat when user is authenticated (only once)
  useEffect(() => {
    if (user && isAuthenticated && !hasJoinedGlobalRef.current) {
      console.log(`Attempting to join global chat for user: ${user.id}`);
      joinGlobalChat(user.id);
      hasJoinedGlobalRef.current = true;
    }
  }, [user, isAuthenticated]); // Removed joinGlobalChat from dependencies

  // Reset join flag when user changes
  useEffect(() => {
    if (!user || !isAuthenticated) {
      hasJoinedGlobalRef.current = false;
    }
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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setConversations(data.conversations || []);
          setError(null); // Clear any previous errors
        } else {
          if (response.status === 404) {
            // API endpoint not found, continue without conversations
            console.warn('Conversations API not available yet');
            setConversations([]);
            setError(null);
          } else {
            try {
              const errorData = await response.json();
              setError(errorData.error || 'Failed to fetch conversations');
            } catch {
              setError('Failed to fetch conversations');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        // Don't show error for network issues, just log them
        console.warn('Conversations will be loaded when API is available');
        setConversations([]);
        setError(null);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    if (user && isAuthenticated) {
      fetchConversations();
    }
  }, [user, isAuthenticated]);

  const handleLogout = async () => {
    try {
      await logout();
      hasJoinedGlobalRef.current = false; // Reset join flag on logout
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      hasJoinedGlobalRef.current = false;
      router.push('/');
    }
  };

  // Show loading while authenticating
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Show loading while fetching conversations
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

  // Redirect if not authenticated (this should be handled by the useEffect above)
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Show error state (only for critical errors)
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

  return (
    <ChatInterface 
      user={user} 
      conversations={conversations} 
      onLogout={handleLogout}
      onConversationsUpdate={setConversations}
    />
  );
}