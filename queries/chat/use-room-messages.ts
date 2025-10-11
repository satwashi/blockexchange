import { ChatMessage } from "@/server/chat/store-message";
import { getMessagesForUser } from "@/server/chat/use-get-user-chat";
import { useQuery } from "@tanstack/react-query";

export const useRoomsMessages = (roomName: string) => {
  const { data, isLoading, error } = useQuery<ChatMessage[], Error>({
    queryKey: ["roomMessages", roomName],
    queryFn: async () => {
      const response = await getMessagesForUser(roomName);

      // Transform database records to ChatMessage format
      const transformedMessages: ChatMessage[] = response.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        user: { name: msg.sender?.name ?? "Unknown" },
        createdAt: msg.created_at,
      }));

      return transformedMessages;
    },
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 60 * 1000, // 1 minute
  });

  return {
    messages: data ?? [],
    isLoading,
    error,
  };
};
