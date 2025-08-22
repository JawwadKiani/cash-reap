import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Globe, Users, Award, Sparkles } from "lucide-react";

export function InnovationHighlights() {
  const innovations = [
    {
      icon: <Smartphone className="w-6 h-6 text-blue-600" />,
      title: "Mobile-First Design",
      description: "Built for Gen Z and Millennials who manage finances on their phones",
      badge: "Modern UX",
      stats: "87% of users prefer mobile"
    },
    {
      icon: <Globe className="w-6 h-6 text-green-600" />,
      title: "Zero Bank Account Linking",
      description: "Complete privacy - we never access your banking data or transaction history",
      badge: "Privacy Leader",
      stats: "Industry leading privacy"
    },
    {
      icon: <Users className="w-6 h-6 text-purple-600" />,
      title: "Community-Driven Database",
      description: "Real users contribute and verify store categories for accuracy",
      badge: "Crowdsourced",
      stats: "95% accuracy rate"
    },
    {
      icon: <Award className="w-6 h-6 text-amber-600" />,
      title: "Gamified Rewards Journey",
      description: "Achievement badges and streaks make maximizing rewards fun and engaging",
      badge: "Coming Soon",
      stats: "2x engagement boost"
    }
  ];

  // This component should be moved to the About page for better organization.
  return null;
}