import { getServerSession } from "@/server/user/users";
import ExchangeFAQ from "./_cmps/exchange-faq";
import { HeroSection } from "./_cmps/hero-section";
import NewsSection from "./_cmps/news/news-list";
import TrustAndSocialProf from "./_cmps/trust-and-social-prof";
import LoggedInCta from "@/components/_logged-in-ctas";

export default function Home() {
  return (
    <>
      <SessionAwareLanding />
    </>
  );
}

async function SessionAwareLanding() {
  const sessionResult = await getServerSession();
  const session = (sessionResult as any)?.session;
  const isLoggedIn = Boolean(session);
  const userVerified = Boolean(
    session?.user?.verified === "verified" ||
      session?.user?.verified === true ||
      session?.user?.kyc_status === "verified" ||
      session?.user?.kyc_status === "approved"
  );
  return (
    <>
      {isLoggedIn && <LoggedInCta userVerified={userVerified} />}
      <HeroSection />
      <NewsSection />
      <TrustAndSocialProf />
      <ExchangeFAQ />
    </>
  );
}
