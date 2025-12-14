import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  status: "safe" | "warning" | "danger";
  label: string;
  unit?: string;
}

const CircularProgress = ({
  value,
  max = 2000,
  size = 240,
  strokeWidth = 12,
  status,
  label,
  unit = "ppm",
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const offset = circumference - progress * circumference;

  const gradientId = useMemo(() => `progress-gradient-${Math.random()}`, []);

  const gradientColors = {
    safe: { start: "#22c55e", end: "#10b981" },
    warning: { start: "#eab308", end: "#f59e0b" },
    danger: { start: "#ef4444", end: "#dc2626" },
  };

  const colors = gradientColors[status];

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Background glow */}
      <div
        className={cn(
          "absolute rounded-full blur-3xl opacity-30 transition-all duration-700",
          status === "safe" && "bg-safe",
          status === "warning" && "bg-warning",
          status === "danger" && "bg-danger pulse-danger"
        )}
        style={{ width: size * 0.8, height: size * 0.8 }}
      />

      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(217 33% 17%)"
          strokeWidth={strokeWidth}
          className="opacity-50"
        />

        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="ring-progress drop-shadow-lg"
          style={{
            filter: `drop-shadow(0 0 10px ${colors.start}66)`,
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "text-5xl font-bold tracking-tight transition-colors duration-500",
            status === "safe" && "text-safe",
            status === "warning" && "text-warning",
            status === "danger" && "text-danger"
          )}
        >
          {value}
        </span>
        <span className="text-muted-foreground text-sm font-medium mt-1">
          {unit}
        </span>
        <span
          className={cn(
            "text-lg font-semibold mt-2 transition-colors duration-500",
            status === "safe" && "text-safe",
            status === "warning" && "text-warning",
            status === "danger" && "text-danger"
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
