"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    onTelegramAuth: (user: TelegramUser) => void;
  }
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginProps {
  onAuth: (user: TelegramUser) => void;
}

export default function TelegramLoginBtn({ onAuth }: TelegramLoginProps) {
  useEffect(() => {
    // Bind your passed function
    window.onTelegramAuth = onAuth;

    // Load Telegram widget
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute(
      "data-telegram-login",
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || ""
    );
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");

    const container = document.getElementById("telegram-login-container");
    if (container) container.appendChild(script);
  }, [onAuth]);

  return <div id="telegram-login-container" className="flex justify-center" />;
}
