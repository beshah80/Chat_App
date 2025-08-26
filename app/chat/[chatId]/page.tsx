'use client';

import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { useChatStore } from '@/store/chatStore';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ChatDetailPage() {
  const params = useParams();
  const chatId = params.chatId as string;
  const { isAuthenticated, setActiveChat, chats } = useChatStore();

  useEffect(() => {
    if (chatId && chats.find(chat => chat.id === chatId)) {
      setActiveChat(chatId);
    }
  }, [chatId, setActiveChat, chats]);

  if (!isAuthenticated) {
    return null; // This will redirect via the root page
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <ChatList />
      <ChatWindow />
    </div>
  );
}