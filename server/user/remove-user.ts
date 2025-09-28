import { admin } from "@/utils/auth-client";

export async function removeUser(userId: string) {
  try {
    const { data, error } = await admin.removeUser({ userId });

    if (error) {
      console.error("Failed to remove user:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error while removing user:", err);
    return { success: false, error: err };
  }
}
