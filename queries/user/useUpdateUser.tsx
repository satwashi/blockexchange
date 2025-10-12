"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUserServer } from "@/server/user/users";

// Define the user update payload type based on the auth schema
export type UserUpdatePayload = {
  name?: string;
  withdrawal_password?: string;
  password?: string;
};

// Server action wrapper for the mutation
async function updateUserAction(userData: UserUpdatePayload) {
  const result = await updateUserServer(userData);

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data;
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateUser,
    isPending: isUpdating,
    error: updateError,
    isSuccess: isUpdateSuccess,
    reset: resetUpdate,
  } = useMutation({
    mutationFn: updateUserAction,
    onSuccess: (_data, _variables) => {
      // Show success toast
      toast.success("Profile updated successfully!", {
        description: "Your changes have been saved.",
        duration: 3000,
      });

      // Invalidate and refetch user session data
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Optionally invalidate other related queries
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
      // queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
    onError: (error: Error, variables) => {
      console.error("User update failed:", error);

      // Show error toast with user-friendly message
      toast.error("Failed to update profile", {
        description: error.message || "Something went wrong. Please try again.",
        duration: 4000,
        action: {
          label: "Retry",
          onClick: () => {
            // Optionally retry the mutation
            updateUser(variables);
          },
        },
      });
    },
  });

  // Helper function for common update operations
  const updateUserField = async (
    field: keyof UserUpdatePayload,
    value: any
  ) => {
    try {
      await updateUser({ [field]: value });
    } catch (error) {
      // Error handling is done in onError callback
      throw error;
    }
  };

  // Specific helper functions for common operations
  const updateName = async (name: string) => {
    return updateUserField("name", name);
  };

  const updatePassword = async (password: string) => {
    return updateUserField("password", password);
  };

  const updateWithdrawalPassword = async (password: string) => {
    return updateUserField("withdrawal_password", password);
  };

  return {
    // Main mutation function
    updateUser,
    isUpdating,
    updateError,
    isUpdateSuccess,
    resetUpdate,

    // Helper functions for common operations
    updateUserField,
    updateName,
    updatePassword,
    updateWithdrawalPassword,
  };
};

export default useUpdateUser;
