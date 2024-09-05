import React from "react";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono scroll-m-20 pb-5 text-3xl font-semibold tracking-tight first:mt-0">
      {children}
    </div>
  );
}
