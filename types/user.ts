import { TelegramBodySchema } from "@/telegram-oauth";
import z from "zod";
import { KycStatus } from "@/types/kyc/kyc";

export type CreateUserPayload = {
  id: string | number;
  first_name: string;
  last_name?: string;
  username?: string;
  email?: string;
  photo_url?: string;
  auth_date: string | number;
  hash: string;
};

export type TelegramBody = z.infer<typeof TelegramBodySchema>;
export type Role = "admin" | "superadmin" | "user";

export type UserType = {
  id: string;
  name: string;
  email?: string;
  email_verified?: boolean;
  image?: string | null;
  created_at?: Date;
  updated_at?: Date;
  role?: string | null | undefined;
  banned?: boolean | null | undefined;
  ban_reason?: string;
  ban_expires?: Date;
  telegram_id?: string | null;
  username?: string | null;
  kyc_status?: KycStatus | null;
};
