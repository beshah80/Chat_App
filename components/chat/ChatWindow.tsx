'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { useChatStore } from '../../store/chatStore';
import type { Conversation } from '../../types/chat';

type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

interface Message {
  id: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  senderId: string;
  senderName: string;
  conversationId: string;
  timestamp: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  status: MessageStatus;
}

interface ChatWindowProps {
  conversation: Conversation;
}

export function ChatWindow({ conversation }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  const { user } = useChatStore();
  const { socket, sendMessage, isConnected, stopTyping } = useSocket(); // removed startTyping

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  const throttledScrollToBottom = useCallback(() => setTimeout(scrollToBottom, 100), [scrollToBottom]);

  const loadMessages = useCallback(async () => {
    if (!conversation.id) return;

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/conversations/${conversation.id}/messages`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data: { messages: Message[] } = await response.json();
        setMessages(data.messages || []);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  }, [conversation.id]);

  const handleNewMessage = useCallback((newMessage: Message & { sender?: { name: string } }) => {
    if (newMessage.conversationId === conversation.id) {
      const msg: Message = {
        id: newMessage.id || `msg-${Date.now()}`,
        content: newMessage.content,
        senderId: newMessage.senderId,
        senderName: newMessage.sender?.name || newMessage.senderName || 'Unknown',
        timestamp: new Date(newMessage.timestamp),
        type: newMessage.type || 'TEXT',
        conversationId: newMessage.conversationId,
        status: 'delivered',
      };

      setMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
      throttledScrollToBottom();
    }
  }, [conversation.id, throttledScrollToBottom]);

  const handleMessageStatus = useCallback((data: { messageId: string; status: MessageStatus }) => {
    setMessages(prev => prev.map(msg => msg.id === data.messageId ? { ...msg, status: data.status } : msg));
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || !user || !isConnected) return;

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const optimisticMessage: Message = {
      id: tempId,
      content: message.trim(),
      senderId: user.id,
      senderName: user.name,
      timestamp: new Date(),
      type: 'TEXT',
      conversationId: conversation.id,
      status: 'sending',
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setMessage('');
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    stopTyping(conversation.id, user.id);

    try {
      sendMessage({
        conversationId: conversation.id,
        senderId: user.id,
        content: optimisticMessage.content,
        type: 'TEXT',
        tempId,
      });
      setTimeout(() => setMessages(prev => prev.map(msg => msg.id === tempId ? { ...msg, status: 'sent' } : msg)), 500);
      setTimeout(() => setMessages(prev => prev.map(msg => msg.id === tempId ? { ...msg, status: 'delivered' } : msg)), 1000);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => prev.map(msg => msg.id === tempId ? { ...msg, status: 'failed' } : msg));
    }

    throttledScrollToBottom();
  }, [message, user, isConnected, conversation.id, sendMessage, stopTyping, throttledScrollToBottom]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  useEffect(() => {
    if (!socket) return;

    socket.on('message', handleNewMessage);
    socket.on('messageStatus', handleMessageStatus);

    return () => {
      socket.off('message', handleNewMessage);
      socket.off('messageStatus', handleMessageStatus);
    };
  }, [socket, handleNewMessage, handleMessageStatus]);

  useEffect(() => { throttledScrollToBottom(); }, [messages, throttledScrollToBottom]);
  useEffect(() => () => { if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current); }, []);
  useEffect(() => { inputRef.current?.focus(); }, [conversation.id]);

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(msg => (
          <div key={msg.id} className={`mb-2 ${msg.senderId === user?.id ? 'text-right' : 'text-left'}`}>
            <span className="inline-block px-3 py-1 rounded-lg bg-gray-200 text-gray-800">
              {msg.content}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t p-4 flex items-center space-x-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
          className="flex-1 border rounded px-3 py-2"
        />
        <button onClick={handleSendMessage} className="px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
}
