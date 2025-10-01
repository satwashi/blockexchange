"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useInitTransaction from "@/queries/transactions/use-init-transcation";
import { useSession } from "@/queries/useSession";
import type { KycStatus } from "@/types/kyc/kyc";
import { toast } from "sonner";
import { ArrowUpRight, Loader2 as WalletIcon } from "lucide-react";
import { WalletData } from "./wallet-card";

const withdrawSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => parseFloat(val) > 0, {
      message: "Amount must be greater than 0",
    }),
  address: z.string().min(10, {
    message: "Destination address must be at least 10 characters.",
  }),
});

type WithdrawSchema = z.infer<typeof withdrawSchema>;

type WithdrawDialogProps = {
  children: React.ReactNode;
  wallet?: WalletData; // if provided, no selector
  wallets?: WalletData[]; // used when wallet prop is absent
  icon?: React.ReactNode;
};

export default function WithdrawDialog({
  children,
  wallet,
  wallets,
  icon,
}: WithdrawDialogProps) {
  const [open, setOpen] = useState(false);
  const { user } = useSession();
  const initial = wallet ?? wallets?.[0];
  const [selected, setSelected] = useState<WalletData | undefined>(initial);
  const wallet_type = selected?.wallet_type ?? wallet?.wallet_type ?? "";
  const balance = selected?.balance ?? wallet?.balance ?? 0;
  const { initTransaction, isPending } = useInitTransaction();
  const [withdrawPassword, setWithdrawPassword] = useState("");

  const form = useForm<WithdrawSchema>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: "",
      address: "",
    },
  });

  const handleSubmit = (values: WithdrawSchema) => {
    const status = (user?.kyc_status as KycStatus | undefined) ?? "pending";
    const isVerified = status === "verified";
    if (!isVerified) {
      toast.error("KYC not verified. Withdrawals are disabled.");
      return;
    }
    if (!user?.withdrawal_password) {
      toast.error("No withdrawal password set.");
      return;
    }
    if (withdrawPassword !== user.withdrawal_password) {
      toast.error("Incorrect withdrawal password.");
      return;
    }
    initTransaction(
      {
        wallet_type,
        amount: parseFloat(values.amount),
        transaction_type: "withdraw",
        address: values.address,
      },
      {
        onSuccess: () => {
          form.reset();
          setWithdrawPassword("");
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className="sm:max-w-md bg-card border-border max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-foreground">
            <ArrowUpRight className="h-5 w-5 text-wallet-warning" />
            <span>Withdraw {wallet_type}</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Wallet chooser (only when an explicit wallet is not provided) */}
            {wallets && wallets.length > 0 && (
              <div className="space-y-2">
                <FormLabel>Choose asset</FormLabel>
                <Select
                  value={selected?.wallet_type}
                  onValueChange={(val) => {
                    const w = wallets.find((w) => w.wallet_type === val);
                    setSelected(w);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallets.map((w) => (
                      <SelectItem key={w.wallet_type} value={w.wallet_type}>
                        {w.wallet_type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Wallet Info */}
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-background">
                {wallet_type ? (
                  <img
                    src={`/crypto/${wallet_type.toUpperCase()}.png`}
                    alt={wallet_type}
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <div className="font-medium text-foreground">{wallet_type}</div>
                <div className="text-sm text-muted-foreground">
                  Balance: {balance.toFixed(4)} {wallet_type}
                </div>
              </div>
            </div>

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.0001"
                      min="0"
                      max={balance}
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the amount of {wallet_type} to withdraw.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => form.setValue("amount", balance.toString())}
              className="text-wallet-primary hover:text-wallet-primary/80"
            >
              Max: {balance.toFixed(4)}
            </Button>

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination Address</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter wallet address..."
                      className="font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Make sure the address is correct. Transactions cannot be
                    reversed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Withdrawal password */}
            <div className="space-y-2">
              <FormLabel>Withdrawal password</FormLabel>
              <Input
                type="password"
                value={withdrawPassword}
                onChange={(e) => setWithdrawPassword(e.target.value)}
              />
            </div>

            {/* Actions */}
            <DialogFooter className="space-x-2">
              <Button
                type="submit"
                disabled={isPending}
                onClick={() => {
                  // Close handled after onSuccess
                }}
              >
                {isPending ? (
                  <>
                    <WalletIcon className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Confirm Withdrawal</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
