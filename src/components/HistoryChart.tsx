import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataPoint {
  time: string;
  value: number;
}

interface HistoryChartProps {
  data: DataPoint[];
  title?: string;
  color?: "safe" | "warning" | "danger";
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 text-sm">
        <p className="text-muted-foreground">{label}</p>
        <p className="text-foreground font-semibold">
          {payload[0].value} ppm
        </p>
      </div>
    );
  }
  return null;
};

const HistoryChart = ({
  data,
  title = "24h Trend",
  color = "safe",
}: HistoryChartProps) => {
  const gradientColors = {
    safe: { start: "#22c55e", end: "#22c55e00" },
    warning: { start: "#eab308", end: "#eab30800" },
    danger: { start: "#ef4444", end: "#ef444400" },
  };

  const colors = gradientColors[color];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-foreground font-semibold text-lg">{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground bg-background/50 rounded-full px-4 gap-2"
        >
          <CalendarDays size={16} />
          <span className="text-sm">Last 24h</span>
        </Button>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.start} stopOpacity={0.4} />
                <stop offset="95%" stopColor={colors.end} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors.start}
              strokeWidth={2.5}
              fill="url(#chartGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: colors.start,
                strokeWidth: 2,
                stroke: "hsl(222 47% 6%)",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoryChart;
