'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Users, Settings, Search, LogOut, Bell, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import type { User, Conversation } from '../../types/chat';
import { ChatWindow } from './ChatWindow';
import { ChatSidebar } from './ChatSidebar';
import { UserProfile } from './UserProfile';
import { MobileNavigation } from './MobileNavigation';

interface ChatInterfaceProps {
  user: User;
  conversations: Conversation[];
  onLogout: () => void;
  onConversationsUpdate: (conversations: Conversation[]) => void;
}

export function ChatInterface({ user, conversations, onLogout, onConversationsUpdate }: ChatInterfaceProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Auto-select global chat if available and no conversation is selected
  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      const globalChat = conversations.find(conv => conv.isGlobal);
      if (globalChat) {
        setSelectedConversation(globalChat);
      }
    }
  }, [conversations, selectedConversation]);

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setShowMobileChat(true);
    }
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  const handleProfileToggle = () => {
    setShowProfile(!showProfile);
  };

  if (isMobile) {
    return (
      <div className="h-screen bg-white flex flex-col">
        {showMobileChat && selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            user={user}
            onBack={handleBackToList}
          />
        ) : (
          <>
            <ChatSidebar
              user={user}
              conversations={conversations}
              selectedConversation={selectedConversation}
              onConversationSelect={handleConversationSelect}
              onLogout={onLogout}
              onConversationsUpdate={onConversationsUpdate}
              isMobile={true}
            />
            <MobileNavigation
              onProfileToggle={handleProfileToggle}
              onSearchToggle={() => setIsSearchOpen(!isSearchOpen)}
            />
          </>
        )}

        {showProfile && (
          <UserProfile
            user={user}
            onClose={() => setShowProfile(false)}
            onUpdate={onConversationsUpdate}
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex">
      {/* Sidebar */}
      <ChatSidebar
        user={user}
        conversations={conversations}
        selectedConversation={selectedConversation}
        onConversationSelect={handleConversationSelect}
        onLogout={onLogout}
        onConversationsUpdate={onConversationsUpdate}
        isMobile={false}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            user={user}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Welcome to ChatApp
              </h3>
              <p className="text-gray-600 mb-4">
                Choose a conversation from the sidebar to start chatting, or search for users to start a new conversation.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <UserProfile
          user={user}
          onClose={() => setShowProfile(false)}
          onUpdate={onConversationsUpdate}
        />
      )}
    </div>
  );
}