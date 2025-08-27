'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDebounce } from '@/hooks/useDebounce';
import { useChatStore } from '@/store/chatStore';
import type { SearchResult } from '@/types/chat';
import { Loader2, MessageCircle, Search, User } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export function UserSearch() {
  const {
    token,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isSearching,
    setSearching,
    addConversation,
    setActiveConversation,
    setSearchOpen,
  } = useChatStore();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debouncedQuery = useDebounce(localQuery, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Update global searchQuery when debouncedQuery changes
  useEffect(() => {
    setSearchQuery(debouncedQuery);
  }, [debouncedQuery, setSearchQuery]);

  // Search users when debouncedQuery changes
  const searchUsers = useCallback(
    async (query: string) => {
      if (!token) return;

      setSearching(true);
      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.users || []);
        } else {
          console.error('Search failed:', response.statusText);
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    },
    [token, setSearchResults, setSearching]
  );

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      searchUsers(debouncedQuery.trim());
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery, searchUsers, setSearchResults]);

  const startConversation = async (user: SearchResult) => {
    if (!token) return;

    try {
      const response = await fetch('/api/conversations/direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.isNew) {
          addConversation(data.conversation);
        }
        
        setActiveConversation(data.conversation.id);
        setSearchOpen(false);
        setLocalQuery('');
        setSearchQuery('');
        setSearchResults([]);
      } else {
        console.error('Failed to create conversation:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const formatLastSeen = (lastSeen: string | Date) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Active now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  return (
    <div className="p-4">
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search for users to chat with..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="pl-10"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {/* Search Results */}
      <ScrollArea className="h-80">
        {localQuery.trim().length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              Search for users by name or email to start a conversation
            </p>
          </div>
        ) : localQuery.trim().length < 2 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">
              Type at least 2 characters to search
            </p>
          </div>
        ) : isSearching ? (
          <div className="text-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">Searching...</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              No users found matching &quot;{localQuery}&quot;
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  {/* Online indicator */}
                  {user.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 online-indicator border-2 border-white rounded-full"></div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {user.name}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user.isOnline ? 'Online' : formatLastSeen(user.lastSeen)}
                  </p>
                </div>

                {/* Start Chat Button */}
                <Button
                  size="sm"
                  onClick={() => startConversation(user)}
                  className="chat-gradient hover:opacity-90"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Chat
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
