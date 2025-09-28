import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditableField from "./editable-field";
import { TradingConfig, ProfitRange } from "@/types/settings";
import { UseFormSetValue } from "react-hook-form";
import { toast } from "sonner";
import { useUpdateTradingConfig } from "@/queries/settings/useUpdateTradingConfig";

export default function ProfitRanges({
  setValue,
  watchedValues,
}: {
  setValue: UseFormSetValue<TradingConfig>;
  watchedValues: TradingConfig;
}) {
  const { updateConfig } = useUpdateTradingConfig();

  const handleEdit = async (
    index: number,
    key: keyof ProfitRange,
    value: number
  ) => {
    const updatedRanges: ProfitRange[] = (
      watchedValues.profit_ranges || []
    ).map((r, i) => (i === index ? { ...r, [key]: value } : r));

    const newConfig: TradingConfig = {
      ...watchedValues,
      profit_ranges: updatedRanges,
    };

    try {
      await updateConfig(newConfig);
      setValue("profit_ranges", updatedRanges, { shouldDirty: true });
      console.log("Updated profit_ranges:", updatedRanges);
      toast.success(`Profit Range Updated`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update trading config";
      toast.error(message);
    }
  };
  const validateMinMax = (minValue: number, maxValue: number) => {
    if (minValue >= maxValue) {
      return "Min profit must be less than max profit";
    }
    if (minValue < 0 || minValue > 1) {
      return "Profit must be between 0 and 1";
    }
    if (maxValue < 0 || maxValue > 1) {
      return "Profit must be between 0 and 1";
    }
    return undefined;
  };

  // const addProfitRange = () => {
  //   // append(defaultProfitRange);
  //   toast.success("Profit Range added");
  // };
  // placeholder array if none present
  const fields = (watchedValues.profit_ranges || []).map((_, i) => ({
    id: String(i),
  }));
  // const remove = (_index: number) => {};

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-trading">Profit Ranges</CardTitle>
        {/* <Button
          onClick={addProfitRange}
          variant="outline"
          size="sm"
          className="border-profit text-profit hover:bg-profit hover:text-profit-foreground"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Range
        </Button> */}
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((field, index) => {
          const currentRange = watchedValues.profit_ranges?.[index];
          if (!currentRange) return null;

          const validationError = validateMinMax(
            currentRange.min_profit,
            currentRange.max_profit
          );

          return (
            <Card key={field.id} className="border-l-4 border-l-profit/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-semibold text-lg">Range {index + 1}</h4>
                  {/* {fields.length > 1 && (
                    <Button
                      onClick={() => remove(index)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )} */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <EditableField
                    label="Time (seconds)"
                    value={currentRange.time_seconds}
                    type="number"
                    onChange={(value) =>
                      handleEdit(index, "time_seconds", Number(value))
                    }
                  />

                  <EditableField
                    label="Min Profit (0-1)"
                    value={currentRange.min_profit}
                    type="number"
                    onChange={(value) =>
                      handleEdit(index, "min_profit", Number(value))
                    }
                    error={validationError}
                  />

                  <EditableField
                    label="Max Profit (0-1)"
                    value={currentRange.max_profit}
                    type="number"
                    onChange={(value) =>
                      handleEdit(index, "max_profit", Number(value))
                    }
                    error={validationError}
                  />
                </div>

                {currentRange.min_profit && currentRange.max_profit && (
                  <div className="mt-4 p-3 bg-profit/5 rounded-lg border border-profit/20">
                    <div className="text-sm text-profit font-medium">
                      Expected Range:{" "}
                      {(currentRange.min_profit * 100).toFixed(1)}% -{" "}
                      {(currentRange.max_profit * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
