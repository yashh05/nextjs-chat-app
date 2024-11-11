"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

interface ChatInputBarProps {
  socket: Socket | null;
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({ socket }) => {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");

  const chatroomId = searchParams.get("chatroomId");

  const session = useSession();

  const handleSendMessage = () => {
    if (message.trim() && socket) {
      socket.emit("message", {
        user: session.data?.user.email,
        message,
        chatroomId,
      });
      setMessage("");
    }
  };

  return (
    <div className="border-t border-slate-700 bg-slate-800 p-4 flex items-center gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 rounded bg-slate-700 text-white focus:outline-none"
        placeholder="Type a message..."
      />
      <button
        onClick={handleSendMessage}
        className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Send size={18} />
      </button>
    </div>
  );
};

export default ChatInputBar;
