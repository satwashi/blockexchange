"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { getServerSession } from "../user/users";

/**
 * Uploads a chat image directly to Supabase Storage bypassing RLS,
 * but only if the user is authenticated via getServerSession().
 */
export async function uploadChatImage(formData: FormData) {
  // 1. Authenticate the user
  const sessionResult = await getServerSession();
  if (!sessionResult?.id) throw new Error("Unauthorized: Please log in first.");

  // 2. Extract Data
  const file = formData.get("image") as File;
  const roomName = formData.get("roomName") as string;
  if (!file || !roomName) {
    throw new Error("Missing file or roomName in request");
  }

  // 3. Generate Path
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${roomName}/${fileName}`;

  // 4. Upload with Admin Key (Bypasses Storage RLS Policies)
  const { error } = await supabaseAdmin.storage
    .from("chat-images")
    .upload(filePath, file);

  if (error) {
    throw new Error(`Upload Failed: ${error.message}`);
  }

  // 5. Get Public URL
  const { data: publicUrlData } = supabaseAdmin.storage
    .from("chat-images")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
