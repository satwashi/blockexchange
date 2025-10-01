"use client";

import { Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";

export default function SMSAlertsSetting() {
  const [smsAlerts, setSmsAlerts] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    const stored = localStorage.getItem("smsAlerts");
    if (stored !== null) {
      setSmsAlerts(stored === "true");
    }
  }, []);

  // Save preference whenever it changes
  useEffect(() => {
    localStorage.setItem("smsAlerts", String(smsAlerts));
  }, [smsAlerts]);

  return (
    <div className="flex items-center justify-between px-6 py-2 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <Smartphone className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm font-medium">SMS Alerts</span>
      </div>
      <Switch
        checked={smsAlerts}
        onCheckedChange={setSmsAlerts}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
