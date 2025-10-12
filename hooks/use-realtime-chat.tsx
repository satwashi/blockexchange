// // "use client";

// // import { useEffect, useRef, useState } from "react";
// // import { useQueryClient } from "@tanstack/react-query";
// // import supabase from "@/lib/client";
// // import { ChatMessage } from "@/server/chat/store-message";
// // import { useSession } from "@/queries/useSession";

// // const EVENT_MESSAGE_TYPE = "message";

// // export function useRealtimeChat(roomNameOverride?: string) {
// //   const queryClient = useQueryClient();
// //   const { id: sessionRoomName, name: username } = useSession();
// //   const roomName = roomNameOverride ?? sessionRoomName;

// //   const seenIdsRef = useRef<Set<string>>(new Set());
// //   const [isConnected, setIsConnected] = useState(false);

// //   useEffect(() => {
// //     if (!roomName) return;

// //     const channel = supabase.channel(roomName);

// //     channel
// //       .on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload) => {
// //         const incoming = payload.payload as ChatMessage;
// //         const incomingId = String(incoming.id);

// //         // prevent duplicates
// //         if (seenIdsRef.current.has(incomingId)) return;
// //         seenIdsRef.current.add(incomingId);

// //         // 🔥 update react-query cache
// //         queryClient.setQueryData<ChatMessage[]>(
// //           ["roomMessages", roomName],
// //           (old) => {
// //             const existing = old ?? [];
// //             if (existing.some((m) => String(m.id) === incomingId))
// //               return existing;
// //             return [...existing, incoming];
// //           }
// //         );
// //       })
// //       .subscribe((status) => {
// //         if (status === "SUBSCRIBED") setIsConnected(true);
// //         if (status === "CLOSED" || status === "CHANNEL_ERROR")
// //           setIsConnected(false);
// //       });

// //     return () => {
// //       supabase.removeChannel(channel);
// //       setIsConnected(false);
// //     };
// //   }, [roomName, queryClient]);

// //   return { username, roomName, isConnected };
// // }

// "use client";

// import supabaseClient from "@/lib/client";
// import { SupabaseClient } from "@supabase/supabase-js";
// import { useCallback, useEffect, useState } from "react";

// interface UseRealtimeChatProps {
//   roomName: string;
//   username: string;
// }

// export interface ChatMessage {
//   id: string;
//   content: string;
//   user: {
//     name: string;
//   };
//   createdAt: string;
// }

// const EVENT_MESSAGE_TYPE = "message";

// export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [channel, setChannel] = useState<ReturnType<
//     typeof supabaseClient.channel
//   > | null>(null);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     const newChannel = supabaseClient.channel(roomName);

//     newChannel
//       .on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload) => {
//         setMessages((current) => [...current, payload.payload as ChatMessage]);
//       })
//       .subscribe(async (status) => {
//         if (status === "SUBSCRIBED") {
//           setIsConnected(true);
//         }
//       });

//     setChannel(newChannel);

//     return () => {
//       supabaseClient.removeChannel(newChannel);
//     };
//   }, [roomName, username, SupabaseClient]);

//   const sendMessage = useCallback(
//     async (content: string) => {
//       if (!channel || !isConnected) return;

//       const message: ChatMessage = {
//         id: crypto.randomUUID(),
//         content,
//         user: {
//           name: username,
//         },
//         createdAt: new Date().toISOString(),
//       };

//       // Update local state immediately for the sender
//       setMessages((current) => [...current, message]);

//       await channel.send({
//         type: "broadcast",
//         event: EVENT_MESSAGE_TYPE,
//         payload: message,
//       });
//     },
//     [channel, isConnected, username]
//   );

//   return { messages, sendMessage, isConnected };
// }

"use client";

import supabaseClient from "@/lib/client";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/queries/useSession";
import { storeMessage } from "@/server/chat/store-message";
import { queryClient } from "@/providers/query-provider";

interface UseRealtimeChatProps {
  roomName: string;
  username: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  user: {
    name: string;
  };
  createdAt: string;
}

const EVENT_MESSAGE_TYPE = "message";
const EVENT_HEARTBEAT = "heartbeat";

export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [channel, setChannel] = useState<ReturnType<
    typeof supabaseClient.channel
  > | null>(null);

  // Get user ID from session
  const { id: userId } = useSession();

  // create and manage Supabase channel
  useEffect(() => {
    if (!roomName || !username) return;

    const newChannel = supabaseClient.channel(roomName);

    // listen for new messages and update React Query cache
    newChannel.on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload) => {
      const newMessage = payload.payload as ChatMessage;

      // Update React Query cache optimistically
      queryClient.setQueryData<ChatMessage[]>(
        ["roomMessages", roomName],
        (old) => {
          const existing = old ?? [];
          // Check if message already exists to prevent duplicates
          if (existing.some((m) => m.id === newMessage.id)) {
            return existing;
          }
          return [...existing, newMessage];
        }
      );
    });

    // listen for heartbeat events (online presence)
    newChannel.on("broadcast", { event: EVENT_HEARTBEAT }, (payload) => {
      const { user } = payload.payload as { user: string };

      // add user to online set
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.add(user);
        return next;
      });

      // auto-remove user after 10s if no new heartbeat
      setTimeout(() => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.delete(user);
          return next;
        });
      }, 10000);
    });

    // subscribe to room
    newChannel.subscribe((status) => {
      if (status === "SUBSCRIBED") setIsConnected(true);
      else if (status === "CLOSED" || status === "CHANNEL_ERROR")
        setIsConnected(false);
    });

    setChannel(newChannel);

    // cleanup
    return () => {
      supabaseClient.removeChannel(newChannel);
      setIsConnected(false);
      setChannel(null);
    };
  }, [roomName, username]);

  // broadcast heartbeat every 5s
  useEffect(() => {
    if (!isConnected || !channel) return;

    const interval = setInterval(() => {
      channel.send({
        type: "broadcast",
        event: EVENT_HEARTBEAT,
        payload: { user: username, timestamp: new Date().toISOString() },
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [channel, username, isConnected]);

  // send chat message with optimistic UI + broadcast first, then store
  const sendMessage = useCallback(
    async (content: string) => {
      if (!isConnected || !channel) return;

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        user: { name: username },
        createdAt: new Date().toISOString(),
      };

      // 1️⃣ Update UI immediately (optimistic update)
      queryClient.setQueryData<ChatMessage[]>(
        ["roomMessages", roomName],
        (old) => [...(old ?? []), message]
      );

      // 2️⃣ Broadcast to others (instant realtime)
      await channel.send({
        type: "broadcast",
        event: EVENT_MESSAGE_TYPE,
        payload: message,
      });

      // 3️⃣ Store in database in background (don't await)
      if (userId) {
        storeMessage(message, roomName, userId)
          .then(() => {
            // Invalidate chats query to update the chat list
            queryClient.invalidateQueries({ queryKey: ["chats"] });
          })
          .catch((error) => {
            console.error("Failed to store message in database:", error);
          });
      }
    },
    [isConnected, channel, roomName, username, userId]
  );

  return { sendMessage, isConnected, onlineUsers };
}
