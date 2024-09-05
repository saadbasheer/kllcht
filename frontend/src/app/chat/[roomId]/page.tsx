"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  username: ReactNode;
  message: string;
}

export default function Chat({
  params,
}: {
  params: { roomId: string; username: string };
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const roomId = params.roomId;

  useEffect(() => {
    const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!NEXT_PUBLIC_BACKEND_URL) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
    }
    const newSocket = io(NEXT_PUBLIC_BACKEND_URL);
    setSocket(newSocket);

    newSocket.emit("joinRoom", { roomId, username });

    newSocket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.close();
    };
  }, [roomId, username]);

  const sendMessage = () => {
    if (inputMessage.trim() && socket) {
      socket.emit("chatMessage", { roomId, username, message: inputMessage });
      setInputMessage("");
    }
  };

  const leaveRoom = () => {
    if (socket) {
      socket.emit("leaveRoom", { roomId, username });
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.username}: </strong>
            {msg.message}
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button
            onClick={() => {
              sendMessage();
            }}
          >
            Send
          </Button>
          <Button onClick={leaveRoom} variant="outline">
            Leave Room
          </Button>
        </div>
      </div>
    </div>
  );
}
