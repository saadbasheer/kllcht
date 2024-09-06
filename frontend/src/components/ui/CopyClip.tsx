"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";


interface CopyToClipboardProps {
  className?: string;
  text: string;
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  className,
  text,
}) => {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = useCallback(async () => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  }, [copied, text]);

  return (
    <div className={cn("relative inline-block", className)}>
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={handleCopy}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onTouchStart={() => {
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 1000);
        
        }}
        className="border size-[17px] dark:border-neutral-800 rounded-md backdrop-blur-2xl z-[2]"
        aria-label={copied ? "Copied" : "Copy to clipboard"}
      >
        {copied ? <CheckMark /> : <ClipBoard />}
      </Button>
      {showTooltip && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black/70 text-white text-xs rounded-xl whitespace-nowrap z-10">
          {copied ? "Copied!" : "Copy hash"}
        </div>
      )}
    </div>
  );
};

export const ClipBoard: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="scale-[0.70] dark:stroke-neutral-400 stroke-neutral-800"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  </svg>
);

export const CheckMark: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="scale-[0.70] dark:stroke-neutral-400 stroke-neutral-800"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default CopyToClipboard;
