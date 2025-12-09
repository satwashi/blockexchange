export type TransactionStatus = "pending" | "verified" | "failed";
export type TransactionType = "deposit" | "withdraw";

export interface Transaction {
  id: string;
  user_id: string;
  wallet_type: string;
  amount: number;
  transaction_type: TransactionType;
  status: TransactionStatus;
  created_at: string;
  verified_at?: string | null;
  address?: string;
  image?: string;
}

// User info for admin views (users table only has id and name)
export interface UserInfo {
  id: string;
  name: string;
}

// Transaction with user info for admin dashboard
export interface TransactionWithUser extends Transaction {
  user?: UserInfo | null;
}

export interface InitTransactionParams {
  wallet_type: string;
  amount: number;
  transaction_type: TransactionType;
  address?: string;
  image?: string;
}
