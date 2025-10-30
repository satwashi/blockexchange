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
import fetchCoins from './fetchCoins';

// Enhanced rate limit bypass configuration
const BYPASS_CONFIG = {
  baseDelay: 1000,
  maxDelay: 30000,
  requestBatchSize: 3,
  batchDelay: 2000,
  jitter: 0.3, // 30% random jitter
};

// Multiple API endpoints with fallbacks
const endpoints = [
  "https://api.binance.com/api/v3/ticker/24hr",
  "https://api1.binance.com/api/v3/ticker/24hr", 
  "https://api2.binance.com/api/v3/ticker/24hr",
  "https://api3.binance.com/api/v3/ticker/24hr",
  "https://api4.binance.com/api/v3/ticker/24hr",
];

// Extended User-Agent list with mobile and modern browsers
const userAgents = [
  // Chrome
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  
  // Firefox
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
  
  // Safari
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  
  // Mobile
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.210 Mobile Safari/537.36',
  
  // Edge
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
];

// Referer list to simulate different entry points
const referers = [
  'https://www.binance.com/en/trade/BTC_USDT',
  'https://www.binance.com/en/trade/ETH_USDT',
  'https://www.binance.com/en/trade/BNB_USDT',
  'https://www.binance.com/en/markets',
  'https://www.binance.com/',
  'https://binance.com/en/trade/BTC_USDT?layout=pro',
];

// Accept language variations
const acceptLanguages = [
  'en-US,en;q=0.9',
  'en-GB,en;q=0.8',
  'en-CA,en;q=0.7',
  'en-AU,en;q=0.6',
  'en;q=0.5',
];

class RateLimitBypass {
  private requestQueue: Array<{resolve: any, reject: any, url: string}> = [];
  private processing = false;
  private lastRequestTime = 0;
  private consecutiveFailures = 0;
  
  // Generate random delay with jitter
  private getRandomDelay(baseDelay: number): number {
    const jitter = baseDelay * BYPASS_CONFIG.jitter;
    return baseDelay + (Math.random() * jitter * 2 - jitter);
  }
  
  // Get random item from array
  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  // Create realistic headers for each request
  private generateHeaders() {
    return {
      'User-Agent': this.getRandomItem(userAgents),
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': this.getRandomItem(acceptLanguages),
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Referer': this.getRandomItem(referers),
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'Connection': 'keep-alive',
    };
  }
  
  // Smart delay between requests
  private async smartDelay() {
    const baseDelay = BYPASS_CONFIG.baseDelay * (1 + this.consecutiveFailures * 0.5);
    const delay = Math.min(this.getRandomDelay(baseDelay), BYPASS_CONFIG.maxDelay);
    
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < delay) {
      const remainingDelay = delay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, remainingDelay));
    }
    
    this.lastRequestTime = Date.now();
  }
  
  // Process queue with rate limiting
  private async processQueue() {
    if (this.processing) return;
    this.processing = true;
    
    while (this.requestQueue.length > 0) {
      const batch = this.requestQueue.splice(0, BYPASS_CONFIG.requestBatchSize);
      
      // Process batch in parallel
      await Promise.all(batch.map(async (request) => {
        try {
          await this.smartDelay();
          const result = await this.makeRequest(request.url);
          request.resolve(result);
        } catch (error) {
          request.reject(error);
        }
      }));
      
      // Delay between batches
      if (this.requestQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, BYPASS_CONFIG.batchDelay));
      }
    }
    
    this.processing = false;
  }
  
  // Make individual request with bypass techniques
  private async makeRequest(url: string): Promise<any> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    
    try {
      // Add cache busting parameter
      const cacheBuster = `_=${Date.now()}`;
      const requestUrl = url.includes('?') 
        ? `${url}&${cacheBuster}`
        : `${url}?${cacheBuster}`;
      
      const response = await fetch(requestUrl, {
        signal: controller.signal,
        headers: this.generateHeaders(),
        // Add credentials to appear more like browser
        credentials: 'omit',
        mode: 'cors',
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        if (response.status === 429) {
          this.consecutiveFailures++;
          throw new Error('RATE_LIMITED');
        }
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      // Reset failure count on success
      this.consecutiveFailures = Math.max(0, this.consecutiveFailures - 1);
      
      return data;
      
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  }
  
  // Public method to make requests
  async fetchWithBypass(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({resolve, reject, url});
      this.processQueue();
    });
  }
}

// Create global instance
const bypass = new RateLimitBypass();

// Enhanced endpoint health with IP rotation simulation
const endpointHealth = endpoints.map(url => ({
  url,
  lastSuccess: Date.now(),
  failureCount: 0,
  successCount: 0,
  averageResponseTime: 0,
  isHealthy: true,
}));

const updateEndpointHealth = (url: string, success: boolean, responseTime: number) => {
  const endpoint = endpointHealth.find(e => e.url === url);
  if (!endpoint) return;
  
  if (success) {
    endpoint.lastSuccess = Date.now();
    endpoint.failureCount = 0;
    endpoint.successCount++;
    endpoint.isHealthy = true;
    endpoint.averageResponseTime = endpoint.averageResponseTime 
      ? (endpoint.averageResponseTime + responseTime) / 2 
      : responseTime;
  } else {
    endpoint.failureCount++;
    endpoint.successCount = Math.max(0, endpoint.successCount - 1);
    
    // Mark as unhealthy after multiple failures
    if (endpoint.failureCount > 3) {
      endpoint.isHealthy = false;
    }
  }
};

// Get best endpoints based on health
const getBestEndpoints = (): string[] => {
  const now = Date.now();
  const fiveMinutesAgo = now - 300000;
  
  return endpointHealth
    .filter(endpoint => {
      if (!endpoint.isHealthy) {
        // Give unhealthy endpoints a chance to recover occasionally
        return Math.random() < 0.1; // 10% chance
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by health score (success rate, response time, recent activity)
      const scoreA = (a.successCount / (a.successCount + a.failureCount)) * 100 - a.averageResponseTime;
      const scoreB = (b.successCount / (b.successCount + b.failureCount)) * 100 - b.averageResponseTime;
      return scoreB - scoreA;
    })
    .map(endpoint => endpoint.url);
};

// Final enhanced fetchCoins function
const fetchCoins = async (): Promise<CryptoData[]> => {
  const bestEndpoints = getBestEndpoints();
  
  console.log(`Trying ${bestEndpoints.length} endpoints in order of health...`);
  
  for (const endpoint of bestEndpoints) {
    const startTime = Date.now();
    
    try {
      console.log(`Attempting bypass fetch from: ${endpoint}`);
      
      const data = await bypass.fetchWithBypass(endpoint);
      const responseTime = Date.now() - startTime;
      
      if (!Array.isArray(data)) {
        throw new Error('Response is not an array');
      }
      
      const coins = processCoinData(data);
      
      if (coins.length === 0) {
        throw new Error('No valid coins found in response');
      }
      
      updateEndpointHealth(endpoint, true, responseTime);
      console.log(`✅ Bypass successful! Fetched ${coins.length} coins from ${endpoint}`);
      
      return coins;
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      updateEndpointHealth(endpoint, false, responseTime);
      
      console.warn(`❌ Bypass failed for ${endpoint}:`, error.message);
      
      // Special handling for rate limits
      if (error.message === 'RATE_LIMITED') {
        console.log('🔄 Rate limit detected, increasing delays...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  
  // Ultimate fallback - try all endpoints with aggressive bypass
  console.log('🆘 All optimized endpoints failed, trying emergency bypass...');
  return await emergencyBypass();
};

// Emergency bypass when everything else fails
const emergencyBypass = async (): Promise<CryptoData[]> => {
  for (const endpoint of endpoints) {
    try {
      // Ultra-stealth mode - longer delays, random patterns
      await new Promise(resolve => setTimeout(resolve, Math.random() * 10000 + 5000));
      
      const data = await bypass.fetchWithBypass(endpoint);
      
      if (Array.isArray(data) && data.length > 0) {
        const coins = processCoinData(data);
        if (coins.length > 0) {
          console.log(`🚨 Emergency bypass successful from ${endpoint}`);
          return coins;
        }
      }
    } catch (error) {
      console.warn(`Emergency bypass failed for ${endpoint}:`, error.message);
    }
  }
  
  // Final fallback
  console.log('💀 All bypass attempts failed, using fallback data');
  return getFallbackData();
};

// Keep your existing processCoinData and getFallbackData functions
const processCoinData = (data: any[]): CryptoData[] => {
  return data
    .filter((coin: any) =>
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
};

const getFallbackData = (): CryptoData[] => {
  return [{
    symbol: "USDT",
    price: 1,
    change1h: 0,
    change24h: 0,
    change7d: 0,
    volume24h: 0,
    marketCap: 0,
    priceHistory: [],
  }];
};
 
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
