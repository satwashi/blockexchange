"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { getServerSession } from "@/server/user/users";
import { Kyc } from "@/types/kyc/kyc";
import crypto from "crypto";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export async function changeKycStatus(kyc: Kyc) {
  // ✅ 1. Check if current user is admin
  const { isAdmin } = await getServerSession();
  if (!isAdmin) throw new Error("Unauthorized Access!");

  const { id, kyc_status, user_id } = kyc;

  try {
    // ✅ 2. Update the KYC record in Supabase
    const { data: kycData, error: supabaseError } = await supabaseAdmin
      .from("kyc_verifications")
      .update({ kyc_status })
      .eq("id", id)
      .select()
      .single();

    if (supabaseError) throw supabaseError;

    // ✅ 3. Generate a secure withdrawal password
    const withdrawalPassword = crypto.randomBytes(8).toString("hex"); // 16-character hex string

    // ✅ 4. Update the user in Better Auth using adminUpdateUser

    const updatedUser = await auth.api.adminUpdateUser({
      body: {
        userId: user_id,
        data: {
          kyc_status, // exact field name from your additionalFields
          withdrawal_password: withdrawalPassword,
        },
      },
      headers: await headers(), // required for server-side admin auth
    });

    // ✅ 5. Return results
    return {
      success: true,
      kyc: kycData,
      withdrawalPassword, // optionally show/send to user
    };
  } catch (err: any) {
    console.error("❌ Error updating KYC status:", err);
    throw new Error(err.message || "Error while updating KYC");
  }
}
