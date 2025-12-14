import { useState } from "react";
import { Calendar, Download, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
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

// Mock history data
const mockHistoryData = [
  { id: 1, date: "2024-01-15", time: "14:30", co2: 485, temp: 23.5, humidity: 52, status: "safe" },
  { id: 2, date: "2024-01-15", time: "12:00", co2: 720, temp: 24.2, humidity: 48, status: "warning" },
  { id: 3, date: "2024-01-15", time: "09:30", co2: 380, temp: 22.8, humidity: 55, status: "safe" },
  { id: 4, date: "2024-01-14", time: "22:00", co2: 1150, temp: 25.1, humidity: 42, status: "danger" },
  { id: 5, date: "2024-01-14", time: "18:30", co2: 620, temp: 24.0, humidity: 50, status: "warning" },
  { id: 6, date: "2024-01-14", time: "15:00", co2: 445, temp: 23.2, humidity: 53, status: "safe" },
  { id: 7, date: "2024-01-14", time: "10:00", co2: 390, temp: 22.5, humidity: 56, status: "safe" },
  { id: 8, date: "2024-01-13", time: "20:00", co2: 890, temp: 24.8, humidity: 45, status: "warning" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "safe":
      return "text-safe";
    case "warning":
      return "text-warning";
    case "danger":
      return "text-danger";
    default:
      return "text-foreground";
  }
};

const getTrendIcon = (current: number, threshold: number) => {
  if (current > threshold * 1.1) return <ArrowUpRight size={14} className="text-danger" />;
  if (current < threshold * 0.9) return <ArrowDownRight size={14} className="text-safe" />;
  return <Minus size={14} className="text-muted-foreground" />;
};

const History = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredData =
    selectedFilter === "all"
      ? mockHistoryData
      : mockHistoryData.filter((item) => item.status === selectedFilter);

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
          <Button variant="outline" className="glass-card gap-2">
            <Download size={16} />
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 animate-fade-in" style={{ animationDelay: "150ms" }}>
          {["all", "safe", "warning", "danger"].map((filter) => (
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
                      <span className="text-foreground font-medium">{item.time}</span>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className={`font-semibold ${getStatusColor(item.status)}`}>
                        {item.co2}
                      </span>
                      {getTrendIcon(item.co2, 600)}
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{item.temp}°</TableCell>
                  <TableCell className="text-foreground">{item.humidity}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <Card className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-safe">75%</p>
            <p className="text-xs text-muted-foreground mt-1">Safe Time</p>
          </Card>
          <Card className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">512</p>
            <p className="text-xs text-muted-foreground mt-1">Avg CO₂</p>
          </Card>
          <Card className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-warning">3</p>
            <p className="text-xs text-muted-foreground mt-1">Alerts</p>
          </Card>
        </div>
      </div>

      <BottomNav activeTab="history" />
    </div>
  );
};

export default History;
