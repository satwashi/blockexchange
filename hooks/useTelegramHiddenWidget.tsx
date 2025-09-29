"use client";

import { useEffect, useRef } from "react";
import type { TelegramUser } from "@/types/telegram";

declare global {
  interface Window {
    onTelegramAuth: (user: TelegramUser) => void;
  }
}

interface UseTelegramHiddenWidgetProps {
  botUsername: string;
  onAuth: (user: TelegramUser) => void;
  requestAccess?: "read" | "write";
}

export function useTelegramHiddenWidget({
  botUsername,
  onAuth,
  requestAccess = "write",
}: UseTelegramHiddenWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.onTelegramAuth = onAuth;

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", requestAccess);

    const container = containerRef.current;
    if (container) container.appendChild(script);

    return () => {
      if (container) container.innerHTML = "";
    };
  }, [botUsername, onAuth, requestAccess]);

  /** 🔑 Updated trigger */
  const triggerAuth = () => {
    const iframe = containerRef.current?.querySelector(
      "iframe"
    ) as HTMLIFrameElement | null;

    console.log("iframe", iframe);
    if (!iframe) {
      console.warn("Telegram iframe not found yet");
      return;
    }
    iframe.contentWindow?.postMessage("login", "*");
  };

  return { containerRef, triggerAuth };
}
