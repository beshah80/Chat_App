import {
  Check,
  CheckCheck,
  Clock,
  Globe,
  LogOut,
  Menu,
  MessageCircle,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Users,
  Video,
  X
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ChatAppProps {
  currentUser: User | null;
  onLogout: () => void;
  onNavigate: (page: 'home' | 'login' | 'signup' | 'chat') => void;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  isOwn: boolean;
}

interface Chat {
  id: string;
  name: string;
  type: 'global' | 'private';
  participants?: number;
  isOnline?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export function ChatApp({ currentUser, onLogout, onNavigate }: ChatAppProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string>('global');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback((chatId: string) => {
    if (chatId === 'global') {
      const globalMessages: Message[] = [
        {
          id: '1',
          content: 'Welcome to our global chat room! 👋',
          senderId: 'system',
          senderName: 'System',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          status: 'read',
          isOwn: false
        },
        {
          id: '2',
          content: 'Hey everyone! Great to be here!',
          senderId: 'user-1',
          senderName: 'John Smith',
          timestamp: new Date(Date.now() - 1000 * 60 * 25),
          status: 'read',
          isOwn: false
        },
        {
          id: '3',
          content: 'Hello John! Welcome to the community 🎉',
          senderId: 'user-2',
          senderName: 'Alice Johnson',
          timestamp: new Date(Date.now() - 1000 * 60 * 20),
          status: 'read',
          isOwn: false
        },
        {
          id: '4',
          content: 'This is amazing! The interface looks great.',
          senderId: currentUser?.id || 'current-user',
          senderName: currentUser?.name || 'You',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          status: 'read',
          isOwn: true
        }
      ];
      setMessages(globalMessages);
    } else {
      const privateMessages: Message[] = [
        {
          id: '1',
          content: 'Hey! How are you doing?',
          senderId: chatId,
          senderName: chats.find(c => c.id === chatId)?.name || 'User',
          timestamp: new Date(Date.now() - 1000 * 60 * 10),
          status: 'read',
          isOwn: false
        },
        {
          id: '2',
          content: 'I\'m doing great, thanks for asking!',
          senderId: currentUser?.id || 'current-user',
          senderName: currentUser?.name || 'You',
          timestamp: new Date(Date.now() - 1000 * 60 * 8),
          status: 'read',
          isOwn: true
        }
      ];
      setMessages(privateMessages);
    }
  }, [currentUser?.id, currentUser?.name, chats]);

  useEffect(() => {
    const initialChats: Chat[] = [
      {
        id: 'global',
        name: 'Global Chat',
        type: 'global',
        participants: 42,
        isOnline: true,
        lastMessage: 'Welcome to our community! 👋',
        lastMessageTime: '2m',
        unreadCount: 5
      },
      {
        id: 'user-1',
        name: 'John Smith',
        type: 'private',
        isOnline: true,
        lastMessage: 'Hey! How are you doing?',
        lastMessageTime: '5m',
        unreadCount: 2
      },
      {
        id: 'user-2',
        name: 'Alice Johnson',
        type: 'private',
        isOnline: false,
        lastMessage: 'Thanks for the help earlier!',
        lastMessageTime: '1h',
        unreadCount: 0
      },
      {
        id: 'user-3',
        name: 'Mike Wilson',
        type: 'private',
        isOnline: true,
        lastMessage: 'Are we still meeting tomorrow?',
        lastMessageTime: '3h',
        unreadCount: 1
      }
    ];

    setChats(initialChats);
    loadMessages('global');
  }, [loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !currentUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      senderId: currentUser.id,
      senderName: currentUser.name,
      timestamp: new Date(),
      status: 'sent',
      isOwn: true
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    setTimeout(() => {
      setMessages(prev => prev.map(msg => msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => msg.id === newMessage.id ? { ...msg, status: 'read' } : msg));
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedChat = chats.find(c => c.id === selectedChatId);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const getStatusIcon = (status: string, isOwn: boolean) => {
    if (!isOwn) return null;
    switch (status) {
      case 'sent': return <Clock className="w-3 h-3 text-gray-400" />;
      case 'delivered': return <Check className="w-3 h-3 text-gray-500" />;
      case 'read': return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default: return null;
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to access the chat.</p>
          <button
            onClick={() => onNavigate('login')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ChatApp
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-600">
              {currentUser.name}
            </span>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Chat Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 fixed md:static inset-y-0 left-0 z-40
          w-80 md:w-96 bg-white border-r border-gray-200
          transition-transform duration-300 ease-in-out
          flex flex-col
        `}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Chats</h2>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                placeholder="Search chats..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setSelectedChatId(chat.id);
                    loadMessages(chat.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-colors mb-1
                    ${selectedChatId === chat.id 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {chat.type === 'global' ? (
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {chat.name.charAt(0).toUpperCase()}
                        </div>
                        {chat.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{chat.name}</h3>
                          {chat.type === 'global' && (
                            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                              <Users className="w-3 h-3 mr-1 inline" />
                              {chat.participants}
                            </span>
                          )}
                        </div>
                        {chat.lastMessageTime && (
                          <span className="text-xs text-gray-500">
                            {chat.lastMessageTime}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate flex-1">
                          {chat.lastMessage || 'No messages yet'}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-2 min-w-[20px] text-center">
                            {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Chat Window */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  {selectedChat.type === 'global' ? (
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedChat.name.charAt(0).toUpperCase()}
                      </div>
                      {selectedChat.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{selectedChat.name}</h3>
                      {selectedChat.type === 'global' && (
                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                          <Users className="w-3 h-3 mr-1 inline" />
                          {selectedChat.participants} online
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedChat.type === 'global' 
                        ? 'Community chat room'
                        : selectedChat.isOnline 
                          ? 'Online' 
                          : 'Last seen recently'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {selectedChat.type === 'private' && (
                    <>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Phone className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Video className="w-4 h-4 text-gray-600" />
                      </button>
                    </>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-end gap-2 max-w-[70%] ${msg.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!msg.isOwn && selectedChat.type === 'global' && (
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {msg.senderName.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="flex flex-col">
                          {!msg.isOwn && selectedChat.type === 'global' && (
                            <span className="text-xs text-gray-600 mb-1 ml-3">
                              {msg.senderName}
                            </span>
                          )}

                          <div className={`
                            px-4 py-2 rounded-2xl break-words
                            ${msg.isOwn 
                              ? 'bg-blue-500 text-white rounded-br-md' 
                              : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                            }
                          `}>
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                          </div>

                          <div className={`
                            flex items-center gap-1 mt-1 text-xs text-gray-500
                            ${msg.isOwn ? 'justify-end mr-3' : 'justify-start ml-3'}
                          `}>
                            <span>{formatTime(msg.timestamp)}</span>
                            {getStatusIcon(msg.status, msg.isOwn)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      placeholder={`Message ${selectedChat.name}...`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>

                  {message.trim() ? (
                    <button 
                      onClick={handleSendMessage}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  ) : (
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Mic className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">Welcome to ChatApp!</h3>
                <p>Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}