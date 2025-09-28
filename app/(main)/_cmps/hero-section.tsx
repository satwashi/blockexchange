import TrustIndicators from "./trust-indicators";
import FeatureHighlights from "./feature-highlights";
import HeroLogin from "./hero-login";
import TrustStatus from "./trust-status";
import CoinShowCase from "./coin-showcase/coin-show-case";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-crypto-dark via-crypto-card to-crypto-dark" />

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 ">
          <div className="space-y-8">
            <TrustStatus />
            <HeroLogin />
            <TrustIndicators />
          </div>

          <CoinShowCase />
          {/* <FeatureHighlights /> */}
        </div>
      </div>
    </section>
  );
}
