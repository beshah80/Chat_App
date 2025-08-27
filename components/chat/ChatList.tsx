'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/store/chatStore';
import type { Conversation } from '@/types/chat';
import { motion } from 'framer-motion';
import { Edit, MoreVertical, Search, Users, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function ChatListItem({
  conversation,
  isActive,
  onClick,
  formatTime,
}: {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  formatTime: (date: Date | string | undefined) => string;
}) {
  return (
    <motion.div
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        isActive ? 'bg-primary/10' : 'hover:bg-muted'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start space-x-3">
        <div className="relative flex-shrink-0">
          <Image
            src={
              conversation.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.name || 'user'}`
            }
            alt={conversation.name || 'Conversation'}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
          {conversation.participants?.some((p) => p.isOnline) && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h3
                className={`font-medium truncate ${
                  isActive ? 'text-primary' : 'text-foreground'
                }`}
              >
                {conversation.name || 'Conversation'}
              </h3>
              {conversation.type === 'GROUP' && (
                <Users className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              )}
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatTime(conversation.lastMessage?.createdAt)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground truncate">
              {conversation.lastMessage?.content || 'No messages yet'}
            </p>
            {conversation.unreadCount && conversation.unreadCount > 0 && (
              <motion.div
                className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs font-medium min-w-[20px] text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ChatList() {
  const router = useRouter();

  const {
    conversations,
    activeConversationId,
    isSidebarOpen,
    setSidebarOpen,
    user,
  } = useChatStore();

  const formatTime = (date?: Date | string) => {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return minutes < 1 ? 'now' : `${minutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return days === 1 ? '1d' : `${days}d`;
    }
  };

  const handleChatClick = (id: string) => {
    router.push(`/chat/${id}`);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-card border-r border-border flex flex-col h-full`}
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : -320 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center space-x-3 hover:bg-muted rounded-lg p-2 transition-colors"
              >
                <Image
                  src={user?.avatar || '/default-avatar.png'}
                  alt={user?.name || 'User'}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
                <span className="font-medium text-foreground">{user?.name || 'User'}</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-muted border-0 focus:bg-background"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="space-y-1 p-2">
            {conversations.map((conv) => (
              <ChatListItem
                key={conv.id}
                conversation={conv}
                isActive={activeConversationId === conv.id}
                onClick={() => handleChatClick(conv.id)}
                formatTime={formatTime}
              />
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Telegram Web</span>
            <span>v1.0</span>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
