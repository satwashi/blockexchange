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

// ✅ Optimized API fetch with multiple endpoints and better error handling
const fetchCoins = async (): Promise<CryptoData[]> => {
  const endpoints = [
    "https://api.binance.com/api/v3/ticker/24hr",
    "https://api1.binance.com/api/v3/ticker/24hr",
    "https://api2.binance.com/api/v3/ticker/24hr",
    "https://api3.binance.com/api/v3/ticker/24hr",
  ];

  for (let i = 0; i < endpoints.length; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(endpoints[i], {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) continue;

      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) continue;

      const coins = data
        .filter(
          (coin: any) =>
            coin.symbol?.endsWith("USDT") &&
            !coin.symbol.includes("DOWN") &&
            !coin.symbol.includes("UP") &&
            !coin.symbol.includes("BEAR") &&
            !coin.symbol.includes("BULL")
        )
        .map((c: any, index: number) => ({
          symbol: c.symbol.replace("USDT", ""),
          price: parseFloat(c.lastPrice) || 0,
          change1h: (parseFloat(c.priceChangePercent) || 0) * 0.3,
          change24h: parseFloat(c.priceChangePercent) || 0,
          change7d: (parseFloat(c.priceChangePercent) || 0) * 1.2,
          volume24h:
            (parseFloat(c.volume) || 0) * (parseFloat(c.lastPrice) || 0),
          marketCap:
            (parseFloat(c.volume) || 0) *
            (parseFloat(c.lastPrice) || 0) *
            (100 - index * 2),
          priceHistory: generateMockPriceHistory(
            parseFloat(c.lastPrice) || 0,
            parseFloat(c.priceChangePercent) || 0
          ),
        }))
        .filter((coin) => coin.price > 0 && coin.symbol) // Remove invalid coins
        .sort((a, b) => b.volume24h - a.volume24h)
        .slice(0, 100);

      if (coins.length > 0) {
        return coins;
      }
    } catch (error) {
      // Continue to next endpoint
      continue;
    }
  }

  throw new Error("All Binance API endpoints failed");
};

export const useCoins = () => {
  const queryClient = useQueryClient();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Optimized favorites loading/saving
  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      try {
        setFavorites(new Set(JSON.parse(saved)));
      } catch (error) {
        console.warn("Failed to parse favorites from localStorage");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  // ✅ Optimized React Query configuration
  const {
    data: coins = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["coins"],
    queryFn: fetchCoins,
    staleTime: 1000 * 10,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // ✅ Optimized WebSocket with better reconnection logic
  useEffect(() => {
    if (typeof window === "undefined" || coins.length === 0) return;

    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;

    const connectWebSocket = () => {
      try {
        const endpoint =
          reconnectAttempts % 2 === 0
            ? "wss://stream.binance.com:9443/stream?streams=!ticker@arr"
            : "wss://stream.binance.com:443/stream?streams=!ticker@arr";

        ws = new WebSocket(endpoint);

        ws.onopen = () => {
          reconnectAttempts = 0;
        };

        ws.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            const data = parsed.data || parsed;

            const updatedCoins = data
              .filter(
                (coin: any) =>
                  coin.s?.endsWith("USDT") &&
                  !coin.s.includes("DOWN") &&
                  !coin.s.includes("UP") &&
                  !coin.s.includes("BEAR") &&
                  !coin.s.includes("BULL")
              )
              .map((c: any, index: number) => ({
                symbol: c.s.replace("USDT", ""),
                price: parseFloat(c.c) || 0,
                change1h: (parseFloat(c.P) || 0) * 0.3,
                change24h: parseFloat(c.P) || 0,
                change7d: (parseFloat(c.P) || 0) * 1.2,
                volume24h: (parseFloat(c.v) || 0) * (parseFloat(c.c) || 0),
                marketCap:
                  (parseFloat(c.v) || 0) *
                  (parseFloat(c.c) || 0) *
                  (100 - index * 2),
                priceHistory: generateMockPriceHistory(
                  parseFloat(c.c) || 0,
                  parseFloat(c.P) || 0
                ),
              }))
              .filter((coin) => coin.price > 0 && coin.symbol)
              .sort((a, b) => b.volume24h - a.volume24h)
              .slice(0, 100);

            if (updatedCoins.length > 0) {
              queryClient.setQueryData(["coins"], updatedCoins);
            }
          } catch (err) {
            console.error("WebSocket parse error:", err);
          }
        };

        ws.onclose = () => {
          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            const delay = Math.min(1000 * reconnectAttempts, 5000);
            reconnectTimeout = setTimeout(connectWebSocket, delay);
          }
        };

        ws.onerror = () => {
          // Errors are handled in onclose
        };
      } catch (err) {
        console.error("WebSocket creation failed:", err);
      }
    };

    connectWebSocket();

    return () => {
      reconnectTimeout && clearTimeout(reconnectTimeout);
      ws?.close(1000, "Component unmounting");
    };
  }, [queryClient, coins.length]);

  // ✅ Optimized derived data with single computation
  const {
    filteredCoins,
    topGainers,
    top5Gainers,
    topLosers,
    favoriteCoins,
    marketStats,
    popular5,
    newListings5,
  } = useMemo(() => {
    const filtered = coins.filter((coin) =>
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedByChange24h = [...filtered].sort(
      (a, b) => b.change24h - a.change24h
    );
    const sortedByVolume = [...filtered].sort(
      (a, b) => b.volume24h - a.volume24h
    );
    const sortedByMarketCap = [...filtered].sort(
      (a, b) => a.marketCap - b.marketCap
    );

    const marketStats =
      filtered.length > 0
        ? {
            totalMarketCap: filtered.reduce((sum, c) => sum + c.marketCap, 0),
            totalVolume: filtered.reduce((sum, c) => sum + c.volume24h, 0),
            avgChange:
              filtered.reduce((sum, c) => sum + c.change24h, 0) /
              filtered.length,
          }
        : null;

    return {
      filteredCoins: filtered,
      topGainers: sortedByChange24h.slice(0, 20),
      top5Gainers: sortedByChange24h.slice(0, 10),
      topLosers: [...filtered]
        .sort((a, b) => a.change24h - b.change24h)
        .slice(0, 20),
      favoriteCoins: filtered.filter((coin) => favorites.has(coin.symbol)),
      marketStats,
      popular5: sortedByVolume.slice(0, 10),
      newListings5: sortedByMarketCap.slice(0, 10),
    };
  }, [coins, searchTerm, favorites]);

  // ✅ Optimized favorite toggle
  const handleFavorite = (symbol: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      newSet.has(symbol) ? newSet.delete(symbol) : newSet.add(symbol);
      return newSet;
    });
  };

  return {
    // Data
    coins,
    filteredCoins,
    topGainers,
    top5Gainers,
    topLosers,
    favoriteCoins,
    popular5,
    newListings5,

    // State
    favorites,
    searchTerm,
    setSearchTerm,

    // Functions
    handleFavorite,

    // Stats
    marketStats,

    // Status
    isLoading,
    error,

    // Optional: Add refetch capability
    refetch,
  };
};

export default useCoins;
