"use client";
import GoogleLoging from "@/components/forms/google-loging";
import TelegramLogin from "@/components/forms/telegram-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HeroLogin() {
  return (
    <div className="space-y-4 max-w-md">
      <div className="flex space-x-2">
        <TelegramLogin />
        <GoogleLoging />
      </div>
    </div>
  );
}
