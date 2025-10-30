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

const endpoints = [
  "https://api.binance.com/api/v3/ticker/24hr",
  "https://api1.binance.com/api/v3/ticker/24hr",
  "https://api2.binance.com/api/v3/ticker/24hr",
  "https://api3.binance.com/api/v3/ticker/24hr",
];

const withTimeout = async (url: string, timeoutMs: number) => {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const r = await fetch(url, { signal: controller.signal, headers: { "User-Agent": "Mozilla/5.0" } });
    if (!r.ok) throw new Error(String(r.status));
    return r.json();
  } finally {
    clearTimeout(t);
  }
};

const fetchCoin = async (): Promise<CryptoData[]> => {
  const data: any[] = await Promise.any(
    endpoints.map((u, i) => withTimeout(u, 7000 + i * 500))
  );

  if (!Array.isArray(data)) return [];

  const coins: CryptoData[] = data
    .filter(
      (coin: any) =>
        coin.symbol?.endsWith("USDT") &&
        !coin.symbol.includes("DOWN") &&
        !coin.symbol.includes("UP") &&
        !coin.symbol.includes("BEAR") &&
        !coin.symbol.includes("BULL")
    )
    .map((c: any, index: number) => ({
      symbol: String(c.symbol || "").replace("USDT", ""),
      price: Number(c.lastPrice) || 0,
      change1h: (Number(c.priceChangePercent) || 0) * 0.3,
      change24h: Number(c.priceChangePercent) || 0,
      change7d: (Number(c.priceChangePercent) || 0) * 1.2,
      volume24h: (Number(c.volume) || 0) * (Number(c.lastPrice) || 0),
      marketCap: (Number(c.volume) || 0) * (Number(c.lastPrice) || 0) * (100 - index * 2),
      priceHistory: [],
    }))
    .filter((coin: CryptoData) => coin.price > 0 && coin.symbol)
    .sort((a: CryptoData, b: CryptoData) => b.volume24h - a.volume24h)
    .slice(0, 100);

  if (!coins.some((c: CryptoData) => c.symbol === "USDT")) {
    coins.push({
      symbol: "USDT",
      price: 1,
      change1h: 0,
      change24h: 0,
      change7d: 0,
      volume24h: 0,
      marketCap: 0,
      priceHistory: [],
    });
  }

  return coins;
};

export default fetchCoins;
function fetchCoins() {
    
}