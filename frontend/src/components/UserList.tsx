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
        <Users className="h-4 w-4 mr-2" />
        <span>{usersInRoom.length}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 ml-2" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-2" />
        )}
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
