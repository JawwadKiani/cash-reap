import { Link, useLocation } from "wouter";
import { Home, CreditCard, Scale, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/my-cards", icon: CreditCard, label: "My Cards" },
    { path: "/card-comparison", icon: Scale, label: "Compare" },
    { path: "/about", icon: null, label: "About" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-surface-variant z-50 shadow-sm">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/src/assets/logo-transparent.svg" alt="CashReap logo with agricultural theme" className="h-8 w-8" />
            <span className="font-bold text-lg">CashReap</span>
          </div>
          {/* Navigation Items */}
          <div className="flex gap-2 items-center">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location === path;
              return (
                <Link key={path} href={path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="p-2 flex flex-col items-center gap-1"
                    title={label}
                    aria-label={label}
                  >
                    {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
                    <span className="text-xs">{label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
