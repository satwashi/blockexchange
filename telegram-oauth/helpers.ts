import { APIError } from "better-auth/api";
import crypto from "crypto";
import { CreateUserPayload, TelegramBody } from "../types/user";

// ✅ Hash verification
export function verifyHash(body: TelegramBody, botToken: string): boolean {
  const { hash } = body;

  if (!hash) {
    throw new APIError("UNAUTHORIZED", {
      message: "Hash not found",
    });
  }
  // --- 1. Verify Telegram Hash ---
  const dataCheckArr: string[] = [];

  Object.keys(body)
    .filter((key) => key !== "hash")
    .sort()
    .forEach((key) => {
      const typedKey = key as keyof TelegramBody;
      dataCheckArr.push(`${key}=${body[typedKey]}`);
    });

  const dataCheckString = dataCheckArr.join("\n");

  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  // console.log(calculatedHash,"......" ,hash,"...", calculatedHash === hash)
  return calculatedHash === hash;
}

export function isAuthDateValid(
  authDateStr: string,
  maxAgeSeconds = 86400
): boolean {
  const authDate = parseInt(authDateStr, 10);
  if (isNaN(authDate)) return false;

  const now = Math.floor(Date.now() / 1000);
  return now - authDate <= maxAgeSeconds;
}

export function fakeTelegramEmail(id: string): string {
  return `https://web.telegram.org/a/#${id}`;
}

export function getProfileUrl(username: string): string {
  return `https://t.me/${username}`;
}
