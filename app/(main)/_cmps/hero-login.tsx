"use client";
import GoogleLoging from "@/components/forms/google-loging";
import TelegramLogin from "@/components/forms/telegram-login";

export default function HeroLogin() {
  return (
    <div className="space-y-4 max-w-md">
      <div className="flex items-center gap-2">
        <TelegramLogin className="w-[220px] md:w-[260px] flex items-center justify-center gap-2 rounded-full" />
        <GoogleLoging className="w-[220px] md:w-[260px] flex items-center justify-center gap-2" />
      </div>
    </div>
  );
}
