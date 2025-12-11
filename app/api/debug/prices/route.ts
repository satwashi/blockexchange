// app/api/debug/prices/route.ts
// Debug endpoint to view CoinGecko prices - for testing only

import { NextResponse } from "next/server";

const COINS = {
  bitcoin: "BTC",
  ethereum: "ETH",
  binancecoin: "BNB",
  solana: "SOL",
  ripple: "XRP",
  cardano: "ADA",
  dogecoin: "DOGE",
  tron: "TRX",
  litecoin: "LTC",
  tether: "USDT",
};

export async function GET() {
  const ids = Object.keys(COINS).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({
        error: `CoinGecko returned ${res.status}`,
        url,
      });
    }

    const raw = await res.json();

    // Format nicely
    const prices = Object.entries(COINS).map(([id, symbol]) => ({
      symbol,
      price: raw[id]?.usd ?? 0,
      change24h: raw[id]?.usd_24h_change?.toFixed(2) ?? "0",
    }));

    return NextResponse.json({
      source: "CoinGecko API",
      fetched_at: new Date().toISOString(),
      prices,
      raw_response: raw,
    });
  } catch (err: any) {
    return NextResponse.json({
      error: err.message,
      url,
    });
  }
}





