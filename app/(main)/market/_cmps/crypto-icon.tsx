import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
interface CryptoIconProps {
  symbol: string;
  className?: string;
}
export function CryptoIcon({ symbol, className }: CryptoIconProps) {
  const [hasError, setHasError] = useState(false);
  const [fallbackUsed, setFallbackUsed] = useState(0);
  const baseSymbol = symbol.replace("USDT", "").toLowerCase();

  const hasLocalImage = (symbol: string) => {
    const localImages = ["btc", "eth", "usdt", "bnb", "sol"];
    return localImages.includes(symbol.toLowerCase());
  };

  // Get local image path
  const getLocalImagePath = (symbol: string) => {
    return `/crypto/${symbol.toUpperCase()}.png`;
  };

  // Primary API: CoinGecko API (more reliable)
  const getCoinGeckoUrl = (symbol: string) => {
    // Map common symbols to CoinGecko IDs
    const symbolMap: Record<string, string> = {
      btc: "bitcoin",
      eth: "ethereum",
      usdt: "tether",
      bnb: "binancecoin",
      xrp: "ripple",
      ada: "cardano",
      sol: "solana",
      doge: "dogecoin",
      dot: "polkadot",
      avax: "avalanche-2",
      matic: "matic-network",
      ltc: "litecoin",
      link: "chainlink",
      uni: "uniswap",
      atom: "cosmos",
      near: "near",
      ftm: "fantom",
      algo: "algorand",
    };

    const coinId = symbolMap[baseSymbol] || baseSymbol;
    return `https://assets.coingecko.com/coins/images/1/large/${coinId}.png`;
  };

  // Fallback API: Crypto Icons API
  const getCryptoIconUrl = (symbol: string, size: number = 32) => {
    return `https://cryptoicons.org/api/color/${symbol.toLowerCase()}/${size}`;
  };

  // Alternative API: CoinCap API
  const getCoinCapUrl = (symbol: string) => {
    return `https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`;
  };

  // Fallback colors for coins
  const getFallbackColor = (symbol: string) => {
    const colors: Record<string, string> = {
      btc: "bg-orange-500",
      eth: "bg-blue-500",
      usdt: "bg-green-500",
      bnb: "bg-yellow-500",
      xrp: "bg-blue-600",
      ada: "bg-blue-700",
      sol: "bg-purple-500",
      doge: "bg-yellow-400",
      dot: "bg-pink-500",
      avax: "bg-red-500",
      matic: "bg-purple-600",
      ltc: "bg-gray-500",
      link: "bg-blue-400",
      uni: "bg-pink-400",
      atom: "bg-indigo-500",
      near: "bg-black",
      ftm: "bg-blue-300",
      algo: "bg-gray-400",
    };
    return colors[baseSymbol] || "bg-muted";
  };

  const getFallbackLetter = () => baseSymbol.charAt(0).toUpperCase();

  // Get the appropriate icon URL based on error state
  const getIconUrl = () => {
    let url;

    // First try local images if available
    if (hasLocalImage(baseSymbol)) {
      url = getLocalImagePath(baseSymbol);
    } else if (fallbackUsed === 0) {
      url = getCoinGeckoUrl(baseSymbol);
    } else if (fallbackUsed === 1) {
      url = getCryptoIconUrl(baseSymbol);
    } else if (fallbackUsed === 2) {
      url = getCoinCapUrl(baseSymbol);
    } else {
      url = getCoinGeckoUrl(baseSymbol);
    }
    console.log(`Trying icon URL for ${baseSymbol}: ${url}`);
    return url;
  };

  const handleError = () => {
    console.log(`Icon failed for ${baseSymbol}, fallback: ${fallbackUsed}`);
    if (fallbackUsed < 2) {
      setFallbackUsed((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  return hasError ? (
    <div
      className={cn(
        "flex items-center justify-center rounded-full w-8 h-8 text-white text-sm font-medium",
        getFallbackColor(symbol),
        className
      )}
    >
      {getFallbackLetter()}
    </div>
  ) : (
    <Image
      src={getIconUrl()}
      alt={symbol}
      width={32}
      height={32}
      className={cn("rounded-full", className)}
      onError={handleError}
      unoptimized
    />
  );
}
