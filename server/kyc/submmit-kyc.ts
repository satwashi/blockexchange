"use server";

import { getServerSession } from "../user/users";
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
  } catch (err: any) {
    console.error("KYC submission failed:", err.message);
    return { success: false, error: err.message };
  }
}
