'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Globe,
  Users,
  Smile,
  Paperclip,
  Mic,
  MessageCircle
} from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { useChatStore } from '../../store/chatStore';
import { useSocket } from '../../contexts/SocketContext';
import type { Conversation, Message } from '../../types/chat';

interface ChatWindowProps {
  conversation: Conversation;
}

export function ChatWindow({ conversation }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useChatStore();
  const { socket, sendMessage, isConnected, startTyping, stopTyping } = useSocket();

  // Memoized computed values for better performance
  const otherParticipant = useMemo(() => {
    if (conversation.isGlobal) return null;
    return conversation.participants.find(p => p.id !== user?.id);
  }, [conversation.participants, conversation.isGlobal, user?.id]);

  const typingUsersArray = useMemo(() => {
    return Array.from(typingUsers);
  }, [typingUsers]);

  // Optimized scroll to bottom with throttling
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, []);

  // Throttled scroll to bottom
  const throttledScrollToBottom = useCallback(() => {
    setTimeout(scrollToBottom, 100);
  }, [scrollToBottom]);

  // Load messages - NO MOCK DATA, only real messages
  const loadMessages = useCallback(async () => {
    if (!conversation.id) return;
    
    setIsLoadingMessages(true);
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/conversations/${conversation.id}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        // NO MOCK MESSAGES - start with empty conversation
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      // NO MOCK MESSAGES - start with empty conversation
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [conversation.id]);

  // Enhanced message handlers
  const handleNewMessage = useCallback((newMessage: any) => {
    if (newMessage.conversationId === conversation.id) {
      const message: Message = {
        id: newMessage.id || `msg-${Date.now()}`,
        content: newMessage.content,
        senderId: newMessage.senderId,
        senderName: newMessage.sender?.name || newMessage.senderName || 'Unknown',
        timestamp: newMessage.timestamp ? new Date(newMessage.timestamp) : new Date(),
        type: newMessage.type || 'TEXT',
        conversationId: newMessage.conversationId,
        status: 'delivered'
      };
      
      setMessages(prev => {
        // Prevent duplicate messages
        if (prev.some(msg => msg.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
      
      throttledScrollToBottom();
    }
  }, [conversation.id, throttledScrollToBottom]);

  const handleMessageStatus = useCallback((data: any) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === data.messageId ? { ...msg, status: data.status } : msg
      )
    );
  }, []);

  const handleUserTyping = useCallback((data: { userId: string; name: string; conversationId: string }) => {
    if (data.conversationId === conversation.id && data.userId !== user?.id) {
      setTypingUsers(prev => new Set([...prev, data.userId]));
      setIsTyping(true);
    }
  }, [conversation.id, user?.id]);

  const handleUserStoppedTyping = useCallback((data: { userId: string; conversationId: string }) => {
    if (data.conversationId === conversation.id) {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
      
      // Update typing status
      setIsTyping(prev => {
        const newTypingUsers = new Set(typingUsers);
        newTypingUsers.delete(data.userId);
        return newTypingUsers.size > 0;
      });
    }
  }, [conversation.id, typingUsers]);

  // Enhanced typing handlers with debouncing
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Handle typing indicators
    if (value.trim() && user) {
      startTyping(conversation.id, user.id, user.name);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(conversation.id, user.id);
      }, 1000);
    } else if (!value.trim() && user) {
      stopTyping(conversation.id, user.id);
    }
  }, [conversation.id, user, startTyping, stopTyping]);

  // Enhanced send message with optimistic updates
  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || !user || !isConnected) return;

    const messageContent = message.trim();
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    
    // Optimistic update
    const optimisticMessage: Message = {
      id: tempId,
      content: messageContent,
      senderId: user.id,
      senderName: user.name,
      timestamp: new Date(),
      type: 'TEXT',
      conversationId: conversation.id,
      status: 'sending'
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setMessage('');
    
    // Clear typing indicators
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    stopTyping(conversation.id, user.id);

    try {
      // Send via socket
      const messageData = {
        conversationId: conversation.id,
        senderId: user.id,
        content: messageContent,
        type: 'TEXT',
        tempId
      };

      sendMessage(messageData);

      // Update message status
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempId ? { ...msg, status: 'sent' } : msg
          )
        );
      }, 500);

      // Simulate delivery
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempId ? { ...msg, status: 'delivered' } : msg
          )
        );
      }, 1000);

    } catch (error) {
      console.error('Failed to send message:', error);
      // Update status to failed
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempId ? { ...msg, status: 'failed' } : msg
        )
      );
    }

    throttledScrollToBottom();
  }, [message, user, isConnected, conversation.id, sendMessage, stopTyping, throttledScrollToBottom]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Effects
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!socket) return;

    socket.on('message', handleNewMessage);
    socket.on('messageStatus', handleMessageStatus);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStoppedTyping', handleUserStoppedTyping);

    return () => {
      socket.off('message', handleNewMessage);
      socket.off('messageStatus', handleMessageStatus);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStoppedTyping', handleUserStoppedTyping);
    };
  }, [socket, handleNewMessage, handleMessageStatus, handleUserTyping, handleUserStoppedTyping]);

  useEffect(() => {
    throttledScrollToBottom();
  }, [messages, throttledScrollToBottom]);

  // Cleanup typing timeout
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Focus input when conversation changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversation.id]);

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Enhanced Chat Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center gap-3">
          {conversation.isGlobal ? (
            <div className="w-10 h-10 user-avatar rounded-full flex items-center justify-center shadow-md">
              <Globe className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="relative">
              <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                {otherParticipant?.avatar ? (
                  <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />
                ) : (
                  <AvatarFallback className="user-avatar">
                    {otherParticipant ? otherParticipant.name.charAt(0).toUpperCase() : '?'}
                  </AvatarFallback>
                )}
              </Avatar>
              {otherParticipant?.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 status-online border-2 border-white rounded-full"></div>
              )}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{conversation.name}</h3>
              {conversation.isGlobal && (
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                  <Users className="w-3 h-3 mr-1" />
                  {conversation.participants.length}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {conversation.isGlobal 
                ? 'Community chat room'
                : otherParticipant?.isOnline 
                  ? 'Online now' 
                  : `Last seen ${new Date(otherParticipant?.lastSeen || Date.now()).toLocaleDateString()}`
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!conversation.isGlobal && (
            <>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                <Video className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 scrollbar-thin">
        <div className="space-y-4">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading messages...</span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            // Empty state - no messages yet
            <div className="flex items-center justify-center h-full py-16">
              <div className="text-center max-w-sm mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {conversation.isGlobal ? 'Start the Conversation!' : `Chat with ${otherParticipant?.name || 'Friend'}`}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {conversation.isGlobal 
                    ? 'Be the first to share something in the global chat room. Say hello to the community!'
                    : 'Send a message to start your conversation. Share thoughts, ideas, or just say hi!'
                  }
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble 
                key={msg.id} 
                message={{
                  ...msg,
                  isOwn: msg.senderId === user?.id
                }}
                showSender={conversation.isGlobal}
              />
            ))
          )}
          
          {/* Typing Indicator */}
          {isTyping && typingUsersArray.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500 px-2 animate-fadeIn">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span>
                {typingUsersArray.length === 1 
                  ? 'Someone is typing...' 
                  : `${typingUsersArray.length} people are typing...`
                }
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Connection Status */}
      {!isConnected && (
        <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200 animate-pulse">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-yellow-800">Reconnecting to chat...</p>
          </div>
        </div>
      )}

      {/* Enhanced Message Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              placeholder={`Message ${conversation.name}...`}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              disabled={!isConnected}
              maxLength={1000}
            />
            <Button 
              variant="ghost" 
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>

          {message.trim() ? (
            <Button 
              onClick={handleSendMessage}
              className="chat-gradient text-white hover:from-blue-600 hover:to-purple-700 shadow-md"
              disabled={!isConnected}
            >
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
              <Mic className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {/* Character count for long messages */}
        {message.length > 800 && (
          <div className="text-xs text-gray-500 mt-1 text-right">
            {message.length}/1000
          </div>
        )}
      </div>
    </div>
  );
}