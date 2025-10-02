"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { useSetting } from "@/queries/settings/useSettings";
import { useTrade } from "@/queries/trade/useTrade";
import { NewOrder } from "@/types/order";
import { ProfitRange } from "@/types/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// --- Zod schema ---
// export const formSchema = z.object({
//   time: z
//     .string({ required_error: "Please select a time." })
//     .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
//       message: "Time must be a valid positive number",
//     }),
//   amount: z
//     .number({ required_error: "Please enter amount." })
//     .gt(0, { message: "Amount must be greater than 0." }),
//   side: z.enum(["LONG", "SHORT"]),
// });

export const formSchema = z.object({
  time: z.number({ required_error: "Please select a time." }).positive(),
  amount: z
    .number({ required_error: "Please enter amount." })
    .gt(0, { message: "Amount must be greater than 0." }),
  side: z.enum(["LONG", "SHORT"]), // required
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  time: 0,
  amount: 0,
  side: "LONG",
};

// --- Trading form ---
export default function TradingForm({ symbol }: { symbol: string }) {
  const { isLoading, timeSeconds, profit_ranges, error, close_market } =
    useSetting();
  const { isTrading, trade } = useTrade();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  if (isLoading) return <>Loading</>;
  if (error) return <>Error</>;
  function onSubmit(data: FormValues) {
    const profit_range = profit_ranges?.find(
      (profit: ProfitRange) => profit.time_seconds === data.time
    );

    if (!profit_range) {
      throw new Error(`No profit range found for time: ${data.time}`);
    }

    const { time, amount, side } = data;
    const order: NewOrder = {
      time: time.toString(),
      amount,
      side,
      symbol: `${symbol.toUpperCase()}-USDT`,
      status: "OPEN",
      profit_range: `${profit_range.min_profit}-${profit_range.max_profit}`,
      on_market: !close_market,
    };

    trade(order);
    form.reset(defaultValues);
  }
  function handleTrade(tradeType: "SHORT" | "LONG") {
    form.setValue("side", tradeType);
    form.handleSubmit(onSubmit)();
  }

  return (
    <div className="w-full md:flex-[1] flex flex-col gap-4">
      <Form {...form}>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            {/* Time field */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <Select
                    disabled={isTrading}
                    onValueChange={(val) => field.onChange(Number(val))} // ensure number
                    value={String(field.value)} // string only for UI
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSeconds.map((value) => (
                        <SelectItem key={value} value={String(value)}>
                          {value < 60 ? `${value}s` : `${value / 60}m`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount field */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isTrading}
                      type="number"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        field.onChange(
                          isNaN(value) ? 0.01 : Math.max(0.01, value)
                        );
                      }}
                      className="w-full text-center"
                      placeholder="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              disabled={isTrading}
              className="bg-green-600 hover:bg-green-500 text-white w-full"
              onClick={() => handleTrade("LONG")}
            >
              Go Long
            </Button>
            <Button
              variant="destructive"
              disabled={isTrading}
              onClick={() => handleTrade("SHORT")}
            >
              Go Short
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
