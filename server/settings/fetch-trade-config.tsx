"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { TradingConfig } from "@/types/settings";

const fetchTradingConfig = async (): Promise<TradingConfig | null> => {
  const { data, error } = await supabaseAdmin
    .from("settings")
    .select("config")
    .eq("name", "trading_config")
    .single();

  if (error) {
    console.error("Error fetching trading config:", error);
    return null;
  }

  return data.config;
};

export default fetchTradingConfig;
