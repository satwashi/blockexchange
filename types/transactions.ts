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

export interface InitTransactionParams {
  wallet_type: string;
  amount: number;
  transaction_type: TransactionType;
  address?: string;
  image?: string;
}
