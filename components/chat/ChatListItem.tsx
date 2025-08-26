'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Globe, Users, User, CheckCheck, Check } from 'lucide-react';
import type { Conversation } from '@/types/chat';

interface ChatListItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ChatListItem({ conversation, isActive, onClick }: ChatListItemProps) {
  const getConversationIcon = () => {
    if (conversation.isGlobal) {
      return <Globe className="w-4 h-4" />;
    }
    if (conversation.type === 'GROUP') {
      return <Users className="w-4 h-4" />;
    }
    return <User className="w-4 h-4" />;
  };

  const getConversationName = () => {
    if (conversation.name) {
      return conversation.name;
    }
    
    // For direct messages, show the other participant's name
    if (conversation.type === 'DIRECT' && conversation.participants.length >= 2) {
      return conversation.participants[1]?.name || 'Unknown User';
    }
    
    return 'Conversation';
  };

  const getLastMessagePreview = () => {
    if (!conversation.lastMessage) {
      return conversation.isGlobal ? 'Welcome to the global chat!' : 'No messages yet';
    }

    const content = conversation.lastMessage.content;
    if (conversation.lastMessage.type === 'IMAGE') {
      return '📷 Image';
    }
    if (conversation.lastMessage.type === 'FILE') {
      return '📎 File';
    }
    
    return content.length > 50 ? content.substring(0, 50) + '...' : content;
  };

  const getLastMessageTime = () => {
    if (!conversation.lastMessage) {
      return '';
    }
    
    try {
      const timestamp = conversation.lastMessage.timestamp || conversation.lastMessage.createdAt;
      return formatDistanceToNow(new Date(timestamp), { 
        addSuffix: false 
      });
    } catch {
      return '';
    }
  };

  const getOnlineCount = () => {
    return conversation.participants.filter(p => p.isOnline).length;
  };

  const getAvatarContent = () => {
    if (conversation.avatar) {
      return <AvatarImage src={conversation.avatar} alt={getConversationName()} />;
    }

    if (conversation.isGlobal) {
      return (
        <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <Globe className="w-4 h-4" />
        </AvatarFallback>
      );
    }

    if (conversation.type === 'GROUP') {
      return (
        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Users className="w-4 h-4" />
        </AvatarFallback>
      );
    }

    // For direct messages, use the other participant's avatar or initials
    const otherParticipant = conversation.participants.find(p => p.name !== getConversationName());
    if (otherParticipant?.avatar) {
      return <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />;
    }

    return (
      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        {getConversationName().charAt(0).toUpperCase()}
      </AvatarFallback>
    );
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'chat-list-item flex items-center space-x-3 p-3 cursor-pointer mb-1',
        isActive && 'active'
      )}
    >
      {/* Avatar */}
      <div className="relative">
        <Avatar className="w-12 h-12">
          {getAvatarContent()}
        </Avatar>
        
        {/* Online indicator for direct messages */}
        {conversation.type === 'DIRECT' && conversation.participants.some(p => p.isOnline) && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2 min-w-0">
            <h3 className={cn(
              'font-medium truncate',
              isActive ? 'text-blue-900' : 'text-gray-900'
            )}>
              {getConversationName()}
            </h3>
            
            {/* Conversation type icon */}
            <div className={cn(
              'flex-shrink-0',
              isActive ? 'text-blue-600' : 'text-gray-400'
            )}>
              {getConversationIcon()}
            </div>
          </div>

          {/* Time and unread count */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {conversation.unreadCount > 0 && (
              <div className="unread-badge">
                {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
              </div>
            )}
            
            {getLastMessageTime() && (
              <span className={cn(
                'text-xs',
                isActive ? 'text-blue-600' : 'text-gray-500'
              )}>
                {getLastMessageTime()}
              </span>
            )}
          </div>
        </div>

        {/* Last message preview */}
        <div className="flex items-center justify-between">
          <p className={cn(
            'text-sm truncate',
            isActive ? 'text-blue-700' : 'text-gray-600'
          )}>
            {conversation.lastMessage?.senderName && !conversation.isGlobal && (
              <span className="font-medium">
                {conversation.lastMessage.senderName}: 
              </span>
            )}
            {getLastMessagePreview()}
          </p>

          {/* Additional info */}
          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
            {/* Online count for group/global chats */}
            {(conversation.type === 'GROUP' || conversation.isGlobal) && (
              <span className={cn(
                'text-xs',
                isActive ? 'text-blue-600' : 'text-gray-500'
              )}>
                {getOnlineCount()} online
              </span>
            )}

            {/* Message status indicators */}
            {conversation.lastMessage && conversation.lastMessage.isOwn && (
              <div className="flex-shrink-0">
                {conversation.lastMessage.status === 'read' && (
                  <CheckCheck className="w-3 h-3 message-status read" />
                )}
                {conversation.lastMessage.status === 'delivered' && (
                  <CheckCheck className="w-3 h-3 message-status delivered" />
                )}
                {conversation.lastMessage.status === 'sent' && (
                  <Check className="w-3 h-3 message-status sent" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}