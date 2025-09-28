import { RealtimeChat } from "@/components/realtime-chat";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Customer } from "@/app/chat/page";

export default function AdminChatPage({ customer }: { customer: Customer }) {
  return (
    <>
      <ChatHeader customer={customer} />
      <RealtimeChat
        roomName={`chat_${customer.id}`} // join that user's room
        username="Admin"
      />
    </>
  );
}

function ChatHeader({ customer }: { customer: Customer }) {
  return (
    <div className="bg-card border-b border-border p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* Back button for mobile
        {onBackToList && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackToList}
            className="md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )} */}
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
