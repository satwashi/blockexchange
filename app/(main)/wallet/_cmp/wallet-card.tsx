import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  TrendingUp,
  Copy,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowUpDown,
} from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";

import WithdrawDialog from "./withdraw-dialogue";
import DepositDialog from "./deposite-dialogue";
import ConvertDialog from "./convert-dialogue";

export interface WalletData {
  id: string;
  wallet_type: string;
  name: string;
  balance: number;
  address?: string;
  change24h?: number; // 24 h % change
  icon?: string;
}

interface WalletCardProps {
  wallet: WalletData;
  userWallets?: WalletData[];
}

export const WalletCard = ({ wallet, userWallets = [] }: WalletCardProps) => {
  const [copied, setCopied] = useState(false);
  const { wallet_type, balance, address, icon, name, change24h } = wallet;

  const handleCopyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 8)}...${addr.slice(-6)}`;

  const formatBalance = (val: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(val);

  return (
    <Card className="group bg-secondary hover:shadow-card-hover transition-card cursor-pointer border border-border/50">
      <CardContent className="p-6">
        {/* Header: icon + name + 24 h change */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-primary">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                {wallet_type}
              </h3>
              <p className="text-muted-foreground text-sm">{name}</p>
            </div>
          </div>

          {change24h !== undefined && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                change24h >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              {change24h >= 0 ? "+" : ""}
              {change24h.toFixed(2)}%
              <span className="ml-1 text-[10px] opacity-75">24 h</span>
            </div>
          )}
        </div>

        {/* Balance */}
        <div className="space-y-3">
          <p className="text-2xl font-bold text-foreground">
            {formatBalance(balance)} {wallet_type}
          </p>

          {/* Address + copy button */}
          {address && (
            <div className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Address</p>
                <p className="font-mono text-sm text-foreground">
                  {formatAddress(address)}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyAddress}
                className="shrink-0 ml-2"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}

          {/* Deposit, Withdraw & Convert actions */}
          <div className="flex gap-2 pt-2">
            <DepositDialog
              wallet={wallet}
              icon={
                <img src={icon} alt={wallet_type} className="h-4 w-4 mr-2" />
              }
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="flex-1 hover:shadow-primary transition-smooth"
                >
                  <ArrowDownLeft className="h-4 w-4 mr-2" />
                  Deposit
                </Button>
              </DialogTrigger>
            </DepositDialog>

            <WithdrawDialog
              wallet={wallet}
              icon={<img src={icon} alt={wallet_type} className="h-4 w-4" />}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </DialogTrigger>
            </WithdrawDialog>

            <ConvertDialog
              wallet={wallet}
              userWallets={userWallets}
              icon={<img src={icon} alt={wallet_type} className="h-4 w-4" />}
            >
              <DialogTrigger asChild>
                <Button size="sm" className="flex-1">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Swap
                </Button>
              </DialogTrigger>
            </ConvertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
