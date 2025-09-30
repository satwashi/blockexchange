import { Mail } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function EmailAlertsSetting() {
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <div className="flex items-center justify-between px-6 py-2 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <Mail className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm font-medium">Email Alerts</span>
      </div>
      <Switch
        checked={emailAlerts}
        onCheckedChange={setEmailAlerts}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
