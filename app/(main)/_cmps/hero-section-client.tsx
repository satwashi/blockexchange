// "use client";

// import TrustIndicators from "./trust-indicators";
// import CoinShowCase from "./coin-showcase/coin-show-case";
// import { Button } from "@/components/ui/button";
// import GoogleLoging from "@/components/forms/google-loging";
// import Link from "next/link";
// import { useSession } from "@/queries/useSession";
// import { useUserWallets } from "@/queries/wallets/use-user-wallets";
// import { ArrowUpRight, TrendingUp, Wallet, ChevronDown } from "lucide-react";
// import { useState, useEffect, useRef } from "react";
// import DepositDialog from "../wallet/_cmp/deposite-dialogue";
// import { DialogTrigger } from "@/components/ui/dialog";

// export function HeroSectionClient() {
//   return (
//     <section className="relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-crypto-dark via-crypto-card to-crypto-dark" />
//       <div className="relative container mx-auto px-4 py-16">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           <HeroSectionContent />
//           <CoinShowCase />
//         </div>
//       </div>
//     </section>
//   );
// }

// function HeroSectionContent() {
//   const { id, isLoading } = useSession();

//   if (isLoading) {
//     return <HeroSectionSkeleton />;
//   }

//   return id ? (
//     <LoggedInHeroContent userId={id} />
//   ) : (
//     <NoSessionHeroSectionContent />
//   );
// }

// export function LoggedInHeroContent({ userId }: { userId: string }) {
//   const { wallets, totalBalance, totalChange24h, totals, isLoading } =
//     useUserWallets(userId);

//   const [selectedCurrency, setSelectedCurrency] = useState<
//     "USDT" | "BTC" | "ETH" | "BNB" | "SOL"
//   >("USDT");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const currencies = ["USDT", "BTC", "ETH", "BNB", "SOL"].map((symbol) => {
//     const total = totals?.[symbol] ?? 0;
//     const price = total > 0 ? totalBalance / total : 0;
//     return { symbol, total, price };
//   });

//   const currentCurrency =
//     currencies.find((c) => c.symbol === selectedCurrency) || currencies[0];

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsDropdownOpen(false);
//       }
//     }

//     if (isDropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//       return () =>
//         document.removeEventListener("mousedown", handleClickOutside);
//     }
//   }, [isDropdownOpen]);

//   if (isLoading) return <HeroSectionSkeleton />;

//   return (
//     <div className="space-y-8">
//       <div className="space-y-6">
//         <div className="space-y-2">
//           <h1 className="text-2xl md:text-4xl font-bold text-yellow-400">
//             Fund Your Account
//           </h1>
//           <h2 className="text-xl md:text-3xl font-bold text-foreground">
//             and Start Trading
//           </h2>
//         </div>

//         {/* Balance Card */}
//         <div className="bg-gradient-to-br from-card/50 to-card/20 backdrop-blur-sm border border-border/50 rounded-2xl p-6 space-y-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//               <Wallet className="w-4 h-4" />
//               Your Estimated Balance
//             </div>

//             {/* Currency Selector */}
//             <div className="relative" ref={dropdownRef}>
//               <button
//                 type="button"
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="flex items-center gap-2 px-3 py-1.5 bg-card/50 border border-border/50 rounded-lg hover:bg-card/70 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
//               >
//                 <span className="text-sm font-medium">{selectedCurrency}</span>
//                 <ChevronDown
//                   className={`w-4 h-4 transition-transform ${
//                     isDropdownOpen ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 bg-card border border-border rounded-lg shadow-2xl min-w-[140px] z-50">
//                   {currencies.map((currency) => (
//                     <button
//                       key={currency.symbol}
//                       type="button"
//                       onClick={() => {
//                         setSelectedCurrency(currency.symbol as any);
//                         setIsDropdownOpen(false);
//                       }}
//                       className="w-full px-4 py-2 text-left hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
//                     >
//                       <div className="flex items-center justify-between">
//                         <span className="font-medium">{currency.symbol}</span>
//                         <span className="text-sm text-muted-foreground">
//                           {currency.total.toFixed(4)}
//                         </span>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="space-y-2">
//             <div className="text-3xl md:text-4xl font-bold">
//               {currentCurrency.total.toFixed(6)}{" "}
//               <span className="text-lg text-muted-foreground">
//                 {currentCurrency.symbol}
//               </span>
//             </div>

//             <div className="text-sm text-muted-foreground">
//               ≈ ${(currentCurrency.total * currentCurrency.price).toFixed(2)}
//             </div>

//             <div
//               className={`flex items-center gap-1 text-sm ${
//                 totalChange24h >= 0 ? "text-green-500" : "text-red-500"
//               }`}
//             >
//               Today&apos;s PnL: {totalChange24h.toFixed(2)}%
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 mt-8">
//           <div className="hidden sm:flex gap-4 w-full">
//             <DepositDialog wallets={wallets}>
//               <DialogTrigger asChild>
//                 <Button
//                   asChild
//                   size="lg"
//                   className="group bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex-1"
//                 >
//                   <div className="flex items-center gap-2">
//                     <div className="flex items-center justify-center w-8 h-8 bg-black/10 rounded-full">
//                       <ArrowUpRight className="w-4 h-4" />
//                     </div>
//                     <span>Deposit</span>
//                   </div>
//                 </Button>
//               </DialogTrigger>
//             </DepositDialog>

//             <Button
//               asChild
//               variant="outline"
//               size="lg"
//               className="group border-2 border-yellow-500/50 hover:border-yellow-500 bg-transparent hover:bg-yellow-500/10 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex-1"
//             >
//               <Link href="/trading" className="flex items-center gap-3">
//                 <div className="flex items-center justify-center w-8 h-8 bg-yellow-500/20 rounded-full">
//                   <TrendingUp className="w-4 h-4 text-yellow-500" />
//                 </div>
//                 <span>Trade</span>
//               </Link>
//             </Button>
//           </div>

//           {/* Mobile */}
//           <div className="flex sm:hidden gap-4 justify-center">
//             <DepositDialog wallets={wallets}>
//               <DialogTrigger asChild>
//                 <button
//                   type="button"
//                   className="group flex flex-col items-center gap-1 p-2 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 transform hover:scale-105 min-w-[70px]"
//                 >
//                   <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300">
//                     <ArrowUpRight className="w-4 h-4 text-black" />
//                   </div>
//                   <span className="text-xs font-medium text-yellow-400">
//                     Deposit
//                   </span>
//                 </button>
//               </DialogTrigger>
//             </DepositDialog>

//             <Link
//               href="/trading"
//               className="group flex flex-col items-center gap-1 p-2 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 transform hover:scale-105 min-w-[70px]"
//             >
//               <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300">
//                 <TrendingUp className="w-4 h-4 text-yellow-400" />
//               </div>
//               <span className="text-xs font-medium text-yellow-400">Trade</span>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function NoSessionHeroSectionContent() {
//   return (
//     <div className="space-y-8">
//       <div className="space-y-4">
//         <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
//           Trade crypto with confidence
//         </h1>
//         <p className="text-muted-foreground max-w-xl">
//           Low fees, lightning-fast execution, and security-first design. Join
//           Blockechange and start your journey today.
//         </p>

//         <div className="flex flex-wrap gap-3">
//           <Button asChild>
//             <Link href="/signup">Create free account</Link>
//           </Button>
//           <GoogleLoging
//             className="flex items-center justify-center gap-2 p-1"
//             text="Sign In"
//           />
//           <Button variant="outline" asChild>
//             <Link href="/market">Explore markets</Link>
//           </Button>
//         </div>
//       </div>

//       <TrustIndicators />
//     </div>
//   );
// }

// function HeroSectionSkeleton() {
//   return (
//     <div className="space-y-8">
//       <div className="space-y-6">
//         <div className="space-y-2">
//           <div className="h-8 w-64 bg-muted/50 rounded animate-pulse" />
//           <div className="h-6 w-48 bg-muted/30 rounded animate-pulse" />
//         </div>

//         <div className="bg-card/50 border border-border/50 rounded-2xl p-6 space-y-4">
//           <div className="h-4 w-32 bg-muted/30 rounded animate-pulse" />
//           <div className="h-10 w-48 bg-muted/50 rounded animate-pulse" />
//           <div className="h-3 w-24 bg-muted/30 rounded animate-pulse" />
//         </div>

//         <div className="flex gap-4">
//           <div className="h-12 w-32 bg-muted/50 rounded animate-pulse" />
//           <div className="h-12 w-24 bg-muted/30 rounded animate-pulse" />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import TrustIndicators from "./trust-indicators";
import CoinShowCase from "./coin-showcase/coin-show-case";
import { Button } from "@/components/ui/button";
import GoogleLoging from "@/components/forms/google-loging";
import Link from "next/link";
import { useSession } from "@/queries/useSession";
import { useUserWallets } from "@/queries/wallets/use-user-wallets";
import {
  ArrowUpRight,
  TrendingUp,
  Wallet,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import DepositDialog from "../wallet/_cmp/deposite-dialogue";
import ConvertDialog from "../wallet/_cmp/convert-dialogue";
import { DialogTrigger } from "@/components/ui/dialog";

export function HeroSectionClient() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-crypto-dark via-crypto-card to-crypto-dark" />
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <HeroSectionContent />
          <CoinShowCase />
        </div>
      </div>
    </section>
  );
}

function HeroSectionContent() {
  const { id, isLoading } = useSession();

  if (isLoading) {
    return <HeroSectionSkeleton />;
  }

  return id ? (
    <LoggedInHeroContent userId={id} />
  ) : (
    <NoSessionHeroSectionContent />
  );
}

export function LoggedInHeroContent({ userId }: { userId: string }) {
  const { wallets, totalBalance, totalChange24h, totals, isLoading } =
    useUserWallets(userId);

  const [selectedCurrency, setSelectedCurrency] = useState<
    "USDT" | "BTC" | "ETH" | "BNB" | "SOL"
  >("USDT");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currencies = ["USDT", "BTC", "ETH", "BNB", "SOL"].map((symbol) => {
    const total = totals?.[symbol] ?? 0;
    const price = total > 0 ? totalBalance / total : 0;
    return { symbol, total, price };
  });

  const currentCurrency =
    currencies.find((c) => c.symbol === selectedCurrency) || currencies[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  if (isLoading) return <HeroSectionSkeleton />;

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-card/50 to-card/20 backdrop-blur-sm border border-border/50 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="w-4 h-4" />
              Your Estimated Balance
            </div>

            {/* Currency Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-card/50 border border-border/50 rounded-lg hover:bg-card/70 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              >
                <span className="text-sm font-medium">{selectedCurrency}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-card border border-border rounded-lg shadow-2xl min-w-[140px] z-50">
                  {currencies.map((currency) => (
                    <button
                      key={currency.symbol}
                      type="button"
                      onClick={() => {
                        setSelectedCurrency(currency.symbol as any);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{currency.symbol}</span>
                        <span className="text-sm text-muted-foreground">
                          {currency.total.toFixed(4)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold">
              {currentCurrency.total.toFixed(6)}{" "}
              <span className="text-lg text-muted-foreground">
                {currentCurrency.symbol}
              </span>
            </div>

            <div className="text-sm text-muted-foreground">
              ≈ ${(currentCurrency.total * currentCurrency.price).toFixed(2)}
            </div>

            <div
              className={`flex items-center gap-1 text-sm ${
                totalChange24h >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              Today&apos;s PnL: {totalChange24h.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <div className="hidden sm:flex gap-4 w-full">
            <DepositDialog wallets={wallets}>
              <DialogTrigger asChild>
                <Button
                  asChild
                  size="lg"
                  className="group border-2 border-yellow-500/50 hover:border-yellow-500 bg-transparent hover:bg-yellow-500/10 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex-1"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-black/10 rounded-full">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <span>Deposit</span>
                  </div>
                </Button>
              </DialogTrigger>
            </DepositDialog>

            <ConvertDialog wallets={wallets} userWallets={wallets}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-2 border-blue-500/50 hover:border-blue-500 bg-transparent hover:bg-blue-500/10 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex-1"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-full">
                      <ArrowUpDown className="w-4 h-4 text-blue-500" />
                    </div>
                    <span>Swap</span>
                  </div>
                </Button>
              </DialogTrigger>
            </ConvertDialog>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="group border-2 border-yellow-500/50 hover:border-yellow-500 bg-transparent hover:bg-yellow-500/10 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex-1"
            >
              <Link href="/trading" className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-500/20 rounded-full">
                  <TrendingUp className="w-4 h-4 text-yellow-500" />
                </div>
                <span>Trade</span>
              </Link>
            </Button>
          </div>

          {/* Mobile */}
          <div className="flex sm:hidden gap-4 justify-center">
            <DepositDialog wallets={wallets}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="group flex flex-col items-center gap-1 p-2 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 transform hover:scale-105 min-w-[70px]"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-xs font-medium text-yellow-400">
                    Deposit
                  </span>
                </button>
              </DialogTrigger>
            </DepositDialog>

            <ConvertDialog wallets={wallets} userWallets={wallets}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="group flex flex-col items-center gap-1 p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 transform hover:scale-105 min-w-[70px]"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-2 border-blue-500 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300">
                    <ArrowUpDown className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-xs font-medium text-blue-400">
                    Swap
                  </span>
                </button>
              </DialogTrigger>
            </ConvertDialog>

            <Link
              href="/trading"
              className="group flex flex-col items-center gap-1 p-2 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 transform hover:scale-105 min-w-[70px]"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
              </div>
              <span className="text-xs font-medium text-yellow-400">Trade</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function NoSessionHeroSectionContent() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Trade crypto with confidence
        </h1>
        <p className="text-muted-foreground max-w-xl">
          Low fees, lightning-fast execution, and security-first design. Join
          Blockechange and start your journey today.
        </p>

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
      </div>

      <TrustIndicators />
    </div>
  );
}

function HeroSectionSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted/50 rounded animate-pulse" />
          <div className="h-6 w-48 bg-muted/30 rounded animate-pulse" />
        </div>

        <div className="bg-card/50 border border-border/50 rounded-2xl p-6 space-y-4">
          <div className="h-4 w-32 bg-muted/30 rounded animate-pulse" />
          <div className="h-10 w-48 bg-muted/50 rounded animate-pulse" />
          <div className="h-3 w-24 bg-muted/30 rounded animate-pulse" />
        </div>

        <div className="flex gap-4">
          <div className="h-12 w-32 bg-muted/50 rounded animate-pulse" />
          <div className="h-12 w-24 bg-muted/30 rounded animate-pulse" />
          <div className="h-12 w-28 bg-muted/30 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
