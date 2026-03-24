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
import { Send, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import supabaseClient from "@/lib/client";
import { uploadChatImage } from "@/server/chat/upload-image";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  // 🔄 Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 🚀 Send message
  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if ((!newMessage.trim() && !imageFile) || !isConnected || isUploading) return;

      let uploadedImageUrl: string | undefined;

      try {
        if (imageFile) {
          setIsUploading(true);
          const formData = new FormData();
          formData.append("image", imageFile);
          formData.append("roomName", roomName);

          uploadedImageUrl = await uploadChatImage(formData);
        }

        await sendMessage(newMessage.trim(), uploadedImageUrl);
        
        // Reset state
        setNewMessage("");
        removeImage();
      } catch (error: any) {
         console.error("Message send failed:", error);
         alert(error.message || "Failed to send message.");
      } finally {
        setIsUploading(false);
      }
    },
    [newMessage, imageFile, isConnected, isUploading, roomName, sendMessage]
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
      <div className="flex flex-col border-t border-border shrink-0 bg-background">
        {/* Image Preview Area */}
        {imagePreview && (
          <div className="p-3 pb-0 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="relative inline-block border rounded-md overflow-hidden bg-muted/30">
              <img src={imagePreview} alt="Preview" className="h-20 w-auto object-cover" />
              <button 
                type="button" 
                onClick={removeImage}
                className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                disabled={isUploading}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSendMessage}
          className="flex w-full gap-2 p-3 items-center"
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageSelect}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={() => fileInputRef.current?.click()}
            disabled={!isConnected || isUploading}
          >
            <ImageIcon className="w-5 h-5" />
          </Button>

          <Input
            className="rounded-full bg-background text-sm transition-all duration-300 w-full"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={
              !isConnected && messages.length === 0
                ? "Connecting to chat..."
                : imageFile ? "Add a caption..." : "Type a message..."
            }
            disabled={!isConnected || isUploading}
          />
          
          <Button
            className={cn(
              "aspect-square rounded-full transition-all duration-300",
              (newMessage.trim() || imageFile) ? "opacity-100 scale-100" : "opacity-0 scale-90 w-0 p-0 overflow-hidden"
            )}
            type="submit"
            disabled={isUploading || (!newMessage.trim() && !imageFile)}
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};
