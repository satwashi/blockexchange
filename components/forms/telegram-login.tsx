import { useState } from "react";
import { CreateUserPayload } from "@/types/user";
import { signInwithTelegram } from "@/server/user/signin-with-telegram";
import TelegramLoginBtn from "../TelegramLoginBtn";

export function TelegramLogin() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAuthCallback = async (data: CreateUserPayload) => {
    try {
      setIsProcessing(true);
      await signInwithTelegram(data);
    } catch (error) {
      console.error("Telegram login error:", error);
    } finally {
      // setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 text-center px-4 sm:px-6">
      <div className="flex items-center justify-center h-14 btn-elegant group relative overflow-hidden">
        {!isProcessing ? (
          <TelegramLoginBtn onAuth={handleAuthCallback} />
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

      {/* Text */}
      <span className="text-sm font-medium ">Authenticating...</span>
    </div>
  );
}

export default function TelegramLoginRedirect() {
  const handleLogin = () => {
    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
    const origin = encodeURIComponent(window.location.origin);
    const returnTo = encodeURIComponent(window.location.origin);

    window.location.href = `https://oauth.telegram.org/auth?bot_id=${botUsername}&origin=${origin}&embed=0&request_access=write&return_to=${returnTo}/api/auth/telegram/callback`;
  };

  return (
    <button className="btn btn-primary" onClick={handleLogin}>
      Login with Telegram
    </button>
  );
}
