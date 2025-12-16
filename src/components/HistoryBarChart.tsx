import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";

interface DataPoint {
  time: string;
  value: number;
}

interface HistoryBarChartProps {
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

const HistoryBarChart = ({
  data,
  title = "24h Trend",
  color = "safe",
}: HistoryBarChartProps) => {
  const colors = {
    safe: "#22c55e",
    warning: "#eab308",
    danger: "#ef4444",
  };

  const barColor = colors[color];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-foreground font-semibold text-lg">{title}</h3>
        <div className="flex items-center gap-2 text-muted-foreground bg-background/50 rounded-full px-4 py-2">
          <BarChart3 size={16} />
          <span className="text-sm">Bar Chart</span>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
              interval={2}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={barColor} opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoryBarChart;
