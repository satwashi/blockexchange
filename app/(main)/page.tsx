import ExchangeFAQ from "./_cmps/exchange-faq";
import { HeroSection } from "./_cmps/hero-section";
import NewsSection from "./_cmps/news/news-list";
import { getServerSession } from "@/server/user/users";
import TrustAndSocialProf from "./_cmps/trust-and-social-prof";

export default function Home() {
  return (
    <>
      {/* Server component wrapper to fetch session and pass flags to children */}
      {/* Keep header untouched as defined in app/(main)/layout.tsx */}
      <SessionAwareLanding />
    </>
  );
}

async function SessionAwareLanding() {
  return (
    <>
      <HeroSection />
      <NewsSection />
      <TrustAndSocialProf />
      <ExchangeFAQ />
    </>
  );
}
