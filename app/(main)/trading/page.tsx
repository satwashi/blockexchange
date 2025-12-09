"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Default trading symbol
const DEFAULT_SYMBOL = "BTCUSD";

export default function TradingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to default symbol
    router.replace(`/trading/${DEFAULT_SYMBOL}`);
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-muted-foreground">
        Loading trading...
      </div>
    </div>
  );
}
