"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import ChatInputBar from "./ChatInputBar";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

interface ChatRoomProps {
  user: { id: string; name: string };
}

const ChatRoom: React.FC<ChatRoomProps> = () => {
  const searchParams = useSearchParams();
  const chatroomId = searchParams.get("chatroomId");

  const { data: session } = useSession();
  console.log("session:", session);

  const [messages, setMessages] = useState<
    { content: string; userId: string }[]
  >([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!chatroomId) {
      return;
    }

    const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

    newSocket.emit("joinRoom", { chatroomId });

    newSocket.on(
      "messageHistory",
      (response: { content: string; userId: string }[]) => {
        setMessages(response);
      }
    );
    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server:", newSocket.id);
    });

    newSocket.on(
      "message",
      ({ content, userId }: { content: string; userId: string }) => {
        setMessages((prevMessages) => [...prevMessages, { userId, content }]);
      }
    );

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server.");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [chatroomId, session]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index + "message"}
            className="bg-slate-800 p-3 rounded-lg shadow-sm"
          >
            <p className="text-slate-300">
              {message.userId}: {message.content}
            </p>
          </div>
        ))}
      </div>
      <ChatInputBar socket={socket} />
    </div>
  );
};

export default ChatRoom;
