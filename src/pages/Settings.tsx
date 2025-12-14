import { Moon, Sun, Bell, Wifi, Gauge, Info, ChevronRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import BottomNav from "@/components/BottomNav";
import DynamicBackground from "@/components/DynamicBackground";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, ReactNode } from "react";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [dangerThreshold, setDangerThreshold] = useState([1000]);
  const [warningThreshold, setWarningThreshold] = useState([600]);

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
              onCheckedChange={toggleTheme}
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
          label: "Push Notifications",
          description: "Receive alerts when air quality changes",
          action: (
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
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
                min={400}
                max={800}
                step={50}
                className="w-full"
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
                min={800}
                max={2000}
                step={100}
                className="w-full"
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
              {group.items.map((item, itemIndex) => (
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
                  {item.action}
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
              onClick={() => theme !== "light" && toggleTheme()}
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
              onClick={() => theme !== "dark" && toggleTheme()}
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
    </div>
  );
};

export default Settings;
