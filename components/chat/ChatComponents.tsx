"use client";

import { motion } from "framer-motion";
import {
  Check,
  CheckCheck,
  Clock,
  Menu,
  MoreVertical,
  Phone,
  Search,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChatStore } from "../../store/chatStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

// Refined color palette - vibrant and opaque
const sillyColors = {
  background: "#F0F4F8",
  chatBackground: "#F9FAFB",
  myBubble: "#FF69B4", // Hot Pink
  otherBubble: "#A7F3D0", // Light Emerald
  myText: "#FFFFFF",
  otherText: "#1F2937",
  header: "#FFFFFF",
  border: "#D1D5DB",
  secondaryText: "#6B7280",
  unreadBadge: "#FFD700", // Gold
  sentIcon: "#FFC0CB", // Light Pink
  deliveredIcon: "#60A5FA", // Sky Blue
  readIcon: "#34D399", // Lime Green
};

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  status: "sent" | "delivered" | "read";
  senderId: string;
}

function formatTime(date: Date) {
  const now = new Date();
  const diffInHours =
    Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60);
    return minutes < 1 ? "just now" : `${minutes}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else {
    const days = Math.floor(diffInHours / 24);
    return days === 1 ? "yesterday" : `${days}d ago`;
  }
}

function formatMessageTime(date: Date) {
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const isYesterday =
    new Date(date.getTime() + 24 * 60 * 60 * 1000).toDateString() ===
    today.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (isYesterday) {
    return `Yesterday at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else {
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

function MessageStatusIcon({ status }: { status: string }) {
  switch (status) {
    case "sent":
      return <Clock className={`h-3 w-3 text-[${sillyColors.sentIcon}]`} />;
    case "delivered":
      return (
        <Check className={`h-3 w-3 text-[${sillyColors.deliveredIcon}]`} />
      );
    case "read":
      return (
        <CheckCheck className={`h-3 w-3 text-[${sillyColors.readIcon}]`} />
      );
    default:
      return null;
  }
}

interface MessageBubbleProps {
  message: Message;
  previousMessage?: Message;
}

function MessageBubble({ message, previousMessage }: MessageBubbleProps) {
  const showAvatar =
    !message.isOwn &&
    (!previousMessage ||
      previousMessage.senderId !== message.senderId ||
      new Date(message.timestamp).getTime() -
        new Date(previousMessage.timestamp).getTime() >
        5 * 60 * 1000);

  return (
    <motion.div
      className={`flex ${
        message.isOwn ? "justify-end" : "justify-start"
      } mb-1.5`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`flex items-end space-x-1.5 max-w-[70%] ${
          message.isOwn ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        {showAvatar && !message.isOwn && (
          <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
            {message.senderId.charAt(0).toUpperCase()}
          </div>
        )}
        {!showAvatar && !message.isOwn && <div className="w-5" />}
        <div
          className={`px-3 py-2 rounded-2xl relative shadow-lg transform hover:scale-105 transition-transform duration-200 ${
            message.isOwn
              ? `bg-[${sillyColors.myBubble}] text-[${sillyColors.myText}] rounded-br-sm`
              : `bg-[${sillyColors.otherBubble}] text-[${sillyColors.otherText}] border border-gray-200 rounded-bl-sm`
          }`}
        >
          <p className="text-sm leading-tight break-words font-comic">
            {message.content}
          </p>
          <div
            className={`flex items-center justify-end space-x-1 mt-0.5 text-[10px] ${
              message.isOwn ? "text-white/70" : "text-gray-500"
            }`}
          >
            <span>{formatMessageTime(message.timestamp)}</span>
            {message.isOwn && <MessageStatusIcon status={message.status} />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ChatSidebar() {
  const { chats, activeChat, setActiveChat, sidebarOpen, toggleSidebar } =
    useChatStore();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Reset sidebarOpen to true on large screens to ensure hamburger menu doesn't persist
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Tailwind's 'md' breakpoint
        useChatStore.getState().setViewMode("chats"); // Ensure sidebarOpen is true on large screens
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {sidebarOpen && (
        <motion.div
          className="md:hidden fixed inset-0 bg-black/20 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
        />
      )}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-[${
          sillyColors.chatBackground
        }] border-r border-gray-200 flex flex-col h-full md:static md:flex md:w-60 md:min-w-[240px] md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -240 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="p-2 border-b border-gray-200 bg-white shadow-md">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                P
              </div>
              <span className="font-bold text-sm text-gray-800 font-comic">
                Profile
              </span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hover:bg-gray-100 md:hidden"
            >
              <Menu className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <Input
              placeholder="Search for your buddies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-100 border-transparent text-xs rounded-full h-8 focus:bg-white focus:border-purple-400 font-comic"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="space-y-0.5 p-1">
            {filteredChats.map((chat) => (
              <motion.div
                key={chat.id}
                className={`px-2 py-2.5 rounded-lg cursor-pointer transition-colors border-t border-divider first:border-t-0 ${
                  activeChat === chat.id
                    ? "bg-blue-100 shadow-inner"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  setActiveChat(chat.id);
                  if (sidebarOpen) toggleSidebar();
                }}
                whileHover={{ scale: 1.01, backgroundColor: "#E6F6FF" }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                      {chat.name.charAt(0).toUpperCase()}
                    </div>
                    {chat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full animate-ping" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`font-bold text-xs truncate font-comic ${
                          activeChat === chat.id
                            ? "text-blue-500"
                            : "text-gray-800"
                        }`}
                      >
                        {chat.name}
                      </h3>
                      <span className="text-[10px] text-gray-500 flex-shrink-0">
                        {formatTime(chat.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-gray-600 truncate font-comic">
                        {chat.lastMessage}
                      </p>
                      {chat.unreadCount > 0 && (
                        <motion.div
                          className={`ml-2 px-1.5 py-0.5 bg-[${sillyColors.unreadBadge}] text-gray-800 rounded-full text-[10px] font-bold min-w-[18px] text-center`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredChats.length === 0 && (
              <div className="p-6 text-center text-gray-500 text-xs font-comic">
                No chats found. So lonely...
              </div>
            )}
          </div>
        </div>
        <div className="p-2 border-t border-gray-200 bg-white shadow-inner">
          <div className="flex items-center justify-between text-[10px] text-gray-500 font-comic">
            <span>Chat App 😜</span>
            <span>v1.0.1</span>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export function ChatWindow() {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { chats, messages, activeChat, sendMessage, toggleSidebar } =
    useChatStore();

  // Ensure hamburger menu is hidden on large screens after resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Tailwind's 'md' breakpoint
        useChatStore.getState().setViewMode("chats"); // Set sidebarOpen: true
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentChat = chats.find((chat) => chat.id === activeChat);
  const chatMessages = useMemo(
    () => (activeChat ? messages[activeChat] || [] : []),
    [activeChat, messages]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (activeChat && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeChat]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;
    sendMessage(activeChat, message.trim());
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && activeChat) {
        sendMessage(activeChat, message.trim());
        setMessage("");
      }
    }
  };

  if (!activeChat || !currentChat) {
    return (
      <div
        className={`flex-1 flex items-center justify-center bg-[${sillyColors.chatBackground}]`}
      >
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
            <Send className="w-8 h-8 text-[#FF69B4] animate-bounce" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800 animate-pulse font-comic">
              Start a wacky conversation!
            </h3>
            <p className="text-xs text-gray-600 max-w-xs mx-auto font-comic">
              Pick a friend from the left sidebar and let the silliness begin!
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex flex-col h-full bg-[${sillyColors.chatBackground}]`}
    >
      <motion.header
        className={`p-2.5 border-b border-gray-200 bg-[${sillyColors.header}] flex items-center justify-between shadow-md`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-4 w-4 text-gray-600" />
          </Button>
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
              {currentChat.name.charAt(0).toUpperCase()}
            </div>
            {currentChat.isOnline && (
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border border-white rounded-full animate-ping" />
            )}
          </div>
          <div>
            <h2 className="font-bold text-sm text-gray-800 font-comic">
              {currentChat.name}
            </h2>
            <p className="text-[11px] text-gray-600 font-comic">
              {currentChat.isOnline
                ? "Online and ready to party!"
                : "Out doing something boring"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <Phone className="h-4 w-4 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </motion.header>
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
        {chatMessages.map((msg, index) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            previousMessage={chatMessages[index - 1]}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <motion.form
        onSubmit={handleSendMessage}
        className="p-2 border-t border-gray-200 bg-white shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-end space-x-1.5">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your funny thoughts here..."
            className="resize-none min-h-[36px] max-h-20 bg-gray-100 border-transparent rounded-full text-xs font-comic"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim()}
            className="bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 rounded-full shadow-lg transition-transform duration-200 hover:scale-105"
          >
            <Send className="h-4 w-4 text-white" />
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
