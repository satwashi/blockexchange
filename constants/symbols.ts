export interface MarketItem {
  id: string; // internal id → used for APIs
  symbol: string; // display symbol → "BTCUSD"
  base: string; // "BTC"
  quote: string; // "USD"
  type: "forex" | "crypto" | "commodity" | "index";
}

export const markets: MarketItem[] = [
  // COMMODITIES
  {
    id: "gold", // internal name for API
    symbol: "XAUUSD",
    base: "XAU",
    quote: "USD",
    type: "commodity",
  },
  {
    id: "silver",
    symbol: "XAGUSD",
    base: "XAG",
    quote: "USD",
    type: "commodity",
  },
  {
    id: "crude-oil",
    symbol: "USOIL",
    base: "OIL",
    quote: "USD",
    type: "commodity",
  },

  // FOREX
  {
    id: "eurusd",
    symbol: "EURUSD",
    base: "EUR",
    quote: "USD",
    type: "forex",
  },
  {
    id: "gbpusd",
    symbol: "GBPUSD",
    base: "GBP",
    quote: "USD",
    type: "forex",
  },
  {
    id: "audusd",
    symbol: "AUDUSD",
    base: "AUD",
    quote: "USD",
    type: "forex",
  },
  {
    id: "nzdusd",
    symbol: "NZDUSD",
    base: "NZD",
    quote: "USD",
    type: "forex",
  },
  {
    id: "usdchf",
    symbol: "USDCHF",
    base: "USD",
    quote: "CHF",
    type: "forex",
  },
  {
    id: "usdjpy",
    symbol: "USDJPY",
    base: "USD",
    quote: "JPY",
    type: "forex",
  },
  {
    id: "usdcad",
    symbol: "USDCAD",
    base: "USD",
    quote: "CAD",
    type: "forex",
  },

  // CRYPTO
  {
    id: "bitcoin",
    symbol: "BTCUSD",
    base: "BTC",
    quote: "USD",
    type: "crypto",
  },
  {
    id: "ethereum",
    symbol: "ETHUSD",
    base: "ETH",
    quote: "USD",
    type: "crypto",
  },
  {
    id: "litecoin",
    symbol: "LTCUSD",
    base: "LTC",
    quote: "USD",
    type: "crypto",
  },
];
