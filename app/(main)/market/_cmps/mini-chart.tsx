import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
interface MiniChartProps {
  data: number[];
  isPositive: boolean;
  className?: string;
}
export default function MiniChart({
  data,
  isPositive,
  className,
}: MiniChartProps) {
  const chartData = data.map((value, index) => ({
    index,
    value,
  }));

  const strokeColor = isPositive ? "#22c55e" : "#ef4444";
  const fillColor = isPositive
    ? "url(#positiveGradient)"
    : "url(#negativeGradient)";
  return (
    <div className={cn("h-12 w-24", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          {/* Gradient background */}
          <defs>
            <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            fill={fillColor}
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
