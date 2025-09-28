"use client";
import { useForm } from "react-hook-form";
import { TradingConfig } from "@/types/settings";
import { useSetting } from "@/queries/settings/useSettings";
import MarketClose from "./_cmps/skeletons/market-close";
import ProfitRanges from "./_cmps/skeletons/profit-ranges";
import { useEffect } from "react";

const Page = () => {
  const { config, isLoading, error } = useSetting();

  const { watch, setValue, reset } = useForm<TradingConfig>({
    mode: "onChange",
  });

  useEffect(() => {
    if (config) {
      reset(config);
    }
  }, [config, reset]);

  if (isLoading) return <>Loading</>;
  if (error || !config) return <>Error</>;

  return (
    <div className="w-full mt-[100px] px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
      </div>

      <MarketClose config={config} />

      <ProfitRanges setValue={setValue} watchedValues={watch()} />
    </div>
  );
};

export default Page;
