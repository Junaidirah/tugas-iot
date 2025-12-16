import { useQuery } from "@tanstack/react-query";
import { aqmsService } from "@/services/aqms-service";
import type { HistoryFilters, ChartResponse, StatisticsResponse } from "@/types/api-types";

/**
 * Hook to fetch history data with filters and pagination
 * @param filters - Optional filters for history data
 */
export function useHistory(filters?: HistoryFilters) {
  return useQuery({
    queryKey: ["history", filters],
    queryFn: () => aqmsService.getHistory(filters),
    staleTime: 60000, // 1 minute
    enabled: true,
  });
}

/**
 * Hook to fetch chart data for visualization
 * @param range - Time range: 24h, 7d, or 30d
 * @param interval - Optional interval: 1h, 4h, or 1d
 */
export function useChartData(
  range: "24h" | "7d" | "30d",
  interval?: "1h" | "4h" | "1d"
) {
  return useQuery<ChartResponse>({
    queryKey: ["chart", range, interval],
    queryFn: () => aqmsService.getChartData(range, interval),
    staleTime: 2 * 60000, // 2 minutes
    enabled: !!range,
  });
}

/**
 * Hook to fetch statistics
 * @param startDate - Optional start date
 * @param endDate - Optional end date
 */
export function useStatistics(startDate?: string, endDate?: string) {
  return useQuery<StatisticsResponse>({
    queryKey: ["statistics", startDate, endDate],
    queryFn: () => aqmsService.getStatistics(startDate, endDate),
    staleTime: 5 * 60000, // 5 minutes
  });
}
