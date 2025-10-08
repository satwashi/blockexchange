"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { getServerSession } from "../user/users";

export interface ChatMessage {
  id: string;
  content: string;
  user: {
    name: string; // userId in your setup
  };
  createdAt: string;
}

/**
 * Stores a single message in the Supabase messages table.
 * @param message - The message object to store
 * @param roomId - The userId representing the chat room
 * @param senderId - The userId of the sender (admin or customer)
 */
export async function storeMessage(message: ChatMessage, roomId: string) {
  const { id: senderId } = await getServerSession();
  if (!senderId) throw new Error("Unauthorized");

  const { data, error } = await supabaseAdmin.from("messages").insert({
    room_id: roomId,
    sender_id: senderId,
    content: message.content,
    created_at: message.createdAt,
  });

  if (error) {
    console.error("Error storing message:", error);
    throw error;
  }

  return data;
}
