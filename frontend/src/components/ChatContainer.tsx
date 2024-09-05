"use client";

import React, { ReactNode, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Hash,
  Users,
  Bookmark,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react";

interface Message {
  username: ReactNode;
  message: string;
}


type ChatContainerProps = {
  messages: Message[];
  username: string;
  sendMessage: (message: string) => void;
  leaveRoom: () => void;
  roomId: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  inputMessage: string;
};

export default function ChatContainer({
  messages,
  username,
  sendMessage,
  leaveRoom,
  roomId,
  setInputMessage,
  inputMessage,
}: ChatContainerProps) {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex p-4 flex-col md:w-1/3 h-screen w-auto lg:w-1/2 rounded-[2rem] border  bg-[#000000] text-gray-100">
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Hash className="w-5 h-5 text-accent" />
          <h1 className="text-white font-semibold">{roomId}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Users className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">32</span>

          <Bookmark className="w-5 h-5 text-gray-400" />
          <Button variant="ghost" size="icon" className="text-gray-400">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{username}</span>
                    <span className="text-xs text-gray-400">{time}</span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-gray-400">
            <PlusCircle className="w-5 h-5" />
          </Button>
          <Input
          className="rounded-xl p-5"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage(inputMessage)}
          />
          <Button
            onClick={() => sendMessage(inputMessage)}
            size={"sm"}
            className="text-gray-400"
          >
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
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => leaveRoom()}
            className="text-gray-400"
          >
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
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
