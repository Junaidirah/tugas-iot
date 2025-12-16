import { useQuery } from "@tanstack/react-query";
import { aqmsService } from "@/services/aqms-service";
import type { SensorStatus, SensorRangeData } from "@/types/api-types";

/**
 * Hook to fetch current sensor status
 * Automatically refetches every 2 minutes
 */
export function useCurrentSensor() {
  return useQuery<SensorStatus>({
    queryKey: ["sensor", "current"],
    queryFn: aqmsService.getCurrentStatus,
    refetchInterval: 120000, // Refetch every 2 minutes
    staleTime: 100000, // Consider data stale after 100 seconds
  });
}

/**
 * Hook to fetch sensor data for a specific time range
 * @param range - Time range: 1h, 8h, or 24h
 */
export function useSensorRange(range: "1h" | "8h" | "24h") {
  return useQuery<SensorRangeData>({
    queryKey: ["sensor", "range", range],
    queryFn: () => aqmsService.getSensorRange(range),
    staleTime: 60000, // 1 minute
    enabled: !!range,
  });
}

/**
 * Hook to fetch latest sensor data
 */
export function useLatestSensor() {
  return useQuery({
    queryKey: ["sensor", "latest"],
    queryFn: aqmsService.getLatest,
    refetchInterval: 30000,
    staleTime: 20000,
  });
}
