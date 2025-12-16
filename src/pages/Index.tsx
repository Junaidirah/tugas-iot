import { useState, useMemo } from "react";
import { Thermometer, Droplets, Wind, Loader2 } from "lucide-react";
import CircularProgress from "@/components/CircularProgress";
import MetricCard from "@/components/MetricCard";
import HistoryChart from "@/components/HistoryChart";
import BottomNav from "@/components/BottomNav";
import TimeRangeTabs from "@/components/TimeRangeTabs";
import DynamicBackground from "@/components/DynamicBackground";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { useCurrentSensor, useSensorRange } from "@/hooks/useSensorData";
import { useChartData } from "@/hooks/useHistoryData";
import { useSettings } from "@/contexts/SettingsContext";
import { getStatus } from "@/lib/status-utils";
import { formatChartLabel } from "@/lib/date-utils";

const getTrendInfo = (current: number, previous: number, unit: string) => {
  const diff = current - previous;
  const sign = diff >= 0 ? "+" : "";
  if (Math.abs(diff) < 0.5) return { trend: "stable" as const, text: `${sign}${diff.toFixed(1)}${unit} from avg` };
  if (diff > 0) return { trend: "up" as const, text: `${sign}${diff.toFixed(1)}${unit} from avg` };
  return { trend: "down" as const, text: `${diff.toFixed(1)}${unit} from avg` };
};

const Index = () => {
  const [selectedRange, setSelectedRange] = useState<"current" | "1h" | "8h" | "24h">("current");
  const { greeting } = useTimeOfDay();
  const { settings } = useSettings();

  // Fetch current sensor data
  const { data: currentData, isLoading: isLoadingCurrent } = useCurrentSensor();
  
  // Fetch range data when not on "current"
  const { data: rangeData, isLoading: isLoadingRange } = useSensorRange(
    selectedRange !== "current" ? selectedRange : "1h"
  );

  // Fetch chart data based on selected range
  const chartRange = selectedRange === "current" || selectedRange === "1h" ? "24h" : 
                     selectedRange === "8h" ? "24h" : "24h";
  const { data: chartResponse, isLoading: isLoadingChart } = useChartData(chartRange);

  // Calculate average from range data
  const calculateAverage = (data: typeof rangeData) => {
    if (!data || !data.data || data.data.length === 0) return null;
    
    const sum = data.data.reduce((acc, item) => ({
      co2: acc.co2 + item.co2,
      temperature: acc.temperature + item.temperature,
      humidity: acc.humidity + item.humidity,
    }), { co2: 0, temperature: 0, humidity: 0 });
    
    const count = data.data.length;
    return {
      co2: sum.co2 / count,
      temperature: sum.temperature / count,
      humidity: sum.humidity / count,
    };
  };

  // Determine which data to display
  const displayData = selectedRange === "current" 
    ? currentData 
    : calculateAverage(rangeData) || currentData;

  // Calculate status
  const { status, label } = useMemo(() => {
    if (!displayData) return { status: "safe" as const, label: "Loading..." };
    return getStatus(
      displayData.co2,
      settings?.thresholds?.warning,
      settings?.thresholds?.danger
    );
  }, [displayData, settings]);

  // Calculate trends
  const tempTrend = displayData 
    ? getTrendInfo(displayData.temperature, currentData?.temperature || 23.5, "°")
    : { trend: "stable" as const, text: "Loading..." };
  
  const humidityTrend = displayData
    ? getTrendInfo(displayData.humidity, currentData?.humidity || 52, "%")
    : { trend: "stable" as const, text: "Loading..." };

  // Format chart data
  const chartData = chartResponse?.data?.map((point) => ({
    time: formatChartLabel(point.timestamp, chartResponse.interval),
    value: point.co2,
  })) || [];

  const isLoading = isLoadingCurrent || (selectedRange !== "current" && isLoadingRange);

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
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <CircularProgress
              value={displayData?.co2 || 0}
              max={2000}
              status={status}
              label={label}
            />
          )}
          <TimeRangeTabs selected={selectedRange} onSelect={setSelectedRange} />
        </section>

        <section
          className="grid grid-cols-2 gap-4 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          <MetricCard
            icon={Thermometer}
            label="Temperature"
            value={displayData?.temperature?.toFixed(1) ?? "0.0"}
            unit="°C"
            trend={tempTrend.trend}
            trendValue={tempTrend.text}
            color="warm"
          />
          <MetricCard
            icon={Droplets}
            label="Humidity"
            value={displayData?.humidity?.toFixed(0) ?? "0"}
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
          {isLoadingChart ? (
            <div className="flex items-center justify-center h-64 glass-card rounded-2xl">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <HistoryChart data={chartData} color={status} />
          )}
        </section>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab="dashboard" />
    </div>
  );
};

export default Index;
