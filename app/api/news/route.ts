import { NextResponse } from "next/server";

// ─── In-memory cache ───────────────────────────────────────────────
let cachedData: unknown = null;
let cacheTimestamp = 0;
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours → ~1 API call/day

export async function GET() {
  const now = Date.now();

  // Return cached data if still fresh
  if (cachedData && now - cacheTimestamp < CACHE_DURATION_MS) {
    return NextResponse.json(cachedData, {
      headers: {
        "X-Cache": "HIT",
        "X-Cache-Age": String(Math.round((now - cacheTimestamp) / 1000)),
      },
    });
  }

  try {
    const apiKey =
      process.env.NEWSDATA_API_KEY ||
      process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "NEWSDATA_API_KEY is not configured on the server" },
        { status: 500 }
      );
    }

    const url = new URL("https://newsdata.io/api/1/latest");
    url.searchParams.append("language", "en");
    url.searchParams.append("q", "cryptocurrency OR bitcoin OR ethereum OR blockchain");
    url.searchParams.append("apikey", apiKey);

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`Newsdata.io responded with status ${res.status}`);
    }

    const data = await res.json();

    if (data.status !== "success") {
      throw new Error(data.results?.message || "Newsdata.io API Error");
    }

    const articles = Array.isArray(data.results) ? data.results : [];

    // Map source_info for convenience
    const mapped = articles.map(
      (article: { source_id?: string; source_icon?: string }) => ({
        ...article,
        source_info: {
          name: article.source_id || "Unknown",
          img: article.source_icon || undefined,
        },
      })
    );

    // Update cache
    cachedData = mapped;
    cacheTimestamp = now;

    return NextResponse.json(mapped, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (err) {
    // If fetch fails but we have stale cache, serve it rather than error
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: { "X-Cache": "STALE" },
      });
    }

    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch news" },
      { status: 502 }
    );
  }
}
