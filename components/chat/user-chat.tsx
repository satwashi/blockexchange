"use client";
import { RealtimeChat } from "@/components/realtime-chat";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { useSession } from "@/queries/useSession";

export default function UserChat() {
  const { id: roomName, name: username } = useSession();

  if (!roomName || !username) return null;

  return (
    <div className="fixed bottom-20 right-10 z-50">
      <Dialog>
        {/* Trigger button */}
        {/* <DialogTrigger asChild>
          <Button size="icon" className="rounded-full w-14 h-14 shadow-lg">
            <Bot className="w-6 h-6" />
          </Button>
        </DialogTrigger> */}

        <DialogTrigger asChild>
          <Button
            size="icon"
            className="
      rounded-full 
      w-16 h-16 
      shadow-[0_4px_20px_rgba(0,0,0,0.3)]
      hover:scale-105 
      active:scale-95
      transition-all 
      duration-300 
      ease-in-out
      relative overflow-hidden
    "
          >
            <div className="absolute inset-0 bg-white/10 animate-pulse rounded-full" />
            <Bot className="w-10 h-10 text-white relative z-10 animate-bounce" />
          </Button>
        </DialogTrigger>

        <DialogContent
          className="sm:max-w-md w-full h-[400px] flex flex-col p-0 border-0"
          aria-describedby={undefined}
        >
          <DialogHeader className="p-4 pb-2 border-b">
            <DialogTitle className="flex items-center justify-between w-full">
              <span>User Support Chat</span>
              {/* <span
                className={`text-sm font-medium ${
                  isConnected ? "text-green-600" : "text-red-500"
                }`}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </span> */}
            </DialogTitle>
          </DialogHeader>
          <RealtimeChat roomName={roomName} username={username} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
