'use client';

import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { useChatStore } from '@/store/chatStore';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function ChatDetailPage() {
  const params = useParams();
  const chatId = params?.chatId as string | undefined;

  const { isAuthenticated, setActiveConversation, conversations } = useChatStore();

  // Find the active conversation
  const activeConversation = useMemo(() => {
    if (!chatId) return null;
    return conversations.find((conv) => conv.id === chatId) || null;
  }, [chatId, conversations]);

  // Set active conversation in store
  useEffect(() => {
    if (chatId && activeConversation) {
      setActiveConversation(chatId);
    }
  }, [chatId, activeConversation, setActiveConversation]);

  if (!isAuthenticated || !chatId || !activeConversation) {
    return null; // Optionally, redirect to /chat or loading state
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <ChatList />
      <ChatWindow conversation={activeConversation} />
    </div>
  );
}
