"use server";

import supabaseAdmin from "@/lib/supabaseAdmin";
import { getServerSession } from "../user/users";

/**
 * Marks all messages in a given chat room as read,
 * ignoring messages sent by the admin.
 *
 * @param roomId - ID of the chat room
 */
export async function markChatAsRead(roomId: string) {
  const { id: adminId, isAdmin } = await getServerSession();
  if (!isAdmin) throw new Error("Unauthorized");

  const { data, error } = await supabaseAdmin
    .from("messages")
    .update({ read: true })
    .eq("room_id", roomId)
    .neq("sender_id", adminId); // don't mark admin messages

  if (error) throw new Error(error.message);

  return data;
}
