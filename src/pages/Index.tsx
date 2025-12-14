import { useState, useMemo } from "react";
import { Thermometer, Droplets, Wind } from "lucide-react";
import CircularProgress from "@/components/CircularProgress";
import MetricCard from "@/components/MetricCard";
import HistoryChart from "@/components/HistoryChart";
import BottomNav from "@/components/BottomNav";
import TimeRangeTabs from "@/components/TimeRangeTabs";
import DynamicBackground from "@/components/DynamicBackground";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";

// Mock data
const mockChartData = [
  { time: "00:00", value: 420 },
  { time: "04:00", value: 380 },
  { time: "08:00", value: 520 },
  { time: "12:00", value: 680 },
  { time: "16:00", value: 590 },
  { time: "20:00", value: 450 },
  { time: "Now", value: 485 },
];

const mockDataByRange = {
  current: { co2: 485, temp: 23.5, humidity: 52 },
  "1h": { co2: 512, temp: 24.1, humidity: 48 },
  "8h": { co2: 548, temp: 23.8, humidity: 50 },
  "24h": { co2: 502, temp: 22.9, humidity: 54 },
};

const getStatus = (value: number) => {
  if (value < 600) return { status: "safe" as const, label: "Fresh Air" };
  if (value < 1000) return { status: "warning" as const, label: "Moderate" };
  return { status: "danger" as const, label: "Poor Quality" };
};

const getTrendInfo = (current: number, previous: number, unit: string) => {
  const diff = current - previous;
  const sign = diff >= 0 ? "+" : "";
  if (Math.abs(diff) < 0.5) return { trend: "stable" as const, text: `${sign}${diff.toFixed(1)}${unit} from avg` };
  if (diff > 0) return { trend: "up" as const, text: `${sign}${diff.toFixed(1)}${unit} from avg` };
  return { trend: "down" as const, text: `${diff.toFixed(1)}${unit} from avg` };
};

const Index = () => {
  const [selectedRange, setSelectedRange] = useState("current");
  const { greeting } = useTimeOfDay();

  const currentData = mockDataByRange[selectedRange as keyof typeof mockDataByRange];
  const { status, label } = useMemo(() => getStatus(currentData.co2), [currentData.co2]);

  const tempTrend = getTrendInfo(currentData.temp, 23.5, "°");
  const humidityTrend = getTrendInfo(currentData.humidity, 52, "%");

  return (
    <div className="min-h-screen pb-28 px-4 pt-8 relative">
      <DynamicBackground />
      
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <header className="text-center animate-fade-in" style={{ animationDelay: "0ms" }}>
          <p className="text-sm text-muted-foreground mb-1">{greeting}</p>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Wind size={20} className="text-primary" />
            <h1 className="text-xl font-semibold text-foreground">
              Air Quality Monitor
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">Living Room Sensor</p>
        </header>

        {/* Hero Section - Circular Progress */}
        <section
          className="flex flex-col items-center gap-6 py-4 animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          <CircularProgress
            value={currentData.co2}
            max={2000}
            status={status}
            label={label}
          />
          <TimeRangeTabs selected={selectedRange} onSelect={setSelectedRange} />
        </section>

        {/* Secondary Metrics */}
        <section
          className="grid grid-cols-2 gap-4 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          <MetricCard
            icon={Thermometer}
            label="Temperature"
            value={currentData.temp}
            unit="°C"
            trend={tempTrend.trend}
            trendValue={tempTrend.text}
            color="warm"
          />
          <MetricCard
            icon={Droplets}
            label="Humidity"
            value={currentData.humidity}
            unit="%"
            trend={humidityTrend.trend}
            trendValue={humidityTrend.text}
            color="cool"
          />
        </section>

        {/* History Chart */}
        <section
          className="animate-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          <HistoryChart data={mockChartData} color={status} />
        </section>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab="dashboard" />
    </div>
  );
};

export default Index;
