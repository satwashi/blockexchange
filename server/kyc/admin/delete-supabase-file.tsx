"use server";
import supabase from "@/lib/client";

/**
 * Deletes a file from Supabase Storage given its public URL.
 * Can be used for KYC docs, deposit screenshots, or any other files.
 *
 * @param fileUrl - Public URL of the file to delete
 * @param bucket - The bucket name, default is 'kyc_documents'
 * @returns { success: boolean, error?: string }
 */
export async function deleteSupabaseFile(
  fileUrl: string,
  bucket: string = "kyc_documents"
) {
  try {
    // Extract the storage path from the public URL
    const urlObj = new URL(fileUrl);
    const pathParts = urlObj.pathname.split("/").slice(4); // Skip /storage/v1/object/public/<bucket>/
    const filePath = pathParts.join("/");

    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) throw error;

    return { success: true };
  } catch (err: any) {
    console.error("Error deleting file:", err.message);
    return { success: false, error: err.message };
  }
}
