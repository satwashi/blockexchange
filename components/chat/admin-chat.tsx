"use client";
import { RealtimeChat } from "@/components/realtime-chat";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Customer } from "@/types/chat/customer";
import useMarkChatAsRead from "@/queries/chat/use-Mark-read";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/queries/useSession";

export default function AdminChatPage({ customer }: { customer?: Customer }) {
  const { name: username } = useSession();

  if (!customer) {
    return (
      <div className="flex h-screen flex-col  items-center justify-center">
        <div className="text-center">
          <h2 className="font-semibold text-xl mb-2">No customer selected</h2>
          <p className="text-muted-foreground">
            Please select a customer to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ChatHeader customer={customer} />
      <div className="flex-1 min-h-0">
        <RealtimeChat
          roomName={`${customer.id}`}
          username={username} // join that user's room
        />
      </div>
    </div>
  );
}

function ChatHeader({ customer }: { customer?: Customer }) {
  const { markChatAsRead, isPending } = useMarkChatAsRead();
  const router = useRouter();

  // Mark chat as read only once when header mounts
  useEffect(() => {
    if (customer?.id) {
      markChatAsRead(customer.id);
    }
  }, [customer?.id, markChatAsRead]);

  if (!customer) return null;

  return (
    <div className="bg-card border-b border-border p-4 flex items-center justify-between shrink-0 h-16">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/chat")}
          className="md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={customer.avatar} alt={customer.name} />
            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {customer.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-online rounded-full border-2 border-background"></div>
          )}
        </div>
        <div>
          <h2 className="font-medium">{customer.name}</h2>
          <p className="text-sm text-muted-foreground">
            {customer.isOnline ? "Online" : "Last seen recently"}
          </p>
        </div>
      </div>
    </div>
  );
}
