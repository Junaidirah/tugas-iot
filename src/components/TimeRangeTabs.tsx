import { cn } from "@/lib/utils";

interface TimeRangeTabsProps {
  selected: string;
  onSelect: (value: string) => void;
}

const TimeRangeTabs = ({ selected, onSelect }: TimeRangeTabsProps) => {
  const options = [
    { value: "current", label: "Current" },
    { value: "1h", label: "1h Avg" },
    { value: "8h", label: "8h Avg" },
    { value: "24h", label: "24h Avg" },
  ];

  return (
    <div className="glass-card p-1.5 inline-flex gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300",
            selected === option.value
              ? "bg-primary text-primary-foreground shadow-lg"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeTabs;
