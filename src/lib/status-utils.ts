import type { Status } from "@/types/api-types";

export interface StatusInfo {
  status: Status;
  label: string;
  color: string;
  textColor: string;
  bgColor: string;
}

/**
 * Calculate status based on CO₂ levels and custom thresholds
 * @param co2 - CO₂ level in ppm
 * @param warningThreshold - Warning threshold (default: 600)
 * @param dangerThreshold - Danger threshold (default: 1000)
 */
export function getStatus(
  co2: number,
  warningThreshold = 600,
  dangerThreshold = 1000
): StatusInfo {
  if (co2 < warningThreshold) {
    return {
      status: "safe",
      label: "Fresh Air",
      color: "hsl(var(--safe))",
      textColor: "text-safe",
      bgColor: "bg-safe",
    };
  }

  if (co2 < dangerThreshold) {
    return {
      status: "warning",
      label: "Moderate",
      color: "hsl(var(--warning))",
      textColor: "text-warning",
      bgColor: "bg-warning",
    };
  }

  return {
    status: "danger",
    label: "Poor Quality",
    color: "hsl(var(--danger))",
    textColor: "text-danger",
    bgColor: "bg-danger",
  };
}

/**
 * Get color class for a given status
 */
export function getStatusColor(status: Status): string {
  const statusMap: Record<Status, string> = {
    safe: "text-safe",
    warning: "text-warning",
    danger: "text-danger",
  };
  return statusMap[status] || "text-foreground";
}

/**
 * Get background color class for a given status
 */
export function getStatusBgColor(status: Status): string {
  const statusMap: Record<Status, string> = {
    safe: "bg-safe",
    warning: "bg-warning",
    danger: "bg-danger",
  };
  return statusMap[status] || "bg-muted";
}

/**
 * Get label for a given status
 */
export function getStatusLabel(status: Status): string {
  const statusMap: Record<Status, string> = {
    safe: "Fresh Air",
    warning: "Moderate",
    danger: "Poor Quality",
  };
  return statusMap[status] || "Unknown";
}

/**
 * Get emoji indicator for status
 */
export function getStatusEmoji(status: Status): string {
  const statusMap: Record<Status, string> = {
    safe: "🟢",
    warning: "🟡",
    danger: "🔴",
  };
  return statusMap[status] || "⚪";
}
