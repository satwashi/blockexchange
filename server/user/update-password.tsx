import { admin } from "@/utils/auth-client";

export async function updateUserPassword(userId: string, newPassword: string) {
  try {
    const { data, error } = await admin.setUserPassword({
      userId,
      newPassword,
    });

    if (error) {
      console.error("Failed to update password:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error while updating password:", err);
    return { success: false, error: err };
  }
}
