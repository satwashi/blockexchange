"use client";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, TrendingUp, Users, Zap } from "lucide-react";

export default function TrustAndSocialProf() {
  return (
    <>
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Trusted by Millions
        </h2>

        {/* Security Badge */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-2 rounded-lg border bg-card p-4">
            <ShieldCheck className="h-6 w-6 text-green-600" />
            <span className="font-semibold">Audited by XYZ Security</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold">2M+</h3>
              <p className="text-muted-foreground">Trades Executed</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold">50+</h3>
              <p className="text-muted-foreground">Countries Served</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Zap className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold">99.9%</h3>
              <p className="text-muted-foreground">Platform Uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials */}
        {(() => {
          const testimonials = [
            {
              initials: "JS",
              name: "John Smith",
              role: "Professional Trader",
              quote:
                "The best crypto exchange I've used. Fast trades, low fees, and excellent customer support. I've been trading here for over two years without any issues.",
            },
            {
              initials: "MJ",
              name: "Maria Johnson",
              role: "Crypto Enthusiast",
              quote:
                "As a beginner, I appreciated the intuitive interface and educational resources. The platform made it easy to start my crypto journey with confidence.",
            },
            {
              initials: "AK",
              name: "Aman Kumar",
              role: "Swing Trader",
              quote:
                "Great liquidity and blazing-fast execution. The UI feels modern and I can place orders quickly even on mobile.",
            },
            {
              initials: "LT",
              name: "Laura Tan",
              role: "Product Designer",
              quote:
                "Beautiful design and thoughtful UX. Security prompts and alerts are clear without getting in the way.",
            },
          ];

          return (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {testimonials.map((t, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <p className="mb-4 italic">&quot;{t.quote}&quot;</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {t.initials}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{t.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          );
        })()}
      </section>

      {/* Footer is rendered globally via SiteFooter */}
    </>
  );
}
