"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function deleteSupabaseFile(
  fileUrl: string,
  bucket: string = "kyc_documents"
) {
  try {
    // Extract the storage path from the public URL
    const urlObj = new URL(fileUrl);
    const pathParts = urlObj.pathname.split("/").slice(4); // Skip /storage/v1/object/public/<bucket>/
    const filePath = pathParts.join("/");

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([filePath]);
    if (error) throw error;

    return { success: true };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Error deleting file:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
