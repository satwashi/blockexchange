// "use client";

// import { useEffect, useState } from "react";

// import { ChatMessage } from "@/server/chat/store-message";
// import { useRoomsMessages } from "@/queries/chat/use-room-messages";
// import { useRealtimeChat } from "@/hooks/use-realtime-chat";

// export function useRoomChat(roomName: string, username: string) {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);

//   // 🗂 Load existing messages from DB
//   const { messages: fetchedMessages = [], isLoading } =
//     useRoomsMessages(roomName);

//   // ⚡ Setup realtime messages
//   const {
//     messages: liveMessages,
//     sendMessage,
//     isConnected,
//     onlineUsers,
//   } = useRealtimeChat({
//     roomName,
//     username,
//   });

//   // 🧠 Combine fetched + live messages, remove duplicates
//   useEffect(() => {
//     const map = new Map<string, ChatMessage>();

//     // Add fetched messages first
//     fetchedMessages.forEach((m) => map.set(m.id, m));

//     // Add live messages
//     liveMessages.forEach((m) => map.set(m.id, m));

//     // Sort by createdAt
//     const combined = Array.from(map.values()).sort(
//       (a, b) =>
//         new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//     );

//     setMessages(combined);
//   }, [fetchedMessages, liveMessages]);

//   return {
//     messages,
//     sendMessage,
//     isLoading,
//     isConnected,
//     isCustomerOnline: onlineUsers.has(username),
//   };
// }

"use client";

import { useRoomsMessages } from "@/queries/chat/use-room-messages";
import { useRealtimeChat } from "@/hooks/use-realtime-chat";

export function useRoomChat(roomName: string, username: string) {
  // 🗂 Load existing messages from DB (React Query handles caching and real-time updates)
  const { messages = [], isLoading } = useRoomsMessages(roomName);

  // ⚡ Setup realtime connection for sending messages
  const { sendMessage, isConnected } = useRealtimeChat({
    roomName,
    username,
  });

  return {
    messages,
    sendMessage,
    isLoading,
    isConnected,
  };
}
