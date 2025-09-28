import { admin } from "@/utils/auth-client";

export async function banUser(
  userId: string,
  banReason?: string,
  banExpiresIn?: number // in seconds
) {
  try {
    const { data, error } = await admin.banUser({
      userId,
      banReason,
      banExpiresIn,
    });

    if (error) {
      console.error("Failed to ban user:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error while banning user:", err);
    return { success: false, error: err };
  }
}
