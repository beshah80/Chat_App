'use client';

import { Check, CheckCheck, Clock } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date | string;
  status?: 'SENT' | 'DELIVERED' | 'READ' | 'sent' | 'delivered' | 'read';
  isOwn: boolean;
}

interface MessageBubbleProps {
  message: Message;
  showSender?: boolean;
}

export function MessageBubble({ message, showSender = false }: MessageBubbleProps) {
  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '00:00';
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const getStatusIcon = () => {
    if (!message.isOwn) return null;

    switch (message.status?.toLowerCase()) {
      case 'sent':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <Check className="w-3 h-3 text-gray-500" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-green-500" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const getMessageColors = () => message.isOwn
    ? { bubble: 'message-bubble-out', tail: 'border-l-[#0088cc]' }
    : { bubble: 'message-bubble-in', tail: 'border-r-white' };

  const colors = getMessageColors();

  return (
    <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex items-end gap-2 max-w-[70%] ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar for non-own messages */}
        {!message.isOwn && showSender && (
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="user-avatar text-xs">
              {message.senderName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}

        {/* Message bubble */}
        <div className="flex flex-col">
          {!message.isOwn && showSender && (
            <span className="text-xs text-gray-600 mb-1 ml-3">{message.senderName}</span>
          )}

          <div className={`
            relative px-4 py-2 rounded-2xl ${colors.bubble}
            ${message.isOwn ? 'rounded-br-md' : 'rounded-bl-md'}
            break-words
          `}>
            <p className="text-sm leading-relaxed">{message.content}</p>

            {/* Message tail/pointer */}
            <div className={`absolute bottom-0 w-3 h-3 ${message.isOwn ? '-right-1' : '-left-1'}`}>
              <div className={`w-full h-full border-8 border-transparent ${message.isOwn ? colors.tail : 'border-l-gray-100'}`} />
            </div>
          </div>

          {/* Timestamp and status */}
          <div className={`
            flex items-center gap-1 mt-1 text-xs text-gray-500
            ${message.isOwn ? 'justify-end mr-3' : 'justify-start ml-3'}
          `}>
            <span>{formatTime(message.timestamp)}</span>
            {getStatusIcon()}
          </div>
        </div>

        {/* Spacer for own messages when no avatar */}
        {message.isOwn && showSender && <div className="w-8" />}
      </div>
    </div>
  );
}
