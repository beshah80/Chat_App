import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Conversation, Message, SearchResult } from '@/types/chat';

interface ChatState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;

  // Conversations state
  conversations: Conversation[];
  activeConversationId: string | null;
  
  // Messages state
  messages: Record<string, Message[]>;
  isLoadingMessages: boolean;
  
  // UI state
  isSidebarOpen: boolean;
  isSearchOpen: boolean;
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Typing indicators
  typingUsers: Record<string, string[]>; // conversationId -> userIds
}

interface ChatActions {
  // Authentication actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  
  // Conversation actions
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void;
  setActiveConversation: (conversationId: string | null) => void;
  
  // Message actions
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  prependMessages: (conversationId: string, messages: Message[]) => void;
  
  // UI actions
  setSidebarOpen: (isOpen: boolean) => void;
  setSearchOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: SearchResult[]) => void;
  setSearching: (isSearching: boolean) => void;
  
  // Loading and error actions
  setLoading: (isLoading: boolean) => void;
  setLoadingMessages: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Typing actions
  setTypingUsers: (conversationId: string, userIds: string[]) => void;
  addTypingUser: (conversationId: string, userId: string) => void;
  removeTypingUser: (conversationId: string, userId: string) => void;
  
  // Utility actions
  clearMessages: () => void;
  reset: () => void;
}

const initialState: ChatState = {
  user: null,
  isAuthenticated: false,
  token: null,
  conversations: [],
  activeConversationId: null,
  messages: {},
  isLoadingMessages: false,
  isSidebarOpen: true,
  isSearchOpen: false,
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  isLoading: false,
  error: null,
  typingUsers: {},
};

export const useChatStore = create<ChatState & ChatActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Authentication actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      login: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true,
        error: null 
      }),
      logout: () => set({ 
        ...initialState,
        conversations: [],
        messages: {},
        activeConversationId: null
      }),

      // Conversation actions
      setConversations: (conversations) => set({ conversations }),
      addConversation: (conversation) => set((state) => ({
        conversations: [conversation, ...state.conversations]
      })),
      updateConversation: (conversationId, updates) => set((state) => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId ? { ...conv, ...updates } : conv
        )
      })),
      setActiveConversation: (conversationId) => set({ 
        activeConversationId: conversationId,
        // Clear search when switching conversations
        isSearchOpen: false,
        searchQuery: '',
        searchResults: []
      }),

      // Message actions
      setMessages: (conversationId, messages) => set((state) => ({
        messages: { ...state.messages, [conversationId]: messages }
      })),
      addMessage: (conversationId, message) => set((state) => {
        const currentMessages = state.messages[conversationId] || [];
        return {
          messages: {
            ...state.messages,
            [conversationId]: [...currentMessages, message]
          }
        };
      }),
      updateMessage: (conversationId, messageId, updates) => set((state) => {
        const currentMessages = state.messages[conversationId] || [];
        return {
          messages: {
            ...state.messages,
            [conversationId]: currentMessages.map(msg =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            )
          }
        };
      }),
      prependMessages: (conversationId, messages) => set((state) => {
        const currentMessages = state.messages[conversationId] || [];
        return {
          messages: {
            ...state.messages,
            [conversationId]: [...messages, ...currentMessages]
          }
        };
      }),

      // UI actions
      setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
      setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSearchResults: (searchResults) => set({ searchResults }),
      setSearching: (isSearching) => set({ isSearching }),

      // Loading and error actions
      setLoading: (isLoading) => set({ isLoading }),
      setLoadingMessages: (isLoadingMessages) => set({ isLoadingMessages }),
      setError: (error) => set({ error }),

      // Typing actions
      setTypingUsers: (conversationId, userIds) => set((state) => ({
        typingUsers: { ...state.typingUsers, [conversationId]: userIds }
      })),
      addTypingUser: (conversationId, userId) => set((state) => {
        const currentTyping = state.typingUsers[conversationId] || [];
        if (!currentTyping.includes(userId)) {
          return {
            typingUsers: {
              ...state.typingUsers,
              [conversationId]: [...currentTyping, userId]
            }
          };
        }
        return state;
      }),
      removeTypingUser: (conversationId, userId) => set((state) => {
        const currentTyping = state.typingUsers[conversationId] || [];
        return {
          typingUsers: {
            ...state.typingUsers,
            [conversationId]: currentTyping.filter(id => id !== userId)
          }
        };
      }),

      // Utility actions
      clearMessages: () => set({ messages: {} }),
      reset: () => set(initialState),
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        // Don't persist UI state, messages, or conversations
        // They should be fetched fresh on app load
      }),
    }
  )
);

// Selectors for better performance
export const useUser = () => useChatStore((state) => state.user);
export const useToken = () => useChatStore((state) => state.token);
export const useIsAuthenticated = () => useChatStore((state) => state.isAuthenticated);
export const useConversations = () => useChatStore((state) => state.conversations);
export const useActiveConversation = () => {
  const conversations = useChatStore((state) => state.conversations);
  const activeId = useChatStore((state) => state.activeConversationId);
  return conversations.find(conv => conv.id === activeId) || null;
};
export const useMessages = (conversationId: string) => 
  useChatStore((state) => state.messages[conversationId] || []);
export const useTypingUsers = (conversationId: string) =>
  useChatStore((state) => state.typingUsers[conversationId] || []);