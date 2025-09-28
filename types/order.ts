// Base order fields (common to both creating and DB orders)
export type BaseOrder = {
  symbol: string; // Trading pair
  side: "LONG" | "SHORT"; // Position side
  amount: number; // Amount of the trade
  time: string; // Duration user set, e.g., "1h 30m"
  status: "OPEN" | "CLOSED"; // Current order status
};

// Fields required when creating a new order
export type NewOrder = BaseOrder & {
  name?: string; // optional user name
  user_id?: string; // optional user ID
  profit_range: string;
  on_market: boolean;
};

// Full order stored in DB, extends BaseOrder + creation metadata + PnL
export type Order = BaseOrder &
  NewOrder & {
    id: string; // unique order ID
    user_id: string;
    created_at?: string; // when the order was created
    pnl: number | null; // Profit/Loss (null if not closed yet)
    win_status?: "WIN" | "LOSS"; // result
  };
