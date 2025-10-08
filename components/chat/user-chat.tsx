"use client";
import { RealtimeChat } from "@/components/realtime-chat";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { useSession } from "@/queries/useSession";

export default function UserChat() {
  const { id: roomName, name: username } = useSession();

  return (
    <div className="fixed bottom-10 right-10 z-50">
      <Dialog>
        {/* Trigger button */}
        <DialogTrigger asChild>
          <Button size="icon" className="rounded-full w-14 h-14 shadow-lg">
            <Bot className="w-6 h-6" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md w-full h-[500px] flex flex-col p-0">
          <RealtimeChat roomName={roomName} username={username} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
