// "use client";

// import { cn } from "@/lib/utils";
// import { ChatMessageItem } from "@/components/chat-message";
// import { useChatScroll } from "@/hooks/use-chat-scroll";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Send } from "lucide-react";
// import { useCallback, useEffect, useMemo, useState } from "react";

// import { useRoomChat } from "@/hooks/use-room-chat";

// interface RealtimeChatProps {
//   roomName: string;
//   username: string;
// }

// export const RealtimeChat = ({ roomName, username }: RealtimeChatProps) => {
//   // ✅ Correct hook call
//   const { messages, sendMessage, isConnected, isLoading } = useRoomChat(
//     roomName,
//     username
//   );
//   // 🧭 Scroll behavior
//   const { containerRef, scrollToBottom } = useChatScroll();

//   // 💬 New message state
//   const [newMessage, setNewMessage] = useState("");

//   // 🔄 Scroll to bottom whenever messages change
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, scrollToBottom]);

//   // 🚀 Send message
//   const handleSendMessage = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault();
//       if (!newMessage.trim() || !isConnected) return;

//       await sendMessage(newMessage.trim());
//       setNewMessage("");
//       // markChatAsRead(roomName);
//     },
//     [newMessage, isConnected, sendMessage]
//   );

//   // 🧩 Sort and remove duplicates
//   const sortedMessages = useMemo(() => {
//     const unique = messages.filter(
//       (msg, idx, arr) => idx === arr.findIndex((m) => m.id === msg.id)
//     );
//     return unique.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
//   }, [messages]);

//   return (
//     <div className="flex flex-col h-full w-full bg-background text-foreground antialiased ">
//       {/* 🟡 Loading State */}
//       {isLoading && (
//         <div className="flex justify-center items-center py-4 text-sm text-muted-foreground">
//           Loading messages...
//         </div>
//       )}

//       {/* 🔌 Connection status bar removed on revert */}

//       {/* 💬 Messages */}
//       <div
//         ref={containerRef}
//         className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
//       >
//         {sortedMessages.length === 0 && !isLoading ? (
//           <div className="text-center text-sm text-muted-foreground">
//             No messages yet. Start the conversation!
//           </div>
//         ) : (
//           <div className="space-y-1">
//             {sortedMessages.map((message, index) => {
//               const prev = sortedMessages[index - 1];
//               const showHeader = !prev || prev.user.name !== message.user.name;

//               return (
//                 <div
//                   key={message.id}
//                   className="animate-in fade-in slide-in-from-bottom-4 duration-300"
//                 >
//                   <ChatMessageItem
//                     message={message}
//                     isOwnMessage={message.user.name === username} // ✅ fixed
//                     showHeader={showHeader}
//                   />
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* 📝 Input */}
//       <form
//         onSubmit={handleSendMessage}
//         className="flex w-full gap-2 border-t border-border p-4 shrink-0"
//       >
//         <Input
//           className={cn(
//             "rounded-full bg-background text-sm transition-all duration-300",
//             isConnected && newMessage.trim() ? "w-[calc(100%-36px)]" : "w-full"
//           )}
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder={
//             isConnected ? "Type a message..." : "Connecting to chat..."
//           }
//           disabled={!isConnected}
//         />
//         {isConnected && newMessage.trim() && (
//           <Button
//             className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
//             type="submit"
//           >
//             <Send className="size-4" />
//           </Button>
//         )}
//       </form>
//     </div>
//   );
// };

"use client";

import { cn } from "@/lib/utils";
import { ChatMessageItem } from "@/components/chat-message";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useRoomChat } from "@/hooks/use-room-chat";

interface RealtimeChatProps {
  roomName: string;
  username: string;
}

export const RealtimeChat = ({ roomName, username }: RealtimeChatProps) => {
  // ✅ Correct hook call
  const { messages, sendMessage, isConnected, isLoading } = useRoomChat(
    roomName,
    username
  );
  // 🧭 Scroll behavior
  const { containerRef, scrollToBottom } = useChatScroll();

  // 💬 New message state
  const [newMessage, setNewMessage] = useState("");

  // 🔄 Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 🚀 Send message
  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim() || !isConnected) return;

      await sendMessage(newMessage.trim());
      setNewMessage("");
      // markChatAsRead(roomName);
    },
    [newMessage, isConnected, sendMessage]
  );

  // 🧩 Sort and remove duplicates
  const sortedMessages = useMemo(() => {
    const unique = messages.filter(
      (msg, idx, arr) => idx === arr.findIndex((m) => m.id === msg.id)
    );
    return unique.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground antialiased ">
      {/* 🟡 Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-4 text-sm text-muted-foreground">
          Loading messages...
        </div>
      )}

      {/* 💬 Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
      >
        {sortedMessages.length === 0 && !isLoading ? (
          <div className="text-center text-sm text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-1">
            {sortedMessages.map((message, index) => {
              const prev = sortedMessages[index - 1];
              const showHeader = !prev || prev.user.name !== message.user.name;

              return (
                <div
                  key={message.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                >
                  <ChatMessageItem
                    message={message}
                    isOwnMessage={message.user.name === username} // ✅ fixed
                    showHeader={showHeader}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 📝 Input */}
      <form
        onSubmit={handleSendMessage}
        className="flex w-full gap-2 border-t border-border p-4 shrink-0"
      >
        <Input
          className={cn(
            "rounded-full bg-background text-sm transition-all duration-300",
            isConnected && newMessage.trim() ? "w-[calc(100%-36px)]" : "w-full"
          )}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={
            // ✅ FIX: Only show "Connecting" if no messages loaded yet
            !isConnected && messages.length === 0
              ? "Connecting to chat..."
              : "Type a message..."
          }
          disabled={!isConnected}
        />
        {isConnected && newMessage.trim() && (
          <Button
            className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
            type="submit"
          >
            <Send className="size-4" />
          </Button>
        )}
      </form>
    </div>
  );
};
