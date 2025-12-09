"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useMemo, useEffect } from "react";

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
import { ArrowDownLeft, Loader2 as WalletIcon, Copy, CheckCircle2, AlertTriangle } from "lucide-react";
import { WalletData } from "./wallet-card";
// import { toast } from "sonner";

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
  wallet?: WalletData; // optional; if not provided, user selects
  wallets?: WalletData[];
  icon?: React.ReactNode;
};

export default function DepositDialog({
  children,
  wallet,
  wallets,
  icon,
}: DepositDialogProps) {
  const initial = wallet ?? wallets?.[0];
  const [selected, setSelected] = useState<WalletData | undefined>(initial);
  const wallet_type = selected?.wallet_type ?? wallet?.wallet_type ?? "";
  const balance = selected?.balance ?? wallet?.balance ?? 0;
  const { initTransaction, isPending } = useInitTransaction();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get available networks from addresses
  const addresses = selected?.addresses ?? wallet?.addresses;
  const availableNetworks = useMemo(() => {
    if (!addresses) return [];
    return Object.keys(addresses);
  }, [addresses]);

  // Default to first network or empty
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");

  // Get the deposit address for selected network
  const depositAddress = useMemo(() => {
    if (!addresses || !selectedNetwork) return null;
    return addresses[selectedNetwork];
  }, [addresses, selectedNetwork]);

  // Update selected network when wallet changes
  useEffect(() => {
    if (availableNetworks.length > 0) {
      setSelectedNetwork(availableNetworks[0]);
    }
  }, [availableNetworks]);

  const handleCopyAddress = async () => {
    if (!depositAddress) return;
    await navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <ArrowDownLeft className="h-5 w-5 text-wallet-success" />
            <span>Deposit {wallet_type}</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Wallet chooser */}
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
                  <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <div className="font-medium text-foreground">{wallet_type}</div>
                <div className="text-sm text-muted-foreground">
                  Balance: {balance.toFixed(4)} {wallet_type}
                </div>
              </div>
            </div>

            {/* Network Selection */}
            {availableNetworks.length > 0 && (
              <div className="space-y-2">
                <FormLabel>Select Network</FormLabel>
                <Select
                  value={selectedNetwork}
                  onValueChange={setSelectedNetwork}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableNetworks.map((network) => (
                      <SelectItem key={network} value={network}>
                        {network}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Deposit Address */}
            {depositAddress && (
              <div className="space-y-2">
                <FormLabel>Deposit Address ({selectedNetwork})</FormLabel>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border">
                  <code className="flex-1 text-sm font-mono break-all text-foreground">
                    {depositAddress}
                  </code>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyAddress}
                    className="shrink-0"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-500">
                    Only send {wallet_type} on the <strong>{selectedNetwork}</strong> network. 
                    Sending on a different network may result in permanent loss of funds.
                  </p>
                </div>
              </div>
            )}

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
              <Button
                type="submit"
                disabled={isPending}
                onClick={() => {
                  // Closing is handled in onSuccess callback below
                }}
              >
                {isPending ? (
                  <>
                    <WalletIcon className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Confirm Deposit</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
