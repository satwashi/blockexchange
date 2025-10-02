"use client";
import { useEffect, useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface CryptoData {
  symbol: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  volume24h: number;
  marketCap: number;
  priceHistory: number[];
}

const FAVORITES_KEY = "crypto-favorites";

const generateMockPriceHistory = (currentPrice: number, change: number) => {
  const points = 20;
  const history: number[] = [];
  const isPositive = change >= 0;

  for (let i = 0; i < points; i++) {
    const randomVariation = (Math.random() - 0.5) * 0.02;
    const trendVariation = isPositive
      ? (i / points) * Math.abs(change) * 0.01
      : -(i / points) * Math.abs(change) * 0.01;

    const price = currentPrice * (1 + trendVariation + randomVariation);
    history.push(Math.max(price, 0));
  }

  return history;
};

// ✅ Fetch coins from Binance REST API
const fetchCoins = async (): Promise<CryptoData[]> => {
  const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
  const data = await res.json();

  return data
    .filter(
      (coin: any) =>
        coin.symbol.endsWith("USDT") &&
        !coin.symbol.includes("DOWN") &&
        !coin.symbol.includes("UP") &&
        !coin.symbol.includes("BEAR") &&
        !coin.symbol.includes("BULL")
    )
    .map((c: any, index: number) => ({
      symbol: c.symbol.replace("USDT", ""),
      price: parseFloat(c.lastPrice),
      change1h: parseFloat(c.priceChangePercent) * 0.3,
      change24h: parseFloat(c.priceChangePercent),
      change7d: parseFloat(c.priceChangePercent) * 1.2,
      volume24h: parseFloat(c.volume) * parseFloat(c.lastPrice),
      marketCap:
        parseFloat(c.volume) * parseFloat(c.lastPrice) * (100 - index * 2),
      priceHistory: generateMockPriceHistory(
        parseFloat(c.lastPrice),
        parseFloat(c.priceChangePercent)
      ),
    }))
    .sort((a, b) => b.volume24h - a.volume24h)
    .slice(0, 100);
};

export const useCoins = () => {
  const queryClient = useQueryClient();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Load favorites on mount
  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  }, []);

  // ✅ Save favorites when they change
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  // ✅ Fetch coins with React Query
  const {
    data: coins,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["coins"],
    queryFn: fetchCoins,
    staleTime: 1000 * 10,
  });

  // ✅ WebSocket for real-time updates (Vercel-safe)
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR safety

    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const connectWebSocket = () => {
      try {
        ws = new WebSocket(
          "wss://stream.binance.com:9443/stream?streams=!ticker@arr"
        );

        ws.onopen = () => {
          console.log("✅ Binance WebSocket connected");
          reconnectAttempts = 0; // Reset on successful connection
        };

        ws.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            const data = parsed.data || parsed; // Binance wraps in { stream, data }

            const updated: CryptoData[] = data
              .filter(
                (coin: any) =>
                  coin.s.endsWith("USDT") &&
                  !coin.s.includes("DOWN") &&
                  !coin.s.includes("UP") &&
                  !coin.s.includes("BEAR") &&
                  !coin.s.includes("BULL")
              )
              .map((c: any, index: number) => ({
                symbol: c.s.replace("USDT", ""),
                price: parseFloat(c.c),
                change1h: parseFloat(c.P) * 0.3,
                change24h: parseFloat(c.P),
                change7d: parseFloat(c.P) * 1.2,
                volume24h: parseFloat(c.v) * parseFloat(c.c),
                marketCap:
                  parseFloat(c.v) * parseFloat(c.c) * (100 - index * 2),
                priceHistory: generateMockPriceHistory(
                  parseFloat(c.c),
                  parseFloat(c.P)
                ),
              }))
              .sort((a, b) => b.volume24h - a.volume24h)
              .slice(0, 100);

            queryClient.setQueryData(["coins"], updated);
          } catch (err) {
            console.error("❌ WebSocket parse error:", err);
          }
        };

        ws.onerror = (err) => {
          console.warn(
            "⚠️ WebSocket connection error (this is normal in some environments):",
            err
          );
          // Don't log the full error object to avoid console spam
        };

        ws.onclose = (event) => {
          console.log("🔌 Binance WebSocket closed", event.code, event.reason);

          // Attempt to reconnect if not a normal closure
          if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            const delay = Math.min(
              1000 * Math.pow(2, reconnectAttempts),
              30000
            ); // Exponential backoff, max 30s
            console.log(
              `🔄 Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts}/${maxReconnectAttempts})`
            );

            reconnectTimeout = setTimeout(() => {
              connectWebSocket();
            }, delay);
          } else if (reconnectAttempts >= maxReconnectAttempts) {
            console.log(
              "❌ Max reconnection attempts reached. Falling back to REST API only."
            );
          }
        };
      } catch (err) {
        console.error("❌ Failed to create WebSocket connection:", err);
      }
    };

    // Start the connection
    connectWebSocket();

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (ws) {
        ws.close(1000, "Component unmounting");
      }
    };
  }, [queryClient]);

  // ✅ Derived data
  const filteredCoins = useMemo(
    () =>
      coins?.filter((coin) =>
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [coins, searchTerm]
  );

  const topGainers = useMemo(
    () =>
      [...(filteredCoins || [])]
        .sort((a, b) => b.change24h - a.change24h)
        .slice(0, 20),
    [filteredCoins]
  );

  const top5Gainers = useMemo(
    () =>
      [...(filteredCoins || [])]
        .sort((a, b) => b.change24h - a.change24h)
        .slice(0, 10),
    [filteredCoins]
  );

  const topLosers = useMemo(
    () =>
      [...(filteredCoins || [])]
        .sort((a, b) => a.change24h - b.change24h)
        .slice(0, 20),
    [filteredCoins]
  );

  const favoriteCoins = useMemo(
    () => filteredCoins?.filter((coin) => favorites.has(coin.symbol)) || [],
    [filteredCoins, favorites]
  );

  const marketStats = useMemo(() => {
    if (!filteredCoins || filteredCoins.length === 0) return null;
    return {
      totalMarketCap: filteredCoins.reduce((sum, c) => sum + c.marketCap, 0),
      totalVolume: filteredCoins.reduce((sum, c) => sum + c.volume24h, 0),
      avgChange:
        filteredCoins.reduce((sum, c) => sum + c.change24h, 0) /
        filteredCoins.length,
    };
  }, [filteredCoins]);

  const popular5 = useMemo(
    () =>
      [...(filteredCoins || [])]
        .sort((a, b) => b.volume24h - a.volume24h)
        .slice(0, 10),
    [filteredCoins]
  );

  const newListings5 = useMemo(
    () =>
      [...(filteredCoins || [])]
        .sort((a, b) => a.marketCap - b.marketCap)
        .slice(0, 10),
    [filteredCoins]
  );

  // ✅ Toggle favorites
  const handleFavorite = (symbol: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(symbol)) {
        newSet.delete(symbol);
      } else {
        newSet.add(symbol);
      }
      return newSet;
    });
  };

  return {
    coins,
    filteredCoins,
    topGainers,
    top5Gainers,
    topLosers,
    favorites,
    favoriteCoins,
    searchTerm,
    setSearchTerm,
    handleFavorite,
    marketStats,
    isLoading,
    error,
    popular5,
    newListings5,
  };
};

export default useCoins;
