// Dashboard Statistics Types

export interface UserStats {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  activeTraders24h: number;
  activeTraders7d: number;
}

export interface VolumeStats {
  dailyVolume: number;
  weeklyVolume: number;
  monthlyVolume: number;
  totalTrades: number;
}

export interface RevenueStats {
  totalFees: number;
  dailyFees: number;
  weeklyFees: number;
  monthlyFees: number;
}

export interface PendingActions {
  pendingKyc: number;
  pendingWithdrawals: number;
  pendingDeposits: number;
  openSupportTickets: number;
}

export interface TrendDataPoint {
  date: string;
  value: number;
}

export interface DashboardStats {
  users: UserStats;
  volume: VolumeStats;
  revenue: RevenueStats;
  pending: PendingActions;
  trends: {
    users: TrendDataPoint[];
    volume: TrendDataPoint[];
    trades: TrendDataPoint[];
  };
}

export interface RecentActivity {
  id: string;
  type: "signup" | "trade" | "deposit" | "withdrawal" | "kyc";
  description: string;
  userName: string;
  amount?: number;
  timestamp: string;
}


