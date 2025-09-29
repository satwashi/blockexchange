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

/**
 * Loads the Telegram auth widget in a hidden container
 * and exposes a trigger function to start the login flow.
 */
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

    const container = containerRef.current; // ✅ capture current value
    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (container) container.innerHTML = ""; // ✅ use captured variable
    };
  }, [botUsername, onAuth, requestAccess]);

  /**
   * Call this to simulate a click on the hidden Telegram button
   * so the Telegram OAuth flow begins.
   */
  const triggerAuth = () => {
    const btn = containerRef.current?.querySelector("button");
    btn?.click();
  };

  return { containerRef, triggerAuth };
}
