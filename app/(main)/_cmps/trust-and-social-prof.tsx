"use client";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, TrendingUp, Users, Zap } from "lucide-react";

export default function TrustAndSocialProf() {
  return (
    <>
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Testimonials from our users
            </h2>
            <p className="text-muted-foreground mt-2">
              Real user stories and feedback.
            </p>
          </div>

          {/* Statistics */}
          {/* <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
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
          </div> */}

          {/* Testimonials - Simple horizontal scroll */}
          {(() => {
            const testimonials = [
              {
                initials: "JS",
                name: "John Smith",
                role: "Professional Trader",
                quote:
                  "The best crypto exchange I've used. Fast trades, low fees, and excellent customer support. I've been trading here for over two years without any issues.",
                avatar: "/testimonials/1.jpg",
              },
              {
                initials: "MJ",
                name: "Maria Johnson",
                role: "Crypto Enthusiast",
                quote:
                  "As a beginner, I appreciated the intuitive interface and educational resources. The platform made it easy to start my crypto journey with confidence.",
                avatar: "/testimonials/2.jpg",
              },
              {
                initials: "AK",
                name: "Aman Kumar",
                role: "Swing Trader",
                quote:
                  "Great liquidity and blazing-fast execution. The UI feels modern and I can place orders quickly even on mobile.",
                avatar: "/testimonials/3.jpg",
              },
              {
                initials: "LT",
                name: "Laura Tan",
                role: "Product Designer",
                quote:
                  "Beautiful design and thoughtful UX. Security prompts and alerts are clear without getting in the way.",
                avatar: "/testimonials/4.jpg",
              },
            ];

            // duplicate for seamless marquee
            const looped = [...testimonials, ...testimonials];
            return (
              <div className="relative overflow-hidden py-2">
                <div className="marquee flex gap-6 w-max">
                  {looped.map((t, i) => (
                    <Card
                      key={i}
                      className="min-w-[280px] max-w-[320px] md:min-w-[340px] md:max-w-[360px]"
                    >
                      <CardContent className="pt-6">
                        <p className="mb-4 italic">&quot;{t.quote}&quot;</p>
                        <div className="flex items-center gap-3">
                          {t.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={t.avatar}
                              alt={t.name}
                              className="h-10 w-10 rounded-full object-cover"
                              onError={(e) => {
                                const el = e.currentTarget as HTMLImageElement;
                                el.style.display = "none";
                                const sibling =
                                  el.nextElementSibling as HTMLElement | null;
                                if (sibling) sibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className="h-10 w-10 rounded-full bg-primary/10 items-center justify-center"
                            style={{ display: t.avatar ? "none" : "flex" }}
                          >
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
                <style jsx>{`
                  @keyframes marquee {
                    0% {
                      transform: translateX(0);
                    }
                    100% {
                      transform: translateX(-50%);
                    }
                  }
                  .marquee {
                    animation: marquee 28s linear infinite;
                  }
                  @media (hover: hover) {
                    .marquee:hover {
                      animation-play-state: paused;
                    }
                  }
                  @media (prefers-reduced-motion: reduce) {
                    .marquee {
                      animation: none;
                    }
                  }
                `}</style>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Footer is rendered globally via SiteFooter */}
    </>
  );
}
