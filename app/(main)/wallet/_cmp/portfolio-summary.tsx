"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUserWallets } from "@/queries/wallets/use-user-wallets";
import { DialogTrigger } from "@/components/ui/dialog";
import { useSession } from "@/queries/useSession";
import DepositDialog from "./deposite-dialogue";
import WithdrawDialog from "./withdraw-dialogue";
import { ArrowDownLeft, ArrowUpRight, CandlestickChart } from "lucide-react";

export default function PortfolioSummary() {
  const { id } = useSession();
  const { totalBalance, totalChange24h, wallets } = useUserWallets(id || "");

  const formatUsd = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(val || 0);

  return (
    <Card className="mb-6">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Est. Total Value (USDT)
            </p>
            <div className="text-3xl font-bold">
              {(totalBalance || 0).toFixed(0)}
            </div>
            <p className="text-muted-foreground text-xs">
              ≈ {formatUsd(totalBalance || 0)}
            </p>
            <p className="text-xs mt-2 text-muted-foreground">
              Today&apos;s PNL {0} USDT ({(totalChange24h || 0).toFixed(2)}%)
            </p>
          </div>
          {/* Hidden per user request: Add Funds */}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          {/* Trade */}
          <Button
            asChild
            variant="outline"
            className="h-16 flex-col items-center justify-center gap-2"
          >
            <Link href="/trade">
              <CandlestickChart className="h-5 w-5" />
              <span className="text-xs">Trade</span>
            </Link>
          </Button>

          {/* Withdraw */}
          <WithdrawDialog
            wallets={wallets as any}
            icon={<ArrowUpRight className="h-4 w-4" />}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2"
              >
                <ArrowUpRight className="h-5 w-5" />
                <span className="text-xs">Withdraw</span>
              </Button>
            </DialogTrigger>
          </WithdrawDialog>

          {/* Deposit */}
          <DepositDialog
            wallets={wallets as any}
            icon={<ArrowDownLeft className="h-4 w-4" />}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2"
              >
                <ArrowDownLeft className="h-5 w-5" />
                <span className="text-xs">Deposit</span>
              </Button>
            </DialogTrigger>
          </DepositDialog>
        </div>
      </CardContent>
    </Card>
  );
}
