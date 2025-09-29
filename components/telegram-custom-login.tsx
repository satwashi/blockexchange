"use client";

import { useTelegramHiddenWidget } from "@/hooks/useTelegramHiddenWidget";
import type { TelegramUser } from "@/types/telegram";
import { Button } from "./ui/button";

interface TelegramCustomLoginProps {
  /** Your Telegram bot username, e.g. "my_bot" */
  botUsername: string;
  /** Callback when Telegram sends back the user info */
  onAuth: (user: TelegramUser) => void;
  /** Optional classes to override styling */
  className?: string;
}

export default function TelegramCustomLogin({
  botUsername,
  onAuth,
  className = "w-full flex items-center justify-center gap-2", // ✅ SAME DEFAULT as GoogleLogin
}: TelegramCustomLoginProps) {
  const { containerRef, triggerAuth } = useTelegramHiddenWidget({
    botUsername,
    onAuth,
  });

  return (
    <>
      <Button
        onClick={triggerAuth}
        variant="outline"
        className={className} // ✅ identical prop signature and default
        type="button"
      >
        {/* Full-color Telegram icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="h-5 w-5"
        >
          <circle cx="24" cy="24" r="24" fill="#37AEE2" />
          <path
            fill="#C8DAEA"
            d="M19.5 34.5c-.6 0-.5-.2-.7-.7l-3-9.6 19-7-15 16.3z"
          />
          <path
            fill="#A9C9DD"
            d="M19.5 34.5c.4 0 .6-.2.8-.4l4.3-4.2-5-3 0 7.6z"
          />
          <path
            fill="#F6FBFE"
            d="M20.5 27.5l11.5 8.5c1.3.7 2.3.3 2.6-1.2l4.7-22
               c.5-2.1-.8-3-2.1-2.4l-28 10.8c-1.9.7-1.9 1.8-.3 2.3l7 2.2
               16.2-10-11.6 12.8z"
          />
        </svg>

        <span className="font-medium">Login with Telegram</span>
      </Button>

      {/* Hidden Telegram widget that performs the secure authentication */}
      <div ref={containerRef} style={{ display: "none" }} />
    </>
  );
}
