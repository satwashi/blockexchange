"use server";

import { getServerSession } from "../user/users";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { headers } from "next/headers";
import { auth } from "@/utils/auth";

export interface SubmitKYCParams {
  fullName: string;
  idType: string;
  idNumber: string;
  idPhoto: File;
  selfie: File;
}

export async function submitKYC({
  fullName,
  idType,
  idNumber,
  idPhoto,
  selfie,
}: SubmitKYCParams) {
  const { id: user_id } = await getServerSession();

  if (!user_id) throw new Error("Please login");

  try {
    // Upload ID photo
    const idPhotoFileName = `${user_id}_id_${Date.now()}`;
    const { data: idPhotoData, error: idPhotoError } =
      await supabaseAdmin.storage
        .from("kyc_documents")
        .upload(idPhotoFileName, idPhoto);

    if (idPhotoError) throw idPhotoError;

    const idPhotoUrl = supabaseAdmin.storage
      .from("kyc_documents")
      .getPublicUrl(idPhotoData.path).data.publicUrl;

    // Upload Selfie
    const selfieFileName = `${user_id}_selfie_${Date.now()}`;
    const { data: selfieData, error: selfieError } = await supabaseAdmin.storage
      .from("kyc_documents")
      .upload(selfieFileName, selfie);

    if (selfieError) throw selfieError;

    const selfieUrl = supabaseAdmin.storage
      .from("kyc_documents")
      .getPublicUrl(selfieData.path).data.publicUrl;

    // Insert KYC record
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
