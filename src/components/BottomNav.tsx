import { Home, History, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
}

interface BottomNavProps {
  activeTab?: "dashboard" | "history" | "settings";
}

const BottomNav = ({ activeTab }: BottomNavProps) => {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: History, label: "History", path: "/history" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const getIsActive = (item: NavItem) => {
    if (activeTab) {
      return (
        (activeTab === "dashboard" && item.path === "/") ||
        (activeTab === "history" && item.path === "/history") ||
        (activeTab === "settings" && item.path === "/settings")
      );
    }
    return location.pathname === item.path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass border-t border-glass-border/50 backdrop-blur-2xl">
        <div className="flex items-center justify-around py-3 px-4 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = getIsActive(item);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all duration-300",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Safe area spacer for iOS */}
      <div className="h-safe-area-inset-bottom bg-background/80" />
    </nav>
  );
};

export default BottomNav;
