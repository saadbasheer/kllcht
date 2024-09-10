"use client";

import React, { ReactNode, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hash, PlusCircle } from "lucide-react";

import HyperText from "./ui/hyper-text";
import CopyToClipboard from "./ui/CopyClip";
import UserList from "./UserList";

interface Message {
  username?: ReactNode;
  message: string;
  isCurrentUser?: boolean;
  time: string;
  isSystemMessage?: boolean;
}

type ChatContainerProps = {
  messages: Message[];
  username: string;
  sendMessage: (message: string) => void;
  leaveRoom: () => void;
  roomId: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  inputMessage: string;
  usersInRoom: string[];
  killChat: () => void;
};

export default function ChatContainer({
  messages,
  usersInRoom,
  sendMessage,
  leaveRoom,
  roomId,
  setInputMessage,
  inputMessage,
}: ChatContainerProps) {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col p-2 border h-[115vh] md:w- lg:w-1/2 w-auto rounded-[1.75rem] bg-black/70 overflow-hidden text-gray-100">
      <header className="flex items-center justify-between p-1 border-b border-border">
        <div className="flex items-center space-x-1">
          <Hash className="w-7 h-7 text-primary" aria-hidden="true" />
          <h1 className="text-white font-semibold font-mono lg:text-xl">
            <HyperText text={roomId} />
          </h1>
          <CopyToClipboard text={roomId} />
        </div>
        <div className="flex items-center p-1 space-x-1">
          <div>
            <UserList usersInRoom={usersInRoom} />
          </div>
          <Button
            variant="outline"
            className="text-muted-foreground h-6 w-6 hover:text-primary"
            size="icon"
            onClick={leaveRoom}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M124,216a12,12,0,0,1-12,12H48a12,12,0,0,1-12-12V40A12,12,0,0,1,48,28h64a12,12,0,0,1,0,24H60V204h52A12,12,0,0,1,124,216Zm108.49-96.49-40-40a12,12,0,0,0-17,17L195,116H112a12,12,0,0,0,0,24h83l-19.52,19.51a12,12,0,0,0,17,17l40-40A12,12,0,0,0,232.49,119.51Z"></path>
            </svg>
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-grow overflow-y-auto">
        <div className="p-4 space-y-6">
          {messages.map((msg, index) => (
            <div key={`${msg.username}-${index}`} className="mb-2">
              {msg.isSystemMessage ? (
                <div className="text-center text-gray-400 italic">
                  <span className="text-xs text-gray-500">{msg.time}</span> -{" "}
                  {msg.message}
                </div>
              ) : (
                <div
                  className={`flex ${
                    msg.isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] ${
                      msg.isCurrentUser
                        ? "bg-red-900 text-white"
                        : "bg-gray-800 text-gray-100"
                    } rounded-lg p-2`}
                  >
                    <div className="flex items-baseline space-x-2 mb-1">
                      {!msg.isCurrentUser && (
                        <span className="font-semibold text-sm">
                          {msg.username}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="text-gray-400 hover:text-primary"
            aria-label="Add more"
          >
            <PlusCircle className="w-5 h-5" aria-hidden="true" />
          </Button>
          <Input
            className="rounded-md bg-black/40 w-full"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Dont be evil..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage(inputMessage)}
          />
          <Button
            onClick={() => sendMessage(inputMessage)}
            size={"sm"}
            variant="default"
            className="text-white w-12 hover:text-gray-300"
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="25"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M231.87,114l-168-95.89A16,16,0,0,0,40.92,37.34L71.55,128,40.92,218.67A16,16,0,0,0,56,240a16.15,16.15,0,0,0,7.93-2.1l167.92-96.05a16,16,0,0,0,.05-27.89ZM56,224a.56.56,0,0,0,0-.12L85.74,136H144a8,8,0,0,0,0-16H85.74L56.06,32.16A.46.46,0,0,0,56,32l168,95.83Z"></path>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
