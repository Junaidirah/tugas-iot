import { format, formatDistanceToNow, parseISO } from "date-fns";

/**
 * Format ISO timestamp to readable date and time
 * @param timestamp - ISO timestamp string
 * @returns Formatted date string (e.g., "Jan 15, 2024 14:30")
 */
export function formatDateTime(timestamp: string): string {
  try {
    const date = parseISO(timestamp);
    return format(date, "MMM dd, yyyy HH:mm");
  } catch {
    return timestamp;
  }
}

/**
 * Format ISO timestamp to date only
 * @param timestamp - ISO timestamp string
 * @returns Formatted date string (e.g., "2024-01-15")
 */
export function formatDate(timestamp: string): string {
  try {
    const date = parseISO(timestamp);
    return format(date, "yyyy-MM-dd");
  } catch {
    return timestamp;
  }
}

/**
 * Format ISO timestamp to time only
 * @param timestamp - ISO timestamp string
 * @returns Formatted time string (e.g., "14:30")
 */
export function formatTime(timestamp: string): string {
  try {
    const date = parseISO(timestamp);
    return format(date, "HH:mm");
  } catch {
    return timestamp;
  }
}

/**
 * Format timestamp as relative time
 * @param timestamp - ISO timestamp string
 * @returns Relative time string (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: string): string {
  try {
    const date = parseISO(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return timestamp;
  }
}

/**
 * Get date range for a given period
 * @param range - Time range identifier
 * @returns Object with startDate and endDate as ISO strings
 */
export function getDateRange(range: "1h" | "8h" | "24h" | "7d" | "30d"): {
  startDate: string;
  endDate: string;
} {
  const now = new Date();
  const endDate = now.toISOString();
  let startDate: Date;

  switch (range) {
    case "1h":
      startDate = new Date(now.getTime() - 1 * 60 * 60 * 1000);
      break;
    case "8h":
      startDate = new Date(now.getTime() - 8 * 60 * 60 * 1000);
      break;
    case "24h":
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }

  return {
    startDate: startDate.toISOString(),
    endDate,
  };
}

/**
 * Format chart timestamp based on interval
 * @param timestamp - ISO timestamp string
 * @param interval - Chart interval
 * @returns Formatted label for chart
 */
export function formatChartLabel(timestamp: string, interval: "1h" | "4h" | "1d"): string {
  try {
    const date = parseISO(timestamp);
    
    switch (interval) {
      case "1h":
        return format(date, "HH:mm");
      case "4h":
        return format(date, "HH:mm");
      case "1d":
        return format(date, "MMM dd");
      default:
        return format(date, "HH:mm");
    }
  } catch {
    return timestamp;
  }
}
