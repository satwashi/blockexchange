"use client";

import { useQuery } from "@tanstack/react-query";
import supabase from "@/lib/client";
import { KycStatus } from "@/types/kyc/kyc";

type MyKycResponse = {
  kyc_status: KycStatus;
} | null;

async function fetchMyKyc(userId: string): Promise<MyKycResponse> {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("kyc_verifications")
    .select("kyc_status")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    // swallow errors for dropdown; treat as unknown
    return null;
  }
  return data as MyKycResponse;
}

export function useMyKyc(userId: string | undefined) {
  const { data, isLoading } = useQuery({
    queryKey: ["my-kyc", userId],
    queryFn: () => fetchMyKyc(userId ?? ""),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });

  return {
    status: data?.kyc_status ?? null,
    isLoading,
  };
}

