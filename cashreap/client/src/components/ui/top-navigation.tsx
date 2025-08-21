import { Link, useLocation } from "wouter";
import { Home, CreditCard, Scale, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    { path: "/faq", label: "FAQ" },
    { path: "/privacy", label: "Privacy" },
  ];

  return (
    <nav className="sticky top-0 left-0 right-0 w-full bg-gradient-to-r from-yellow-100 via-green-50 to-blue-100 border-b border-surface-variant z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          <img src="/src/assets/logo-transparent.svg" alt="CashReap Logo" className="h-24 w-24 drop-shadow-xl" />
          <span className="font-extrabold text-2xl tracking-tight flex gap-1">
            <span className="text-yellow-500">Cash</span>
            <span className="text-green-600">Reap</span>
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-8">
          {navItems.map(({ path, label }) => {
            const isActive = location === path;
            return (
              <Link key={path} href={path}>
                <span
                  className={`font-medium text-lg px-2 py-1 rounded transition-colors duration-150 cursor-pointer ${isActive ? "bg-primary text-white shadow" : "text-on-surface hover:bg-primary/10 hover:text-primary"}`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}