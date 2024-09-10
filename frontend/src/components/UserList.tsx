import { ChevronDown, ChevronUp, Users } from "lucide-react";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function UserList({ usersInRoom }: { usersInRoom: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dropdownHeight = useMemo(() => {
    const itemHeight = 36; // Height of a single item in pixels
    const maxVisibleItems = 5; // Maximum number of items to show before scrolling
    return Math.min(usersInRoom.length, maxVisibleItems) * itemHeight;
  }, [usersInRoom.length]);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    // Attach the listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-auto px-2 text-muted-foreground hover:text-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
        </svg>
        <span>{usersInRoom.length}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 " />
        ) : (
          <ChevronDown className="h-4 w-4 " />
        )}</div>
      </Button>
      {isOpen && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-40 bg-black/60 backdrop-blur-sm rounded-md shadow-lg z-10 overflow-hidden"
          style={{ height: `${dropdownHeight}px` }}
        >
          <ScrollArea className="h-full">
            <div
              className="py-0"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {usersInRoom.map((user: string, index: number) => (
                <div
                  key={index}
                  className="px-4 py-2 text-sm text-foreground hover:bg-[#621212]/40 hover:border cursor-pointer"
                  role="menuitem"
                >
                  {user}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
