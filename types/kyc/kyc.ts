export type KycStatus = "pending" | "verified" | "rejected";

export interface Kyc {
  id: string;
  user_id: string;
  full_name: string;
  id_type: string;
  id_file_url: string | null;
  selfie_url: string | null;
  kyc_status: KycStatus;
  id_number: string;
  verified_at: string | null; // ISO date string
  created_at: string; // when the record was created
}
