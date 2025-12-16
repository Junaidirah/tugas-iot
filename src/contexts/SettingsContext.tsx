import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { aqmsService } from "@/services/aqms-service";
import { useTheme } from "@/contexts/ThemeContext";
import type { UserSettings } from "@/types/api-types";

interface SettingsContextType {
  settings: UserSettings | undefined;
  isLoading: boolean;
  error: Error | null;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_SETTINGS: UserSettings = {
  notifications: {
    enabled: true,
    pushEnabled: false,
  },
  thresholds: {
    warning: 600,
    danger: 1000,
  },
  theme: "dark",
  chartType: "area",
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { setTheme } = useTheme();

  // Load settings from localStorage as fallback
  const getStoredSettings = (): UserSettings => {
    try {
      const stored = localStorage.getItem('aqms-settings');
      console.log('Reading from localStorage:', stored);
      if (stored) {
        const parsed = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        console.log('Parsed settings:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
    console.log('Using DEFAULT_SETTINGS');
    return DEFAULT_SETTINGS;
  };

  // State for localStorage settings
  const [localSettings, setLocalSettings] = useState<UserSettings>(() => {
    const initial = getStoredSettings();
    console.log('Initial localSettings:', initial);
    return initial;
  });

  // Fetch settings from API
  const {
    data: apiSettings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: aqmsService.getSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  // Use API settings if available, otherwise use localStorage
  // Merge with DEFAULT_SETTINGS to ensure all fields have values
  const settings = apiSettings 
    ? { ...DEFAULT_SETTINGS, ...apiSettings }
    : localSettings;

  // Sync theme with settings
  useEffect(() => {
    if (settings?.theme) {
      setTheme(settings.theme);
    }
  }, [settings?.theme, setTheme]);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    // Merge with current settings
    const mergedSettings = { ...localSettings, ...newSettings };
    console.log('Updating settings to:', mergedSettings);
    
    // Update local state
    setLocalSettings(mergedSettings);
    
    // Update cache
    queryClient.setQueryData(["settings"], mergedSettings);
    
    // Save to localStorage
    localStorage.setItem('aqms-settings', JSON.stringify(mergedSettings));
    
    // Invalidate queries to trigger re-render
    queryClient.invalidateQueries({ queryKey: ["settings"] });
    
    // Sync theme if changed
    if (newSettings.theme) {
      setTheme(newSettings.theme);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        error: error as Error | null,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
