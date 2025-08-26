'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, MessageCircle, Users, Settings, X, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { ChatListItem } from './ChatListItem';
import { UserSearch } from './UserSearch';
import type { User, Conversation } from '../../types/chat';

interface ChatSidebarProps {
  user: User;
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onConversationSelect: (conversation: Conversation) => void;
  onLogout: () => void;
  onConversationsUpdate: (conversations: Conversation[]) => void;
  isMobile: boolean;
}

export function ChatSidebar({ 
  user, 
  conversations, 
  selectedConversation, 
  onConversationSelect, 
  onLogout, 
  onConversationsUpdate, 
  isMobile 
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);

  // Filter conversations based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = conversations.filter(conv => 
        conv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.participants.some(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

  const displayConversations = searchQuery.trim() ? filteredConversations : conversations;

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  return (
    <div className={`${isMobile ? 'w-full' : 'w-80'} bg-white border-r border-gray-200 flex flex-col h-full`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-green-600">Online</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearchToggle}
              className="text-gray-500 hover:text-gray-700"
            >
              {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
            
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="text-gray-500 hover:text-red-600"
                title="Sign Out"
              >
                <Settings className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Search Input */}
        {showSearch && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500"
              />
            </div>
            <UserSearch />
          </div>
        )}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {displayConversations.length === 0 ? (
          <div className="p-6 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {searchQuery.trim() ? 'No conversations found' : 'No conversations yet'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {searchQuery.trim() ? 'Try a different search term' : 'Start a new conversation to get chatting'}
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {displayConversations.map((conversation) => {
              const otherParticipant = conversation.participants.find(p => p.id !== user.id);
              const displayName = conversation.isGlobal 
                ? 'Global Chat' 
                : (conversation.name || otherParticipant?.name || 'Unknown User');
              const displayAvatar = conversation.isGlobal 
                ? null 
                : (conversation.avatar || otherParticipant?.avatar);
              
              return (
                <div
                  key={conversation.id}
                  onClick={() => onConversationSelect(conversation)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    {conversation.isGlobal ? (
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <img 
                        src={displayAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`}
                        alt={displayName}
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    {!conversation.isGlobal && otherParticipant?.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {displayName}
                      </h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      {conversation.lastMessage ? (
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage.senderId === user.id ? 'You: ' : ''}
                          {conversation.lastMessage.content}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">
                          {conversation.isGlobal ? 'Welcome to the global chat!' : 'Start a conversation'}
                        </p>
                      )}
                      
                      {conversation.unreadCount > 0 && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}