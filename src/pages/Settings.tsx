import { Moon, Sun, Bell, Wifi, Gauge, Info, ChevronRight, Loader2, BarChart3, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import BottomNav from "@/components/BottomNav";
import DynamicBackground from "@/components/DynamicBackground";
import { useTheme } from "@/contexts/ThemeContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useState, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import { NotificationPermissionDialog } from "@/components/NotificationPermissionDialog";

// Settings page with theme, notifications, thresholds, and chart type

const Settings = () => {
  const { theme, toggleTheme: toggleThemeContext } = useTheme();
  const { settings, isLoading, updateSettings } = useSettings();
  
  const [notifications, setNotifications] = useState(settings?.notifications?.enabled ?? true);
  const [pushEnabled, setPushEnabled] = useState(settings?.notifications?.pushEnabled ?? false);
  const [dangerThreshold, setDangerThreshold] = useState([settings?.thresholds?.danger ?? 1000]);
  const [warningThreshold, setWarningThreshold] = useState([settings?.thresholds?.danger ?? 1000]);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);

  // Sync local state with settings from API
  useEffect(() => {
    if (settings?.notifications && settings?.thresholds) {
      setNotifications(settings.notifications.enabled);
      setPushEnabled(settings.notifications.pushEnabled);
      setDangerThreshold([settings.thresholds.danger]);
      setWarningThreshold([settings.thresholds.warning]);
    }
  }, [settings]);

  const handleThemeToggle = async () => {
    toggleThemeContext();
    const newTheme = theme === "dark" ? "light" : "dark";
    try {
      await updateSettings({ theme: newTheme });
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  const handleNotificationsChange = async (enabled: boolean) => {
    setNotifications(enabled);
    try {
      await updateSettings({
        notifications: {
          enabled,
          pushEnabled: enabled ? pushEnabled : false,
        },
      });
      toast.success("Notification settings updated");
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast.error("Failed to update settings");
      setNotifications(!enabled); // Revert on error
    }
  };

  const handlePushEnabledChange = async (enabled: boolean) => {
    // If enabling, show custom dialog first
    if (enabled) {
      setShowNotificationDialog(true);
      return;
    }
    
    // If disabling, just update settings
    setPushEnabled(false);
    try {
      await updateSettings({
        notifications: {
          enabled: notifications,
          pushEnabled: false,
        },
      });
      toast.success("Push notifications disabled");
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast.error("Failed to update settings");
    }
  };

  const handleNotificationConfirm = async () => {
    setShowNotificationDialog(false);
    
    if (!("Notification" in window)) {
      toast.error("Browser doesn't support notifications");
      return;
    }

    if (Notification.permission === "denied") {
      toast.error("Notification permission denied. Please enable in browser settings.");
      return;
    }

    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Notification permission denied");
        return;
      }
      toast.success("Notification permission granted!");
    }

    // Show test notification
    new Notification("AQMS Notifications Enabled", {
      body: "You will now receive air quality alerts",
      icon: "/favicon.ico",
    });

    setPushEnabled(true);
    try {
      await updateSettings({
        notifications: {
          enabled: notifications,
          pushEnabled: true,
        },
      });
      toast.success("Push notifications enabled");
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast.error("Failed to update settings");
      setPushEnabled(false);
    }
  };

  const handleNotificationCancel = () => {
    setShowNotificationDialog(false);
    setPushEnabled(false);
  };

  const handleWarningThresholdChange = async (value: number[]) => {
    // Validate: warning must be less than danger
    if (value[0] >= dangerThreshold[0]) {
      toast.error(`Warning level must be below danger level (${dangerThreshold[0]} ppm)`);
      return;
    }
    
    setWarningThreshold(value);
    try {
      await updateSettings({
        thresholds: {
          warning: value[0],
          danger: dangerThreshold[0],
        },
      });
      toast.success(`Warning threshold set to ${value[0]} ppm`);
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast.error("Failed to update threshold");
    }
  };

  const handleDangerThresholdChange = async (value: number[]) => {
    // Validate: danger must be greater than warning
    if (value[0] <= warningThreshold[0]) {
      toast.error(`Danger level must be above warning level (${warningThreshold[0]} ppm)`);
      return;
    }
    
    setDangerThreshold(value);
    try {
      await updateSettings({
        thresholds: {
          warning: warningThreshold[0],
          danger: value[0],
        },
      });
      toast.success(`Danger threshold set to ${value[0]} ppm`);
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast.error("Failed to update threshold");
    }
  };

  const settingGroups: { title: string; items: { icon: LucideIcon; label: string; description: string; action: ReactNode }[] }[] = [
    {
      title: "Appearance",
      items: [
        {
          icon: theme === "dark" ? Moon : Sun,
          label: "Dark Mode",
          description: "Toggle dark/light theme",
          action: (
            <Switch
              checked={theme === "dark"}
              onCheckedChange={handleThemeToggle}
            />
          ),
        },
        {
          icon: BarChart3,
          label: "Bar Chart",
          description: "Use bar chart instead of area chart",
          action: (
            <Switch
              checked={settings?.chartType === "bar"}
              onCheckedChange={async (checked) => {
                console.log('Chart type toggle clicked:', checked);
                try {
                  await updateSettings({ chartType: checked ? "bar" : "area" });
                  console.log('Chart type updated to:', checked ? "bar" : "area");
                  toast.success(`Chart type changed to ${checked ? "bar" : "area"}`);
                } catch (error) {
                  console.error("Failed to update chart type:", error);
                }
              }}
            />
          ),
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          description: "Enable air quality alerts",
          action: (
            <Switch
              checked={notifications}
              onCheckedChange={handleNotificationsChange}
              disabled={isLoading}
            />
          ),
        },
        {
          icon: Bell,
          label: "Push Notifications",
          description: "Receive push notifications",
          action: (
            <Switch
              checked={pushEnabled}
              onCheckedChange={handlePushEnabledChange}
              disabled={isLoading || !notifications}
            />
          ),
        },
      ],
    },
    {
      title: "Thresholds",
      items: [
        {
          icon: Gauge,
          label: "Warning Level",
          description: `CO₂ above ${warningThreshold[0]} ppm`,
          action: (
            <div className="w-32">
              <Slider
                value={warningThreshold}
                onValueChange={setWarningThreshold}
                onValueCommit={handleWarningThresholdChange}
                min={400}
                max={800}
                step={50}
                className="w-full"
                disabled={isLoading}
              />
            </div>
          ),
        },
        {
          icon: Gauge,
          label: "Danger Level",
          description: `CO₂ above ${dangerThreshold[0]} ppm`,
          action: (
            <div className="w-32">
              <Slider
                value={dangerThreshold}
                onValueChange={setDangerThreshold}
                onValueCommit={handleDangerThresholdChange}
                min={800}
                max={2000}
                step={100}
                className="w-full"
                disabled={isLoading}
              />
            </div>
          ),
        },
      ],
    },
    {
      title: "Device",
      items: [
        {
          icon: Wifi,
          label: "Sensor Connection",
          description: "Living Room Sensor • Connected",
          action: <ChevronRight size={20} className="text-muted-foreground" />,
        },
        {
          icon: Info,
          label: "About",
          description: "Version 1.0.0",
          action: <ChevronRight size={20} className="text-muted-foreground" />,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-28 px-4 pt-8 relative">
      <DynamicBackground />
      
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <header className="animate-fade-in">
          <Link to="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Configure your preferences</p>
        </header>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {/* Settings Groups */}
        {settingGroups.map((group, groupIndex) => (
          <div
            key={group.title}
            className="space-y-3 animate-fade-in"
            style={{ animationDelay: `${(groupIndex + 1) * 100}ms` }}
          >
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
              {group.title}
            </h2>
            <Card className="glass-card divide-y divide-glass-border/30">
              {group.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-4 hover:bg-glass/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10 cursor-pointer">
                    {item.action}
                  </div>
                </div>
              ))}
            </Card>
          </div>
        ))}

        {/* Theme Preview */}
        <Card className="glass-card p-4 animate-fade-in" style={{ animationDelay: "500ms" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Current Theme</span>
            <span className="text-sm text-muted-foreground capitalize">{theme}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => theme !== "light" && handleThemeToggle()}
              className={`p-3 rounded-xl border transition-all ${
                theme === "light"
                  ? "border-primary bg-primary/10"
                  : "border-glass-border/50 hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Sun size={16} className="text-amber-500" />
                <span className="text-sm text-foreground">Light</span>
              </div>
            </button>
            <button
              onClick={() => theme !== "dark" && handleThemeToggle()}
              className={`p-3 rounded-xl border transition-all ${
                theme === "dark"
                  ? "border-primary bg-primary/10"
                  : "border-glass-border/50 hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Moon size={16} className="text-indigo-400" />
                <span className="text-sm text-foreground">Dark</span>
              </div>
            </button>
          </div>
        </Card>
      </div>

      <BottomNav activeTab="settings" />
      
      <NotificationPermissionDialog
        open={showNotificationDialog}
        onOpenChange={setShowNotificationDialog}
        onConfirm={handleNotificationConfirm}
        onCancel={handleNotificationCancel}
      />
    </div>
  );
};

export default Settings;
