"use client";

import Draggable from "react-draggable";
import { useRef, useState } from "react";
import { useImpersonation } from "@/providers/impersonate-provider";
import { Button } from "./ui/button";
import { useSession } from "@/queries/useSession";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GripVertical, Minus, Plus } from "lucide-react";

export default function ImpersonationAlert() {
  const { impersonatedUserId, isImpersonating, stopImpersonating } =
    useImpersonation();

  const { user } = useSession();
  const [minimized, setMinimized] = useState(false);

  const nodeRef = useRef<HTMLDivElement>(null);

  if (!isImpersonating || !impersonatedUserId) return null;

  return (
    <Draggable nodeRef={nodeRef} handle=".drag-handle">
      <div
        ref={nodeRef}
        className="fixed bottom-6 right-6 z-[100] max-w-sm rounded-2xl shadow-lg bg-secondary p-4 flex items-center gap-3"
      >
        {/* Drag handle */}
        <div className="drag-handle cursor-grab active:cursor-grabbing text-muted-foreground">
          <GripVertical className="h-5 w-5" />
        </div>

        <Avatar>
          <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
          <AvatarFallback>
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>

        {!minimized && (
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              You are impersonating
            </p>
            <p className="font-semibold">{user?.name}</p>
          </div>
        )}

        {!minimized && (
          <Button onClick={stopImpersonating} variant="default" size="sm">
            Stop
          </Button>
        )}

        {/* Minimize / Expand toggle */}
        <button
          onClick={() => setMinimized((prev) => !prev)}
          className="p-1 rounded-md hover:bg-muted"
        >
          {minimized ? (
            <Plus className="h-4 w-4" />
          ) : (
            <Minus className="h-4 w-4" />
          )}
        </button>
      </div>
    </Draggable>
  );
}
