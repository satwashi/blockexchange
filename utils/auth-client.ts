import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
// import { telegramAuthClient } from "../telegram-oauth/client";

import { inferAdditionalFields } from "better-auth/client/plugins";

import type { auth } from "@/utils/auth";
import { telegramAuthClient } from "@/telegram-oauth/client";

const { useSession, signIn, signOut, getSession, updateUser, signUp, admin } =
  createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    plugins: [
      telegramAuthClient(),
      adminClient(),
      inferAdditionalFields<typeof auth>(),
    ],
  });

export { signOut, useSession, signIn, getSession, updateUser, signUp, admin };
