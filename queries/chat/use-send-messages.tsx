// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { ChatMessage, storeMessage } from "@/server/chat/store-message";
// import supabase from "@/lib/client";
// import { queryClient } from "@/providers/query-provider";

// const EVENT_MESSAGE_TYPE = "message";

// interface SendMessageArgs {
//   message: ChatMessage;
//   roomName: string;
// }

// /**
//  * useSendMessage - mutation hook for sending messages
//  */
// export function useSendMessage() {
//   const { mutateAsync, isPending } = useMutation({
//     mutationFn: async ({ roomName, message }: SendMessageArgs) => {
//       // 1️⃣ Store message in Supabase DB
//       await storeMessage(message, roomName);

//       return message;
//     },

//     // 3️⃣ Optimistically update UI
//     onMutate: async (newMessage) => {
//       await queryClient.cancelQueries({
//         queryKey: ["roomMessages", newMessage.roomName],
//       });

//       const previousMessages = queryClient.getQueryData<ChatMessage[]>([
//         "roomMessages",
//         newMessage.roomName,
//       ]);

//       queryClient.setQueryData<ChatMessage[]>(
//         ["roomMessages", newMessage.roomName],
//         (old) => [
//           ...(old ?? []),
//           {
//             id: crypto.randomUUID(),
//             content: newMessage.content,
//             user: { name: newMessage.username },
//             createdAt: new Date().toISOString(),
//           },
//         ]
//       );

//       return { previousMessages };
//     },

//     // 4️⃣ Rollback if it fails
//     onError: (error, newMessage, context) => {
//       if (context?.previousMessages) {
//         queryClient.setQueryData(
//           ["roomMessages", newMessage.roomName],
//           context.previousMessages
//         );
//       }
//       console.error("Failed to send message:", error);
//     },

//     // 5️⃣ Re-sync messages after success
//     onSuccess: (data, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: ["roomMessages", variables.roomName],
//       });
//     },
//   });

//   return { sendMessage: mutateAsync, isPending };
// }
