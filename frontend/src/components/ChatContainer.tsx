"use client";

import React, { ReactNode, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Hash,
  PlusCircle,
} from "lucide-react";

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
  killChat,
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
        <div className="flex items-center p-1 space-x-4">
          <div>
            <UserList usersInRoom={usersInRoom} />
          </div>
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
            className="text-gray-400"
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
