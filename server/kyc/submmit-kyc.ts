"use server";

import { getServerSession } from "@/server/user/users";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { headers } from "next/headers";
import { auth } from "@/utils/auth";

export interface SubmitKYCParams {
  fullName: string;
  idType: string;
  idNumber: string;
  idPhotoUrl: string;
  selfieUrl: string;
}

export async function submitKYC({
  fullName,
  idType,
  idNumber,
  idPhotoUrl,
  selfieUrl,
}: SubmitKYCParams) {
  const { id: user_id } = await getServerSession();

  if (!user_id) throw new Error("Please login");

  try {
    // Check for recent submissions (48h cooldown)
    const { data: lastKyc, error: checkError } = await supabaseAdmin
      .from("kyc_verifications")
      .select("created_at, kyc_status")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (checkError) throw checkError;

    if (lastKyc) {
      const lastCreated = new Date(lastKyc.created_at).getTime();
      const now = Date.now();
      const COOLDOWN_MS = 48 * 60 * 60 * 1000;

      if (now - lastCreated < COOLDOWN_MS && lastKyc.kyc_status === "pending") {
        return {
          success: false,
          error: "A recent application is already being processed. Please wait 48 hours.",
        };
      }
    }

    // Insert KYC record with the provided URLs
    const { data, error } = await supabaseAdmin
      .from("kyc_verifications")
      .insert({
        user_id,
        full_name: fullName,
        id_type: idType,
        id_number: idNumber,
        id_file_url: idPhotoUrl,
        selfie_url: selfieUrl,
        kyc_status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    await auth.api.updateUser({
      body: {
        kyc_status: "pending",
      },
      headers: await headers(),
    });

    return { success: true, kyc: data };
  } catch (err: unknown) {
    let errorMessage = "Unknown error";

    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (err && typeof err === "object" && "message" in err) {
      errorMessage = String(err.message);
    }

    console.error("KYC submission failed:", {
      error: err,
      errorMessage,
      fullName,
      idType,
      idNumber,
      idPhotoUrl,
      selfieUrl,
      user_id,
    });

    return { success: false, error: errorMessage };
  }
}
