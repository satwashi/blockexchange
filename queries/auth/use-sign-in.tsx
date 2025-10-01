"use client";

import { useMutation } from "@tanstack/react-query";
import { signInServer } from "@/server/user/users";

type SignInPayload = { email: string; password: string };
type ServerResult = { success?: boolean; message?: string };

export function useSignIn() {
  return useMutation<ServerResult, Error, SignInPayload>({
    mutationKey: ["auth", "sign-in"],
    mutationFn: async ({ email, password }) => {
      return await signInServer(email, password);
    },
  });
}

export default useSignIn;
