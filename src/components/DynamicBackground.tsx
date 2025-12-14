import { useTimeOfDay, getTimeColors } from "@/hooks/useTimeOfDay";
import { cn } from "@/lib/utils";

const DynamicBackground = () => {
  const { timeOfDay } = useTimeOfDay();
  const colors = getTimeColors(timeOfDay);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Time-based gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b transition-all duration-1000",
          colors.from,
          colors.via,
          colors.to
        )}
      />
      
      {/* Floating particles / air elements */}
      <div className="absolute inset-0">
        {/* Large orbs */}
        <div
          className={cn(
            "absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse",
            timeOfDay === "morning" && "bg-amber-400 top-10 -right-20",
            timeOfDay === "afternoon" && "bg-sky-400 top-20 right-10",
            timeOfDay === "evening" && "bg-orange-500 top-0 right-0",
            timeOfDay === "night" && "bg-indigo-500 top-10 right-10"
          )}
          style={{ animationDuration: "4s" }}
        />
        <div
          className={cn(
            "absolute w-64 h-64 rounded-full blur-3xl opacity-10 animate-pulse",
            timeOfDay === "morning" && "bg-yellow-300 bottom-40 -left-10",
            timeOfDay === "afternoon" && "bg-cyan-400 bottom-60 left-20",
            timeOfDay === "evening" && "bg-rose-500 bottom-40 left-0",
            timeOfDay === "night" && "bg-purple-600 bottom-60 -left-10"
          )}
          style={{ animationDuration: "6s" }}
        />
        
        {/* Small floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-2 h-2 rounded-full opacity-30",
              timeOfDay === "morning" && "bg-amber-300",
              timeOfDay === "afternoon" && "bg-sky-300",
              timeOfDay === "evening" && "bg-orange-300",
              timeOfDay === "night" && "bg-indigo-300"
            )}
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 12}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
      
      {/* Wind lines */}
      <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="windGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[...Array(4)].map((_, i) => (
          <path
            key={i}
            d={`M-100,${100 + i * 80} Q${150 + i * 30},${80 + i * 60} 400,${120 + i * 70}`}
            fill="none"
            stroke="url(#windGradient)"
            strokeWidth="1"
            className="text-foreground"
            style={{
              animation: `windFlow ${8 + i * 2}s linear infinite`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default DynamicBackground;
