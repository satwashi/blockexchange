import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, Copy, CheckCircle2 } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";

import WithdrawDialog from "./withdraw-dialogue";
import DepositDialog from "./deposite-dialogue";
// import WithdrawDialog from "./withdraw-dialog"; // ✅ new dialog

export interface WalletData {
  id: string;
  wallet_type: string;
  name: string;
  balance: number;
  address?: string;
  change24h?: number;
  icon?: string;
}

interface WalletCardProps {
  wallet: WalletData;
}

export const WalletCard = ({ wallet }: WalletCardProps) => {
  const [copied, setCopied] = useState(false);

  const { wallet_type, balance, address, icon, name } = wallet;

  const handleCopyAddress = async () => {
    if (wallet.address) {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(balance);
  };

  return (
    <Card className="group bg-secondary hover:shadow-card-hover transition-card cursor-pointer border border-border/50">
      <CardContent className="p-6">
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
          {wallet.change24h && (
            <Badge
              variant={wallet.change24h >= 0 ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              <TrendingUp className="w-3 h-3" />
              {wallet.change24h >= 0 ? "+" : ""}
              {wallet.change24h.toFixed(2)}%
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-2xl font-bold text-foreground">
              {formatBalance(balance)} {wallet_type}
            </p>
          </div>

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

          <div className="flex gap-3 pt-2">
            {/* ✅ Deposit Dialog */}
            {/* <DepositeDialogue> */}
            {/* <DialogTrigger asChild> */}

            {/* </DialogTrigger> */}
            {/* </DepositeDialogue> */}

            <DepositDialog
              wallet={wallet}
              icon={
                <img
                  src={icon} // <-- WalletData should provide a valid URL
                  alt={wallet_type}
                  className="h-4 w-4 mr-2"
                />
              }
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="flex-1 hover:shadow-primary transition-smooth"
                >
                  Deposit
                </Button>
              </DialogTrigger>
            </DepositDialog>

            {/* ✅ Withdraw Dialog */}
            <WithdrawDialog
              wallet={wallet}
              icon={
                <img
                  src={icon} // <-- make sure your WalletData has a valid image URL here
                  alt={wallet_type}
                  className="h-4 w-4"
                />
              }
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  Withdraw
                </Button>
              </DialogTrigger>
            </WithdrawDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
