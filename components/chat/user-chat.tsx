"use client";

import { useState } from "react";
import { RealtimeChat } from "@/components/realtime-chat";
import { useSession } from "@/queries/useSession";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react"; // nice bot icon

export default function UserChat() {
  const { user, isLoading } = useSession();
  const [open, setOpen] = useState(false);

  if (isLoading) return <>Loading</>;
  if (!user) return null; // only show if logged in

  const customerId = user.id;

  return (
    <div className="fixed bottom-30 right-10 z-50">
      {/* Floating button */}
      <Button
        size="icon"
        className="rounded-full w-14 h-14 shadow-lg"
        onClick={() => setOpen(true)}
      >
        <Bot className="w-6 h-6" />
      </Button>

      {/* Chat dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md w-full h-[500px] flex flex-col p-0">
          <div className="flex-1 overflow-hidden">
            <RealtimeChat roomName={`chat_${4}`} username={`${user.name}`} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
