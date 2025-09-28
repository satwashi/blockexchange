export type ProfitRange = {
  time_seconds: number;
  min_profit: number;
  max_profit: number;
};

export type TradingConfig = {
  profit_ranges: ProfitRange[];
  close_market: boolean;
};
