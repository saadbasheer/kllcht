"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatContainer from "@/components/ChatContainer";
import Footer from "@/components/Footer";
import BlurFade from "@/components/magicui/blur-fade";

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth={1.5}
  stroke="currentColor"
  className="size-6"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
  />
</svg>;

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
  const username = searchParams.get("username") ?? "";
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
    <div className="flex flex-col items-center justify-center h-screen py-20 lg:p-20 ">
 
        <ChatContainer
          sendMessage={sendMessage}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          leaveRoom={leaveRoom}
          roomId={roomId}
          username={username}
          messages={messages}
        />
        <Footer />
 
    </div>
  );
}

{
  /* <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.username}: </strong>
            {msg.message}
          </div>
        ))}
      </div> */
}

//       <div className="p-4 border-t">
//         <div className="flex space-x-2">
//           <Input
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             placeholder="Type a message..."
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           />
//           <Button
//             onClick={() => {
//               sendMessage();
//             }}
//           >
//             Send
//           </Button>
//           <Button onClick={leaveRoom} variant="outline">
//             Leave Room
//           </Button>
//         </div>
//       </div>
