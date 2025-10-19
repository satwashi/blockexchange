// "use client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { useState, useMemo } from "react";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { ArrowUpDown, Loader2, RefreshCw } from "lucide-react";
// import { WalletData } from "./wallet-card";
// import { toast } from "sonner";
// import useCoins from "@/queries/coins/use-coins";
// import { useSession } from "@/queries/useSession";
// import withdrawCrypto from "@/server/wallets/withdraw-crypto";
// import depositCrypto from "@/server/wallets/deposit-crypto";

// const convertSchema = z.object({
//   fromCoin: z.string().min(1, "Source coin is required"),
//   toCoin: z.string().min(1, "Target coin is required"),
//   amount: z.string().min(1, "Amount is required"),
// });

// type ConvertSchema = z.infer<typeof convertSchema>;

// type ConvertDialogProps = {
//   children: React.ReactNode;
//   wallet?: WalletData; // if provided, no selector
//   wallets?: WalletData[]; // used when wallet prop is absent
//   icon?: React.ReactNode;
//   userWallets?: WalletData[]; // for target coin selection
// };

// const SUPPORTED_COINS = ["USDT", "BTC", "ETH", "SOL", "BNB"];

// export default function ConvertDialog({
//   children,
//   wallet,
//   wallets,
//   icon: _icon,
//   userWallets = [],
// }: ConvertDialogProps) {
//   const { id: userId } = useSession();
//   const { coins } = useCoins();
//   const [isConverting, setIsConverting] = useState(false);
//   const [open, setOpen] = useState(false);

//   // Determine the source wallet
//   const initial = wallet ?? wallets?.[0];
//   const [selected, setSelected] = useState<WalletData | undefined>(initial);
//   const sourceWallet = selected ?? wallet;
//   const wallet_type = sourceWallet?.wallet_type ?? "";

//   const form = useForm<ConvertSchema>({
//     resolver: zodResolver(convertSchema),
//     defaultValues: {
//       fromCoin: wallet_type,
//       toCoin: "",
//       amount: "",
//     },
//   });

//   const fromCoin = form.watch("fromCoin");
//   const toCoin = form.watch("toCoin");
//   const amount = form.watch("amount");

//   // Get available target coins (exclude source coin)
//   const availableTargetCoins = useMemo(() => {
//     return SUPPORTED_COINS.filter((coin) => coin !== fromCoin);
//   }, [fromCoin]);

//   // Get user's wallet balance for source coin
//   const currentSourceWallet = useMemo(() => {
//     // If we have a specific wallet (from wallet card), use that
//     if (wallet && wallet.wallet_type === fromCoin) {
//       return wallet;
//     }
//     // Otherwise, find from userWallets
//     return userWallets.find((w) => w.wallet_type === fromCoin);
//   }, [userWallets, fromCoin, wallet]);

//   // Get realtime prices
//   const fromPrice = useMemo(() => {
//     if (!coins || !fromCoin) return 0;
//     const coinData = coins.find((c) => c.symbol === fromCoin);
//     return coinData?.price || 0;
//   }, [coins, fromCoin]);

//   const toPrice = useMemo(() => {
//     if (!coins || !toCoin) return 0;
//     const coinData = coins.find((c) => c.symbol === toCoin);
//     return coinData?.price || 0;
//   }, [coins, toCoin]);

//   // Calculate conversion
//   const convertedAmount = useMemo(() => {
//     if (!amount || !fromPrice || !toPrice) return 0;
//     const amountNum = parseFloat(amount);
//     if (isNaN(amountNum) || amountNum <= 0) return 0;

//     // Convert to USD first, then to target coin
//     const usdValue = amountNum * fromPrice;
//     return usdValue / toPrice;
//   }, [amount, fromPrice, toPrice]);

//   // Check if user has zero balance
//   const hasZeroBalance = useMemo(() => {
//     return currentSourceWallet && currentSourceWallet.balance === 0;
//   }, [currentSourceWallet]);

//   // Get the current wallet balance for display
//   const currentBalance = currentSourceWallet?.balance || 0;

//   // Validation: check if user has sufficient balance
//   const hasInsufficientBalance = useMemo(() => {
//     if (!currentSourceWallet || !amount) return false;
//     const amountNum = parseFloat(amount);
//     return (
//       isNaN(amountNum) ||
//       amountNum <= 0 ||
//       amountNum > currentSourceWallet.balance
//     );
//   }, [currentSourceWallet, amount]);

//   const handleConvert = async (values: ConvertSchema) => {
//     if (!userId) {
//       toast.error("Please log in to convert coins");
//       return;
//     }

//     const { fromCoin, toCoin, amount } = values;
//     const amountNum = parseFloat(amount);

//     // Custom validation
//     if (fromCoin === toCoin) {
//       toast.error("Cannot convert to the same coin");
//       return;
//     }

//     if (isNaN(amountNum) || amountNum <= 0) {
//       toast.error("Amount must be greater than 0");
//       return;
//     }

//     if (hasZeroBalance) {
//       toast.error("Cannot convert - Zero balance");
//       return;
//     }

//     if (amountNum > (currentSourceWallet?.balance || 0)) {
//       console.log("Balance check failed:", {
//         amountNum,
//         currentBalance: currentSourceWallet?.balance,
//         fromCoin,
//         wallet: currentSourceWallet,
//       });
//       toast.error(
//         `Insufficient balance. You have ${
//           currentSourceWallet?.balance || 0
//         } ${fromCoin}`
//       );
//       return;
//     }

//     setIsConverting(true);

//     try {
//       // Step 1: Withdraw from source wallet
//       await withdrawCrypto({
//         user_id: userId,
//         wallet_type: fromCoin,
//         amount: amountNum,
//         type: "withdraw",
//       });

//       // Step 2: Deposit to target wallet
//       await depositCrypto({
//         user_id: userId,
//         wallet_type: toCoin,
//         amount: convertedAmount,
//       });

//       toast.success(
//         `Successfully converted ${amount} ${fromCoin} to ${convertedAmount.toFixed(
//           6
//         )} ${toCoin}`
//       );

//       form.reset();
//       setOpen(false);
//     } catch (error) {
//       console.error("Conversion failed:", error);
//       toast.error(error instanceof Error ? error.message : "Conversion failed");
//     } finally {
//       setIsConverting(false);
//     }
//   };

//   const swapCoins = () => {
//     const currentFrom = form.getValues("fromCoin");
//     const currentTo = form.getValues("toCoin");

//     if (currentTo && SUPPORTED_COINS.includes(currentTo)) {
//       form.setValue("fromCoin", currentTo);
//       form.setValue("toCoin", currentFrom);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       {children}
//       <DialogContent className="sm:max-w-md bg-card border-border">
//         <DialogHeader>
//           <DialogTitle className="flex items-center space-x-2 text-foreground">
//             <ArrowUpDown className="h-5 w-5 text-primary" />
//             <span>Convert {wallet_type}</span>
//           </DialogTitle>
//         </DialogHeader>

//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(handleConvert)}
//             className="space-y-6"
//           >
//             {/* Wallet chooser (only when an explicit wallet is not provided) */}
//             {wallets && wallets.length > 0 && (
//               <div className="space-y-2">
//                 <FormLabel>Choose source asset</FormLabel>
//                 <Select
//                   value={selected?.wallet_type}
//                   onValueChange={(val) => {
//                     const w = wallets.find((w) => w.wallet_type === val);
//                     setSelected(w);
//                     form.setValue("fromCoin", val);
//                   }}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select source asset" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {wallets.map((w) => (
//                       <SelectItem key={w.wallet_type} value={w.wallet_type}>
//                         <div className="flex items-center justify-between w-full">
//                           <div className="flex items-center gap-2">
//                             <img
//                               src={`/crypto/${w.wallet_type.toUpperCase()}.png`}
//                               alt={w.wallet_type}
//                               className="h-4 w-4"
//                             />
//                             <span>{w.wallet_type}</span>
//                           </div>
//                           <span className="text-xs text-muted-foreground ml-2">
//                             {w.balance.toFixed(4)}
//                           </span>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             )}

//             {/* From and To Selection - Side by Side */}
//             <div className="grid grid-cols-2 gap-4">
//               {/* Source Coin Selection */}
//               <FormField
//                 control={form.control}
//                 name="fromCoin"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>From</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select source coin" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {SUPPORTED_COINS.map((coin) => {
//                           const wallet = userWallets.find(
//                             (w) => w.wallet_type === coin
//                           );
//                           return (
//                             <SelectItem
//                               key={coin}
//                               value={coin}
//                               disabled={!wallet}
//                             >
//                               <div className="flex items-center justify-between w-full">
//                                 <div className="flex items-center gap-2">
//                                   <img
//                                     src={`/crypto/${coin.toUpperCase()}.png`}
//                                     alt={coin}
//                                     className="h-4 w-4"
//                                   />
//                                   <span>{coin}</span>
//                                 </div>
//                                 {wallet && (
//                                   <span className="text-xs text-muted-foreground ml-2">
//                                     {wallet.balance.toFixed(4)}
//                                   </span>
//                                 )}
//                               </div>
//                             </SelectItem>
//                           );
//                         })}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Target Coin Selection */}
//               <FormField
//                 control={form.control}
//                 name="toCoin"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>To</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select target coin" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {availableTargetCoins.map((coin) => (
//                           <SelectItem key={coin} value={coin}>
//                             <div className="flex items-center gap-2">
//                               <img
//                                 src={`/crypto/${coin.toUpperCase()}.png`}
//                                 alt={coin}
//                                 className="h-4 w-4"
//                               />
//                               <span>{coin}</span>
//                             </div>
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Swap Button */}
//             <div className="flex justify-center">
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={swapCoins}
//                 className="rounded-full p-2"
//               >
//                 <RefreshCw className="h-4 w-4" />
//               </Button>
//             </div>

//             {/* Wallet Info Display */}
//             {currentSourceWallet && (
//               <div className="p-3 bg-muted/50 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <img
//                       src={`/crypto/${fromCoin.toUpperCase()}.png`}
//                       alt={fromCoin}
//                       className="h-5 w-5"
//                     />
//                     <span className="font-medium">{fromCoin}</span>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-sm font-semibold">
//                       {currentBalance.toFixed(4)} {fromCoin}
//                     </div>
//                     <div className="text-xs text-muted-foreground">
//                       Available
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Zero Balance Warning */}
//             {hasZeroBalance && (
//               <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
//                 <div className="flex items-center gap-2 text-destructive">
//                   <div className="w-2 h-2 bg-destructive rounded-full"></div>
//                   <span className="text-sm font-medium">
//                     Cannot convert - Zero balance
//                   </span>
//                 </div>
//                 <p className="text-xs text-destructive/80 mt-1">
//                   You need to deposit {fromCoin} first before you can convert
//                   it.
//                 </p>
//               </div>
//             )}

//             {/* Amount Input */}
//             <FormField
//               control={form.control}
//               name="amount"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Amount</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       step="0.0001"
//                       placeholder="0.00"
//                       disabled={hasZeroBalance}
//                       {...field}
//                     />
//                   </FormControl>
//                   <div className="flex items-center justify-between">
//                     <FormDescription>
//                       Enter the amount to convert
//                     </FormDescription>
//                     {currentSourceWallet && currentSourceWallet.balance > 0 && (
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         onClick={() =>
//                           form.setValue(
//                             "amount",
//                             currentSourceWallet.balance.toString()
//                           )
//                         }
//                         className="text-primary hover:text-primary/80"
//                       >
//                         Max
//                       </Button>
//                     )}
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Conversion Preview */}
//             {toCoin && amount && convertedAmount > 0 && (
//               <div className="p-4 bg-muted/50 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-muted-foreground">
//                     You will receive:
//                   </span>
//                   <span className="font-semibold">
//                     {convertedAmount.toFixed(6)} {toCoin}
//                   </span>
//                 </div>
//                 {fromPrice > 0 && toPrice > 0 && (
//                   <div className="text-xs text-muted-foreground mt-1">
//                     Rate: 1 {fromCoin} = {(toPrice / fromPrice).toFixed(6)}{" "}
//                     {toCoin}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Error Messages */}
//             {hasInsufficientBalance && !hasZeroBalance && (
//               <div className="text-sm text-destructive">
//                 Insufficient balance. You have{" "}
//                 {currentSourceWallet?.balance.toFixed(4)} {fromCoin}
//               </div>
//             )}

//             {/* Actions */}
//             <DialogFooter className="space-x-2">
//               <Button
//                 type="submit"
//                 disabled={isConverting || !toCoin || hasZeroBalance}
//               >
//                 {isConverting ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     Converting...
//                   </>
//                 ) : hasZeroBalance ? (
//                   <>Cannot Convert - Zero Balance</>
//                 ) : (
//                   <>Confirm Convert</>
//                 )}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState, useMemo } from "react";

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

import { ArrowUpDown, Loader2, RefreshCw } from "lucide-react";
import { WalletData } from "./wallet-card";
import { toast } from "sonner";
import useCoins from "@/queries/coins/use-coins";
import { useSession } from "@/queries/useSession";
import withdrawCrypto from "@/server/wallets/withdraw-crypto";
import depositCrypto from "@/server/wallets/deposit-crypto";
import {
  decimalMul,
  decimalDiv,
  formatDecimal,
} from "@/utils/crypto/arthimetic";
import { queryClient } from "@/providers/query-provider";

const convertSchema = z.object({
  fromCoin: z.string().min(1, "Source coin is required"),
  toCoin: z.string().min(1, "Target coin is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be greater than 0",
    }),
});

type ConvertSchema = z.infer<typeof convertSchema>;

type ConvertDialogProps = {
  children: React.ReactNode;
  wallet?: WalletData; // if provided, no selector
  wallets?: WalletData[]; // used when wallet prop is absent
  icon?: React.ReactNode;
  userWallets?: WalletData[]; // for target coin selection
};

const SUPPORTED_COINS = ["USDT", "BTC", "ETH", "SOL", "BNB"];

export default function ConvertDialog({
  children,
  wallet,
  wallets,
  icon: _icon,
  userWallets = [],
}: ConvertDialogProps) {
  const { id: userId } = useSession();
  const { coins } = useCoins();
  const [isConverting, setIsConverting] = useState(false);
  const [open, setOpen] = useState(false);

  // Determine the source wallet
  const initial = wallet ?? wallets?.[0];
  const [selected, setSelected] = useState<WalletData | undefined>(initial);
  const sourceWallet = selected ?? wallet;
  const wallet_type = sourceWallet?.wallet_type ?? "";

  const form = useForm<ConvertSchema>({
    resolver: zodResolver(convertSchema),
    defaultValues: {
      fromCoin: wallet_type,
      toCoin: "",
      amount: "",
    },
  });

  const fromCoin = form.watch("fromCoin");
  const toCoin = form.watch("toCoin");
  const amount = form.watch("amount");

  // Update form when wallet changes
  React.useEffect(() => {
    if (wallet_type) {
      form.setValue("fromCoin", wallet_type);
    }
  }, [wallet_type, form]);

  // Update selected when fromCoin changes (for wallet selection)
  React.useEffect(() => {
    if (!wallet && fromCoin) {
      const walletList = wallets || [];
      const foundWallet = walletList.find((w) => w.wallet_type === fromCoin);
      if (foundWallet) {
        setSelected(foundWallet);
      }
    }
  }, [fromCoin, wallet, wallets]);

  // Get available target coins (exclude source coin)
  const availableTargetCoins = useMemo(() => {
    return SUPPORTED_COINS.filter((coin) => coin !== fromCoin);
  }, [fromCoin]);

  // Get user's wallet balance for source coin
  const currentSourceWallet = useMemo(() => {
    // If we have a specific wallet (from wallet card), use that
    if (wallet && wallet.wallet_type === fromCoin) {
      return wallet;
    }
    // Otherwise, find from the appropriate wallet list
    const walletList = wallet ? userWallets : wallets || [];
    return walletList.find((w) => w.wallet_type === fromCoin);
  }, [userWallets, wallets, fromCoin, wallet]);

  // Get realtime prices
  const fromPrice = useMemo(() => {
    if (!coins || !fromCoin) return 0;
    const coinData = coins.find((c) => c.symbol === fromCoin);
    let price = coinData?.price || 0;

    // Fallback for USDT if price is 0 or not found
    if (fromCoin === "USDT" && price === 0) {
      price = 1; // USDT is typically pegged to $1
      console.log(
        "Applied USDT fallback price for fromCoin:",
        fromCoin,
        "price:",
        price
      );
    }

    console.log("From price debug:", {
      fromCoin,
      coinData,
      price,
      allCoins: coins.map((c) => ({ symbol: c.symbol, price: c.price })),
    });

    return price;
  }, [coins, fromCoin]);

  const toPrice = useMemo(() => {
    if (!coins || !toCoin) return 0;
    const coinData = coins.find((c) => c.symbol === toCoin);
    let price = coinData?.price || 0;

    // Fallback for USDT if price is 0 or not found
    if (toCoin === "USDT" && price === 0) {
      price = 1; // USDT is typically pegged to $1
      console.log(
        "Applied USDT fallback price for toCoin:",
        toCoin,
        "price:",
        price
      );
    }

    console.log("To price debug:", {
      toCoin,
      coinData,
      price,
      allCoins: coins.map((c) => ({ symbol: c.symbol, price: c.price })),
    });

    return price;
  }, [coins, toCoin]);

  // Calculate conversion
  const convertedAmount = useMemo(() => {
    if (!amount) return 0;
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return 0;

    // Handle USDT case - if both coins are USDT, return the same amount
    if (fromCoin === toCoin) return amountNum;

    // If converting to USDT and we have a valid fromPrice, use direct conversion
    if (toCoin === "USDT" && fromPrice > 0) {
      const usdValue = decimalMul(amountNum, fromPrice).toNumber();
      console.log("USDT conversion debug:", {
        fromCoin,
        toCoin,
        amount,
        amountNum,
        fromPrice,
        usdValue,
      });
      return usdValue;
    }

    // If converting from USDT and we have a valid toPrice, use direct conversion
    if (fromCoin === "USDT" && toPrice > 0) {
      const result = decimalDiv(amountNum, toPrice).toNumber();
      console.log("From USDT conversion debug:", {
        fromCoin,
        toCoin,
        amount,
        amountNum,
        toPrice,
        result,
      });
      return result;
    }

    // Standard conversion: convert to USD first, then to target coin
    if (fromPrice > 0 && toPrice > 0) {
      const usdValue = decimalMul(amountNum, fromPrice);
      const result = decimalDiv(usdValue, toPrice).toNumber();

      console.log("Standard conversion debug:", {
        fromCoin,
        toCoin,
        amount,
        amountNum,
        fromPrice,
        toPrice,
        usdValue: usdValue.toString(),
        result,
        rate: decimalDiv(fromPrice, toPrice).toNumber(),
        expectedRate: `1 ${fromCoin} should equal approximately ${formatDecimal(
          decimalDiv(fromPrice, toPrice),
          8
        )} ${toCoin}`,
      });

      return result;
    }

    console.log("Conversion failed - missing prices:", {
      fromCoin,
      toCoin,
      fromPrice,
      toPrice,
    });

    return 0;
  }, [amount, fromPrice, toPrice, fromCoin, toCoin]);

  // Check if user has zero balance
  const hasZeroBalance = useMemo(() => {
    return currentSourceWallet && currentSourceWallet.balance === 0;
  }, [currentSourceWallet]);

  // Get the current wallet balance for display
  const currentBalance = currentSourceWallet?.balance || 0;

  // Validation: check if user has sufficient balance
  const hasInsufficientBalance = useMemo(() => {
    if (!currentSourceWallet || !amount) return false;
    const amountNum = parseFloat(amount);
    return (
      isNaN(amountNum) ||
      amountNum <= 0 ||
      amountNum > currentSourceWallet.balance
    );
  }, [currentSourceWallet, amount]);

  // Check if conversion is valid
  const isValidConversion = useMemo(() => {
    if (!amount || !fromCoin || !toCoin) return false;
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return false;

    // If converting to the same coin, it's always valid
    if (fromCoin === toCoin) return true;

    // If converting to USDT, only need fromPrice
    if (toCoin === "USDT") return fromPrice > 0;

    // If converting from USDT, only need toPrice
    if (fromCoin === "USDT") return toPrice > 0;

    // For other conversions, need both prices and valid converted amount
    return convertedAmount > 0 && fromPrice > 0 && toPrice > 0;
  }, [convertedAmount, fromPrice, toPrice, amount, fromCoin, toCoin]);

  const handleConvert = async (values: ConvertSchema) => {
    if (!userId) {
      toast.error("Please log in to convert coins");
      return;
    }

    const { fromCoin, toCoin, amount } = values;
    const amountNum = parseFloat(amount);

    // Custom validation
    if (fromCoin === toCoin) {
      toast.error("Cannot convert to the same coin");
      return;
    }

    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    if (hasZeroBalance) {
      toast.error("Cannot convert - Zero balance");
      return;
    }

    if (amountNum > (currentSourceWallet?.balance || 0)) {
      toast.error(
        `Insufficient balance. You have ${
          currentSourceWallet?.balance || 0
        } ${fromCoin}`
      );
      return;
    }

    // Check if converted amount is valid
    if (!isValidConversion || convertedAmount <= 0) {
      console.error("Invalid conversion:", {
        convertedAmount,
        fromPrice,
        toPrice,
        amountNum,
      });
      toast.error("Invalid conversion rate - please try again");
      return;
    }

    // Check for very small amounts
    if (convertedAmount < 0.00000001) {
      toast.error("Conversion amount is too small");
      return;
    }

    console.log("Conversion details:", {
      withdrawAmount: amountNum,
      depositAmount: convertedAmount,
      fromCoin,
      toCoin,
      fromPrice,
      toPrice,
      conversionRate: toPrice / fromPrice,
    });

    setIsConverting(true);

    try {
      // Step 1: Withdraw from source wallet
      const withdrawResult = await withdrawCrypto({
        user_id: userId,
        wallet_type: fromCoin,
        amount: amountNum,
        type: "withdraw",
      });

      console.log("Withdraw result:", withdrawResult);

      // Step 2: Deposit to target wallet
      const depositResult = await depositCrypto({
        user_id: userId,
        wallet_type: toCoin,
        amount: convertedAmount,
      });

      console.log("Deposit result:", depositResult);

      toast.success(
        `Successfully converted ${amountNum} ${fromCoin} to ${convertedAmount.toFixed(
          8
        )} ${toCoin}`
      );
      queryClient.invalidateQueries({ queryKey: ["user_wallets", userId] });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Conversion failed:", error);
      toast.error(error instanceof Error ? error.message : "Conversion failed");
    } finally {
      setIsConverting(false);
    }
  };

  const swapCoins = () => {
    const currentFrom = form.getValues("fromCoin");
    const currentTo = form.getValues("toCoin");

    if (currentTo && SUPPORTED_COINS.includes(currentTo)) {
      form.setValue("fromCoin", currentTo);
      form.setValue("toCoin", currentFrom);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      // Reset form when dialog opens
      const initialWallet = wallet ?? wallets?.[0];
      const initialWalletType = initialWallet?.wallet_type ?? "";
      form.reset({
        fromCoin: initialWalletType,
        toCoin: "",
        amount: "",
      });
      setSelected(initialWallet);
    } else {
      // Reset form when dialog closes
      setTimeout(() => {
        const initialWallet = wallet ?? wallets?.[0];
        const initialWalletType = initialWallet?.wallet_type ?? "";
        form.reset({
          fromCoin: initialWalletType,
          toCoin: "",
          amount: "",
        });
        setSelected(initialWallet);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children}
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-foreground">
            <ArrowUpDown className="h-5 w-5 text-primary" />
            <span>Convert {wallet_type}</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleConvert)}
            className="space-y-6"
            noValidate
          >
            {/* From and To Selection - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Source Coin Selection */}
              <FormField
                control={form.control}
                name="fromCoin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!!wallet} // Disable when wallet prop is provided
                    >
                      <FormControl>
                        <SelectTrigger className={wallet ? "opacity-60" : ""}>
                          <SelectValue placeholder="Select source coin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SUPPORTED_COINS.map((coin) => {
                          // Use wallets array if no wallet prop, otherwise use userWallets
                          const walletList = wallet
                            ? userWallets
                            : wallets || [];
                          const walletData = walletList.find(
                            (w) => w.wallet_type === coin
                          );
                          return (
                            <SelectItem
                              key={coin}
                              value={coin}
                              disabled={!walletData}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={`/crypto/${coin.toUpperCase()}.png`}
                                    alt={coin}
                                    className="h-4 w-4"
                                  />
                                  <span>{coin}</span>
                                </div>
                                {walletData && (
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {formatDecimal(walletData.balance, 4)}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Target Coin Selection */}
              <FormField
                control={form.control}
                name="toCoin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target coin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTargetCoins.map((coin) => (
                          <SelectItem key={coin} value={coin}>
                            <div className="flex items-center gap-2">
                              <img
                                src={`/crypto/${coin.toUpperCase()}.png`}
                                alt={coin}
                                className="h-4 w-4"
                              />
                              <span>{coin}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={swapCoins}
                className="rounded-full p-2"
                aria-label="Swap source and target currencies"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {/* Wallet Info Display */}
            {currentSourceWallet && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={`/crypto/${fromCoin.toUpperCase()}.png`}
                      alt={fromCoin}
                      className="h-5 w-5"
                    />
                    <span className="font-medium">{fromCoin}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {formatDecimal(currentBalance, 4)} {fromCoin}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Available
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Zero Balance Warning */}
            {hasZeroBalance && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 text-destructive">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <span className="text-sm font-medium">
                    Cannot convert - Zero balance
                  </span>
                </div>
                <p className="text-xs text-destructive/80 mt-1">
                  You need to deposit {fromCoin} first before you can convert
                  it.
                </p>
              </div>
            )}

            {/* Amount Input */}
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
                      placeholder="0.00"
                      disabled={hasZeroBalance}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormDescription>
                      Enter the amount to convert
                    </FormDescription>
                    {currentSourceWallet && currentSourceWallet.balance > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          form.setValue(
                            "amount",
                            currentSourceWallet.balance.toString()
                          )
                        }
                        className="text-primary hover:text-primary/80"
                      >
                        Max
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conversion Preview */}
            {toCoin && amount && convertedAmount > 0 && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    You will receive:
                  </span>
                  <span className="font-semibold">
                    {convertedAmount < 0.001
                      ? formatDecimal(convertedAmount, 8)
                      : formatDecimal(convertedAmount, 6)}{" "}
                    {toCoin}
                  </span>
                </div>
                {fromPrice > 0 && toPrice > 0 && fromCoin !== toCoin && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Rate: 1 {fromCoin} ={" "}
                    {formatDecimal(decimalDiv(fromPrice, toPrice), 8)} {toCoin}
                    {/* <div className="text-xs text-red-500 mt-1">
                      Debug: {fromCoin} price: ${formatDecimal(fromPrice, 2)},{" "}
                      {toCoin} price: ${formatDecimal(toPrice, 2)}
                    </div> */}
                  </div>
                )}
                {fromCoin === toCoin && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Same currency - 1:1 conversion
                  </div>
                )}
              </div>
            )}

            {/* Price Loading State */}
            {(!coins || coins.length === 0) && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-600">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-sm">Loading current prices...</span>
                </div>
              </div>
            )}

            {/* Error Messages */}
            {hasInsufficientBalance && !hasZeroBalance && (
              <div className="text-sm text-destructive">
                Insufficient balance. You have{" "}
                {formatDecimal(currentSourceWallet?.balance || 0, 4)} {fromCoin}
              </div>
            )}

            {/* Actions */}
            <DialogFooter className="space-x-2">
              <Button
                type="submit"
                disabled={
                  isConverting ||
                  !toCoin ||
                  !amount ||
                  hasZeroBalance ||
                  hasInsufficientBalance ||
                  !isValidConversion
                }
              >
                {isConverting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : hasZeroBalance ? (
                  <>Cannot Convert - Zero Balance</>
                ) : hasInsufficientBalance ? (
                  <>Insufficient Balance</>
                ) : !isValidConversion ? (
                  <>Check Conversion</>
                ) : (
                  <>Confirm Convert</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
