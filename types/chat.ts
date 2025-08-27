// types.ts

// =================== User Types ===================
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  isOnline: boolean;
  lastSeen: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date | string;
}

export interface Message {
  id: string;
  content: string;
  type: "TEXT" | "IMAGE" | "FILE" | "SYSTEM";
  senderId: string;
  senderName: string;
  conversationId: string;
  timestamp: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  isOwn?: boolean;
}

export interface Conversation {
  id: string;
  name?: string;
  type: "DIRECT" | "GROUP" | "GLOBAL";
  isGlobal: boolean;
  avatar?: string;
  participants: Participant[];
  lastMessage?: Message;
  lastMessageAt?: Date | string;
  unreadCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface SearchResult {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date | string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

// =================== Requests ===================
export interface CreateConversationRequest {
  userId: string;
  type?: "DIRECT" | "GROUP";
}

export interface SendMessageRequest {
  content: string;
  type?: "TEXT" | "IMAGE" | "FILE";
  conversationId: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

// =================== Realtime Events ===================
export interface TypingIndicator {
  userId: string;
  conversationId: string;
  isTyping: boolean;
}

export interface OnlineStatus {
  userId: string;
  isOnline: boolean;
  lastSeen?: Date | string;
}

export interface MessageStatus {
  messageId: string;
  isRead: boolean;
  isDelivered: boolean;
  readAt?: Date | string;
  deliveredAt?: Date | string;
}

// =================== Socket Events ===================
export interface SocketEvents {
  // Joining rooms
  "join-conversation": { conversationId: string };
  "leave-conversation": { conversationId: string };

  // Messaging
  "send-message": SendMessageRequest;
  "message-sent": { message: Message };
  "new-message": { message: Message };

  // Typing indicators
  "typing-start": { conversationId: string; userId: string };
  "typing-stop": { conversationId: string; userId: string };
  "user-typing": { conversationId: string; userId: string; userName: string };
  "user-stopped-typing": { conversationId: string; userId: string };

  // Online status
  "user-online": { userId: string };
  "user-offline": { userId: string; lastSeen: Date };

  // Message status
  "message-delivered": { messageId: string; conversationId: string };
  "message-read": { messageId: string; conversationId: string };

  // Conversation updates
  "conversation-updated": { conversation: Conversation };
  "new-conversation": { conversation: Conversation };

  // Error handling
  error: { message: string; code?: string };
}

// =================== Utility Types ===================
export type MessageWithoutId = Omit<
  Message,
  "id" | "createdAt" | "updatedAt"
>;
export type ConversationWithoutId = Omit<
  Conversation,
  "id" | "createdAt" | "updatedAt"
>;
export type UserWithoutPassword = Omit<User, "password">;

// =================== Form Types ===================
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface MessageFormData {
  content: string;
  type: "TEXT" | "IMAGE" | "FILE";
}

// =================== API Responses ===================
export interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
}

export interface MessagesResponse {
  messages: Message[];
  total: number;
  hasMore: boolean;
}

export interface SearchUsersResponse {
  users: SearchResult[];
  total: number;
}

export interface CreateConversationResponse {
  conversation: Conversation;
  isNew: boolean;
}

// =================== Utility Function ===================
// utils/cn.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional classNames with Tailwind support
 * Usage: cn("px-4", isActive && "bg-blue-500")
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}
