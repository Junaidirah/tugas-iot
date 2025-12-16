import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { setTheme } = useTheme();

  // Fetch settings from API
  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: aqmsService.getSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    // Fallback to default settings if API fails
    placeholderData: DEFAULT_SETTINGS,
  });

  // Sync theme with settings
  useEffect(() => {
    if (settings?.theme) {
      setTheme(settings.theme);
    }
  }, [settings?.theme, setTheme]);

  // Mutation for updating settings
  const mutation = useMutation({
    mutationFn: (newSettings: Partial<UserSettings>) =>
      aqmsService.updateSettings(newSettings),
    onSuccess: (updatedSettings) => {
      // Update cache
      queryClient.setQueryData(["settings"], updatedSettings);
      
      // Sync theme if changed
      if (updatedSettings.theme) {
        setTheme(updatedSettings.theme);
      }
    },
  });

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    await mutation.mutateAsync(newSettings);
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
