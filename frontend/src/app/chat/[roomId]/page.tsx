"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import ChatContainer from "@/components/ChatContainer";
import Footer from "@/components/Footer";
import H1 from "@/components/H1";
import KillChatButton from "@/components/KillChatButton";

interface Message {
  username?: ReactNode;
  message: string;
  isCurrentUser?: boolean;
  time: string;
  isSystemMessage?: boolean;
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
  const [usersInRoom, setUsersInRoom] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const username = searchParams.get("username") ?? "";
  const roomId = params.roomId;

  const killChat = () => {
    if (socket) {
      socket.emit("killChat", { roomId, username });
    }
  };

  useEffect(() => {
    const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!NEXT_PUBLIC_BACKEND_URL) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
    }
    const newSocket = io(NEXT_PUBLIC_BACKEND_URL);
    setSocket(newSocket);

    newSocket.emit("joinRoom", { roomId, username });

    // Listen for regular chat messages
    newSocket.on(
      "message",
      (message: { username: ReactNode; message: string }) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...message,
            isCurrentUser: message.username === username,
            time: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    );

    const sendMessage = () => {
      if (inputMessage.trim() && socket) {
        if (inputMessage.toLowerCase() === "/kllchat") {
          killChat();
        } else {
          socket.emit("chatMessage", {
            roomId,
            username,
            message: inputMessage,
          });
        }
        setInputMessage("");
      }
    };

    // Listen for system messages
    newSocket.on("systemMessage", (message: string) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message,
          isSystemMessage: true, // Mark the message as a system message
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    });

    
    newSocket.on("chatKilled", () => {
      setMessages((prevMessages) => [
        ...prevMessages,
      ]);
      setTimeout(() => {
        router.push("/");
      }, 5000); // Redirect after 5 seconds
    });

    // Listen for user list updates
    newSocket.on("roomData", ({ users }) => {
      setUsersInRoom(users); // Update the user list
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
    <div className="flex flex-col items-center justify-center h-screen py-20 lg:p-20">
      <KillChatButton killChat={killChat} />
      <ChatContainer
        sendMessage={sendMessage}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        leaveRoom={leaveRoom}
        roomId={roomId}
        username={username}
        messages={messages}
        killChat={killChat}
        usersInRoom={usersInRoom}
      />
      <Footer />
    </div>
  );
}
