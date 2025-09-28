"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "../shared/header/logo";
import Link from "next/link";
import { signIn } from "@/utils/auth-client";
import { TelegramLogin } from "./telegram-login";
// import { signInServer } from "@/server/user/users";
import GoogleLoging from "./google-loging";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Your own email/password sign-in logic
    // await signInServer();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative z-0">
        <CardHeader className="text-center">
          <CardTitle className="text-xl flex justify-center">
            <Logo />
          </CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>

              {/* divider */}
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <TelegramLogin />

                <GoogleLoging />
              </div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* Optional footer terms or privacy notice */}
    </div>
  );
}
