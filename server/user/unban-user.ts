import { admin } from "@/utils/auth-client";

export async function unbanUser(userId: string) {
  try {
    const { data, error } = await admin.unbanUser({
      userId,
    });

    if (error) {
      console.error("Failed to unban user:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error while unbanning user:", err);
    return { success: false, error: err };
  }
}
