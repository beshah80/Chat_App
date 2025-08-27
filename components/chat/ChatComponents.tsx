"use client";

import { motion } from "framer-motion";
import { Check, CheckCheck, Clock, Menu, MoreVertical, Phone, Search, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChatStore } from "../../store/chatStore";
import { Message as ChatMessage } from "../../types/chat";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

// Format message timestamp
function formatMessageTime(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const isYesterday =
    new Date(d.getTime() + 24 * 60 * 60 * 1000).toDateString() === today.toDateString();

  if (isToday) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (isYesterday)
    return `Yesterday at ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  return d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

// Format relative time
function formatTime(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - d.getTime()) / (1000 * 60 * 60);
  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60);
    return minutes < 1 ? "just now" : `${minutes}m ago`;
  }
  if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
  const days = Math.floor(diffInHours / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}

// Message status icon
function MessageStatusIcon({ status }: { status: ChatMessage["status"] }) {
  switch (status) {
    case "sending":
    case "sent":
      return <Clock className="h-3 w-3 text-pink-300" />;
    case "delivered":
      return <Check className="h-3 w-3 text-sky-400" />;
    case "read":
      return <CheckCheck className="h-3 w-3 text-lime-400" />;
    case "failed":
      return <span className="text-red-500 text-[10px]">!</span>;
    default:
      return null;
  }
}

interface MessageBubbleProps {
  message: ChatMessage;
  previousMessage?: ChatMessage;
}

function MessageBubble({ message, previousMessage }: MessageBubbleProps) {
  const showAvatar =
    !message.isOwn &&
    (!previousMessage ||
      previousMessage.senderId !== message.senderId ||
      new Date(message.timestamp).getTime() - new Date(previousMessage.timestamp).getTime() > 5 * 60 * 1000);

  return (
    <motion.div
      className={`flex ${message.isOwn ? "justify-end" : "justify-start"} mb-1.5`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`flex items-end space-x-1.5 max-w-[70%] ${message.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}>
        {showAvatar && !message.isOwn && (
          <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
            {message.senderName.charAt(0).toUpperCase()}
          </div>
        )}
        {!showAvatar && !message.isOwn && <div className="w-5" />}
        <div
          className={`px-3 py-2 rounded-2xl relative shadow-lg transform hover:scale-105 transition-transform duration-200 ${
            message.isOwn
              ? "bg-[#FF69B4] text-white rounded-br-sm"
              : "bg-[#A7F3D0] text-[#1F2937] border border-gray-200 rounded-bl-sm"
          }`}
        >
          <p className="text-sm leading-tight break-words font-comic">{message.content}</p>
          <div className={`flex items-center justify-end space-x-1 mt-0.5 text-[10px] ${message.isOwn ? "text-white/70" : "text-gray-500"}`}>
            <span>{formatMessageTime(message.timestamp)}</span>
            {message.isOwn && <MessageStatusIcon status={message.status} />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ------------------- Chat Sidebar -------------------
export function ChatSidebar() {
  const { conversations, activeConversationId, setActiveConversation } = useChatStore();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredChats = conversations.filter((conv) =>
    (conv.name ?? conv.participants.map((p) => p.name).join(",")).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-gray-50 border-r flex flex-col h-full md:static md:flex md:w-60 md:min-w-[240px]">
      <div className="p-2 border-b border-gray-200 bg-white shadow-md">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">P</div>
            <span className="font-bold text-sm text-gray-800 font-comic">Profile</span>
          </button>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100 md:hidden">
            <Menu className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-100 border-transparent text-xs rounded-full h-8 focus:bg-white font-comic"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="space-y-0.5 p-1">
          {filteredChats.map((conv) => (
            <div
              key={conv.id}
              className={`px-2 py-2.5 rounded-lg cursor-pointer transition-colors border-t border-divider first:border-t-0 ${
                activeConversationId === conv.id ? "bg-blue-100 shadow-inner" : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveConversation(conv.id)}
            >
              <div className="flex items-center space-x-2">
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                    {(conv.name ?? conv.participants[0]?.name)?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs truncate font-comic">
                      {conv.name ?? conv.participants.map((p) => p.name).join(", ")}
                    </h3>
                    <span className="text-[10px] text-gray-500 flex-shrink-0">
                      {conv.lastMessage ? formatTime(conv.lastMessage.timestamp) : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-gray-600 truncate font-comic">
                      {conv.lastMessage?.content ?? "No messages yet."}
                    </p>
                    {conv.unreadCount > 0 && (
                      <div className="ml-2 px-1.5 py-0.5 bg-yellow-400 text-gray-800 rounded-full text-[10px] font-bold min-w-[18px] text-center">
                        {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredChats.length === 0 && (
            <div className="p-6 text-center text-gray-500 text-xs font-comic">No chats found.</div>
          )}
        </div>
      </div>
    </aside>
  );
}

// ------------------- Chat Window -------------------
export function ChatWindow() {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { conversations, activeConversationId, messages, addMessage } = useChatStore();

  const currentConversation = conversations.find((c) => c.id === activeConversationId);

  const chatMessages = useMemo(() => (activeConversationId ? messages[activeConversationId] || [] : []), [
    activeConversationId,
    messages,
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentConversation) return;

    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      content: message.trim(),
      type: "TEXT",
      conversationId: currentConversation.id,
      senderId: "me",
      senderName: "Me",
      timestamp: new Date(),
      status: "sending",
      isOwn: true,
    };

    addMessage(currentConversation.id, newMsg);
    setMessage("");
  };

  if (!currentConversation)
    return <div className="flex-1 flex items-center justify-center text-gray-400 font-comic">Select a conversation</div>;

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
            {(currentConversation.name ?? currentConversation.participants[0]?.name)?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-sm font-bold font-comic">
              {currentConversation.name ?? currentConversation.participants.map((p) => p.name).join(", ")}
            </h2>
            <span className="text-[10px] text-gray-500 font-comic">
              {currentConversation.type === "DIRECT"
                ? "Online"
                : `${currentConversation.participants.length} participants`}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-4 w-4 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        {chatMessages.map((msg, idx) => (
          <MessageBubble key={msg.id} message={msg} previousMessage={chatMessages[idx - 1]} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex items-center border-t border-gray-200 p-2 space-x-2 bg-white">
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 h-10 text-sm font-comic"
        />
        <Button type="submit" size="icon" variant="ghost">
          <Send className="h-5 w-5 text-gray-600" />
        </Button>
      </form>
    </div>
  );
}
