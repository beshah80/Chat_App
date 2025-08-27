'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore } from '@/store/chatStore';
import { MessageCircle, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ChatListItem } from './ChatListItem';

export function ChatSidebar() {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    setSearchOpen,
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState(conversations);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = conversations.filter(
        (conv) =>
          conv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.participants.some((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

  // Sort conversations by last message time, with global chat first
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isGlobal && !b.isGlobal) return -1;
    if (!a.isGlobal && b.isGlobal) return 1;

    const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return bTime - aTime;
  });

  const handleConversationSelect = (conversationId: string) => {
    setActiveConversation(conversationId);
  };

  const handleNewChat = () => {
    setSearchOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button 
          onClick={handleNewChat}
          className="w-full chat-gradient hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="px-2">
          {sortedConversations.length > 0 ? (
            sortedConversations.map((conversation) => (
              <ChatListItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                onClick={() => handleConversationSelect(conversation.id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchQuery 
                  ? 'Try searching for something else' 
                  : 'Start a new conversation to get chatting'
                }
              </p>
              {!searchQuery && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleNewChat}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start Chat
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
