// app/api/coins/route.ts
import { NextResponse } from "next/server";
import fetchCoins from "@/server/coins/fetch-coins";

export async function GET() {
  try {
    const coins = await fetchCoins();
    return NextResponse.json(coins, {
      headers: { "Cache-Control": "public, max-age=10, s-maxage=10" },
    });
  } catch {
    return NextResponse.json([], {
      headers: { "Cache-Control": "public, max-age=5, s-maxage=5" },
    });
  }
}
