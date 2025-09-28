"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { getServerSession } from "../user/users";

export async function uploadDepositPhoto(file: File) {
  const { id: user_id } = await getServerSession();
  try {
    // Create unique filename to avoid overwrites
    const fileExt = file.name.split(".").pop();
    const fileName = `${user_id}_${Date.now()}.${fileExt}`;
    const filePath = `${user_id}/${fileName}`;

    // Upload to bucket
    const { data, error } = await supabaseAdmin.storage
      .from("deposite_photos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("deposite_photos")
      .getPublicUrl(filePath);

    return {
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
    };
  } catch (err: any) {
    console.error("Upload failed:", err.message);
    throw err;
  }
}
