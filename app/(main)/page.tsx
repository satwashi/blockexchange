import ExchangeFAQ from "./_cmps/exchange-faq";
import { HeroSection } from "./_cmps/hero-section";
import NewsSection from "./_cmps/news/news-list";

export default function Home() {
  return (
    <>
      <HeroSection />
      <NewsSection />
      <ExchangeFAQ />
      {/* <>Testing</> */}
    </>
  );
}
