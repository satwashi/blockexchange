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
import { ArrowDownLeft, Loader2 as WalletIcon } from "lucide-react";
import { WalletData } from "./wallet-card";
import { toast } from "sonner";

const depositSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => parseFloat(val) > 0, {
      message: "Amount must be greater than 0",
    }),
  image: z.any().refine((file) => file instanceof File || file?.length > 0, {
    message: "Screenshot is required",
  }),
});

type DepositSchema = z.infer<typeof depositSchema>;

type DepositDialogProps = {
  children: React.ReactNode;
  wallet: WalletData;
  icon: React.ReactNode;
};

export default function DepositDialog({
  children,
  wallet,
  icon,
}: DepositDialogProps) {
  const { wallet_type, balance } = wallet;
  const { initTransaction, isPending } = useInitTransaction();

  const form = useForm<DepositSchema>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: "",
      image: undefined,
    },
  });

  const handleSubmit = (values: DepositSchema) => {
    const { amount, image } = values;
    const formData = new FormData();
    formData.append("wallet_type", wallet_type);
    formData.append("amount", values.amount);
    formData.append("transaction_type", "deposit");
    formData.append("image", values.image[0]); // only first file
    values.image = values.image[0];

    initTransaction(
      {
        wallet_type,
        amount: parseFloat(amount),
        image: image[0],
        transaction_type: "deposit",
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
            <ArrowDownLeft className="h-5 w-5 text-wallet-success" />
            <span>Deposit {wallet.wallet_type}</span>
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
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the amount of {wallet_type} you deposited.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Screenshot Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Screenshot</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload the screenshot of your transaction.
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
                    <>Confirm Deposit</>
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
