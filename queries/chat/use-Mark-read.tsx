import { markChatAsRead } from "@/server/chat/mark-chat-as-read";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useMarkChatAsRead() {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (roomId: string) => markChatAsRead(roomId),
    onSuccess: (_, roomId) => {
      // Refresh chat summary query
      queryClient.invalidateQueries({ queryKey: ["chats"] });

      // Optimistically update cache
      queryClient.setQueryData(["chats"], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((chat: any) =>
          chat.id === roomId ? { ...chat, unread_count: 0 } : chat
        );
      });
    },
  });

  // Expose mutateAsync for calling in components, plus status
  return {
    markChatAsRead: mutateAsync,
    isPending,
  };
}

export default useMarkChatAsRead;
