// API Response Types for AQMS

import type { Key } from "react";

export type Status = "safe" | "warning" | "danger";

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface SensorData {
  sensorId?: string;
  co2: number;
  temperature: number;
  humidity: number;
  timestamp: string;
  status?: Status;
}

export interface SensorStatus extends SensorData {
  status: Status;
}

// For /api/v1/aqms/sensors/range - returns array with count
export interface SensorRangeData {
  range: "1h" | "8h" | "24h";
  count: number;
  data: SensorData[];
}

export interface HistoryItem {
  id: Key | null | undefined;
  sensorId: string;
  co2: number;
  temperature: number;
  humidity: number;
  status: Status;
  timestamp: string;
}

export interface HistoryResponse {
  data: HistoryItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface ChartDataPoint {
  timestamp: string;
  co2: number;
  temperature: number;
  humidity: number;
  status: Status;
}

export interface ChartResponse {
  data: ChartDataPoint[];
  range: "24h" | "7d" | "30d";
  interval: "1h" | "4h" | "1d";
}

export interface Statistics {
  count: number;
  co2: {
    min: number;
    max: number;
    avg: number;
  };
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  humidity: {
    min: number;
    max: number;
    avg: number;
  };
  statusDistribution: {
    safe: number;
    warning: number;
    danger: number;
  };
}

// Wrapper for stats endpoint
export interface StatisticsResponse {
  data: Statistics;
}

export interface UserSettings {
  notifications: {
    enabled: boolean;
    pushEnabled: boolean;
  };
  thresholds: {
    warning: number;
    danger: number;
  };
  theme: "dark" | "light";
}

export interface HistoryFilters {
  startDate?: string;
  endDate?: string;
  status?: "all" | Status;
  limit?: number;
  offset?: number;
}

export interface ExportParams {
  format: "csv" | "json";
  startDate: string;
  endDate: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
