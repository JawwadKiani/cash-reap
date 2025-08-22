import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Search, Sparkles } from "lucide-react";

export function UniqueFeaturesSection() {
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Privacy-First Approach",
      description: "No bank account linking required - we never access your financial data",
      badge: "Privacy First",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Search className="w-6 h-6 text-blue-600" />,
      title: "Business-Specific Search", 
      description: "Search 'Netflix' or 'Planet Fitness' - not just generic categories",
      badge: "More Granular",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      title: "Instant Guest Access",
      description: "Try our recommendations immediately without signing up first",
      badge: "Zero Friction",
      color: "bg-amber-50 border-amber-200"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-600" />,
      title: "Modern Business Coverage",
      description: "First to optimize for streaming services, fitness, and entertainment",
      badge: "Ahead of Trends",
      color: "bg-purple-50 border-purple-200"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-extrabold text-green-700 mb-2 animate-fade-in">Why Choose CashReap?</h3>
        <p className="text-muted-foreground text-lg animate-fade-in delay-100">
          Built different from other credit card apps—focused on what matters most.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className={`bg-white border-2 border-surface-variant shadow-md transition-transform duration-300 hover:scale-105 ${feature.color}`} style={{animation: `fadeIn 0.6s ease ${index * 0.1}s both`}}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {feature.icon}
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs font-medium">
                  {feature.badge}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="text-center p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow animate-fade-in delay-200">
        <p className="text-lg text-amber-800 font-semibold">
          <strong>🌾 Harvest Your Rewards</strong> — The only app with an agricultural theme that makes earning cash back feel like reaping what you sow.
        </p>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fadeIn 0.7s ease both; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
}