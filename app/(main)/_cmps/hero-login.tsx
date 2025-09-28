import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HeroLogin() {
  return (
    <div className="space-y-4 max-w-md">
      <div className="flex space-x-2">
        <Input
          placeholder="Email"
          className="flex-1 bg-crypto-surface border-crypto-border text-foreground placeholder:text-muted-foreground"
        />
        <Button>Sign Up</Button>
      </div>
      <p className="text-xs text-muted-foreground">
        By creating an account, I agree to BlockX&apos;s Terms of Service and
        Privacy Policy
      </p>
    </div>
  );
}
