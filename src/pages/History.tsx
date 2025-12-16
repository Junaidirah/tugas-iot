import { useState } from "react";
import { Calendar, Download, ArrowUpRight, ArrowDownRight, Minus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BottomNav from "@/components/BottomNav";
import DynamicBackground from "@/components/DynamicBackground";
import { useHistory, useStatistics } from "@/hooks/useHistoryData";
import { useSettings } from "@/contexts/SettingsContext";
import { getStatusColor } from "@/lib/status-utils";
import { formatDate, formatTime } from "@/lib/date-utils";
import { aqmsService, downloadFile } from "@/services/aqms-service";
import { toast } from "sonner";
import type { Status } from "@/types/api-types";

const getTrendIcon = (current: number, threshold: number) => {
  if (current > threshold * 1.1) return <ArrowUpRight size={14} className="text-danger" />;
  if (current < threshold * 0.9) return <ArrowDownRight size={14} className="text-safe" />;
  return <Minus size={14} className="text-muted-foreground" />;
};

const History = () => {
  const [selectedFilter, setSelectedFilter] = useState<"all" | Status>("all");
  const [isExporting, setIsExporting] = useState(false);
  const { settings } = useSettings();

  // Fetch history data with filters
  const { data: historyResponse, isLoading: isLoadingHistory } = useHistory({
    status: selectedFilter,
    limit: 50,
    offset: 0,
  });

  // Fetch statistics
  const { data: stats, isLoading: isLoadingStats } = useStatistics();

  const filteredData = historyResponse?.data || [];

  // Calculate statistics percentages
  const safePercentage = stats?.data?.statusDistribution
    ? Math.round((stats.data.statusDistribution.safe / stats.data.count) * 100)
    : 0;

  const alertCount = stats?.data?.statusDistribution
    ? stats.data.statusDistribution.warning + stats.data.statusDistribution.danger
    : 0;

  const handleExport = async (format: "csv" | "json") => {
    try {
      setIsExporting(true);
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const blob = await aqmsService.exportHistory({
        format,
        startDate: thirtyDaysAgo.toISOString(),
        endDate: now.toISOString(),
      });

      const filename = `aqms-history-${formatDate(now.toISOString())}.${format}`;
      downloadFile(blob, filename);
      
      toast.success(`Data exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen pb-28 px-4 pt-8 relative">
      <DynamicBackground />
      
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <header className="animate-fade-in">
          <Link to="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">History</h1>
          <p className="text-muted-foreground text-sm mt-1">View detailed sensor logs</p>
        </header>

        {/* Controls */}
        <div className="flex gap-3 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Button variant="outline" className="glass-card flex-1 gap-2">
            <Calendar size={16} />
            <span>Date Range</span>
          </Button>
          <Button 
            variant="outline" 
            className="glass-card gap-2"
            onClick={() => handleExport("csv")}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 animate-fade-in" style={{ animationDelay: "150ms" }}>
          {(["all", "safe", "warning", "danger"] as const).map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
              className={`capitalize ${
                selectedFilter === filter
                  ? filter === "safe"
                    ? "bg-safe text-safe-foreground"
                    : filter === "warning"
                    ? "bg-warning text-warning-foreground"
                    : filter === "danger"
                    ? "bg-danger text-danger-foreground"
                    : ""
                  : "glass-card"
              }`}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Data Table */}
        <Card className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: "200ms" }}>
          {isLoadingHistory ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No data available
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-glass-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">Time</TableHead>
                  <TableHead className="text-muted-foreground font-medium">CO₂</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Temp</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Hum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-glass-border/30 hover:bg-glass/50 transition-colors"
                  >
                    <TableCell className="py-3">
                      <div className="flex flex-col">
                        <span className="text-foreground font-medium">{formatTime(item.timestamp)}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className={`font-semibold ${getStatusColor(item.status)}`}>
                          {item.co2}
                        </span>
                        {getTrendIcon(item.co2, settings?.thresholds?.warning || 600)}
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{item.temperature.toFixed(1)}°</TableCell>
                    <TableCell className="text-foreground">{item.humidity.toFixed(0)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <Card className="glass-card p-4 text-center">
            {isLoadingStats ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary mx-auto" />
            ) : (
              <>
                <p className="text-2xl font-bold text-safe">{safePercentage}%</p>
                <p className="text-xs text-muted-foreground mt-1">Safe Time</p>
              </>
            )}
          </Card>
          <Card className="glass-card p-4 text-center">
            {isLoadingStats ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary mx-auto" />
            ) : (
              <>
                <p className="text-2xl font-bold text-foreground">{stats?.data?.co2.avg.toFixed(0) || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Avg CO₂</p>
              </>
            )}
          </Card>
          <Card className="glass-card p-4 text-center">
            {isLoadingStats ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary mx-auto" />
            ) : (
              <>
                <p className="text-2xl font-bold text-warning">{alertCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Alerts</p>
              </>
            )}
          </Card>
        </div>
      </div>

      <BottomNav activeTab="history" />
    </div>
  );
};

export default History;
