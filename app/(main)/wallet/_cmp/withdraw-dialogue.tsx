"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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

import useInitTransaction from "@/queries/transactions/use-init-transcation";
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
  wallet: WalletData;
  icon: React.ReactNode;
};

export default function WithdrawDialog({
  children,
  wallet,
  icon,
}: WithdrawDialogProps) {
  const { wallet_type, balance } = wallet;
  const { initTransaction, isPending } = useInitTransaction();

  const form = useForm<WithdrawSchema>({
    resolver: zodResolver(withdrawSchema),
  });

  const handleSubmit = (values: WithdrawSchema) => {
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
        },
      }
    );
  };

  return (
    <Dialog>
      {children}
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-foreground">
            <ArrowUpRight className="h-5 w-5 text-wallet-warning" />
            <span>Withdraw {wallet.wallet_type}</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Wallet Info */}
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-wallet-gradient rounded-full flex items-center justify-center font-bold text-white text-sm">
                {icon}
              </div>
              <div>
                <div className="font-medium text-foreground">{wallet_type}</div>
                <div className="text-sm text-muted-foreground">
                  Balance: {wallet.balance.toFixed(4)} {wallet_type}
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

            {/* Actions */}
            <DialogFooter className="space-x-2">
              <DialogClose asChild>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <WalletIcon className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Confirm Withdrawal</>
                  )}
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
