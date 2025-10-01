"use client";

import { useMutation } from "@tanstack/react-query";
import { signUpServer } from "@/server/user/users";

type SignUpPayload = { email: string; password: string; username: string };
type ServerResult = { success?: boolean; message?: string };

export function useSignUp() {
  return useMutation<ServerResult, Error, SignUpPayload>({
    mutationKey: ["auth", "sign-up"],
    mutationFn: async ({ email, password, username }) => {
      return await signUpServer(email, password, username);
    },
  });
}

export default useSignUp;
