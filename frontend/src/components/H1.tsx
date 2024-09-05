import React from "react";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono pb-5  text-nowrap text-5xl font-semibold tracking-tight first:mt-0">
      {children}
    </div>
  );
}
