// app/api/coins/coingecko/route.ts
// CoinGecko-only endpoint for landing page (stable, no WebSocket needed)

import { NextResponse } from "next/server";

export interface CoinGeckoPrice {
  symbol: string;
  price: number;
  change24h: number;
}

const CORE_COINS = ["BTC", "ETH", "BNB", "SOL", "XRP", "ADA", "DOGE", "TRX", "LTC", "USDT"];

const ID_MAP: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "binancecoin",
  SOL: "solana",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  TRX: "tron",
  LTC: "litecoin",
  USDT: "tether",
};

async function fetchFromCoinGecko(): Promise<CoinGeckoPrice[]> {
  const ids = CORE_COINS.map((s) => ID_MAP[s]).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    const coins: CoinGeckoPrice[] = CORE_COINS.map((symbol) => {
      const id = ID_MAP[symbol];
      const price = data?.[id]?.usd ?? 0;
      const change24h = data?.[id]?.usd_24h_change ?? 0;

      return {
        symbol,
        price: Number(price),
        change24h: Number(change24h),
      };
    }).filter((coin) => coin.price > 0);

    return coins;
  } catch (error) {
    console.error("CoinGecko fetch error:", error);
    return [];
  }
}

export async function GET() {
  try {
    const coins = await fetchFromCoinGecko();

    return NextResponse.json(
      {
        source: "coingecko",
        timestamp: new Date().toISOString(),
        count: coins.length,
        coins,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=30, s-maxage=30",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        source: "coingecko",
        timestamp: new Date().toISOString(),
        error: "Failed to fetch prices",
        coins: [],
      },
      { status: 500 }
    );
  }
}

