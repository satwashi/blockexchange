"use server";

import supabaseAdmin from "@/lib/supabaseAdmin";
import { getServerSession } from "@/server/user/users";

export async function getMessagesForUser(userId: string) {
  const { role } = await getServerSession();
  if (!role) throw new Error("Unauthorized");
  if (!userId) throw new Error("Missing userId");
  const { data, error } = await supabaseAdmin
    .from("messages")
    .select(
      `
    id,
    content,
    created_at,
    room_id,
    sender:users!messages_sender_id_fkey (
      id,
      name
    )
  `
    )
    .order("created_at", { ascending: true })
    .eq("room_id", userId);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to load messages");
  }

  console.log("data,.................", data);

  return data;
}
