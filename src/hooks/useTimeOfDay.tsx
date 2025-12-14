import { useState, useEffect } from "react";

type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

interface TimeInfo {
  timeOfDay: TimeOfDay;
  hour: number;
  greeting: string;
}

const getTimeOfDay = (hour: number): TimeOfDay => {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "evening";
  return "night";
};

const getGreeting = (timeOfDay: TimeOfDay): string => {
  switch (timeOfDay) {
    case "morning":
      return "Good Morning";
    case "afternoon":
      return "Good Afternoon";
    case "evening":
      return "Good Evening";
    case "night":
      return "Good Night";
  }
};

export const useTimeOfDay = (): TimeInfo => {
  const [timeInfo, setTimeInfo] = useState<TimeInfo>(() => {
    const hour = new Date().getHours();
    const timeOfDay = getTimeOfDay(hour);
    return {
      timeOfDay,
      hour,
      greeting: getGreeting(timeOfDay),
    };
  });

  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours();
      const timeOfDay = getTimeOfDay(hour);
      setTimeInfo({
        timeOfDay,
        hour,
        greeting: getGreeting(timeOfDay),
      });
    };

    // Update every minute
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return timeInfo;
};

export const getTimeColors = (timeOfDay: TimeOfDay) => {
  switch (timeOfDay) {
    case "morning":
      return {
        from: "from-amber-500/20",
        via: "via-orange-400/10",
        to: "to-transparent",
        accent: "text-amber-400",
      };
    case "afternoon":
      return {
        from: "from-sky-400/20",
        via: "via-blue-500/10",
        to: "to-transparent",
        accent: "text-sky-400",
      };
    case "evening":
      return {
        from: "from-orange-500/20",
        via: "via-rose-500/10",
        to: "to-transparent",
        accent: "text-orange-400",
      };
    case "night":
      return {
        from: "from-indigo-600/20",
        via: "via-purple-600/10",
        to: "to-transparent",
        accent: "text-indigo-400",
      };
  }
};
