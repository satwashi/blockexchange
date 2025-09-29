"use client";

import { useState } from "react";
import type { CreateUserPayload } from "@/types/user";
import { signInwithTelegram } from "@/server/user/signin-with-telegram";
import TelegramCustomLogin from "@/components/telegram-custom-login";
import TelegramLoginBtn from "../TelegramLoginBtn";

interface TelegramLoginProps {
  /**
   * Optional Tailwind (or other) classes for styling the outer button.
   * Defaults to the same layout as the GoogleLogin button.
   */
  className?: string;
}

export default function TelegramLogin({
  className = "w-full flex items-center justify-center gap-2",
}: TelegramLoginProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAuthCallback = async (data: CreateUserPayload) => {
    try {
      setIsProcessing(true);
      await signInwithTelegram(data);
    } catch (error) {
      setIsProcessing(false);
      console.error("Telegram login error:", error);
    } finally {
      // If you want the spinner to disappear after backend completes:
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 text-center px-4 sm:px-6">
      <div className="flex items-center justify-center h-14 btn-elegant group relative overflow-hidden">
        {!isProcessing ? (
          <TelegramLoginBtn
            onAuth={handleAuthCallback}
            // className={className}
          />
        ) : (
          <AuthProcessing />
        )}
      </div>
    </div>
  );
}

export function AuthProcessing() {
  return (
    <div className="flex items-center justify-center h-14 btn-elegant group relative overflow-hidden">
      {/* Dual-ring spinner */}
      <div className="w-6 h-6 border-4 border-t-blue-500 border-b-blue-300 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
      <span className="ml-2 text-sm font-medium">Authenticating...</span>
    </div>
  );
}
