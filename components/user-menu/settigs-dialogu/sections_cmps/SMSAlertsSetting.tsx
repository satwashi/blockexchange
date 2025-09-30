import { Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function SMSAlertsSetting() {
  const [smsAlerts, setSmsAlerts] = useState(false);

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
