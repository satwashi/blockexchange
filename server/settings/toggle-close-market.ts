"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { getServerSession } from "../user/users";
import { TradingConfig } from "@/types/settings";

export default async function toggleCloseMarket(
  config: TradingConfig
): Promise<TradingConfig> {
  const { isAdmin } = await getServerSession();

  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabaseAdmin
    .from("settings")
    .update({ config })
    .eq("name", "trading_config")
    .select("config")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to update");
  }

  return data.config as TradingConfig;
}
