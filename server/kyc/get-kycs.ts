"use server";

import supabaseAdmin from "@/lib/supabaseAdmin";
import { Kyc } from "@/types/kyc/kyc";

export async function getKycs(): Promise<Kyc[]> {
  const { data, error } = await supabaseAdmin
    .from("kyc_verifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching KYCs:", error.message);
    throw new Error("Failed to fetch KYCs");
  }

  return data as Kyc[];
}
