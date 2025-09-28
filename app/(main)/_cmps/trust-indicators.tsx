import { Card, CardContent } from "@/components/ui/card";
import { Shield, TrendingUp, Users } from "lucide-react";
import React from "react";

function TrustIndicators() {
  return (
    <div className="grid grid-cols-3 gap-4 pt-8">
      <Card className="text-center space-y-2">
        <CardContent>
          <Users className="h-8 w-8 text-primary mx-auto" />
          <div className="text-lg font-semibold">200M+</div>
          <div className="text-sm text-muted-foreground">Users</div>
        </CardContent>
      </Card>
      <Card className="text-center space-y-2">
        <CardContent>
          <Shield className="h-8 w-8 text-primary mx-auto" />
          <div className="text-lg font-semibold">Secure</div>
          <div className="text-sm text-muted-foreground">Platform</div>
        </CardContent>
      </Card>

      <Card className="text-center space-y-2">
        <CardContent>
          <TrendingUp className="h-8 w-8 text-primary mx-auto" />
          <div className="text-lg font-semibold">24/7</div>
          <div className="text-sm text-muted-foreground">Trading</div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TrustIndicators;
