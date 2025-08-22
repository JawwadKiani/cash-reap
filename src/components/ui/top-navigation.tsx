import { Link, useLocation } from "wouter";
import { Home, CreditCard, Scale, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    {
      label: "Tools",
      dropdown: [
        { path: "/my-cards", icon: CreditCard, label: "My Cards" },
        { path: "/card-comparison", icon: Scale, label: "Compare" },
      ],
    },
    { path: "/about", icon: null, label: "About" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-surface-variant z-50 shadow-sm">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/src/assets/logo-transparent.svg" alt="CashReap logo with agricultural theme" className="h-8 w-8" />
            <span className="font-bold text-lg">CashReap</span>
          </div>
          {/* Hamburger for mobile */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="p-2" onClick={() => setMenuOpen((v) => !v)} aria-label="Open menu">
              <span className="sr-only">Open menu</span>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </Button>
          </div>
          {/* Navigation Items */}
          <div className="hidden md:flex gap-2 items-center">
            {navItems.map((item, idx) => {
              if (item.dropdown) {
                return (
                  <div key={item.label} className="relative group">
                    <Button variant="ghost" size="sm" className="p-2 flex items-center gap-1" aria-haspopup="true">
                      <span>{item.label}</span>
                      <span className="ml-1">▼</span>
                    </Button>
                    <div className="absolute left-0 mt-2 min-w-[140px] bg-white border rounded shadow-lg z-10 hidden group-hover:block">
                      {item.dropdown.map(({ path, icon: Icon, label }) => {
                        const isActive = location === path;
                        return (
                          <Link key={path} href={path}>
                            <div className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent ${isActive ? "bg-accent text-accent-foreground" : "text-on-surface"}`}>
                              <Icon className="w-4 h-4" />
                              <span>{label}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              } else {
                const isActive = location === item.path;
                const Icon = item.icon;
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className="p-2 flex items-center gap-1"
                      title={item.label}
                      aria-label={item.label}
                    >
                      {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              }
            })}
          </div>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 bg-white border rounded shadow-lg z-10">
            {navItems.map((item, idx) => {
              if (item.dropdown) {
                return (
                  <div key={item.label} className="border-b">
                    <div className="px-4 py-2 font-semibold">{item.label}</div>
                    {item.dropdown.map(({ path, icon: Icon, label }) => {
                      const isActive = location === path;
                      return (
                        <Link key={path} href={path}>
                          <div className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent ${isActive ? "bg-accent text-accent-foreground" : "text-on-surface"}`}>
                            <Icon className="w-4 h-4" />
                            <span>{label}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                );
              } else {
                const isActive = location === item.path;
                const Icon = item.icon;
                return (
                  <Link key={item.path} href={item.path}>
                    <div className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent ${isActive ? "bg-accent text-accent-foreground" : "text-on-surface"}`}>
                      {Icon && <Icon className="w-4 h-4" />}
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              }
            })}
          </div>
        )}
      </div>
    </nav>
  );
}