'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useSocket } from '@/contexts/SocketContext';
import { useChatStore } from '@/store/chatStore';
import type { Conversation, User } from '@/types/chat';
import { LogOut, Menu, Search, Settings, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';
import { MobileNavigation } from './MobileNavigation';
import { UserSearch } from './UserSearch';

interface ChatInterfaceProps {
  user: User;
  conversations: Conversation[];
  onLogout: () => void;
}

export function ChatInterface({ user, conversations, onLogout }: ChatInterfaceProps) {
  const router = useRouter();
  const {
    setUser,
    setConversations,
    activeConversationId,
    isSidebarOpen,
    setSidebarOpen,
    isSearchOpen,
    setSearchOpen,
  } = useChatStore();

  const { isConnected, joinGlobalChat, joinPrivateChat } = useSocket();
  const [isMobile, setIsMobile] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const joinGlobalChatOnce = useCallback(() => {
    if (isConnected && user.id) {
      joinGlobalChat(user.id);
    }
  }, [isConnected, user.id, joinGlobalChat]);

  useEffect(() => {
    setUser(user);
    setConversations(conversations);
    joinGlobalChatOnce();
  }, [user, conversations, setUser, setConversations, joinGlobalChatOnce]);

  useEffect(() => {
    if (activeConversationId && isConnected) {
      joinPrivateChat(activeConversationId);
    }
  }, [activeConversationId, isConnected, joinPrivateChat]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  const handleSidebarToggle = () => setSidebarOpen(!isSidebarOpen);
  const handleSearchToggle = () => setSearchOpen(!isSearchOpen);

  const handleProfileClick = () => {
    router.push('/profile');
    setIsSettingsOpen(false);
  };

  const handleAboutClick = () => {
    router.push('/about');
    setIsSettingsOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Connection Status */}
      <div className={`fixed top-2 right-2 z-50 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
        isConnected ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200 animate-pulse'
      }`}>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNavigation
          onToggle={handleSidebarToggle}
          onSearchToggle={handleSearchToggle}
          onLogout={onLogout}
        />
      )}

      {/* Sidebar */}
      <div className={`${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative'} ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isMobile ? 'w-full max-w-sm' : 'w-80'} transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 flex flex-col shadow-lg`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 user-avatar rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-lg">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">{user.name}</h1>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'status-online' : 'status-offline'}`} />
                <p className="text-sm text-gray-500">{isConnected ? 'Online' : 'Offline'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" onClick={handleSearchToggle} className={isSearchOpen ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}>
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {!isMobile && (
              <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                    <Settings className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader><SheetTitle>Settings</SheetTitle></SheetHeader>
                  <div className="flex flex-col h-full">
                    <div className="flex-1 py-6">
                      <nav className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start" onClick={handleProfileClick}>
                          <Settings className="mr-3 h-4 w-4" /> Profile Settings
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" onClick={handleAboutClick}>
                          <Search className="mr-3 h-4 w-4" /> About
                        </Button>
                      </nav>
                    </div>
                    <div className="border-t pt-4">
                      <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={onLogout}>
                        <LogOut className="mr-3 h-4 w-4" /> Sign Out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {!isMobile && (
              <Button variant="ghost" size="icon" onClick={onLogout} className="text-gray-500 hover:text-red-600 transition-colors" title="Sign Out">
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {isSearchOpen && <div className="border-b border-gray-200 animate-fadeIn"><UserSearch /></div>}

        <div className="flex-1 overflow-hidden"><ChatSidebar /></div>
      </div>

      {isMobile && isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity" onClick={() => setSidebarOpen(false)} />}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {!isMobile && (
          <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={handleSidebarToggle} className="lg:hidden"><Menu className="h-5 w-5" /></Button>
              {activeConversation && (
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${activeConversation.isGlobal ? 'status-online' : 'bg-gray-400'}`} />
                  <div>
                    <h2 className="font-semibold text-gray-900">{activeConversation.name}</h2>
                    <p className="text-sm text-gray-500">
                      {activeConversation.participants.length} participants{activeConversation.isGlobal && ' • Global Chat'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handleSearchToggle} className={isSearchOpen ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-blue-600'} title="Search Users">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          {activeConversation ? (
            <ChatWindow conversation={activeConversation} />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-blue-50">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Welcome to ChatApp</h3>
                <p className="text-gray-600 mb-4">
                  Choose a conversation from the sidebar to start chatting, or search for users to start a new conversation.
                </p>
                <Button onClick={handleSearchToggle} className="chat-gradient text-white hover:opacity-90">
                  <Search className="w-4 h-4 mr-2" /> Find People to Chat
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
