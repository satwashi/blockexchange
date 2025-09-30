import TrustIndicators from "./trust-indicators";

import CoinShowCase from "./coin-showcase/coin-show-case";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/server/user/users";

import GoogleLoging from "@/components/forms/google-loging";
import Link from "next/link";
import LoggedInCta from "./hero/_logged-in-ctas";

export async function HeroSection() {
  const sessionResult = await getServerSession();
  const session = (sessionResult as any)?.session;
  const isLoggedIn = Boolean(session);
  const userVerified = Boolean(session?.user?.verified);
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-crypto-dark via-crypto-card to-crypto-dark" />

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 ">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                Trade crypto with confidence
              </h1>
              <p className="text-muted-foreground max-w-xl">
                Low fees, lightning-fast execution, and security-first design.
                Join Blockechange and start your journey today.
              </p>
              {isLoggedIn ? (
                <LoggedInCta userVerified={userVerified} />
              ) : (
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/signup">Create free account</Link>
                  </Button>
                  <GoogleLoging
                    className="flex items-center justify-center gap-2 p-1"
                    text="Sign In"
                  />
                  <Button variant="outline" asChild>
                    <Link href="/market">Explore markets</Link>
                  </Button>
                </div>
              )}
            </div>

            <TrustIndicators />
          </div>

          <CoinShowCase />
          {/* <FeatureHighlights /> */}
        </div>
      </div>
    </section>
  );
}
