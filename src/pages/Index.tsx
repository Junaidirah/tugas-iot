import { useState, useMemo } from "react";
import { Thermometer, Droplets, Wind, Loader2 } from "lucide-react";
import CircularProgress from "@/components/CircularProgress";
import MetricCard from "@/components/MetricCard";
import HistoryBarChart from "@/components/HistoryBarChart";
import BottomNav from "@/components/BottomNav";
import TimeRangeTabs from "@/components/TimeRangeTabs";
import DynamicBackground from "@/components/DynamicBackground";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { useCurrentSensor, useSensorRange } from "@/hooks/useSensorData";
import { useHistory } from "@/hooks/useHistoryData";
import { useSettings } from "@/contexts/SettingsContext";
import { getStatus } from "@/lib/status-utils";
// import { formatTime } from "@/lib/date-utils";

// Chart uses history data instead of chart API

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
  
  // Fetch all range data
  const { data: range1h } = useSensorRange("1h");
  const { data: range8h } = useSensorRange("8h");
  const { data: range24h } = useSensorRange("24h");
  
  // Select appropriate range data based on selectedRange
  const rangeData = selectedRange === "1h" ? range1h 
    : selectedRange === "8h" ? range8h
    : selectedRange === "24h" ? range24h
    : null;

  // Fetch history data for chart (last 24 hours, limit to 24 points for hourly data)
  const { data: chartHistoryData, isLoading: isLoadingChart } = useHistory({
    limit: 24,
    offset: 0,
  });

  // Calculate average from range data
  const calculateAverage = (data: typeof rangeData) => {
    if (!data || !data.data || data.data.length === 0) {
      console.log('No range data available:', data);
      return null;
    }
    
    console.log('Range data:', data);
    console.log('Range data count:', data.data.length);
    
    const sum = data.data.reduce((acc, item) => ({
      co2: acc.co2 + item.co2,
      temperature: acc.temperature + item.temperature,
      humidity: acc.humidity + item.humidity,
    }), { co2: 0, temperature: 0, humidity: 0 });
    
    const count = data.data.length;
    const result = {
      co2: Number((sum.co2 / count).toFixed(2)),
      temperature: Number((sum.temperature / count).toFixed(2)),
      humidity: Number((sum.humidity / count).toFixed(2)),
    };
    
    console.log('Calculated average:', result);
    return result;
  };

  // Determine which data to display
  console.log('=== DATA DEBUG ===');
  console.log('selectedRange:', selectedRange);
  console.log('currentData:', currentData);
  console.log('rangeData:', rangeData);
  
  const displayData = selectedRange === "current" 
    ? currentData 
    : calculateAverage(rangeData) || currentData;
  
  console.log('displayData:', displayData);
  console.log('==================');

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

  // Format chart data from history - calculate hourly averages for all 24 hours
  const chartData = useMemo(() => {
    if (!chartHistoryData?.data || chartHistoryData.data.length === 0) {
      // Return 24 hours with 0 values if no data
      return Array.from({ length: 24 }, (_, i) => ({
        time: `${String(i).padStart(2, '0')}:00`,
        value: 0,
      }));
    }
    
    // Group data by hour
    const hourlyGroups: { [key: number]: number[] } = {};
    
    chartHistoryData.data.forEach((point) => {
      const date = new Date(point.timestamp);
      const hour = date.getHours();
      
      if (!hourlyGroups[hour]) {
        hourlyGroups[hour] = [];
      }
      hourlyGroups[hour].push(point.co2);
    });
    
    // Create array for all 24 hours
    const hourlyAverages = Array.from({ length: 24 }, (_, hour) => {
      const values = hourlyGroups[hour];
      const avgCo2 = values 
        ? Math.round(values.reduce((sum, val) => sum + val, 0) / values.length)
        : 0; // 0 if no data for this hour
      
      return {
        time: `${String(hour).padStart(2, '0')}:00`,
        value: avgCo2,
      };
    });
    
    console.log('24-hour chart data:', hourlyAverages);
    return hourlyAverages;
  }, [chartHistoryData]);

  const isLoading = isLoadingCurrent;

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
          ) : chartData.length === 0 ? (
            <div className="glass-card p-5">
              <h3 className="text-foreground font-semibold text-lg mb-4">24h Trend</h3>
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                No chart data available
              </div>
            </div>
          ) : (
            <HistoryBarChart data={chartData} color={status} title="24h Trend" />
          )}
        </section>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab="dashboard" />
    </div>
  );
};

export default Index;
