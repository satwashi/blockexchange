"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ResizablePanelProps {
  children: [React.ReactNode, React.ReactNode];
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
}

export function ResizablePanel({
  children,
  defaultSize = 320,
  minSize = 80,
  maxSize = 500,
}: ResizablePanelProps) {
  const [sidebarWidth, setSidebarWidth] = useState(defaultSize);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth >= minSize && newWidth <= maxSize) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, minSize, maxSize]);

  return (
    <div ref={containerRef} className="flex h-full">
      {/* Left Panel */}
      <div style={{ width: sidebarWidth }} className="shrink-0 h-full">
        {children[0]}
      </div>

      {/* Resize Handle */}
      <div
        className={cn(
          "w-1 cursor-col-resize bg-border hover:bg-primary/50 transition-colors shrink-0 h-full",
          isResizing && "bg-primary"
        )}
        onMouseDown={() => setIsResizing(true)}
      />

      {/* Right Panel */}
      <div className="flex-1 min-w-0 h-full">{children[1]}</div>
    </div>
  );
}
