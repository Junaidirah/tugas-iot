import { apiClient } from "@/lib/api-client";
import type {
  SensorData,
  SensorStatus,
  SensorRangeData,
  HistoryResponse,
  HistoryFilters,
  ChartResponse,
  StatisticsResponse,
  UserSettings,
  ExportParams,
} from "@/types/api-types";

/**
 * AQMS API Service
 * Provides functions to interact with all AQMS API endpoints
 */
export const aqmsService = {
  /**
   * 1. GET /api/v1/aqms/latest
   * Get the latest sensor data (most recent input)
   */
  async getLatest(): Promise<SensorData> {
    return apiClient.get<SensorData>("/api/v1/aqms/latest");
  },

  /**
   * 2. GET /api/v1/aqms/sensors/current
   * Get current sensor readings with status (safe/warning/danger)
   */
  async getCurrentStatus(): Promise<SensorStatus> {
    return apiClient.get<SensorStatus>("/api/v1/aqms/sensors/current");
  },

  /**
   * 3. GET /api/v1/aqms/sensors/range?range=1h|8h|24h
   * Get sensor data within a specific time range
   * @param range - Time range: 1h (1 hour), 8h (8 hours), or 24h (24 hours)
   */
  async getSensorRange(range: "1h" | "8h" | "24h"): Promise<SensorRangeData> {
    return apiClient.get<SensorRangeData>("/api/v1/aqms/sensors/range", {
      params: { range },
    });
  },

  /**
   * 4. GET /api/v1/aqms/history
   * Get historical data with filters and pagination
   * @param filters - Optional filters for date range, status, limit, and offset
   */
  async getHistory(filters?: HistoryFilters): Promise<HistoryResponse> {
    return apiClient.get<HistoryResponse>("/api/v1/aqms/history", {
      params: filters as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * 5. GET /api/v1/aqms/history/chart?range=24h|7d|30d
   * Get aggregated data for chart visualization
   * @param range - Time range: 24h (24 hours), 7d (7 days), or 30d (30 days)
   * @param interval - Optional interval: 1h, 4h, or 1d (auto-calculated if not provided)
   */
  async getChartData(
    range: "24h" | "7d" | "30d",
    interval?: "1h" | "4h" | "1d"
  ): Promise<ChartResponse> {
    return apiClient.get<ChartResponse>("/api/v1/aqms/history/chart", {
      params: { range, interval },
    });
  },

  /**
   * 6. GET /api/v1/aqms/history/stats
   * Get summary statistics (min, max, average, status distribution)
   * @param startDate - Optional start date
   * @param endDate - Optional end date
   */
  async getStatistics(startDate?: string, endDate?: string): Promise<StatisticsResponse> {
    return apiClient.get<StatisticsResponse>("/api/v1/aqms/history/stats", {
      params: { startDate, endDate },
    });
  },

  /**
   * 7. GET /api/v1/aqms/history/export?format=csv|json
   * Export historical data to CSV or JSON file
   * @param params - Export parameters including format, startDate, and endDate
   */
  async exportHistory(params: ExportParams): Promise<Blob> {
    return apiClient.download("/api/v1/aqms/history/export", params as unknown as Record<string, string | number | boolean | undefined>);
  },

  /**
   * 8. GET /api/v1/aqms/settings
   * Get user settings (notifications, thresholds, theme)
   */
  async getSettings(): Promise<UserSettings> {
    return apiClient.get<UserSettings>("/api/v1/aqms/settings");
  },

  /**
   * 9. PUT /api/v1/aqms/settings
   * Update user settings
   * @param settings - Updated settings object
   */
  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    return apiClient.put<UserSettings>("/api/v1/aqms/settings", settings);
  },
};

/**
 * Helper function to download exported file
 * @param blob - File blob from export API
 * @param filename - Desired filename
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
