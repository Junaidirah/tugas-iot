import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  color?: "default" | "warm" | "cool";
}

const MetricCard = ({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  trendValue,
  color = "default",
}: MetricCardProps) => {
  const iconColors = {
    default: "text-primary",
    warm: "text-orange-400",
    cool: "text-sky-400",
  };

  const bgGradients = {
    default: "from-primary/10 to-transparent",
    warm: "from-orange-500/10 to-transparent",
    cool: "from-sky-500/10 to-transparent",
  };

  return (
    <div className="glass-card p-5 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]">
      {/* Background gradient accent */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-300 group-hover:opacity-70",
          bgGradients[color]
        )}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={cn(
              "p-2.5 rounded-xl bg-background/50 transition-transform duration-300 group-hover:scale-110",
              iconColors[color]
            )}
          >
            <Icon size={22} strokeWidth={2} />
          </div>
          <span className="text-muted-foreground text-sm font-medium">
            {label}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground tracking-tight">
            {value}
          </span>
          <span className="text-muted-foreground text-lg">{unit}</span>
        </div>

        {trend && trendValue && (
          <div
            className={cn(
              "flex items-center gap-1 mt-2 text-xs font-medium",
              trend === "up" && "text-danger",
              trend === "down" && "text-safe",
              trend === "stable" && "text-muted-foreground"
            )}
          >
            <span>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
            </span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
