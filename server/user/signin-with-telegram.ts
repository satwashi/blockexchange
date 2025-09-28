"use server";
import { CreateUserPayload } from "@/types/user";
import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";

export const signInwithTelegram = async (body: CreateUserPayload) => {
  const transformedBody = {
    ...body,
    id: String(body.id),
    auth_date: String(body.auth_date),
  };
  console.log("transformedBody", transformedBody);
  const session = await auth.api.telegramCallback({ body: transformedBody });

  console.log("session", session);

  redirect("/");
};
