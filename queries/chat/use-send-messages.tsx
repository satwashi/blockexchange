import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatMessage, storeMessage } from "@/server/chat/store-message";
import supabase from "@/lib/client";
import { queryClient } from "@/providers/query-provider";

const EVENT_MESSAGE_TYPE = "message";

interface SendMessageArgs {
  content: string;
  roomName: string;
  username: string;
  channel?: ReturnType<typeof supabase.channel>;
}

/**
 * useSendMessage - mutation hook for sending messages
 */
export function useSendMessage() {
  return useMutation({
    mutationFn: async ({
      content,
      roomName,
      username,
      channel,
    }: SendMessageArgs) => {
      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        user: { name: username },
        createdAt: new Date().toISOString(),
      };

      // 1️⃣ Store message in Supabase DB
      await storeMessage(message, roomName);

      // 2️⃣ Broadcast to others if a channel is provided
      if (channel) {
        await channel.send({
          type: "broadcast",
          event: EVENT_MESSAGE_TYPE,
          payload: message,
        });
      }

      return message;
    },

    // 3️⃣ Optimistically update UI
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({
        queryKey: ["roomMessages", newMessage.roomName],
      });

      const previousMessages = queryClient.getQueryData<ChatMessage[]>([
        "roomMessages",
        newMessage.roomName,
      ]);

      queryClient.setQueryData<ChatMessage[]>(
        ["roomMessages", newMessage.roomName],
        (old) => [
          ...(old ?? []),
          {
            id: crypto.randomUUID(),
            content: newMessage.content,
            user: { name: newMessage.username },
            createdAt: new Date().toISOString(),
          },
        ]
      );

      return { previousMessages };
    },

    // 4️⃣ Rollback if it fails
    onError: (error, newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["roomMessages", newMessage.roomName],
          context.previousMessages
        );
      }
      console.error("Failed to send message:", error);
    },

    // 5️⃣ Re-sync messages after success
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["roomMessages", variables.roomName],
      });
    },
  });
}
