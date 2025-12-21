"use client";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import supabase from "@/lib/client";

import { KycWithUser } from "@/types/kyc/kyc";
import { getKycs } from "@/server/kyc/get-kycs";

export const useKycs = () => {
  const queryClient = useQueryClient();
  const {
    data: kycs,
    isLoading,
    error,
  } = useQuery<KycWithUser[]>({
    queryKey: ["kycs"],
    queryFn: getKycs, // no need to unwrap
  });

  useEffect(() => {
    const channel = supabase
      .channel("kycs-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "kyc_verifications",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["all-kycs"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    kycs: kycs ?? [],
    isLoading,
    error,
  };
};
