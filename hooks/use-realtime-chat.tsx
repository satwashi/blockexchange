// "use client";

// import { createClient } from "@/lib/client";
// import { useCallback, useEffect, useState } from "react";

// export interface ChatMessage {
//   id: string;
//   content: string;
//   user: {
//     name: string; // userId or username
//   };
//   createdAt: string;
// }

// interface UseRealtimeChatProps {
//   roomName: string; // customer userId (acts as room)
//   username: string; // current user (admin or customer)
//   initialMessages?: ChatMessage[]; // optional initial messages
// }

// const EVENT_MESSAGE_TYPE = "message";

// // Function to store a single message in Supabase
// async function storeMessage(
//   message: ChatMessage,
//   roomId: string,
//   senderId: string
// ) {
//   const supabase = createClient();
//   const { error } = await supabase.from("messages").insert({
//     id: message.id,
//     room_id: roomId,
//     sender_id: senderId,
//     content: message.content,
//     created_at: message.createdAt,
//   });
//   if (error) {
//     console.error("Error storing message:", error);
//     throw error;
//   }
// }

// export function useRealtimeChat({
//   roomName,
//   username,
//   initialMessages = [],
// }: UseRealtimeChatProps) {
//   const supabase = createClient();
//   const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
//   const [channel, setChannel] = useState<ReturnType<
//     typeof supabase.channel
//   > | null>(null);
//   const [isConnected, setIsConnected] = useState(false);

//   // Subscribe to Supabase Realtime channel
//   useEffect(() => {
//     const newChannel = supabase.channel(roomName);

//     newChannel
//       .on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload) => {
//         setMessages((current) => [...current, payload.payload as ChatMessage]);
//       })
//       .subscribe(async (status) => {
//         if (status === "SUBSCRIBED") setIsConnected(true);
//       });

//     setChannel(newChannel);

//     return () => {
//       supabase.removeChannel(newChannel);
//     };
//   }, [roomName, supabase]);

//   // Function to send a new message
//   const sendMessage = useCallback(
//     async (content: string) => {
//       if (!channel || !isConnected) return;

//       const message: ChatMessage = {
//         id: crypto.randomUUID(),
//         content,
//         user: { name: username },
//         createdAt: new Date().toISOString(),
//       };

//       // 1️⃣ Store in Supabase
//       await storeMessage(message, roomName, username);

//       // 2️⃣ Update local state immediately
//       setMessages((current) => [...current, message]);

//       // 3️⃣ Broadcast for realtime updates
//       await channel.send({
//         type: "broadcast",
//         event: EVENT_MESSAGE_TYPE,
//         payload: message,
//       });
//     },
//     [channel, isConnected, username, roomName]
//   );

//   return { messages, sendMessage, isConnected };
// }

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import supabase from "@/lib/client";

import { ChatMessage, storeMessage } from "@/server/chat/store-message";
import { useSession } from "@/queries/useSession";
import { getMessagesForUser } from "@/server/chat/use-get-user-chat";

const EVENT_MESSAGE_TYPE = "message";

export function useRealtimeChat(roomNameOverride?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [channel, setChannel] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { id: sessionRoomName, name: username } = useSession();
  const roomName = roomNameOverride ?? sessionRoomName;
  const isSubscribedRef = useRef(false);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const isSendingRef = useRef(false);

  // 1️⃣ Load initial messages from server action
  useEffect(() => {
    getMessagesForUser(roomName)
      .then((data) => {
        // Transform database records to ChatMessage format
        const transformedMessages: ChatMessage[] = data.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          user: { name: msg.sender.name },
          createdAt: msg.created_at,
        }));
        setMessages(transformedMessages);
        // Seed seen ids to avoid duplicate appends from realtime
        const nextSeen = new Set<string>(seenIdsRef.current);
        for (const m of transformedMessages) nextSeen.add(String(m.id));
        seenIdsRef.current = nextSeen;
      })
      .catch(console.error);
  }, [roomName]);

  // 2️⃣ Subscribe to realtime channel
  useEffect(() => {
    if (isSubscribedRef.current) return;
    const newChannel = supabase.channel(roomName);

    newChannel
      .on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload) => {
        const incoming = payload.payload as ChatMessage;
        const incomingId = String(incoming.id);
        // Ignore if we've already seen this id, or if it's our own optimistic message
        if (seenIdsRef.current.has(incomingId)) return;
        seenIdsRef.current.add(incomingId);
        setMessages((current) => [...current, incoming]);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          isSubscribedRef.current = true;
        }
      });

    setChannel(newChannel);

    return () => {
      isSubscribedRef.current = false;
      supabase.removeChannel(newChannel);
    };
  }, [roomName]);

  // 3️⃣ Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected) return;
      if (isSendingRef.current) return;
      isSendingRef.current = true;

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        user: { name: username },
        createdAt: new Date().toISOString(),
      };

      // Call server action to store message
      try {
        await storeMessage(message, roomName);
      } finally {
        isSendingRef.current = false;
      }

      // Update local state
      seenIdsRef.current.add(String(message.id));
      setMessages((current) => [...current, message]);

      // Broadcast
      await channel.send({
        type: "broadcast",
        event: EVENT_MESSAGE_TYPE,
        payload: message,
      });
    },
    [channel, isConnected, username, roomName]
  );

  return { messages, sendMessage, isConnected, roomName, username };
}
